//==============================================================================
// ACADEMY — Member surveys: the survey team's view of EVERY member's answers
//==============================================================================
// The survey team (me_users.survey_reviewer) and Academy admins only;
// everyone else gets 403. 404 when the site defines no surveys.
// GET               → { members, responses } for the results page.
// GET ?format=csv   → spreadsheet download of every response.
// DELETE ?id=<uuid> → remove one response (e.g. a test answer, or to let a
//                     member redo a survey). The page asks for confirmation.
//==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAcademyUser } from "@/lib/academy-session";
import { db, getUserById } from "@/lib/academy-db";
import { canReviewSurveys, NOT_SET_UP_MESSAGE, surveysNotSetUp } from "@/lib/survey-access";
import { responsesCsv, surveysEnabled } from "@/lib/surveys";
import { CSV_STEM, TEAM_NAME } from "@/lib/survey-text";

const noStore = { "Cache-Control": "private, no-store" };

async function requireReviewer(): Promise<NextResponse | string> {
  if (!surveysEnabled) return NextResponse.json({ error: "Not found." }, { status: 404, headers: noStore });
  const auth = await requireAcademyUser();
  if (auth instanceof NextResponse) return auth;
  if (!canReviewSurveys(await getUserById(auth))) {
    return NextResponse.json({ error: `Survey results are for ${TEAM_NAME} only.` }, { status: 403, headers: noStore });
  }
  return auth;
}

export async function GET(request: NextRequest) {
  const auth = await requireReviewer();
  if (auth instanceof NextResponse) return auth;

  const supabase = db();
  const [{ data: users, error: usersError }, { data: responses, error }] = await Promise.all([
    supabase
      .from("me_users")
      .select("id, name, email, avatar, photo_url, role, survey_reviewer, created_at")
      .order("name", { ascending: true })
      .limit(1000),
    supabase
      .from("me_survey_responses")
      .select("id, user_id, survey_slug, answers, submitted_at")
      .order("submitted_at", { ascending: true })
      .limit(5000),
  ]);
  if (error || usersError) {
    if (surveysNotSetUp(error)) return NextResponse.json({ error: NOT_SET_UP_MESSAGE, notSetUp: true }, { status: 503, headers: noStore });
    console.error("[academy-surveys-review] read failed:", (error ?? usersError)?.message);
    return NextResponse.json({ error: "Could not load survey results." }, { status: 500, headers: noStore });
  }

  const members = (users ?? []).map((u) => ({
    id: u.id as string,
    name: u.name as string,
    email: u.email as string,
    avatar: u.avatar as string,
    photoUrl: (u.photo_url as string | null) ?? null,
    leader: u.role === "admin" || u.survey_reviewer === true,
    joinedAt: u.created_at as string,
  }));

  if (request.nextUrl.searchParams.get("format") === "csv") {
    const byId = new Map(members.map((m) => [m.id, m]));
    const csv = responsesCsv(
      (responses ?? []).map((r) => ({
        name: byId.get(r.user_id)?.name ?? "(deleted member)",
        email: byId.get(r.user_id)?.email ?? "",
        survey_slug: r.survey_slug,
        submitted_at: r.submitted_at,
        answers: r.answers,
      }))
    );
    return new NextResponse(csv, {
      headers: {
        ...noStore,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${CSV_STEM}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ members, responses: responses ?? [] }, { headers: noStore });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireReviewer();
  if (auth instanceof NextResponse) return auth;

  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Unknown response." }, { status: 400 });

  const { data, error } = await db().from("me_survey_responses").delete().eq("id", id).select("user_id, survey_slug");
  if (error) {
    console.error("[academy-surveys-review] delete failed:", error.message);
    return NextResponse.json({ error: "Could not remove that response." }, { status: 500 });
  }
  if (!data?.length) return NextResponse.json({ error: "That response was already removed." }, { status: 404 });
  console.info(`[academy-surveys-review] reviewer ${auth} removed ${data[0].survey_slug} response of member ${data[0].user_id}`);
  return NextResponse.json({ success: true });
}
