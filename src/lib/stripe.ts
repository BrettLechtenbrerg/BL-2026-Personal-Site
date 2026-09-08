//==============================================================================
// Stripe — server-only client + Academy course checkout fulfilment
//==============================================================================
// Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_* (one per paid
// course — see `priceEnv` on AcademyCourse). Test/live swap = swap the env.
//==============================================================================

import Stripe from "stripe";
import { getCourse, academyCourses, type AcademyCourse } from "@/content/academy/modules";
import { grantCourse } from "./academy-access";

let client: Stripe | null = null;

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
  return (client ??= new Stripe(key));
}

/** Stripe Price id for a paid course, or null when free / env unset. */
export function coursePriceId(course: AcademyCourse): string | null {
  return course.priceEnv ? (process.env[course.priceEnv] ?? null) : null;
}

const SESSION_ID_RE = /^cs_[A-Za-z0-9_]{8,200}$/;

/**
 * Grant the course a completed Checkout Session paid for. Idempotent — safe
 * to call from the webhook AND the success page. Trusts only the session
 * retrieved from Stripe (never the caller's query string). Pass `asUser` from
 * the success page so a shared link can't fulfil someone else's session.
 * Returns the course id on success, null when unpaid / not ours / not theirs.
 */
export async function fulfillCheckout(sessionId: string, asUser?: string): Promise<string | null> {
  if (!SESSION_ID_RE.test(sessionId)) return null;
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  // 100%-off promo codes complete as `no_payment_required` — still a sale.
  if (session.payment_status === "unpaid") return null;

  const userId = session.metadata?.user_id ?? "";
  const courseId = session.metadata?.course_id ?? "";
  const course = getCourse(courseId);
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !course?.priceEnv) {
    console.error(`[stripe] session ${session.id} has no valid user/course metadata`);
    return null;
  }
  if (asUser && asUser !== userId) return null;
  await grantCourse(userId, courseId, "stripe", session.id);
  return courseId;
}

let priceLabels: Promise<Record<string, string>> | null = null;

/**
 * Display price per paid course id (e.g. "$97"), read from Stripe once per
 * server process so the dashboard stays the single source of truth. Empty on
 * any failure — the UI then shows "Unlock course" without an amount.
 */
export function coursePriceLabels(): Promise<Record<string, string>> {
  return (priceLabels ??= (async () => {
    const labels: Record<string, string> = {};
    for (const course of academyCourses) {
      const priceId = coursePriceId(course);
      if (!priceId) continue;
      try {
        const price = await stripe().prices.retrieve(priceId);
        if (price.unit_amount == null) continue;
        labels[course.id] = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: price.currency.toUpperCase(),
          minimumFractionDigits: price.unit_amount % 100 === 0 ? 0 : 2,
        }).format(price.unit_amount / 100);
      } catch (err) {
        console.error(`[stripe] price lookup failed for ${course.id}:`, err);
        priceLabels = null; // don't cache a failure — retry on the next request
      }
    }
    return labels;
  })());
}
