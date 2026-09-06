//==============================================================================
// Academy — module detail (server component: passes only answer-free fields)
//==============================================================================

import { notFound } from "next/navigation";
import { getModule } from "@/content/academy/modules";
import { loadFlashcards } from "@/content/academy/media";
import ModuleDetail from "@/components/academy/ModuleDetail";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) notFound();
  const flashcards = await loadFlashcards(slug);

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
        videoFiles: m.videoFiles,
        flashcards,
        images: m.images,
        keyPoints: m.keyPoints,
        lesson: m.lesson,
        questionCount: m.quiz.length,
      }}
    />
  );
}
