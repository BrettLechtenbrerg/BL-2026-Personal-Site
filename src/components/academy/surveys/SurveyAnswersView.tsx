//==============================================================================
// Member surveys — read-only view of one response (the member's own page and
// the team's results). With `compareTo` (the first survey), each rating shows
// an up/down arrow.
//==============================================================================

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { FIRST_SURVEY, RATING_QUESTIONS, type SurveyAnswers } from "@/lib/surveys";

export function formatSurveyDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function ratingLabel(id: (typeof RATING_QUESTIONS)[number]["id"], value: number): string {
  const q = RATING_QUESTIONS.find((r) => r.id === id)!;
  if (!Number.isFinite(value)) return "No answer";
  if (q.lowLabel) return `${value} of ${q.options.length}`;
  return q.options.find((o) => o.value === value)?.label ?? String(value);
}

export function Change({ delta }: { delta: number | null }) {
  if (delta === null || !Number.isFinite(delta)) return null;
  if (delta === 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-academy-fg/60">
        <Minus size={12} aria-hidden /> <span>no change</span>
      </span>
    );
  const up = delta > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-academy-accent" : "text-academy-fg/75"}`}>
      {up ? <ArrowUp size={12} aria-hidden /> : <ArrowDown size={12} aria-hidden />}
      <span>
        {up ? "+" : ""}
        {Math.round(delta * 10) / 10}
        <span className="sr-only">{` since the ${FIRST_SURVEY?.shortTitle ?? ""}`}</span>
      </span>
    </span>
  );
}

export default function SurveyAnswersView({
  answers,
  compareTo,
  showPrompts = true,
}: {
  answers: SurveyAnswers;
  compareTo?: SurveyAnswers | null;
  showPrompts?: boolean;
}) {
  return (
    <div className="space-y-4">
      <dl className="grid gap-2 sm:grid-cols-2">
        {RATING_QUESTIONS.map((q) => {
          const value = answers.ratings[q.id];
          const before = compareTo?.ratings[q.id];
          const delta = compareTo && Number.isFinite(value) && Number.isFinite(before) ? value - (before as number) : null;
          return (
            <div key={q.id} className="rounded-lg border border-academy-fg/10 bg-academy-bg/20 px-3 py-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-academy-fg/60">{q.short}</dt>
              <dd className="mt-0.5 flex flex-wrap items-baseline gap-2">
                <span className="font-heading text-base font-bold">{ratingLabel(q.id, value)}</span>
                <Change delta={delta} />
              </dd>
            </div>
          );
        })}
      </dl>
      <dl className="space-y-3">
        {answers.text.map((t) => (
          <div key={t.id}>
            {showPrompts && <dt className="text-sm font-semibold text-academy-fg/80">{t.prompt}</dt>}
            <dd className={`mt-0.5 whitespace-pre-wrap [overflow-wrap:anywhere] ${t.answer ? "text-academy-fg" : "italic text-academy-fg/50"}`}>
              {t.answer || "Skipped"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
