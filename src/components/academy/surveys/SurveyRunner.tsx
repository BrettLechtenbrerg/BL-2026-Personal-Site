"use client";

//==============================================================================
// Member surveys — one question per screen (Typeform style).
//==============================================================================
// Intro → tap-to-answer ratings (auto-advance) → short answers (optional)
// → send → thank you. A draft survives a refresh (sessionStorage, this tab
// only). Once sent, the survey shows the member's answers read-only.
// Preview mode (team, /academy/surveys/preview/<slug>): same screens, but
// nothing is loaded, locked, kept as a draft or sent.
// "Try it" mode (GIFT CONNECT, 16 Oct 2026): a survey team member
// (survey_reviewer) who opens a later survey before sending the first one gets
// the same preview screens in place instead of the "start first" lock. Nothing
// is sent; the API still refuses a later survey without the first one.
// Everyone else (all signups unless added to the team) takes them in order.
//==============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Eye, Loader2, Lock, RotateCcw, Send } from "lucide-react";
import SurveyAnswersView, { formatSurveyDate } from "./SurveyAnswersView";
import {
  FIRST_SURVEY,
  RATING_QUESTIONS,
  MAX_ANSWER_CHARS,
  readAnswers,
  surveyBySlug,
  SURVEYS,
  SURVEY_MINUTES,
  type RatingId,
  type SurveySlug,
  type SurveyStatus,
} from "@/lib/surveys";
import { A_MEMBER, cap, MEMBERS, TEAM_LABEL, TEAM_NAME, THANK_YOU } from "@/lib/survey-text";
import { academyConfig } from "@/content/academy.config";

const FIRST_SLUG = FIRST_SURVEY?.slug ?? "";
const FIRST_TITLE = FIRST_SURVEY?.title ?? "";

interface OwnResponse {
  survey_slug: string;
  answers: unknown;
  submitted_at: string;
}

interface Draft {
  step: number;
  ratings: Partial<Record<RatingId, number>>;
  text: Record<string, string>;
}

const card = "rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6 backdrop-blur-md sm:p-8";
const primaryButton =
  "inline-flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark disabled:opacity-60";
const quietButton =
  "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-academy-fg/75 hover:bg-academy-fg/10 hover:text-academy-fg";

export function PrivacyNote() {
  return (
    <p className="flex gap-2 rounded-lg border border-academy-fg/10 bg-academy-bg/20 px-4 py-3 text-sm text-academy-fg/80">
      <Lock size={16} className="mt-0.5 shrink-0 text-academy-accent" aria-hidden />
      <span>
        {`Your answers are saved to your account. Only you and ${TEAM_NAME} can see them. Anything shared beyond that is group totals with no names. Please don't include medical details.`}
      </span>
    </p>
  );
}

/** Shown on every preview screen so a team member never mistakes it for the real survey. */
function PreviewBar({ slug, teamTry = false }: { slug: SurveySlug; teamTry?: boolean }) {
  return (
    <div className="mx-auto mb-4 max-w-2xl rounded-2xl border-2 border-dashed border-academy-accent/60 bg-academy-accent/10 px-4 py-3 text-sm">
      <p className="flex items-center gap-2 font-semibold">
        <Eye size={16} className="shrink-0 text-academy-accent" aria-hidden />
        {teamTry
          ? `${cap(TEAM_LABEL)}: try this survey before it opens for you. Nothing you enter is saved or sent.`
          : `Preview: this is what ${MEMBERS} see. Nothing you enter is saved or sent.`}
      </p>
      {teamTry && (
        <p className="mt-1 text-academy-fg/80">{`${cap(MEMBERS)} must send their ${FIRST_TITLE} before this one opens.`}</p>
      )}
      <nav aria-label="Preview another survey" className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {SURVEYS.map((s) => (
          <Link
            key={s.slug}
            href={`/academy/surveys/preview/${s.slug}`}
            aria-current={s.slug === slug ? "page" : undefined}
            className={`underline underline-offset-4 ${s.slug === slug ? "font-bold" : "text-academy-fg/75 hover:text-academy-fg"}`}
          >
            {s.title}
          </Link>
        ))}
        <Link href="/academy/surveys/preview" className="text-academy-fg/75 underline underline-offset-4 hover:text-academy-fg">
          All questions
        </Link>
      </nav>
    </div>
  );
}

