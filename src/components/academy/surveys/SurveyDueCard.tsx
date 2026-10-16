"use client";

//==============================================================================
// Member surveys — dashboard card: "Your survey is ready" when one is due, and
// a results link for the survey team. Renders nothing otherwise (or before
// setup, or when the site has no surveys).
//==============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList } from "lucide-react";
import { questionCount, surveyBySlug, surveysEnabled, SURVEY_MINUTES, type SurveyStatus } from "@/lib/surveys";
import { TEAM_LABEL } from "@/lib/survey-text";

export default function SurveyDueCard() {
  const [due, setDue] = useState<SurveyStatus | null>(null);
  const [reviewer, setReviewer] = useState(false);

  useEffect(() => {
    if (!surveysEnabled) return;
    let cancelled = false;
    fetch("/api/academy/surveys")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json) return;
        setDue((json.schedule as SurveyStatus[]).find((s) => s.state === "open") ?? null);
        setReviewer(Boolean(json.reviewer));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!due && !reviewer) return null;

  return (
    <div className="mb-6 space-y-3">
      {due && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-academy-accent/40 bg-gradient-to-r from-academy-accent/15 to-transparent p-5 backdrop-blur-md">
          <div className="flex min-w-0 items-start gap-3">
            <ClipboardList size={24} className="mt-0.5 shrink-0 text-academy-accent" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-academy-accent">Survey ready</p>
              <h2 className="font-heading text-lg font-bold">Your {surveyBySlug(due.slug).title}</h2>
              <p className="text-sm text-academy-fg/75">{`${questionCount(surveyBySlug(due.slug))} quick questions · about ${SURVEY_MINUTES} minutes · private to you and the ${TEAM_LABEL}`}</p>
            </div>
          </div>
          <Link
            href={`/academy/surveys/${due.slug}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark"
          >
            Start <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      )}
      {reviewer && (
        <Link href="/academy/surveys/review" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-academy-accent underline underline-offset-4">
          <BarChart3 size={16} aria-hidden />{` Survey results (${TEAM_LABEL})`}
        </Link>
      )}
    </div>
  );
}
