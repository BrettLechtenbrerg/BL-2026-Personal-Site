//==============================================================================
// Academy — module detail (server component: passes only answer-free fields)
//==============================================================================

import { notFound } from "next/navigation";
import { getModule } from "@/content/academy/modules";
import ModuleDetail from "@/components/academy/ModuleDetail";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) notFound();

  return (
    <ModuleDetail
      module={{
        slug: m.slug,
        order: m.order,
        title: m.title,
        tagline: m.tagline,
        description: m.description,
        videoUrl: m.videoUrl,
        pdfs: m.pdfs,
        audio: m.audio,
        images: m.images,
        keyPoints: m.keyPoints,
        lesson: m.lesson,
        questionCount: m.quiz.length,
      }}
    />
  );
}
