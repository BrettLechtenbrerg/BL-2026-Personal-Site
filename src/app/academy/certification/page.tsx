"use client";

//==============================================================================
// Academy — certification: project submission + final exam. Unlocked once
// every module is passed (server enforces; this page mirrors the state).
//==============================================================================

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, Clock, FileEdit, Loader2, Lock, X } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import { academyConfig } from "@/content/academy.config";

const TOP = academyConfig.ranks.top;
const COPY = academyConfig.academy.copy;
const OWNER = academyConfig.academy.ownerFirstName;

interface Submission {
  status: "pending" | "approved" | "revise";
  feedback: string | null;
  created_at: string;
}

interface CertState {
  unlocked: boolean;
  project: Submission | null;
  exam: Submission | null;
  certified: boolean;
}

interface ExamQuestion {
  question: string;
  options: string[];
}

interface ExamResult {
  percent: number;
  passed: boolean;
  certified: boolean;
  results: { correct: boolean; yourAnswer: number; explanation: string }[];
}

function StatusPill({ sub }: { sub: Submission | null }) {
  if (!sub) return <span className="text-xs text-academy-fg/40">Not started</span>;
  if (sub.status === "approved")
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-academy-accent">
        <CheckCircle2 size={14} /> Approved
      </span>
    );
  if (sub.status === "pending")
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-academy-fg/60">
        <Clock size={14} /> Awaiting review
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-red-300">
      <FileEdit size={14} /> Revise &amp; resubmit
    </span>
  );
}

