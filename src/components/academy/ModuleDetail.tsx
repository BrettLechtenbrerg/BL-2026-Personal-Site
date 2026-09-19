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
import {
  ArrowLeft, BookOpen, CheckCircle2, Download, ExternalLink, Loader2, Sparkles, Swords,
} from "lucide-react";
import { useAcademyUser } from "./useAcademyUser";
import Flashcards, { type Flashcard } from "./Flashcards";
import PodcastPlayer from "./PodcastPlayer";
import ReadAloudPlayer from "./ReadAloudPlayer";
import { academyConfig } from "@/content/academy.config";
import { cap } from "@/lib/academy-config";

/** Narrated-lesson tracks (installed by academy-lesson.mjs narrate) vs. podcast-style overviews. */
const isReadAloud = (t: { label: string; href: string }) =>
  /^read aloud\b/i.test(t.label) || /\/read-aloud\.m4a$/i.test(t.href);

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

  const narration = (m.audio ?? []).filter(isReadAloud);
  const podcasts = (m.audio ?? []).filter((t) => !isReadAloud(t));

  if (loading || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-academy-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/academy/modules"
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-academy-fg/60 hover:text-academy-fg"
      >
        <ArrowLeft size={16} /> All {academyConfig.vocab.modules}
      </Link>

      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-academy-accent">
        {cap(academyConfig.vocab.module)} {m.order} · {m.tagline}
      </span>
      <h1 className="mb-2 font-heading text-3xl font-bold">{m.title}</h1>
      <p className="mb-6 leading-relaxed text-academy-fg/70">{m.description}</p>

      {/* Self-hosted videos (e.g. NotebookLM video overviews) — shown alongside
          the YouTube embed below so the owner can compare both before choosing */}
      {(m.videoFiles?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6 backdrop-blur-md">
          <h2 className="mb-3 font-heading text-lg font-bold text-academy-accent">Video Overview</h2>
          <div className="space-y-4">
            {m.videoFiles!.map((v) => (
              <div key={v.href}>
                <p className="mb-2 text-sm font-semibold text-academy-fg/80">{v.label}</p>
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

      {/* Podcast overviews — e.g. NotebookLM deep dives (narration lives in the Lesson card) */}
      {podcasts.length > 0 && (
        <div className="mb-6 space-y-4">
          {podcasts.map((track) => (
            <PodcastPlayer key={track.href} label={track.label} src={track.href} />
          ))}
        </div>
      )}

      {/* Video (YouTube embed) — hidden when the brand has no placeholder video yet */}
      {m.videoUrl && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-academy-fg/10 bg-academy-bg/40">
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
      )}

      {/* Written lesson — for members who learn best by reading */}
      <div className="mb-6 rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6 backdrop-blur-md">
        <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-bold text-academy-accent">
          <BookOpen size={18} /> The Lesson
        </h2>
        <p className="mb-4 text-xs text-academy-fg/50">
          Prefer reading? Everything the video covers — and everything the quiz tests — is here.
          {narration.length > 0 && ` Or press play and let ${academyConfig.narration.narrator} read it to you.`}
        </p>
        {narration.map((track) => (
          <div key={track.href} className="mb-6">
            <ReadAloudPlayer title={m.title} src={track.href} chapters={m.lesson.map((s) => s.heading)} />
          </div>
        ))}
        <div className="space-y-5">
          {m.lesson.map((section) => (
            <section key={section.heading}>
              <h3 className="mb-2 font-heading text-base font-bold text-academy-fg">
                {section.heading}
              </h3>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mb-2 text-sm leading-relaxed text-academy-fg/75">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-1 space-y-1">
                  {section.bullets.map((b) => (
                    <li key={b} className="pl-4 text-sm leading-relaxed text-academy-fg/75">
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
      <div className="mb-6 rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6 backdrop-blur-md">
        <h2 className="mb-3 font-heading text-lg font-bold text-academy-accent">Key Points</h2>
        <ul className="space-y-2">
          {m.keyPoints.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-relaxed text-academy-fg/80">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-academy-accent" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Resources — downloadable workbooks / worksheets, presented as document tiles */}
      {(m.pdfs.length > 0 || m.images.length > 0) && (
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-academy-accent/30 bg-gradient-to-br from-[#1a1206] via-academy-bg to-[#12100a] p-6 shadow-[0_0_40px_-14px_var(--academy-accent)]">
          <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-academy-accent/15 blur-3xl" />
          <div className="relative">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-academy-accent">
              <Download size={12} /> Downloads
            </div>
            <h2 className="font-heading text-xl font-bold text-academy-fg">Resources &amp; Worksheets</h2>
            <p className="mb-5 text-sm text-academy-fg/60">
              Print these, fill them in, and put the lesson to work this week.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {m.pdfs.map((pdf) => (
                <ResourceTile key={pdf.href} label={pdf.label} href={pdf.href} />
              ))}
            </div>
          </div>
          {m.images.length > 0 && (
            <div className="relative mt-4 grid grid-cols-2 gap-3">
              {m.images.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={600}
                  height={400}
                  className="rounded-lg border border-academy-fg/10"
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
              ? "cursor-default bg-academy-accent/20 text-academy-accent"
              : "bg-academy-fg/10 text-academy-fg hover:bg-academy-fg/20"
          }`}
        >
          <CheckCircle2 size={18} />
          {lessonDone ? "Lesson Complete" : marking ? "Saving…" : "Mark Lesson Complete"}
        </button>
        <Link
          href={`/academy/modules/${m.slug}/quiz`}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-academy-primary font-heading font-bold text-academy-fg transition-colors hover:bg-academy-primary-dark"
        >
          <Swords size={18} />
          {passed ? `Retake Quiz (best ${quizScore}%)` : "Take the Quiz"}
        </Link>
      </div>

      {xpToast !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-academy-accent px-5 py-2 font-heading font-bold text-academy-bg shadow-lg"
        >
          +{xpToast} XP
        </motion.div>
      )}
    </div>
  );
}

/** A downloadable document as a tile: paper-sheet icon, label, file type, open + download. */
function ResourceTile({ label, href }: { label: string; href: string }) {
  const ext = (href.split(".").pop() ?? "").toUpperCase();
  const clean = label.replace(/\s*\((PDF|pdf)\)\s*$/, "");
  return (
    <div className="group flex gap-4 rounded-xl border border-academy-fg/10 bg-academy-fg/[0.04] p-4 transition-colors hover:border-academy-accent/50 hover:bg-academy-fg/[0.07]">
      {/* Paper sheet */}
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${clean}`} className="shrink-0">
        <div className="relative h-24 w-[72px] rounded-sm bg-gradient-to-b from-[#fbf6ea] to-[#e9dfc6] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)] transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-1.5deg]">
          <span aria-hidden className="absolute right-0 top-0 h-5 w-5 bg-[#c9a96a] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
          <span aria-hidden className="absolute right-0 top-0 h-5 w-5 bg-[#2b2118]/10 [clip-path:polygon(0_0,100%_0,100%_100%)]" />
          <div className="absolute inset-x-2 top-7 space-y-1.5">
            {[60, 90, 75, 85, 50].map((w, i) => (
              <span key={i} className="block h-1 rounded-full bg-[#b9a37c]" style={{ width: `${w}%` }} />
            ))}
          </div>
          <span className="absolute bottom-1.5 left-1.5 rounded bg-academy-primary px-1.5 py-0.5 text-[9px] font-black tracking-wider text-academy-fg">
            {ext || "FILE"}
          </span>
        </div>
      </a>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-base font-bold leading-snug text-academy-fg">{clean}</p>
        <p className="mt-1 text-xs text-academy-fg/50">{ext ? `${ext} document` : "Document"} · opens in a new tab</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-academy-accent px-3.5 text-sm font-heading font-bold text-academy-bg hover:bg-academy-accent-light"
          >
            <ExternalLink size={15} /> Open
          </a>
          <a
            href={href}
            download
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-academy-fg/15 px-3.5 text-sm font-semibold text-academy-fg/80 hover:bg-academy-fg/10 hover:text-academy-fg"
          >
            <Download size={15} /> Download
          </a>
        </div>
      </div>
    </div>
  );
}
