import { notFound, redirect } from "next/navigation";
import { partnerPrograms } from "@/content/academy/partner-programs";
import { findPartnerProgram } from "@/lib/academy-partner-programs";
import { getAcademyUserId } from "@/lib/academy-session";
import PartnerProgram from "@/components/academy/PartnerProgram";

export default async function PartnerProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = findPartnerProgram(partnerPrograms, slug);
  if (!program) notFound();
  // Match the existing lesson boundary. Never serialize the library before this check.
  const userId = await getAcademyUserId();
  if (!userId) redirect(`/academy?next=/academy/programs/${program.slug}`);
  return <PartnerProgram program={program} />;
}
