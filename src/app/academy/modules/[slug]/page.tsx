//==============================================================================
// Academy — module detail (server component: passes only answer-free fields)
//==============================================================================
// THE paywall gate for lesson content: no session → /academy; course not
// owned → a locked panel with the Unlock button, and the lesson never leaves
// the server. (Media files under /public are still public by URL — see
// docs/ACADEMY.md.)
//==============================================================================

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { courseForModule, getModule } from "@/content/academy/modules";
import { loadFlashcards } from "@/content/academy/media";
import { getAcademyUserId } from "@/lib/academy-session";
import { getOwnedCourses } from "@/lib/academy-access";
import { coursePriceLabels } from "@/lib/stripe";
import ModuleDetail from "@/components/academy/ModuleDetail";
import UnlockCourseButton from "@/components/academy/UnlockCourseButton";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) notFound();
  const course = courseForModule(m);
  if (!course) notFound();

  const userId = await getAcademyUserId();
  if (!userId) redirect("/academy");

  const owned = await getOwnedCourses(userId);
  if (!owned.has(course.id)) {
    const priceLabel = (await coursePriceLabels())[course.id];
    return (
      <div className="mx-auto max-w-2xl pt-6">
        <Link
          href={`/academy/modules#${course.id}`}
          className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to courses
        </Link>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur-md">
          <div className="mb-3 text-5xl">{course.emoji}</div>
          <h1 className="font-heading text-2xl font-bold">
            Module {m.order} is part of {course.title}
          </h1>
          <p className="mt-2 text-white/70">
            Unlock the whole course to open this lesson, its quiz, and every other module in it.
            Have a gift code? Enter it at checkout.
          </p>
          <UnlockCourseButton courseId={course.id} priceLabel={priceLabel} className="mt-6" />
        </div>
      </div>
    );
  }

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
