"use client";

//==============================================================================
// Academy — typeform-style quiz: one question per screen, keyboard nav,
// animated transitions, server-side scoring, 80% pass gate.
//==============================================================================

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw, X } from "lucide-react";
import { badgeBySlug } from "@/content/academy/badges";

interface Question {
  question: string;
  options: string[];
}

interface QuizResult {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  passPercent: number;
  xpAwarded: number;
  newBadges: string[];
  results: { correct: boolean; yourAnswer: number; explanation: string }[];
}

export default function QuizPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setReady(false);
    setResult(null);
    setCurrent(0);
    fetch(`/api/academy/quiz?module=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/academy");
          return;
        }
        if (!res.ok) {
          router.replace("/academy/modules");
          return;
        }
        const json = await res.json();
        setTitle(json.module.title);
        setQuestions(json.questions);
        setAnswers(new Array(json.questions.length).fill(-1));
        setReady(true);
      })
      .catch(() => router.replace("/academy/modules"));
  }, [slug, router]);

  useEffect(load, [load]);

  const submit = useCallback(
    async (finalAnswers: number[]) => {
      setSubmitting(true);
      setError(null);
      try {
        const res = await fetch("/api/academy/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: slug, answers: finalAnswers }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Could not score the quiz.");
        setResult(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not score the quiz.");
      } finally {
        setSubmitting(false);
      }
    },
    [slug]
  );

  const choose = useCallback(
    (optionIndex: number) => {
      if (submitting || result) return;
      const next = [...answers];
      next[current] = optionIndex;
      setAnswers(next);
      // Brief beat so the selection registers visually, then advance.
      setTimeout(() => {
        if (current + 1 < questions.length) {
          setCurrent((c) => c + 1);
        } else {
          submit(next);
        }
      }, 350);
    },
    [answers, current, questions.length, result, submit, submitting]
  );

  // Keyboard: 1–9 selects an option.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ready || result || submitting) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= questions[current]?.options.length) {
        choose(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, result, submitting, current, questions, choose]);

  if (!ready || submitting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-gold" size={32} />
        {submitting && <p className="text-white/60">Scoring your answers…</p>}
      </div>
    );
  }

  //----------------------------------------------------------------------------
  // Result screens
  //----------------------------------------------------------------------------
  if (result) {
    return (
      <div className="mx-auto max-w-2xl pt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 rounded-2xl border p-8 text-center backdrop-blur-md ${
            result.passed ? "border-gold/50 bg-gold/10" : "border-white/15 bg-white/5"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-3 text-6xl"
          >
            {result.passed ? "🎉" : "🥊"}
          </motion.div>
          <h1 className="font-heading text-3xl font-bold">
            {result.percent}% — {result.passed ? "Passed!" : "Not yet."}
          </h1>
          <p className="mt-2 text-white/70">
            {result.score}/{result.total} correct.{" "}
            {result.passed
              ? result.xpAwarded > 0
                ? `+${result.xpAwarded} XP earned.`
                : "Already conquered — no new XP this time."
              : `You need ${result.passPercent}% to pass. Review below and go again.`}
          </p>
          {result.newBadges.map((slug) => {
            const badge = badgeBySlug(slug);
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 font-heading font-bold text-black"
              >
                <span className="text-xl">{badge.emoji}</span> Badge earned: {badge.name}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Review */}
        <div className="space-y-3">
          {questions.map((q, i) => {
            const r = result.results[i];
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  r.correct ? "border-gold/30 bg-gold/5" : "border-cranberry/40 bg-cranberry/10"
                }`}
              >
                <div className="flex items-start gap-2">
                  {r.correct ? (
                    <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                  ) : (
                    <X size={18} className="mt-0.5 shrink-0 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{q.question}</p>
                    <p className="mt-1 text-xs text-white/60">
                      Your answer: {q.options[r.yourAnswer]}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/70">{r.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {!result.passed && (
            <button
              onClick={load}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-cranberry font-heading font-bold text-white hover:bg-cranberry-dark"
            >
              <RotateCcw size={18} /> Retake Quiz
            </button>
          )}
          <Link
            href={result.passed ? "/academy/modules" : `/academy/modules/${slug}`}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 font-heading font-bold text-white hover:bg-white/20"
          >
            {result.passed ? (
              <>
                Continue Training <ArrowRight size={18} />
              </>
            ) : (
              "Review the Lesson"
            )}
          </Link>
        </div>
      </div>
    );
  }

  //----------------------------------------------------------------------------
  // Question screens (one at a time)
  //----------------------------------------------------------------------------
  const q = questions[current];
  return (
    <div className="mx-auto max-w-2xl pt-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/academy/modules/${slug}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft size={16} /> {title}
        </Link>
        <span className="text-sm text-white/50">
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cranberry to-gold"
          animate={{ width: `${(current / questions.length) * 100}%` }}
        />
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-cranberry/40 bg-cranberry/15 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="mb-6 font-heading text-2xl font-bold leading-snug">{q.question}</h1>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-base transition-all ${
                    selected
                      ? "border-gold bg-gold/20 text-white"
                      : "border-white/15 bg-white/5 text-white/85 hover:border-cranberry-light hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                      selected ? "border-gold bg-gold text-black" : "border-white/30 text-white/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-white/40">Tip: press 1–{q.options.length} on your keyboard.</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
