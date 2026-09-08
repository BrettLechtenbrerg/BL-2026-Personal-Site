//==============================================================================
// STRIPE — webhook receiver (Academy course purchases)
//==============================================================================
// No session auth: authenticity comes from the Stripe-Signature header
// verified against STRIPE_WEBHOOK_SECRET over the RAW body (never parse it
// first). Fulfilment is idempotent, so Stripe retries and replays are safe.
// Register in the Stripe Dashboard → Webhooks:
//   https://www.brettlechtenberg.com/api/stripe/webhook
//   events: checkout.session.completed, checkout.session.async_payment_succeeded
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { fulfillCheckout, stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  let event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (err) {
    console.warn("[stripe-webhook] signature rejected:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    try {
      const courseId = await fulfillCheckout(event.data.object.id);
      console.log(`[stripe-webhook] ${event.type} ${event.data.object.id} → ${courseId ?? "no grant"}`);
    } catch (err) {
      // Non-2xx → Stripe retries with backoff; the success page also fulfils.
      console.error("[stripe-webhook] fulfilment failed:", err);
      return NextResponse.json({ error: "Fulfilment failed." }, { status: 500 });
    }
  }
  return NextResponse.json({ received: true });
}
