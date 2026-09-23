import { NextRequest, NextResponse } from "next/server";
import { academyConfig } from "@/content/academy.config";

// ---------------------------------------------------------------------------
// Shared bot/spam protection for lead-capture API routes.
// Ported from the TSAI site (lib/bot-protection.ts) — same four layers:
//
//   1. Honeypot      — a hidden field bots fill in but humans never see.
//   2. Timing gate   — submissions faster than a human could type are bots.
//   3. Origin check  — POSTs must come from our own site, not a curl script.
//   4. Rate limit    — caps submissions per IP within a warm instance.
//
// Every protected form sends two extra fields produced by `useBotProtection`:
//   - `hp_leave_blank`  : the honeypot (must stay EMPTY)
//   - `_elapsed_ms`     : how long the form was open, measured on the device
//
// Sep 23 2026: renamed from `company_website` (AutoFill could fill it from the
// owner's contact card) and `_ts` (a device-clock timestamp, so a phone with a
// fast clock looked like a bot). Old field names are ignored, never rejected.
//
// Usage in a route:
//   const verdict = checkBotSignals(request, body);
//   if (!verdict.ok) return rejectBot(verdict);
// ---------------------------------------------------------------------------

// Naive bots fill every field; AutoFill ignores a name it can't classify.
export const HONEYPOT_FIELD = "hp_leave_blank";
export const ELAPSED_FIELD = "_elapsed_ms";

// A human needs at least this long to fill out and submit a form. No upper
// limit: a tab left open overnight is still a person.
const MIN_FILL_MS = 2500;

// In-memory sliding-window rate limit. Per warm serverless instance — not
// global — but enough to blunt a flood from one IP without any dependency.
const RATE_LIMIT_MAX = 5; // submissions
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 10; // per 10 minutes per IP
const ipHits = new Map<string, number[]>();

// Hosts allowed to POST to our APIs. Add preview/staging hosts as needed.
const SITE_HOST = new URL(academyConfig.site.url).host;
const ALLOWED_HOSTS = [
  SITE_HOST,
  SITE_HOST.replace(/^www\./, ""),
  "localhost:3000",
  "localhost",
];

export type BotVerdict =
  | { ok: true }
  | { ok: false; reason: string; status: number };

function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function hostFromUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  hits.push(now);
  ipHits.set(ip, hits);

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (ipHits.size > 5000) {
    for (const [key, times] of ipHits) {
      const fresh = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (fresh.length === 0) ipHits.delete(key);
      else ipHits.set(key, fresh);
    }
  }

  return hits.length > RATE_LIMIT_MAX;
}

export function checkBotSignals(
  request: NextRequest,
  body: Record<string, unknown>
): BotVerdict {
  // 1) Honeypot — real users never see or fill this field.
  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    console.warn("[bot-protection] rejected: honeypot");
    return { ok: false, reason: "honeypot", status: 200 };
  }

  // 2) Timing — submitted faster than a human could type. Missing/0 = skip.
  const elapsed = Number(body[ELAPSED_FIELD]);
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_FILL_MS) {
    console.warn("[bot-protection] rejected: timing");
    return { ok: false, reason: "timing", status: 200 };
  }

  // 3) Origin — real browser form POSTs always carry an Origin or a same-site
  //    Referer. We require at least one, and it must match an allowed host.
  const originHost = hostFromUrl(request.headers.get("origin"));
  const refererHost = hostFromUrl(request.headers.get("referer"));
  const claimedHost = originHost || refererHost;
  const isLocalhost =
    claimedHost === "localhost" || claimedHost?.startsWith("localhost:");
  if (!claimedHost || (!ALLOWED_HOSTS.includes(claimedHost) && !isLocalhost)) {
    return { ok: false, reason: "origin", status: 403 };
  }

  // 4) Rate limit per IP.
  const ip = getClientIp(request);
  if (rateLimited(ip)) {
    return { ok: false, reason: "rate_limit", status: 429 };
  }

  return { ok: true };
}

// Standard rejection. For honeypot/timing we return a 200 "success" so the
// bot believes it worked and moves on — and crucially we never forward the
// junk lead, so no contact and no notification is created.
export function rejectBot(verdict: Extract<BotVerdict, { ok: false }>) {
  if (verdict.status === 200) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json(
    { error: "Request blocked." },
    { status: verdict.status }
  );
}
