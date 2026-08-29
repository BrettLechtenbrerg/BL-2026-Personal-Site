//==============================================================================
// Master's Edge Academy — per-user signed session (HTTP-only cookie)
//==============================================================================
// Modeled on src/lib/hub-session.ts, but carries a user id instead of a fixed
// admin role. Every /api/academy/* route MUST call requireAcademyUser() first.
//
// Cookie value format: v1.<userId>.<expiresAtMs>.<hmacSha256Hex>
// Secret: ACADEMY_SESSION_SECRET (openssl rand -hex 32).
//
// FAIL-SAFE: if the secret is missing in production, protected routes return
// 503 instead of silently allowing access. In development a fixed dev secret
// keeps local work running.
//==============================================================================

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const ACADEMY_SESSION_COOKIE = "bl_academy_session";

const VERSION = "v1";

/** Member session lifetime — 30 days (cookie Max-Age matches). */
export const ACADEMY_TTL_MS = 30 * 24 * 60 * 60 * 1000;

let warnedMissingSecret = false;

function getSecret(): string | null {
  const secret = process.env.ACADEMY_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") {
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn(
        "[academy-session] ACADEMY_SESSION_SECRET missing/short — using the dev-only fallback. Set a real one in .env.local (openssl rand -hex 32)."
      );
    }
    return "bl-academy-dev-only-secret-not-for-production";
  }
  if (!warnedMissingSecret) {
    warnedMissingSecret = true;
    console.error(
      "[academy-session] ACADEMY_SESSION_SECRET is not configured in production — all Academy API access is disabled (503) until it is set in Vercel."
    );
  }
  return null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Constant-time string comparison (safe for differing lengths). */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Mint a signed session value for a user id. Returns null when the secret is
 * unavailable (production misconfiguration) — callers must surface 503.
 */
export function createAcademySessionValue(
  userId: string,
  ttlMs: number = ACADEMY_TTL_MS
): string | null {
  const secret = getSecret();
  if (!secret) return null;
  // userId is a Supabase uuid — no '.' characters, so the format stays parseable.
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return null;
  const expiresAt = Date.now() + ttlMs;
  const payload = `${VERSION}.${userId}.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** Verify a raw cookie value. Returns the user id, or null. */
export function verifyAcademySessionValue(value: string | undefined | null): string | null {
  if (!value) return null;
  const secret = getSecret();
  if (!secret) return null;

  const parts = value.split(".");
  if (parts.length !== 4) return null;
  const [version, userId, expiresAtRaw, signature] = parts;
  if (version !== VERSION || !/^[0-9a-f-]{36}$/i.test(userId)) return null;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const expected = sign(`${version}.${userId}.${expiresAtRaw}`, secret);
  if (!timingSafeStringEqual(signature, expected)) return null;

  return userId;
}

/** Read + verify the session cookie. Returns the user id, or null. */
export async function getAcademyUserId(): Promise<string | null> {
  const store = await cookies();
  return verifyAcademySessionValue(store.get(ACADEMY_SESSION_COOKIE)?.value);
}

/**
 * Route guard. Call at the top of every /api/academy/* handler:
 *
 *   const auth = await requireAcademyUser();
 *   if (auth instanceof NextResponse) return auth;
 *   // auth is the user id string
 */
export async function requireAcademyUser(): Promise<NextResponse | string> {
  if (!getSecret()) {
    return NextResponse.json(
      { error: "Academy sessions are not configured (ACADEMY_SESSION_SECRET missing)." },
      { status: 503 }
    );
  }
  const userId = await getAcademyUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Not signed in to the Academy. Please log in again." },
      { status: 401 }
    );
  }
  return userId;
}

/** Cookie attributes shared by set + clear. */
export function academyCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}
