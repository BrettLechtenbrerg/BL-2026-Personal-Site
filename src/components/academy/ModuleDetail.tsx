"use client";

//==============================================================================
// Academy — module lesson view: video, resources, key points, mark-complete,
// quiz launcher. Redirects to /academy/modules if the module is locked.
//==============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, Loader2, Sparkles, Swords } from "lucide-react";
import { useAcademyUser } from "./useAcademyUser";
import Flashcards, { type Flashcard } from "./Flashcards";

export interface ModuleDetailData {
  slug: string;
  order: number;
  title: string;
  tagline: string;
  description: string;
  videoUrl: string;
  pdfs: { label: string; href: string }[];
  audio?: { label: string; href: string }[];
  videoFiles?: { label: string; href: string }[];
  flashcards?: Flashcard[];
  images: string[];
  keyPoints: string[];
  lesson: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  questionCount: number;
}

export default function ModuleDetail({ module: m }: { module: ModuleDetailData }) {
  const router = useRouter();
  const { loading } = useAcademyUser();
  const [lessonDone, setLessonDone] = useState(false);
  const [passed, setPassed] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [marking, setMarking] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/academy/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!json) return;
        if (!(json.unlocked ?? []).includes(m.slug)) {
          router.replace("/academy/modules");
          return;
        }
        const row = (json.progress ?? []).find(
          (p: { module_slug: string }) => p.module_slug === m.slug
        );
        setLessonDone(row?.lesson_done ?? false);
        setPassed(row?.passed ?? false);
        setQuizScore(row?.quiz_score ?? null);
        setReady(true);
      })
      .catch(() => {});
  }, [m.slug, router]);

  const markComplete = async () => {
    setMarking(true);
    try {
      const res = await fetch("/api/academy/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: m.slug }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setLessonDone(true);
        if (json.xpAwarded > 0) {
          setXpToast(json.xpAwarded);
          setTimeout(() => setXpToast(null), 3000);
        }
      }
    } finally {
      setMarking(false);
    }
  };

  if (loading || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/academy/modules"
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft size={16} /> All modules
      </Link>

      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gold">
        Module {m.order} · {m.tagline}
      </span>
      <h1 className="mb-2 font-heading text-3xl font-bold">{m.title}</h1>
      <p className="mb-6 leading-relaxed text-white/70">{m.description}</p>

      {/* Self-hosted videos (e.g. NotebookLM video overviews) — shown alongside
          the YouTube embed below so Brett can compare both before choosing */}
      {(m.videoFiles?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h2 className="mb-3 font-heading text-lg font-bold text-gold">Video Overview</h2>
          <div className="space-y-4">
            {m.videoFiles!.map((v) => (
              <div key={v.href}>
                <p className="mb-2 text-sm font-semibold text-white/80">{v.label}</p>
                <video controls preload="metadata" playsInline className="w-full rounded-lg">
                  <source src={v.href} />
                  Your browser doesn&apos;t support video playback —{" "}
                  <a href={v.href} className="underline">
                    download the file
                  </a>
                  .
                </video>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio lessons — e.g. NotebookLM deep-dive overviews */}
      {(m.audio?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h2 className="mb-3 font-heading text-lg font-bold text-gold">Listen</h2>
          <div className="space-y-4">
            {m.audio!.map((track) => (
              <div key={track.href}>
                <p className="mb-2 text-sm font-semibold text-white/80">{track.label}</p>
                <audio controls preload="none" className="w-full">
                  <source src={track.href} />
                  Your browser doesn&apos;t support audio playback —{" "}
                  <a href={track.href} className="underline">
                    download the file
                  </a>
                  .
                </audio>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video (YouTube embed) */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="relative aspect-video">
          <iframe
            src={m.videoUrl}
            title={m.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      {/* Written lesson — for members who learn best by reading */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-bold text-gold">
          <BookOpen size={18} /> The Lesson
        </h2>
        <p className="mb-4 text-xs text-white/50">
          Prefer reading? Everything the video covers — and everything the quiz tests — is here.
        </p>
        <div className="space-y-5">
          {m.lesson.map((section) => (
            <section key={section.heading}>
              <h3 className="mb-2 font-heading text-base font-bold text-white">
                {section.heading}
              </h3>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mb-2 text-sm leading-relaxed text-white/75">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-1 space-y-1">
                  {section.bullets.map((b) => (
                    <li key={b} className="pl-4 text-sm leading-relaxed text-white/75">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>


      {/* Flashcards — e.g. NotebookLM export, installed by scripts/academy-install.mjs */}
      {(m.flashcards?.length ?? 0) > 0 && <Flashcards cards={m.flashcards!} />}

      {/* Key points */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="mb-3 font-heading text-lg font-bold text-gold">Key Points</h2>
        <ul className="space-y-2">
          {m.keyPoints.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-relaxed text-white/80">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-gold" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      {(m.pdfs.length > 0 || m.images.length > 0) && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h2 className="mb-3 font-heading text-lg font-bold text-gold">Resources</h2>
          <div className="space-y-2">
            {m.pdfs.map((pdf) => (
              <a
                key={pdf.href}
                href={pdf.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                <FileText size={16} className="text-cranberry-light" /> {pdf.label}
              </a>
            ))}
          </div>
          {m.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {m.images.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={600}
                  height={400}
                  className="rounded-lg border border-white/10"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={markComplete}
          disabled={lessonDone || marking}
          className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg font-heading font-bold transition-colors ${
            lessonDone
              ? "cursor-default bg-gold/20 text-gold"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          <CheckCircle2 size={18} />
          {lessonDone ? "Lesson Complete" : marking ? "Saving…" : "Mark Lesson Complete"}
        </button>
        <Link
          href={`/academy/modules/${m.slug}/quiz`}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-cranberry font-heading font-bold text-white transition-colors hover:bg-cranberry-dark"
        >
          <Swords size={18} />
          {passed ? `Retake Quiz (best ${quizScore}%)` : "Take the Quiz"}
        </Link>
      </div>

      {xpToast !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 font-heading font-bold text-black shadow-lg"
        >
          +{xpToast} XP
        </motion.div>
      )}
    </div>
  );
}
