//==============================================================================
// Academy — take one survey: /academy/surveys/<slug> (slugs from the site's
// content/academy/surveys.ts). This is the link the team sends; logged-out
// members log in and land back here.
//==============================================================================

import { notFound, redirect } from "next/navigation";
import { getAcademyUserId } from "@/lib/academy-session";
import { isSurveySlug } from "@/lib/surveys";
import SurveyRunner from "@/components/academy/surveys/SurveyRunner";

export const dynamic = "force-dynamic";

export default async function SurveyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSurveySlug(slug)) notFound();
  if (!(await getAcademyUserId())) redirect(`/academy?next=/academy/surveys/${slug}`);
  return <SurveyRunner slug={slug} />;
}
