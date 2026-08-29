//==============================================================================
// ACADEMY — Certification API (project submission + final exam)
//==============================================================================
// Unlocked only when every module is passed (server-checked, fail closed).
// GET            → status { unlocked, project, exam, certified }
// GET ?exam=1    → final-exam questions (answers stripped)
// POST { action: "project", body, link } → submit project (status pending;
//                  resubmission allowed while not approved)
// POST { action: "exam", answers }       → score server-side; ≥80% auto-
//                  approves the exam submission, <80% records 'revise'.
// Certified = latest project approved AND latest exam approved → badge
// 'certified-masters-edge' (Black Belt).
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, getProgress, latestSubmission, maybeCertify } from "@/lib/academy-db";
import { orderedModules, finalExam, PASS_PERCENT } from "@/content/academy/modules";

async function certificationUnlocked(userId: string): Promise<boolean> {
  const progress = await getProgress(userId);
  const passed = new Set(progress.filter((p) => p.passed).map((p) => p.module_slug));
  return orderedModules().every((m) => passed.has(m.slug));
}

export async function GET(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const unlocked = await certificationUnlocked(auth);

  if (request.nextUrl.searchParams.get("exam")) {
    if (!unlocked) {
      return NextResponse.json({ error: "Certification is still locked." }, { status: 403 });
    }
    return NextResponse.json({
      passPercent: PASS_PERCENT,
      questions: finalExam.map((q) => ({ question: q.question, options: q.options })),
    });
  }

  const [project, exam] = await Promise.all([
    latestSubmission(auth, "project"),
    latestSubmission(auth, "exam"),
  ]);
  const certified = await maybeCertify(auth);
  return NextResponse.json({ unlocked, project, exam, certified });
}

export async function POST(request: NextRequest) {
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  if (!(await certificationUnlocked(auth))) {
    return NextResponse.json({ error: "Pass every module first." }, { status: 403 });
  }

  const payload = await request.json().catch(() => ({}));
  const action = String(payload?.action || "");
  const supabase = db();

  if (action === "project") {
    const existing = await latestSubmission(auth, "project");
    if (existing?.status === "approved" || existing?.status === "pending") {
      return NextResponse.json(
        { error: existing.status === "approved" ? "Your project is already approved." : "Your project is awaiting review." },
        { status: 409 }
      );
    }
    const body = String(payload?.body || "").trim().slice(0, 10000);
    const link = String(payload?.link || "").trim().slice(0, 500);
    if (body.length < 50) {
      return NextResponse.json(
        { error: "Tell us more — describe your project in at least 50 characters." },
        { status: 400 }
      );
    }
    if (link && !/^https?:\/\//i.test(link)) {
      return NextResponse.json({ error: "Links must start with http(s)://" }, { status: 400 });
    }
    const { error } = await supabase
      .from("me_submissions")
      .insert({ user_id: auth, kind: "project", body, link: link || null });
    if (error) {
      return NextResponse.json({ error: "Could not submit. Try again." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "exam") {
    const raw = payload?.answers;
    if (!Array.isArray(raw) || raw.length !== finalExam.length) {
      return NextResponse.json({ error: "Please answer every question." }, { status: 400 });
    }
    const answers = raw.map((a) => Number(a));
    if (answers.some((a, i) => !Number.isInteger(a) || a < 0 || a >= finalExam[i].options.length)) {
      return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
    }

    const results = finalExam.map((q, i) => ({
      correct: answers[i] === q.correctIndex,
      yourAnswer: answers[i],
      explanation: q.explanation,
    }));
    const score = results.filter((r) => r.correct).length;
    const percent = Math.round((score / finalExam.length) * 100);
    const passed = percent >= PASS_PERCENT;

    const { error } = await supabase.from("me_submissions").insert({
      user_id: auth,
      kind: "exam",
      body: JSON.stringify(answers),
      status: passed ? "approved" : "revise",
      feedback: `Scored ${percent}% (${score}/${finalExam.length}). ${passed ? "Passed." : `Need ${PASS_PERCENT}%.`}`,
    });
    if (error) {
      return NextResponse.json({ error: "Could not save your exam." }, { status: 500 });
    }

    const certified = passed ? await maybeCertify(auth) : false;
    return NextResponse.json({ score, total: finalExam.length, percent, passed, certified, results });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
