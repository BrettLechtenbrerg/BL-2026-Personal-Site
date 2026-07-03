//==============================================================================
// Comms Hub server-side session — signed HTTP-only cookie
//==============================================================================
// Ported from PMMA's lib/power-hub-session.ts (the proven July-2026 pattern),
// trimmed to the single 'admin' role this site needs. Every /api/hub/* route
// MUST call requireHubSession() first — the messaging routes expose lead PII.
//
// Cookie value format: v1.admin.<expiresAtMs>.<credFingerprint>.<hmacSha256Hex>
// Secret: HUB_SESSION_SECRET (64-hex recommended; openssl rand -hex 32).
//
// CREDENTIAL BINDING: the payload includes a short fingerprint of the
// credentials that were valid when the session was minted. Verification
// recomputes the fingerprint from the CURRENT env and rejects on mismatch —
// rotating HUB_PASSWORD in Vercel kills every existing session immediately.
//
// FAIL-SAFE: if the secret is missing in production, protected routes return
// 503 instead of silently allowing access. In development a fixed dev secret
// keeps local work running.
//==============================================================================

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHash, createHmac, timingSafeEqual } from "crypto";

export const HUB_SESSION_COOKIE = "bl_hub_session";

const VERSION = "v1";

/** Admin session lifetime — 30 days (cookie Max-Age matches). */
export const ADMIN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

let warnedMissingSecret = false;

function getSecret(): string | null {
  const secret = process.env.HUB_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") {
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn(
        "[hub-session] HUB_SESSION_SECRET missing/short — using the dev-only fallback secret. Set a real one in .env.local (openssl rand -hex 32)."
      );
    }
    return "bl-dev-only-session-secret-not-for-production";
  }
  if (!warnedMissingSecret) {
    warnedMissingSecret = true;
    console.error(
      "[hub-session] HUB_SESSION_SECRET is not configured in production — all Comms Hub API access is disabled (503) until it is set in Vercel."
    );
  }
  return null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

//------------------------------------------------------------------------------
// Credential fingerprint — ties a session to the credentials it was minted
// under. Production requires the env vars; dev falls back so local work runs.
//------------------------------------------------------------------------------
function credentialSeed(): string | null {
  const isProd = process.env.NODE_ENV === "production";
  const username = process.env.HUB_USERNAME || (isProd ? null : "bladmin");
  const password = process.env.HUB_PASSWORD || (isProd ? null : "bl-dev-2026");
  if (!username || !password) return null;
  return `admin\u0000${username}\u0000${password}`;
}

/**
 * Short (16-hex) SHA-256 fingerprint of the CURRENT admin credentials.
 * Returns null when unconfigured in production — callers must refuse to
 * mint (503) and verification fails closed.
 */
export function credentialFingerprint(): string | null {
  const seed = credentialSeed();
  if (!seed) return null;
  return createHash("sha256").update(seed).digest("hex").slice(0, 16);
}

/** Constant-time string comparison (safe for differing lengths). */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    // Compare against itself to keep timing flat, then fail.
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Mint a signed session value for the cookie. Returns null when the secret
 * or credentials are unavailable (production misconfiguration) — callers
 * must surface 503.
 */
export function createSessionValue(ttlMs: number = ADMIN_TTL_MS): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const fingerprint = credentialFingerprint();
  if (!fingerprint) return null;
  const expiresAt = Date.now() + ttlMs;
  const payload = `${VERSION}.admin.${expiresAt}.${fingerprint}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** Verify a raw cookie value. Returns true only for a valid admin session. */
export function verifySessionValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const secret = getSecret();
  if (!secret) return false;

  const parts = value.split(".");
  if (parts.length !== 5) return false;
  const [version, role, expiresAtRaw, fingerprint, signature] = parts;
  if (version !== VERSION || role !== "admin") return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = sign(`${version}.${role}.${expiresAtRaw}.${fingerprint}`, secret);
  if (!timingSafeStringEqual(signature, expected)) return false;

  // Credential binding: the session dies the moment credentials change
  // (or are unset — fail closed).
  const currentFingerprint = credentialFingerprint();
  if (!currentFingerprint || !timingSafeStringEqual(fingerprint, currentFingerprint)) {
    return false;
  }

  return true;
}

/** Read + verify the session cookie. */
export async function hasHubSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(HUB_SESSION_COOKIE)?.value);
}

/**
 * Route guard. Call at the top of every /api/hub/* handler:
 *
 *   const denied = await requireHubSession();
 *   if (denied) return denied;
 *
 * Returns null when access is allowed, or a ready-to-return NextResponse
 * (401 unauthenticated / 503 secret-missing-in-production).
 */
export async function requireHubSession(): Promise<NextResponse | null> {
  if (!getSecret()) {
    return NextResponse.json(
      { error: "Comms Hub sessions are not configured (HUB_SESSION_SECRET missing)." },
      { status: 503 }
    );
  }
  const ok = await hasHubSession();
  if (!ok) {
    return NextResponse.json(
      { error: "Not signed in to the Comms Hub. Please log in again." },
      { status: 401 }
    );
  }
  return null;
}

/** Cookie attributes shared by set + clear. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}
