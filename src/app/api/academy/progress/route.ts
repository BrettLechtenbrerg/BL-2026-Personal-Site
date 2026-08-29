//==============================================================================
// ACADEMY — Progress API
//==============================================================================
// GET  → member's per-module progress + unlocked slugs + badges + XP.
// POST { module } → mark that module's lesson complete (+50 XP, once).
// Session-gated; unlock order enforced server-side (fail closed).
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, getProgress, getBadges, getUserById, awardXp, awardBadge } from "@/lib/academy-db";
import { getModule, orderedModules, unlockedSlugs } from "@/content/academy/modules";

/** Consecutive-day visit streak ending today/yesterday, from daily_visit refs (YYYY-MM-DD). */
async function visitStreak(userId: string): Promise<number> {
  const { data } = await db()
    .from("me_xp_events")
    .select("ref")
    .eq("user_id", userId)
    .eq("kind", "daily_visit")
    .order("ref", { ascending: false })
    .limit(60);
  const days = new Set((data ?? []).map((r) => r.ref as string));
  let streak = 0;
  const cursor = new Date();
  // A streak may end today or yesterday (visited yesterday, not yet today).
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function GET() {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  // Record today's visit (deduped by date ref) so streaks accrue on any page load.
  await awardXp(auth, "daily_visit", new Date().toISOString().slice(0, 10));
  const streak = await visitStreak(auth);
  if (streak >= 7) await awardBadge(auth, "seven-day-streak");

  const [progress, badges, user] = await Promise.all([
    getProgress(auth),
    getBadges(auth),
    getUserById(auth),
  ]);
  const passed = new Set(progress.filter((p) => p.passed).map((p) => p.module_slug));
  const allPassed = orderedModules().every((m) => passed.has(m.slug));

  return NextResponse.json({
    progress,
    badges,
    xp: user?.xp ?? 0,
    streak,
    unlocked: Array.from(unlockedSlugs(passed)),
    certificationUnlocked: allPassed,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const slug = String(body?.module || "");
  const moduleDef = getModule(slug);
  if (!moduleDef) {
    return NextResponse.json({ error: "Unknown module." }, { status: 400 });
  }

  const progress = await getProgress(auth);
  const passed = new Set(progress.filter((p) => p.passed).map((p) => p.module_slug));
  if (!unlockedSlugs(passed).has(slug)) {
    return NextResponse.json({ error: "That module is still locked." }, { status: 403 });
  }

  const { error } = await db()
    .from("me_progress")
    .upsert({ user_id: auth, module_slug: slug, lesson_done: true }, { onConflict: "user_id,module_slug" });
  if (error) {
    console.error("[academy-progress] upsert failed:", error.message);
    return NextResponse.json({ error: "Could not save progress." }, { status: 500 });
  }

  const xpAwarded = await awardXp(auth, "lesson_complete", slug);
  return NextResponse.json({ success: true, xpAwarded });
}
