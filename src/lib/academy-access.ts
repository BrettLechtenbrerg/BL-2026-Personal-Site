//==============================================================================
// Master's Edge Academy — per-course access (server only)
//==============================================================================
// A member owns a course when it is free (no `priceEnv`) or when a row exists
// in me_course_access (Stripe purchase / promo code, legacy grandfathering,
// or an admin grant). Every access decision — API routes AND the module page
// — goes through getOwnedCourses(), so the paywall is enforced server-side.
//==============================================================================

import { academyCourses } from "@/content/academy/modules";
import { db } from "./academy-db";

export type AccessSource = "free" | "stripe" | "legacy" | "admin";

export function freeCourseIds(): string[] {
  return academyCourses.filter((c) => !c.priceEnv).map((c) => c.id);
}

/**
 * Course ids this member may open. FAIL CLOSED: on a DB error, paid courses
 * stay locked (only free ones are returned) rather than opening everything.
 */
export async function getOwnedCourses(userId: string): Promise<Set<string>> {
  const owned = new Set(freeCourseIds());
  const { data, error } = await db()
    .from("me_course_access")
    .select("course_id")
    .eq("user_id", userId);
  if (error) {
    console.error("[academy-access] read failed:", error.message);
    return owned;
  }
  for (const row of data ?? []) owned.add(row.course_id as string);
  return owned;
}

/**
 * Idempotent grant — PK (user_id, course_id) means a replayed webhook or a
 * second call from the success page is a no-op. Throws on a real DB error so
 * callers (webhook) can return non-2xx and let Stripe retry.
 */
export async function grantCourse(
  userId: string,
  courseId: string,
  source: AccessSource,
  stripeSessionId?: string
): Promise<void> {
  const { error } = await db()
    .from("me_course_access")
    .upsert(
      { user_id: userId, course_id: courseId, source, stripe_session_id: stripeSessionId ?? null },
      { onConflict: "user_id,course_id", ignoreDuplicates: true }
    );
  if (error) throw new Error(`[academy-access] grant failed: ${error.message}`);
}