export default function SurveyRunner({ slug, preview = false }: { slug: SurveySlug; preview?: boolean }) {
  const survey = surveyBySlug(slug);
  const draftKey = `pts-survey-draft:${slug}`;
  const total = RATING_QUESTIONS.length + survey.shortAnswers.length;

  // Team member opening a survey that is still locked for them: show it, save nothing.
  const [teamTry, setTeamTry] = useState(false);
  const isPreview = preview || teamTry;
  const [phase, setPhase] = useState<"loading" | "notSetUp" | "error" | "needsStart" | "taking" | "sent" | "already" | "previewDone">(
    preview ? "taking" : "loading",
  );
  const [firstName, setFirstName] = useState("");
  const [existing, setExisting] = useState<OwnResponse | null>(null);
  const [nextUp, setNextUp] = useState<SurveyStatus | null>(null);
  // step -1 = intro; 0..total-1 = questions
  const [step, setStep] = useState(-1);
  const [ratings, setRatings] = useState<Partial<Record<RatingId, number>>>({});
  const [text, setText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** This member's response to this survey: null = not sent yet, undefined = couldn't load. */
  const load = useCallback(async (): Promise<OwnResponse | null | undefined> => {
    const res = await fetch("/api/academy/surveys").catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    if (!res || !res.ok) {
      if (res?.status === 401) window.location.replace(`/academy?next=/academy/surveys/${slug}`);
      setPhase(json.notSetUp ? "notSetUp" : "error");
      return undefined;
    }
    setFirstName(json.firstName ?? "");
    const own = json.responses as OwnResponse[];
    const mine = own.find((r) => r.survey_slug === slug) ?? null;
    setExisting(mine);
    // Later surveys compare against the first one, so it comes first.
    if (!mine && slug !== FIRST_SLUG && !own.some((r) => r.survey_slug === FIRST_SLUG)) {
      if (json.reviewer === true) {
        setTeamTry(true);
        setPhase("taking");
      } else {
        setPhase("needsStart");
      }
      return undefined;
    }
    const schedule = json.schedule as SurveyStatus[];
    setNextUp(schedule.find((s) => s.slug !== slug && s.state !== "done") ?? null);
    return mine;
  }, [slug]);

  useEffect(() => {
    if (preview) return; // nothing to load: no locks, no saved answers, no drafts
    let cancelled = false;
    load().then((mine) => {
      if (cancelled || mine === undefined) return;
      if (mine) {
        setPhase("already");
        return;
      }
      try {
        const saved = JSON.parse(sessionStorage.getItem(draftKey) ?? "null") as Draft | null;
        if (saved && typeof saved.step === "number") {
          setRatings(saved.ratings ?? {});
          setText(saved.text ?? {});
          setStep(Math.min(Math.max(saved.step, -1), total - 1));
        }
      } catch {
        /* ignore a damaged draft */
      }
      setPhase("taking");
    });
    return () => {
      cancelled = true;
    };
  }, [load, draftKey, total, preview]);

  // Keep the draft for this tab only.
  useEffect(() => {
    if (phase !== "taking" || isPreview) return;
    sessionStorage.setItem(draftKey, JSON.stringify({ step, ratings, text } satisfies Draft));
  }, [phase, step, ratings, text, draftKey, isPreview]);

  // Move focus to the new question so screen readers and keyboards follow along.
  useEffect(() => {
    if (phase === "taking" || phase === "sent" || phase === "previewDone") headingRef.current?.focus();
  }, [step, phase]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const goTo = (next: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setError(null);
    setStep(Math.min(Math.max(next, -1), total - 1));
  };

  const pick = (id: RatingId, value: number) => {
    setRatings((r) => ({ ...r, [id]: value }));
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => goTo(step + 1), 260);
  };

  const send = async () => {
    const missing = RATING_QUESTIONS.findIndex((q) => ratings[q.id] === undefined);
    if (missing !== -1) {
      goTo(missing);
      setError("Please answer this one before sending.");
      return;
    }
    if (isPreview) {
      setPhase("previewDone"); // never sent
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ survey: slug, answers: { ratings, text } }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 409 && json.alreadySent) {
        sessionStorage.removeItem(draftKey);
        await load();
        setPhase("already");
        return;
      }
      if (!res.ok) throw new Error(json.error || "Could not send your answers. Please try again.");
      sessionStorage.removeItem(draftKey);
      await load();
      setPhase("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your answers. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (phase === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-academy-accent" size={32} aria-label="Loading" />
      </div>
    );
  }

  if (phase === "notSetUp" || phase === "error") {
    return (
      <div className={`mx-auto max-w-2xl ${card}`}>
        <h1 className="font-heading text-2xl font-bold">{survey.title}</h1>
        <p className="mt-3 text-academy-fg/80">
          {phase === "notSetUp" ? "Surveys are still being set up. Please try again soon." : "We couldn't load this survey. Please refresh the page."}
        </p>
      </div>
    );
  }

  if (phase === "needsStart") {
    return (
      <div className={`mx-auto max-w-2xl ${card}`}>
        <h1 className="font-heading text-2xl font-bold">{survey.title}</h1>
        <p className="mt-3 text-academy-fg/80">
          {`Please start with your ${FIRST_TITLE}. It's what we compare your later answers with.`}
        </p>
        <Link href={`/academy/surveys/${FIRST_SLUG}`} className={`mt-5 ${primaryButton}`}>
          {`Take the ${FIRST_TITLE} `}<ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    );
  }

  const nextLine =
    nextUp &&
    (nextUp.opensAt
      ? `Your ${surveyBySlug(nextUp.slug).title} opens on ${formatSurveyDate(nextUp.opensAt)}. We'll show it on your dashboard.`
      : nextUp.state === "open"
        ? `Your ${surveyBySlug(nextUp.slug).title} is ready too, whenever you are.`
        : null);

  if (phase === "already" && existing) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-academy-accent">Sent {formatSurveyDate(existing.submitted_at)}</p>
        <h1 className="mt-1 font-heading text-3xl font-bold">{survey.title}</h1>
        <p className="mt-2 text-academy-fg/80">Thank you! Here are the answers you sent. They can&apos;t be changed.</p>
        <div className={`mt-6 ${card}`}>
          <SurveyAnswersView answers={readAnswers(existing.answers)} />
        </div>
        <Link href="/academy/surveys" className={`mt-6 ${quietButton}`}>
          <ArrowLeft size={16} aria-hidden /> My Surveys
        </Link>
      </div>
    );
  }

  if (phase === "sent") {
    return (
      <div className={`mx-auto max-w-2xl text-center ${card}`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-academy-accent/15 text-academy-accent">
          <Check size={28} aria-hidden />
        </div>
        <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-heading text-3xl font-bold outline-none">
          Thank you{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="mt-3 text-lg text-academy-fg/85">Your {survey.title}{` is saved. ${THANK_YOU}`}</p>
        {nextLine && <p className="mt-3 text-academy-fg/75">{nextLine}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/academy/dashboard" className={primaryButton}>
            Back to my dashboard <ArrowRight size={16} aria-hidden />
          </Link>
          <Link href="/academy/surveys" className={quietButton}>
            See my answers
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "previewDone") {
    const again = () => {
      setRatings({});
      setText({});
      setStep(-1);
      setPhase("taking");
    };
    return (
      <>
        <PreviewBar slug={slug} teamTry={teamTry} />
        <div className={`mx-auto max-w-2xl text-center ${card}`}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-academy-accent/15 text-academy-accent">
            <Check size={28} aria-hidden />
          </div>
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-heading text-3xl font-bold outline-none">
            End of the preview
          </h1>
          <p className="mt-3 text-lg text-academy-fg/85">
            {`Here ${A_MEMBER} sees “Thank you!” and their `}{survey.title} is saved to their account. Nothing was
            saved for this preview.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={again} className={primaryButton}>
              <RotateCcw size={16} aria-hidden /> Preview again
            </button>
            <Link href="/academy/surveys/preview" className={quietButton}>
              All questions
            </Link>
            <Link href="/academy/surveys/review" className={quietButton}>
              Survey Results
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ---- taking the survey ----
  if (step === -1) {
    return (
      <>
      {isPreview && <PreviewBar slug={slug} teamTry={teamTry} />}
      <div className={`mx-auto max-w-2xl ${card}`}>
        <p className="text-sm font-semibold uppercase tracking-wide text-academy-accent">{academyConfig.academy.name}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-1 font-heading text-3xl font-bold outline-none sm:text-4xl">
          {survey.title}
        </h1>
        <p className="mt-3 text-lg text-academy-fg/85">{survey.intro}</p>
        <p className="mt-2 text-academy-fg/70">{total}{` quick questions · about ${SURVEY_MINUTES} minutes`}</p>
        <div className="mt-5">
          <PrivacyNote />
        </div>
        <button type="button" onClick={() => goTo(0)} className={`mt-6 ${primaryButton}`}>
          {Object.keys(ratings).length ? "Continue" : "Start"} <ArrowRight size={18} aria-hidden />
        </button>
      </div>
      </>
    );
  }

  const isRating = step < RATING_QUESTIONS.length;
  const rating = isRating ? RATING_QUESTIONS[step] : null;
  const short = isRating ? null : survey.shortAnswers[step - RATING_QUESTIONS.length];
  const isLast = step === total - 1;
  const value = short ? text[short.id] ?? "" : "";

  return (
    <div className="mx-auto max-w-2xl">
      {isPreview && <PreviewBar slug={slug} teamTry={teamTry} />}
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm text-academy-fg/70">
        <span>{survey.title}</span>
        <span aria-live="polite">
          Question {step + 1} of {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Survey progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        className="mb-6 h-2 overflow-hidden rounded-full bg-academy-fg/10"
      >
        <div className="h-full rounded-full bg-academy-accent transition-all duration-300" style={{ width: `${(step / total) * 100}%` }} />
      </div>

      <div className={card}>
        {rating && (
          <div>
            <h1 id={`q-${rating.id}`} ref={headingRef} tabIndex={-1} className="font-heading text-2xl font-bold outline-none sm:text-3xl">
              {rating.prompt}
            </h1>
            {rating.lowLabel ? (
              <>
                <div role="group" aria-labelledby={`q-${rating.id}`} className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
                  {rating.options.map((o) => {
                    const selected = ratings[rating.id] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={selected}
                        aria-label={`${o.value}${o.value === 1 ? `, ${rating.lowLabel}` : o.value === rating.options.length ? `, ${rating.highLabel}` : ""}`}
                        onClick={() => pick(rating.id, o.value)}
                        className={`flex min-h-14 items-center justify-center rounded-xl border-2 font-heading text-xl font-bold transition-colors ${
                          selected
                            ? "border-academy-accent bg-academy-accent text-academy-bg"
                            : "border-academy-fg/15 bg-academy-bg/20 hover:border-academy-accent/60 hover:bg-academy-fg/10"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between gap-4 text-sm text-academy-fg/70" aria-hidden>
                  <span>{rating.lowLabel}</span>
                  <span className="text-right">{rating.highLabel}</span>
                </div>
              </>
            ) : (
              <div role="group" aria-labelledby={`q-${rating.id}`} className="mt-6 grid gap-2 sm:gap-3">
                {rating.options.map((o) => {
                  const selected = ratings[rating.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => pick(rating.id, o.value)}
                      className={`flex min-h-14 items-center justify-between rounded-xl border-2 px-5 text-left text-lg font-semibold transition-colors ${
                        selected
                          ? "border-academy-accent bg-academy-accent text-academy-bg"
                          : "border-academy-fg/15 bg-academy-bg/20 hover:border-academy-accent/60 hover:bg-academy-fg/10"
                      }`}
                    >
                      {o.label}
                      {selected && <Check size={20} aria-hidden />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {short && (
          <div>
            <h1 ref={headingRef} tabIndex={-1} className="font-heading text-2xl font-bold outline-none sm:text-3xl">
              <label htmlFor={`answer-${short.id}`}>{short.prompt}</label>
            </h1>
            <textarea
              id={`answer-${short.id}`}
              value={value}
              onChange={(e) => setText((t) => ({ ...t, [short.id]: e.target.value }))}
              maxLength={MAX_ANSWER_CHARS}
              rows={5}
              placeholder="Type your answer here…"
              className="mt-5 w-full rounded-xl border border-academy-fg/15 bg-academy-bg/30 px-4 py-3 text-base text-academy-fg placeholder-academy-fg/50 outline-none focus:border-academy-accent"
            />
            <p className="mt-1 text-sm text-academy-fg/60">A few words is fine. You can skip any of these.</p>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-academy-primary/40 bg-academy-primary/15 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => goTo(step - 1)} className={quietButton}>
            <ArrowLeft size={16} aria-hidden /> Back
          </button>
          {rating && ratings[rating.id] !== undefined && (
            <button type="button" onClick={() => goTo(step + 1)} className={primaryButton}>
              Next <ArrowRight size={18} aria-hidden />
            </button>
          )}
          {short && !isLast && (
            <button type="button" onClick={() => goTo(step + 1)} className={primaryButton}>
              {value.trim() ? "Next" : "Skip"} <ArrowRight size={18} aria-hidden />
            </button>
          )}
          {short && isLast && (
            <button type="button" onClick={send} disabled={sending} className={primaryButton}>
              {sending ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={18} aria-hidden />}
              {sending ? "Sending…" : "Send my answers"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
