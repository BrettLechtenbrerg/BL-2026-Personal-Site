//==============================================================================
// Academy — click through one survey as a member would, in preview mode
// (survey team only). /academy/surveys/preview/<slug>.
// No locks, nothing loaded, nothing saved or sent.
//==============================================================================

import { notFound, redirect } from "next/navigation";
import { getAcademyUserId } from "@/lib/academy-session";
import { getUserById } from "@/lib/academy-db";
import { canReviewSurveys } from "@/lib/survey-access";
import { isSurveySlug } from "@/lib/surveys";
import SurveyRunner from "@/components/academy/surveys/SurveyRunner";

export const dynamic = "force-dynamic";

export default async function SurveyPreviewOnePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSurveySlug(slug)) notFound();
  const userId = await getAcademyUserId();
  if (!userId) redirect(`/academy?next=/academy/surveys/preview/${slug}`);
  if (!canReviewSurveys(await getUserById(userId))) notFound();
  // key: switching surveys from the preview bar starts the new one fresh.
  return <SurveyRunner key={slug} slug={slug} preview />;
}
