//==============================================================================
// ACADEMY — change your own password (16 Oct 2026)
//==============================================================================
// GET  → { canSkipCurrent } : true for 30 minutes after opening an emailed
//        sign-in link ("Forgot your password?"), so the member can set a new
//        password without the old one.
// POST { currentPassword?, newPassword } → updates the signed-in member's own
//        row only. The current password is required unless that grant is
//        valid for this exact member. Wrong current passwords are rate limited
//        per member. The grant is cleared after use and the member is emailed.
//==============================================================================

import { after, NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import {
  academyCookieOptions,
  PASSWORD_RESET_COOKIE,
  requireAcademyUser,
  verifyPasswordResetGrant,
} from "@/lib/academy-session";
import { db } from "@/lib/academy-db";
import { passwordChangedEmail, sendAcademyEmail } from "@/lib/academy-email";

const noStore = { "Cache-Control": "private, no-store" };
const MIN_LEN = 8; // same rule as signup
const MAX_LEN = 100;

// Wrong current password: 5 per member per 15 minutes (in-memory, per instance —
// a soft brake on top of bcrypt's cost, same posture as the login route).
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const FAIL_MAX = 5;
const failures = new Map<string, number[]>();
function recentFailures(userId: string): number[] {
  const recent = (failures.get(userId) ?? []).filter((t) => t > Date.now() - FAIL_WINDOW_MS);
  failures.set(userId, recent);
  return recent;
}

/** Cookies are SameSite=Lax already; also refuse a browser POST from another site. */
function crossSite(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  // The address the browser actually asked for (Vercel sets x-forwarded-host);
  // request.nextUrl.host can differ from it behind the proxy and in dev.
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  try {
    return !host || new URL(origin).host.toLowerCase() !== host;
  } catch {
    return true;
  }
}

async function hasGrant(userId: string): Promise<boolean> {
  const store = await cookies();
  return verifyPasswordResetGrant(store.get(PASSWORD_RESET_COOKIE)?.value, userId);
}

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ canSkipCurrent: await hasGrant(auth) }, { headers: noStore });
}

export async function POST(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;
  if (crossSite(request)) return NextResponse.json({ error: "Request refused." }, { status: 403, headers: noStore });

  if (recentFailures(auth).length >= FAIL_MAX) {
    return NextResponse.json({ error: "Too many tries. Please wait 15 minutes and try again." }, { status: 429, headers: noStore });
  }

  const body = (await request.json().catch(() => null)) as { currentPassword?: unknown; newPassword?: unknown } | null;
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  if (newPassword.length < MIN_LEN || newPassword.length > MAX_LEN) {
    return NextResponse.json({ error: `Your new password must be ${MIN_LEN} to ${MAX_LEN} characters.` }, { status: 400, headers: noStore });
  }

  const supabase = db();
  const { data: user, error: readError } = await supabase
    .from("me_users")
    .select("id, name, email, password_hash")
    .eq("id", auth)
    .maybeSingle();
  if (readError || !user) {
    return NextResponse.json({ error: "We couldn't find your account. Please log in again." }, { status: 401, headers: noStore });
  }

  const grant = await hasGrant(auth);
  if (!grant) {
    const ok = currentPassword !== "" && typeof user.password_hash === "string" && (await bcrypt.compare(currentPassword, user.password_hash));
    if (!ok) {
      recentFailures(auth).push(Date.now());
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Your current password isn't right. Forgot it? See the note above the form." }, { status: 400, headers: noStore });
    }
  }

  const password_hash = await bcrypt.hash(newPassword, 12);
  const { error } = await supabase.from("me_users").update({ password_hash }).eq("id", auth);
  if (error) {
    console.error("[academy-password] update failed:", error.message);
    return NextResponse.json({ error: "Could not save your new password. Please try again." }, { status: 500, headers: noStore });
  }
  failures.delete(auth);
  console.info(`[academy-password] password changed (${grant ? "email link" : "current password"})`);

  const email = String(user.email || "");
  const firstName = String(user.name || "").split(" ")[0] || "there";
  after(async () => {
    const sent = await sendAcademyEmail(passwordChangedEmail(email, firstName));
    if (!sent.ok) console.error("[academy-password] notice email not sent:", sent.error);
  });

  const response = NextResponse.json({ success: true }, { headers: noStore });
  response.cookies.set(PASSWORD_RESET_COOKIE, "", { ...academyCookieOptions(), maxAge: 0 });
  return response;
}
