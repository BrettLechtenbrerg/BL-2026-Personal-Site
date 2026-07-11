import { NextRequest, NextResponse } from "next/server";

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
//   - `company_website` : the honeypot (must stay EMPTY)
//   - `_ts`             : ms timestamp of when the form was rendered
//
// Usage in a route:
//   const verdict = checkBotSignals(request, body);
//   if (!verdict.ok) return rejectBot(verdict);
// ---------------------------------------------------------------------------

// Name chosen to look like a real field so bots auto-fill it.
export const HONEYPOT_FIELD = "company_website";
export const TIMESTAMP_FIELD = "_ts";

// A human needs at least this long to fill out and submit a form.
const MIN_FILL_MS = 2500;
// Reject absurdly old timestamps too (stale/replayed render tokens).
const MAX_FILL_MS = 1000 * 60 * 60 * 6; // 6 hours

// In-memory sliding-window rate limit. Per warm serverless instance — not
// global — but enough to blunt a flood from one IP without any dependency.
const RATE_LIMIT_MAX = 5; // submissions
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 10; // per 10 minutes per IP
const ipHits = new Map<string, number[]>();

// Hosts allowed to POST to our APIs. Add preview/staging hosts as needed.
const ALLOWED_HOSTS = [
  "brettlechtenberg.com",
  "www.brettlechtenberg.com",
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
    return { ok: false, reason: "honeypot", status: 200 };
  }

  // 2) Timing — too fast (or impossibly stale) means it wasn't a human.
  const ts = Number(body[TIMESTAMP_FIELD]);
  if (Number.isFinite(ts) && ts > 0) {
    const elapsed = Date.now() - ts;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
      return { ok: false, reason: "timing", status: 200 };
    }
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
