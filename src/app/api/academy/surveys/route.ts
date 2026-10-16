//==============================================================================
// ACADEMY — Member surveys: the signed-in member's OWN surveys
//==============================================================================
// GET  → { schedule, responses, reviewer } — only this member's answers.
// POST { survey, answers } → saves one response. Answers are final: a second
//      submission of the same survey is refused (409) by the unique key.
// The survey team reads everyone's answers through ./review (separate permission).
// 404 when the site defines no surveys (content/academy/surveys.ts).
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, getUserById } from "@/lib/academy-db";
import { canReviewSurveys, NOT_SET_UP_MESSAGE, surveysNotSetUp } from "@/lib/survey-access";
import { FIRST_SURVEY, isSurveySlug, surveyBySlug, surveySchedule, surveysEnabled, validateSubmission } from "@/lib/surveys";
import { NEEDS_FIRST } from "@/lib/survey-text";

const noStore = { "Cache-Control": "private, no-store" };
const off = () => NextResponse.json({ error: "Not found." }, { status: 404, headers: noStore });

export async function GET() {
  if (!surveysEnabled) return off();
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const [user, { data, error }] = await Promise.all([
    getUserById(auth),
    db()
      .from("me_survey_responses")
      .select("survey_slug, answers, submitted_at")
      .eq("user_id", auth)
      .order("submitted_at", { ascending: true }),
  ]);
  if (error) {
    if (surveysNotSetUp(error)) return NextResponse.json({ error: NOT_SET_UP_MESSAGE, notSetUp: true }, { status: 503, headers: noStore });
    console.error("[academy-surveys] read failed:", error.message);
    return NextResponse.json({ error: "Could not load your surveys." }, { status: 500, headers: noStore });
  }
  const responses = data ?? [];
  return NextResponse.json(
    {
      schedule: surveySchedule(responses),
      responses,
      reviewer: canReviewSurveys(user),
      firstName: user?.name.split(" ")[0] ?? "",
    },
    { headers: noStore }
  );
}

export async function POST(request: NextRequest) {
  if (!surveysEnabled || !FIRST_SURVEY) return off();
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  const slug = body?.survey;
  if (!isSurveySlug(slug)) return NextResponse.json({ error: "Unknown survey." }, { status: 400 });

  const checked = validateSubmission(slug, body?.answers);
  if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });

  // Later surveys are compared with the first one, so it must come first.
  // (Taking a later one a little early is fine: the team sends the links.)
  if (slug !== FIRST_SURVEY.slug) {
    const { data: start, error: startError } = await db()
      .from("me_survey_responses")
      .select("id")
      .eq("user_id", auth)
      .eq("survey_slug", FIRST_SURVEY.slug)
      .maybeSingle();
    if (startError) {
      if (surveysNotSetUp(startError)) return NextResponse.json({ error: NOT_SET_UP_MESSAGE }, { status: 503 });
      console.error("[academy-surveys] start check failed:", startError.message);
      return NextResponse.json({ error: "Could not save your answers. Please try again." }, { status: 500 });
    }
    if (!start) {
      return NextResponse.json({ error: NEEDS_FIRST, needsStart: true }, { status: 409 });
    }
  }

  const { error } = await db()
    .from("me_survey_responses")
    .insert({ user_id: auth, survey_slug: slug, version: 1, answers: checked.answers });
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: `You've already sent your ${surveyBySlug(slug).title}. Thank you!`, alreadySent: true },
        { status: 409 }
      );
    }
    if (surveysNotSetUp(error)) return NextResponse.json({ error: NOT_SET_UP_MESSAGE }, { status: 503 });
    console.error("[academy-surveys] save failed:", error.code, error.message);
    return NextResponse.json({ error: "Could not save your answers. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
