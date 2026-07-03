//==============================================================================
// COMMS HUB — Auth API (server-side sessions)
//==============================================================================
// POST   - log in with { username, password } → sets the signed HTTP-only
//          session cookie that every /api/hub/* route verifies.
// GET    - report the current session ({ authenticated }) so the client
//          pages can confirm the cookie is still valid.
// DELETE - log out (clears the cookie).
//
// Credentials come from env: HUB_USERNAME / HUB_PASSWORD. In production both
// are REQUIRED (503 if unset — the dev fallbacks are documented in the repo,
// so allowing them in prod would let anyone in). Ported from PMMA's
// /api/power-hub/auth with the same rate limiting + fail-safe posture.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  HUB_SESSION_COOKIE,
  ADMIN_TTL_MS,
  createSessionValue,
  hasHubSession,
  sessionCookieOptions,
  timingSafeStringEqual,
} from "@/lib/hub-session";

//------------------------------------------------------------------------------
// Login rate limit — per-IP FAILED attempts. In-memory per serverless
// instance, resets on cold start — a soft brake on credential stuffing, not a
// hard guarantee. 8 failures / 15 min per IP; a successful login clears the
// counter. Every failed attempt also eats a flat delay.
//------------------------------------------------------------------------------
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const FAIL_MAX = 8;
const FAIL_DELAY_MS = 500;
const failedAttempts = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  // Vercel sets x-forwarded-for; first hop is the client.
  const xff = request.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || "unknown";
}

function recentFailures(ip: string): number[] {
  const windowStart = Date.now() - FAIL_WINDOW_MS;
  const recent = (failedAttempts.get(ip) ?? []).filter((t) => t > windowStart);
  failedAttempts.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (failedAttempts.size > 1000) {
    for (const [key, stamps] of failedAttempts) {
      if (stamps.every((t) => t <= windowStart)) failedAttempts.delete(key);
    }
  }
  return recent;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Record a failure, wait the flat delay, and return the 401. */
async function failLogin(ip: string, message: string): Promise<NextResponse> {
  const recent = recentFailures(ip);
  recent.push(Date.now());
  failedAttempts.set(ip, recent);
  console.warn(`[hub-auth] failed login from ${ip} (${recent.length}/${FAIL_MAX} in window)`);
  await sleep(FAIL_DELAY_MS);
  return NextResponse.json({ error: message }, { status: 401 });
}

// FAIL-SAFE: in production the credentials MUST come from the environment.
const IS_PROD = process.env.NODE_ENV === "production";

function resolveCredential(value: string | undefined, devFallback: string): string | null {
  if (value && value.length > 0) return value;
  return IS_PROD ? null : devFallback;
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (recentFailures(ip).length >= FAIL_MAX) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Please wait 15 minutes and try again." },
        { status: 429 }
      );
    }

    const adminUsername = resolveCredential(process.env.HUB_USERNAME, "bladmin");
    const adminPassword = resolveCredential(process.env.HUB_PASSWORD, "bl-dev-2026");
    if (adminUsername === null || adminPassword === null) {
      return NextResponse.json(
        { error: "Comms Hub login is not configured on this deploy (HUB_USERNAME / HUB_PASSWORD missing)." },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const username = String(body?.username || "");
    const password = String(body?.password || "");
    const usernameOk = username !== "" && timingSafeStringEqual(username, adminUsername);
    const passwordOk = password !== "" && timingSafeStringEqual(password, adminPassword);
    if (!usernameOk || !passwordOk) {
      return failLogin(ip, "Invalid username or password");
    }

    // Successful login — clear this IP's failure history.
    failedAttempts.delete(ip);

    const value = createSessionValue(ADMIN_TTL_MS);
    if (!value) {
      return NextResponse.json(
        { error: "Sessions are not configured (HUB_SESSION_SECRET missing)." },
        { status: 503 }
      );
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set(HUB_SESSION_COOKIE, value, {
      ...sessionCookieOptions(),
      maxAge: Math.floor(ADMIN_TTL_MS / 1000),
    });
    return response;
  } catch (error) {
    console.error("Hub auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET() {
  const ok = await hasHubSession();
  if (!ok) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(HUB_SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
