//==============================================================================
// Academy — My Surveys (members only).
//==============================================================================

import { notFound, redirect } from "next/navigation";
import { getAcademyUserId } from "@/lib/academy-session";
import { surveysEnabled } from "@/lib/surveys";
import MySurveys from "@/components/academy/surveys/MySurveys";

export const dynamic = "force-dynamic";

export default async function MySurveysPage() {
  if (!surveysEnabled) notFound();
  if (!(await getAcademyUserId())) redirect("/academy?next=/academy/surveys");
  return <MySurveys />;
}
