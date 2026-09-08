//==============================================================================
// Academy — Stripe Checkout return page
//==============================================================================
// Fulfils by session id so access is instant even if the webhook lags, then
// bounces to the course. Everything is read from the retrieved Stripe session;
// the query string only names which session to look up. Must be signed in as
// the buyer — a shared success link can't grant anyone else access.
//==============================================================================

import { redirect } from "next/navigation";
import { getAcademyUserId } from "@/lib/academy-session";
import { fulfillCheckout } from "@/lib/stripe";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId = "" } = await searchParams;
  const userId = await getAcademyUserId();
  if (!userId) redirect("/academy");

  let courseId: string | null = null;
  try {
    courseId = await fulfillCheckout(sessionId, userId);
  } catch (err) {
    console.error("[checkout-success] fulfilment failed (webhook will retry):", err);
  }
  redirect(courseId ? `/academy/modules#${courseId}` : "/academy/modules");
}
