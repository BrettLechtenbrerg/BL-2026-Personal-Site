//==============================================================================
// ACADEMY — Checkout API: start a Stripe Checkout Session for one course
//==============================================================================
// POST { course } → { url }. Session-gated. Rejects free/unknown courses and
// courses the member already owns (409). Promo codes (incl. Brett's 100%-off
// gift codes) are entered on the Stripe page (allow_promotion_codes).
// Fulfilment: /api/stripe/webhook + /academy/checkout/success, both via
// fulfillCheckout() which trusts only the session's metadata set here.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { getUserById } from "@/lib/academy-db";
import { getOwnedCourses } from "@/lib/academy-access";
import { coursePriceId, stripe } from "@/lib/stripe";
import { getCourse } from "@/content/academy/modules";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.brettlechtenberg.com";
}

export async function POST(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const course = getCourse(String(body?.course || ""));
  const priceId = course ? coursePriceId(course) : null;
  if (!course || !course.priceEnv) {
    return NextResponse.json({ error: "That course can't be purchased." }, { status: 400 });
  }
  if (!priceId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Checkout isn't configured yet." }, { status: 503 });
  }
  const [owned, user] = await Promise.all([getOwnedCourses(auth), getUserById(auth)]);
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 401 });
  if (owned.has(course.id)) {
    return NextResponse.json({ error: "You already own this course." }, { status: 409 });
  }

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      customer_email: user.email,
      client_reference_id: auth,
      metadata: { user_id: auth, course_id: course.id },
      success_url: `${siteUrl()}/academy/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/academy/modules#${course.id}`,
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL.");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[academy-checkout] session create failed:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