export default function CertificationPage() {
  const { loading } = useAcademyUser();
  const [state, setState] = useState<CertState | null>(null);
  const [projectBody, setProjectBody] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exam state
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[] | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const load = useCallback(() => {
    fetch("/api/academy/certification")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => json && setState(json))
      .catch(() => {});
  }, []);

  useEffect(load, [load]);

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/certification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "project", body: projectBody, link: projectLink }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not submit.");
      setProjectBody("");
      setProjectLink("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const startExam = async () => {
    setError(null);
    const res = await fetch("/api/academy/certification?exam=1");
    if (!res.ok) return;
    const json = await res.json();
    setExamQuestions(json.questions);
    setAnswers(new Array(json.questions.length).fill(-1));
    setCurrent(0);
    setExamResult(null);
  };

  const chooseExam = (i: number) => {
    if (!examQuestions) return;
    const next = [...answers];
    next[current] = i;
    setAnswers(next);
    setTimeout(async () => {
      if (current + 1 < examQuestions.length) {
        setCurrent((c) => c + 1);
      } else {
        setSubmitting(true);
        try {
          const res = await fetch("/api/academy/certification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "exam", answers: next }),
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(json.error || "Could not score the exam.");
          setExamResult(json);
          setExamQuestions(null);
          load();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not score the exam.");
        } finally {
          setSubmitting(false);
        }
      }
    }, 350);
  };

  if (loading || !state) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-academy-accent" size={32} />
      </div>
    );
  }

  if (!state.unlocked) {
    return (
      <div className="mx-auto max-w-xl pt-10 text-center">
        <Lock size={40} className="mx-auto mb-4 text-academy-fg/40" />
        <h1 className="font-heading text-2xl font-bold">Certification is locked</h1>
        <p className="mt-2 text-academy-fg/60">{TOP.unlockHint}</p>
        <Link
          href="/academy/modules"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark"
        >
          {COPY.backCta} <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const canSubmitProject =
    !state.project || state.project.status === "revise";

  //----------------------------------------------------------------------------
  // Exam-in-progress view
  //----------------------------------------------------------------------------
  if (examQuestions) {
    const q = examQuestions[current];
    return (
      <div className="mx-auto max-w-2xl pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold">Final Exam</h1>
          <span className="text-sm text-academy-fg/50">
            {current + 1} / {examQuestions.length}
          </span>
        </div>
        <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-academy-fg/10">
          <motion.div
            className="h-full bg-gradient-to-r from-academy-primary to-academy-accent"
            animate={{ width: `${(current / examQuestions.length) * 100}%` }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="mb-6 font-heading text-2xl font-bold leading-snug">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => chooseExam(i)}
                  disabled={submitting}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-base transition-all ${
                    answers[current] === i
                      ? "border-academy-accent bg-academy-accent/20"
                      : "border-academy-fg/15 bg-academy-fg/5 hover:border-academy-primary-light hover:bg-academy-fg/10"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-academy-fg/30 text-xs font-bold text-academy-fg/60">
                    {i + 1}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  //----------------------------------------------------------------------------
  // Main certification hub
  //----------------------------------------------------------------------------
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-heading text-3xl font-bold">
        {TOP.title} <span className="text-academy-accent">Certification</span>
      </h1>
      <p className="mb-8 text-academy-fg/60">
        Two steps: submit your capstone project, then pass the final exam. {OWNER} personally reviews
        every project.
      </p>

      {state.certified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 rounded-2xl border border-academy-accent/50 bg-academy-accent/10 p-6 text-center"
        >
          <div className="mb-2 text-5xl">🏆</div>
          <h2 className="font-heading text-2xl font-bold text-academy-accent">
            {TOP.certifiedHeading}
          </h2>
          <Link
            href="/academy/certificate"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-academy-accent px-5 py-2 font-heading font-bold text-academy-bg hover:bg-academy-accent-dark"
          >
            View Your Certificate <ArrowRight size={18} />
          </Link>
        </motion.div>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-academy-primary/40 bg-academy-primary/15 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {examResult && (
        <div
          className={`mb-6 rounded-2xl border p-6 text-center ${
            examResult.passed ? "border-academy-accent/50 bg-academy-accent/10" : "border-academy-fg/15 bg-academy-fg/5"
          }`}
        >
          <h2 className="font-heading text-2xl font-bold">
            Exam: {examResult.percent}% — {examResult.passed ? "Passed! 🎉" : "Not yet."}
          </h2>
          <div className="mt-4 space-y-2 text-left">
            {examResult.results.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {r.correct ? (
                  <Check size={16} className="mt-0.5 shrink-0 text-academy-accent" />
                ) : (
                  <X size={16} className="mt-0.5 shrink-0 text-red-400" />
                )}
                <p className="text-academy-fg/70">{r.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: project */}
      <div className="mb-4 rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-academy-accent">Step 1 · Capstone Project</h2>
          <StatusPill sub={state.project} />
        </div>
        <p className="mb-4 text-sm leading-relaxed text-academy-fg/70">
          {TOP.projectBrief}
        </p>
        {state.project?.feedback && state.project.status !== "approved" && (
          <p className="mb-4 rounded-lg border border-academy-accent/30 bg-academy-accent/10 px-3 py-2 text-sm text-academy-fg/80">
            <strong className="text-academy-accent">{OWNER}&apos;s feedback:</strong> {state.project.feedback}
          </p>
        )}
        {canSubmitProject && (
          <form onSubmit={submitProject} className="space-y-3">
            <textarea
              value={projectBody}
              onChange={(e) => setProjectBody(e.target.value)}
              rows={6}
              maxLength={10000}
              required
              minLength={50}
              placeholder="What did you implement, what changed, and what did you measure? (min 50 characters)"
              className="w-full resize-y rounded-lg border border-academy-fg/15 bg-academy-bg/30 px-4 py-3 text-base text-academy-fg placeholder-academy-fg/40 outline-none focus:border-academy-accent"
            />
            <input
              type="url"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              maxLength={500}
              placeholder="Optional link (doc, video, spreadsheet…)"
              className="w-full rounded-lg border border-academy-fg/15 bg-academy-bg/30 px-4 py-3 text-base text-academy-fg placeholder-academy-fg/40 outline-none focus:border-academy-accent"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {state.project ? "Resubmit Project" : "Submit Project"}
            </button>
          </form>
        )}
      </div>

      {/* Step 2: exam */}
      <div className="rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-academy-accent">Step 2 · Final Exam</h2>
          <StatusPill sub={state.exam} />
        </div>
        <p className="mb-4 text-sm leading-relaxed text-academy-fg/70">
          Five questions spanning all {academyConfig.vocab.modules}. Score 80%+ to pass. You can retake it.
        </p>
        {state.exam?.status !== "approved" && (
          <button
            onClick={startExam}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark"
          >
            {state.exam ? "Retake Final Exam" : "Start Final Exam"} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
