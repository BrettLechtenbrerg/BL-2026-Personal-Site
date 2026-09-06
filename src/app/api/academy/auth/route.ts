//==============================================================================
// ACADEMY — Auth API (signup / login / session / logout)
//==============================================================================
// POST   { action: "signup", code, name, email, password, avatar } → create
//        member (enrollment code gates signup) + set session cookie.
// POST   { action: "login", email, password } → verify + set session cookie.
// GET    → current member profile ({ user }) or 401.
// DELETE → log out (clears the cookie).
//
// Enrollment code comes from env ACADEMY_ACCESS_CODE (required in production).
// Passwords are bcrypt-hashed; sessions are HMAC-signed HTTP-only cookies.
// Rate limiting mirrors /api/hub/auth: per-IP failed attempts, in-memory.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  ACADEMY_SESSION_COOKIE,
  ACADEMY_TTL_MS,
  createAcademySessionValue,
  requireAcademyUser,
  academyCookieOptions,
  timingSafeStringEqual,
} from "@/lib/academy-session";
import { db, getUserById, getBadges, awardBadge, awardXp } from "@/lib/academy-db";

//------------------------------------------------------------------------------
// Rate limit — per-IP FAILED attempts (login + bad enrollment codes).
// In-memory per serverless instance; a soft brake, same posture as hub auth.
//------------------------------------------------------------------------------
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const FAIL_MAX = 8;
const FAIL_DELAY_MS = 500;
const failedAttempts = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || "unknown";
}

function recentFailures(ip: string): number[] {
  const windowStart = Date.now() - FAIL_WINDOW_MS;
  const recent = (failedAttempts.get(ip) ?? []).filter((t) => t > windowStart);
  failedAttempts.set(ip, recent);
  if (failedAttempts.size > 1000) {
    for (const [key, stamps] of failedAttempts) {
      if (stamps.every((t) => t <= windowStart)) failedAttempts.delete(key);
    }
  }
  return recent;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function failAuth(ip: string, message: string, status = 401): Promise<NextResponse> {
  const recent = recentFailures(ip);
  recent.push(Date.now());
  failedAttempts.set(ip, recent);
  console.warn(`[academy-auth] failed attempt from ${ip} (${recent.length}/${FAIL_MAX} in window)`);
  await sleep(FAIL_DELAY_MS);
  return NextResponse.json({ error: message }, { status });
}

const IS_PROD = process.env.NODE_ENV === "production";

function enrollmentCode(): string | null {
  const code = process.env.ACADEMY_ACCESS_CODE;
  if (code && code.length > 0) return code;
  return IS_PROD ? null : "masters-edge-dev";
}

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

function sessionResponse(userId: string, payload: object): NextResponse | null {
  const value = createAcademySessionValue(userId);
  if (!value) return null;
  const response = NextResponse.json(payload);
  response.cookies.set(ACADEMY_SESSION_COOKIE, value, {
    ...academyCookieOptions(),
    maxAge: Math.floor(ACADEMY_TTL_MS / 1000),
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (recentFailures(ip).length >= FAIL_MAX) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please wait 15 minutes and try again." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "");
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (action === "signup") {
      const code = enrollmentCode();
      if (!code) {
        return NextResponse.json(
          { error: "Academy enrollment is not configured on this deploy (ACADEMY_ACCESS_CODE missing)." },
          { status: 503 }
        );
      }
      const givenCode = String(body?.code || "");
      if (givenCode === "" || !timingSafeStringEqual(givenCode, code)) {
        return failAuth(ip, "That enrollment code isn't valid. Check with Brett and try again.");
      }

      const name = String(body?.name || "").trim().slice(0, 80);
      const avatar = String(body?.avatar || "🥋").slice(0, 8);
      if (name.length < 2) {
        return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
      }
      if (password.length < 8 || password.length > 100) {
        return NextResponse.json(
          { error: "Password must be 8–100 characters." },
          { status: 400 }
        );
      }

      const supabase = db();
      const { data: existing } = await supabase
        .from("me_users")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (existing) {
        return NextResponse.json(
          { error: "That email is already enrolled. Try logging in instead." },
          { status: 409 }
        );
      }

      const password_hash = await bcrypt.hash(password, 12);
      const { data: user, error } = await supabase
        .from("me_users")
        .insert({ name, email, password_hash, avatar })
        .select("id, name, avatar, xp")
        .single();
      if (error || !user) {
        console.error("[academy-auth] signup insert failed:", error?.message);
        return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
      }

      // First Steps badge + first daily-visit XP.
      await awardBadge(user.id, "first-steps");
      await awardXp(user.id, "daily_visit", new Date().toISOString().slice(0, 10));

      failedAttempts.delete(ip);
      const response = sessionResponse(user.id, { user });
      if (!response) {
        return NextResponse.json(
          { error: "Sessions are not configured (ACADEMY_SESSION_SECRET missing)." },
          { status: 503 }
        );
      }
      return response;
    }

    if (action === "login") {
      const { data: user } = await db()
        .from("me_users")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      // Always run a bcrypt compare so timing doesn't reveal whether the
      // email exists.
      const hash =
        user?.password_hash ??
        "$2b$12$C6UzMDM.H6dfI/f/IKcEeO7ZDbQeUYkLO7HxWTonNH7XeFYRC/dS6";
      const ok = password !== "" && (await bcrypt.compare(password, hash));
      if (!ok || !user) {
        return failAuth(ip, "Invalid email or password.");
      }

      failedAttempts.delete(ip);
      await awardXp(user.id, "daily_visit", new Date().toISOString().slice(0, 10));
      const response = sessionResponse(user.id, {
        user: { id: user.id, name: user.name, avatar: user.avatar, xp: user.xp },
      });
      if (!response) {
        return NextResponse.json(
          { error: "Sessions are not configured (ACADEMY_SESSION_SECRET missing)." },
          { status: 503 }
        );
      }
      return response;
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("Academy auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;
  const user = await getUserById(auth);
  if (!user) {
    // Session valid but user deleted — clear the cookie.
    const response = NextResponse.json({ error: "Account not found." }, { status: 401 });
    response.cookies.set(ACADEMY_SESSION_COOKIE, "", { ...academyCookieOptions(), maxAge: 0 });
    return response;
  }
  const badges = await getBadges(auth);
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      xp: user.xp,
      role: user.role ?? "member",
    },
    badges,
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ACADEMY_SESSION_COOKIE, "", { ...academyCookieOptions(), maxAge: 0 });
  return response;
}
