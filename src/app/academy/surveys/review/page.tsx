//==============================================================================
// Academy — Survey Results (survey team: survey_reviewer + Academy admins).
// Anyone else gets a plain "not found" so the page doesn't advertise itself.
// The API behind it checks the same permission on every request.
//==============================================================================

import { notFound, redirect } from "next/navigation";
import { getAcademyUserId } from "@/lib/academy-session";
import { getUserById } from "@/lib/academy-db";
import { canReviewSurveys } from "@/lib/survey-access";
import { surveysEnabled } from "@/lib/surveys";
import SurveyReview from "@/components/academy/surveys/SurveyReview";

export const dynamic = "force-dynamic";

export default async function SurveyReviewPage() {
  if (!surveysEnabled) notFound();
  const userId = await getAcademyUserId();
  if (!userId) redirect("/academy?next=/academy/surveys/review");
  if (!canReviewSurveys(await getUserById(userId))) notFound();
  return <SurveyReview />;
}
