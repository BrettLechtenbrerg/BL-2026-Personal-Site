"use client";

//==============================================================================
// Member surveys — "My Surveys": the member's surveys, what's ready, and the
// answers they sent. The survey team (survey_reviewer) also gets links to
// everyone's results and to the preview / share page.
//==============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, ChevronDown, Clock, Eye, Loader2 } from "lucide-react";
import SurveyAnswersView, { formatSurveyDate } from "./SurveyAnswersView";
import { PrivacyNote } from "./SurveyRunner";
import { FIRST_SURVEY, readAnswers, surveyBySlug, SURVEY_MINUTES, type SurveyStatus } from "@/lib/surveys";
import { MEMBER, myIntro, TEAM_LABEL, THE_SURVEYS } from "@/lib/survey-text";

interface OwnResponse {
  survey_slug: string;
  answers: unknown;
  submitted_at: string;
}

export default function MySurveys() {
  const [state, setState] = useState<"loading" | "ready" | "notSetUp" | "error">("loading");
  const [schedule, setSchedule] = useState<SurveyStatus[]>([]);
  const [responses, setResponses] = useState<OwnResponse[]>([]);
  const [reviewer, setReviewer] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/academy/surveys")
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState(json.notSetUp ? "notSetUp" : "error");
          return;
        }
        setSchedule(json.schedule ?? []);
        setResponses(json.responses ?? []);
        setReviewer(Boolean(json.reviewer));
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl font-bold">My Surveys</h1>
      <p className="mt-2 text-academy-fg/80">{myIntro()}</p>
      <div className="mt-4">
        <PrivacyNote />
      </div>

      {reviewer && (
        <Link
          href="/academy/surveys/review"
          className="mt-4 flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-academy-accent/40 bg-academy-accent/10 px-5 py-3 font-semibold text-academy-fg hover:bg-academy-accent/20"
        >
          <span className="flex items-center gap-2">
            <BarChart3 size={18} className="text-academy-accent" aria-hidden />{` Survey results for every ${MEMBER} (${TEAM_LABEL})`}
          </span>
          <ArrowRight size={18} aria-hidden />
        </Link>
      )}
      {reviewer && (
        <Link
          href="/academy/surveys/preview"
          className="mt-2 flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-academy-accent/40 bg-academy-accent/10 px-5 py-3 font-semibold text-academy-fg hover:bg-academy-accent/20"
        >
          <span className="flex items-center gap-2">
            <Eye size={18} className="text-academy-accent" aria-hidden />{` Preview and share ${THE_SURVEYS} (${TEAM_LABEL})`}
          </span>
          <ArrowRight size={18} aria-hidden />
        </Link>
      )}

      {state === "loading" && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="animate-spin text-academy-accent" size={28} aria-label="Loading" />
        </div>
      )}
      {(state === "notSetUp" || state === "error") && (
        <p className="mt-6 rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6">
          {state === "notSetUp" ? "Surveys are still being set up. Please check back soon." : "We couldn't load your surveys. Please refresh the page."}
        </p>
      )}

      {state === "ready" && (
        <ol className="mt-6 space-y-4">
          {schedule.map((s) => {
            const survey = surveyBySlug(s.slug);
            const response = responses.find((r) => r.survey_slug === s.slug);
            const expanded = openSlug === s.slug;
            return (
              <li key={s.slug} className="rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-5 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-heading text-xl font-bold">{survey.title}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-academy-fg/75">
                      {s.state === "done" && (
                        <>
                          <CheckCircle2 size={16} className="text-academy-accent" aria-hidden /> Sent {formatSurveyDate(s.submittedAt!)}
                        </>
                      )}
                      {s.state === "open" && <span className="font-semibold text-academy-accent">{`Ready now · about ${SURVEY_MINUTES} minutes`}</span>}
                      {s.state === "upcoming" && (
                        <>
                          <Clock size={16} aria-hidden />
                          {s.opensAt ? `Opens ${formatSurveyDate(s.opensAt)}` : `Opens after your ${FIRST_SURVEY?.shortTitle ?? ""} survey`}
                        </>
                      )}
                    </p>
                  </div>
                  {s.state === "open" && (
                    <Link
                      href={`/academy/surveys/${s.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark"
                    >
                      Start <ArrowRight size={16} aria-hidden />
                    </Link>
                  )}
                  {/* Survey team: try a survey that isn't open for them yet (nothing is saved). */}
                  {s.state === "upcoming" && reviewer && (
                    <Link
                      href={`/academy/surveys/preview/${s.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-academy-fg/15 px-4 py-2 text-sm font-semibold hover:bg-academy-fg/10"
                    >
                      <Eye size={16} aria-hidden /> Try it (nothing saved)
                    </Link>
                  )}
                  {s.state === "done" && response && (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setOpenSlug(expanded ? null : s.slug)}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-academy-fg/15 px-4 py-2 text-sm hover:bg-academy-fg/10"
                    >
                      {expanded ? "Hide my answers" : "See my answers"}
                      <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                  )}
                </div>
                {expanded && response && (
                  <div className="mt-4 border-t border-academy-fg/10 pt-4">
                    <SurveyAnswersView answers={readAnswers(response.answers)} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
