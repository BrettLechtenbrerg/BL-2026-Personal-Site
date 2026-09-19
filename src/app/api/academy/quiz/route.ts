//==============================================================================
// ACADEMY — Quiz API (server-side scoring; answers never ship to the client)
//==============================================================================
// GET  ?module=<slug> → questions WITHOUT correctIndex/explanation.
// POST { module, answers: number[] } → score server-side. ≥80% passes:
//   records attempt, marks progress passed, awards XP (+100, +25 for 100%)
//   and the module badge. Returns per-question review (correct + explanation).
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, getProgress, awardXp, awardBadge, awardCourseCertificates, getBadges } from "@/lib/academy-db";
import { getOwnedCourses } from "@/lib/academy-access";
import { getModule, getCourse, unlockedSlugs, PASS_PERCENT } from "@/content/academy/modules";
import { courseBadge } from "@/content/academy/badges";

async function checkUnlocked(
  userId: string,
  slug: string
): Promise<{ unlocked: boolean; row?: { passed: boolean; quiz_score: number | null } }> {
  const [progress, owned] = await Promise.all([getProgress(userId), getOwnedCourses(userId)]);
  const passed = new Set(progress.filter((p) => p.passed).map((p) => p.module_slug));
  return {
    unlocked: unlockedSlugs(passed, owned).has(slug),
    row: progress.find((p) => p.module_slug === slug),
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const slug = request.nextUrl.searchParams.get("module") || "";
  const moduleDef = getModule(slug);
  if (!moduleDef) {
    return NextResponse.json({ error: "Unknown module." }, { status: 400 });
  }
  if (!(await checkUnlocked(auth, slug)).unlocked) {
    return NextResponse.json({ error: "That module is still locked." }, { status: 403 });
  }

  return NextResponse.json({
    module: { slug: moduleDef.slug, title: moduleDef.title },
    passPercent: PASS_PERCENT,
    questions: moduleDef.quiz.map((q) => ({
      question: q.question,
      options: q.options,
    })),
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
  const { unlocked, row: existing } = await checkUnlocked(auth, slug);
  if (!unlocked) {
    return NextResponse.json({ error: "That module is still locked." }, { status: 403 });
  }

  const raw = body?.answers;
  if (!Array.isArray(raw) || raw.length !== moduleDef.quiz.length) {
    return NextResponse.json({ error: "Please answer every question." }, { status: 400 });
  }
  const answers = raw.map((a) => Number(a));
  if (answers.some((a, i) => !Number.isInteger(a) || a < 0 || a >= moduleDef.quiz[i].options.length)) {
    return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
  }

  const results = moduleDef.quiz.map((q, i) => ({
    correct: answers[i] === q.correctIndex,
    yourAnswer: answers[i],
    explanation: q.explanation,
  }));
  const score = results.filter((r) => r.correct).length;
  const percent = Math.round((score / moduleDef.quiz.length) * 100);
  const passedQuiz = percent >= PASS_PERCENT;

  const supabase = db();
  await supabase.from("me_quiz_attempts").insert({
    user_id: auth,
    module_slug: slug,
    score: percent,
    answers,
  });

  let xpAwarded = 0;
  const newBadges: string[] = [];

  if (passedQuiz) {
    const { error } = await supabase.from("me_progress").upsert(
      {
        user_id: auth,
        module_slug: slug,
        passed: true,
        quiz_score: percent,
        passed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_slug" }
    );
    if (error) {
      console.error("[academy-quiz] progress upsert failed:", error.message);
      return NextResponse.json({ error: "Could not save your result." }, { status: 500 });
    }

    xpAwarded += await awardXp(auth, "quiz_pass", slug);
    if (await awardBadge(auth, `module-${slug}`)) newBadges.push(`module-${slug}`);
    if (percent === 100) {
      xpAwarded += await awardXp(auth, "perfect_score", slug);
      if (await awardBadge(auth, "perfect-score")) newBadges.push("perfect-score");
    }
    // Last module of a course → course certificate (course-<id>).
    const passedNow = new Set(
      (await getProgress(auth)).filter((p) => p.passed).map((p) => p.module_slug)
    );
    newBadges.push(...(await awardCourseCertificates(auth, passedNow, await getBadges(auth))));
  } else if (!existing?.passed && percent > (existing?.quiz_score ?? -1)) {
    // Record the best failing score; never downgrade a score or touch passed.
    await supabase.from("me_progress").upsert(
      { user_id: auth, module_slug: slug, quiz_score: percent },
      { onConflict: "user_id,module_slug" }
    );
  }

  return NextResponse.json({
    score,
    total: moduleDef.quiz.length,
    percent,
    passed: passedQuiz,
    passPercent: PASS_PERCENT,
    xpAwarded,
    newBadges,
    // Course certificates carry their course title/emoji so the toast reads well
    // (the client badge lookup has no course metadata by design — bundle size).
    newCertificates: newBadges
      .filter((b) => b.startsWith("course-"))
      .map((b) => {
        const c = getCourse(b.slice("course-".length));
        return courseBadge(b.slice("course-".length), c?.title, c?.emoji);
      }),
    results,
  });
}
