//==============================================================================
// Academy — magic-link sign-in ("Forgot password? Email me a link")
//==============================================================================
// POST { email }            → always 200 { ok:true } (never reveals whether an
//                             address exists). If it does, emails a one-time
//                             link: <site>/api/academy/magic-link?token=…
// GET  ?token=<raw token>   → verifies + burns the token, sets the session
//                             cookie, redirects to /academy/dashboard.
//                             Bad/expired → redirects to /academy?link=expired
//
// Token: 32 random bytes, base64url; only its sha256 is stored
// (me_login_tokens). 15-minute TTL, single use. Requesting a new link
// invalidates older unused ones. Rate limit: 3 requests / 15 min per email
// and per IP (in-memory, per instance — good enough for a login form).
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/academy-db";
import {
  ACADEMY_SESSION_COOKIE,
  ACADEMY_TTL_MS,
  academyCookieOptions,
  createAcademySessionValue,
} from "@/lib/academy-session";
import { sendAcademyEmail, magicLinkEmail } from "@/lib/academy-email";
import { academyConfig } from "@/content/academy.config";

export const dynamic = "force-dynamic";

const TTL_MS = 15 * 60 * 1000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 3;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const recent = new Map<string, number[]>();

function limited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => t > now - RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return true;
  hits.push(now);
  recent.set(key, hits);
  return false;
}

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function siteUrl(request: NextRequest): string {
  // Prefer the configured origin so links never point at a preview host.
  return (process.env.NEXT_PUBLIC_SITE_URL || academyConfig.site.url || request.nextUrl.origin).replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  let body: { email?: unknown } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = String(body?.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(`email:${email}`) || limited(`ip:${ip}`)) {
    return NextResponse.json({ error: "Too many link requests. Please wait 15 minutes and try again." }, { status: 429 });
  }

  // Uniform response from here on — same body + timing whether or not the user exists.
  const ok = NextResponse.json({ ok: true });
  const supabase = db();
  const { data: user } = await supabase.from("me_users").select("id, name").eq("email", email).maybeSingle();
  if (!user) return ok;

  const raw = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TTL_MS).toISOString();
  // Newest link wins: retire older unused links for this user.
  await supabase.from("me_login_tokens").update({ used_at: new Date().toISOString() }).eq("user_id", user.id).is("used_at", null);
  const { error } = await supabase.from("me_login_tokens").insert({ user_id: user.id, token_hash: sha256(raw), expires_at: expiresAt });
  if (error) {
    console.error("[magic-link] insert failed:", error.message);
    return ok;
  }

  const url = `${siteUrl(request)}/api/academy/magic-link?token=${raw}`;
  const firstName = String(user.name || "").split(" ")[0] || "there";
  const sent = await sendAcademyEmail(magicLinkEmail(email, url, firstName));
  if (!sent.ok) console.error("[magic-link] email not sent:", sent.error);
  return ok;
}

export async function GET(request: NextRequest) {
  const base = siteUrl(request);
  const raw = request.nextUrl.searchParams.get("token") || "";
  const fail = () => NextResponse.redirect(`${base}/academy?link=expired`);
  if (!/^[A-Za-z0-9_-]{40,50}$/.test(raw)) return fail();

  const supabase = db();
  const { data: row } = await supabase
    .from("me_login_tokens")
    .select("id, user_id, expires_at, used_at")
    .eq("token_hash", sha256(raw))
    .maybeSingle();
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) return fail();

  // Burn it atomically: only proceed if WE flipped used_at from null.
  const { data: burned } = await supabase
    .from("me_login_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", row.id)
    .is("used_at", null)
    .select("id");
  if (!burned || burned.length === 0) return fail();

  const value = createAcademySessionValue(row.user_id);
  if (!value) return NextResponse.redirect(`${base}/academy?link=unavailable`);
  const response = NextResponse.redirect(`${base}/academy/dashboard`);
  response.cookies.set(ACADEMY_SESSION_COOKIE, value, { ...academyCookieOptions(), maxAge: Math.floor(ACADEMY_TTL_MS / 1000) });
  return response;
}
