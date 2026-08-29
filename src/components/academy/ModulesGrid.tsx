"use client";

//==============================================================================
// Academy — module grid with linear lock/progress states
//==============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, PlayCircle, Loader2 } from "lucide-react";
import { useAcademyUser } from "./useAcademyUser";

export interface ModuleCard {
  slug: string;
  order: number;
  title: string;
  tagline: string;
  description: string;
  questionCount: number;
}

interface ProgressRow {
  module_slug: string;
  lesson_done: boolean;
  quiz_score: number | null;
  passed: boolean;
}

export default function ModulesGrid({ modules }: { modules: ModuleCard[] }) {
  const { loading } = useAcademyUser();
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/academy/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setProgress(json.progress ?? []);
          setUnlocked(json.unlocked ?? []);
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (loading || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Training Modules</h1>
      <p className="mb-8 text-white/60">Pass each module&apos;s quiz (80%+) to unlock the next.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((m, i) => {
          const row = progress.find((p) => p.module_slug === m.slug);
          const isUnlocked = unlocked.includes(m.slug);
          const isPassed = row?.passed ?? false;

          const card = (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative h-full rounded-2xl border p-6 backdrop-blur-md transition-all ${
                isPassed
                  ? "border-gold/40 bg-gold/10"
                  : isUnlocked
                    ? "border-white/15 bg-white/5 hover:border-cranberry-light hover:shadow-[0_0_30px_rgba(155,27,48,0.3)]"
                    : "border-white/10 bg-white/[0.02] opacity-60"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-cranberry/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
                  Module {m.order} · {m.tagline}
                </span>
                {isPassed ? (
                  <CheckCircle2 className="text-gold" size={22} />
                ) : isUnlocked ? (
                  <PlayCircle className="text-cranberry-light" size={22} />
                ) : (
                  <Lock className="text-white/40" size={20} />
                )}
              </div>
              <h2 className="mb-2 font-heading text-xl font-bold text-white">{m.title}</h2>
              <p className="text-sm leading-relaxed text-white/60">{m.description}</p>
              <div className="mt-4 text-xs text-white/50">
                {isPassed
                  ? `Passed · ${row?.quiz_score ?? "—"}%`
                  : row?.quiz_score != null
                    ? `Best quiz score: ${row.quiz_score}%`
                    : `${m.questionCount}-question quiz`}
              </div>
            </motion.div>
          );

          return isUnlocked ? (
            <Link key={m.slug} href={`/academy/modules/${m.slug}`} className="block h-full">
              {card}
            </Link>
          ) : (
            <div key={m.slug}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
