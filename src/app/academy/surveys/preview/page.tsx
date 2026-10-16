//==============================================================================
// Academy — Survey Preview (survey team: survey_reviewer + admins).
// Every survey's questions side by side, each with a "click through as a
// member" link, a Share box (copy links / team message) and Print or Save as
// PDF. Nothing here reads or saves answers. Everyone else gets a plain "not
// found", the same as the results page.
//==============================================================================

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { getAcademyUserId } from "@/lib/academy-session";
import { getUserById } from "@/lib/academy-db";
import { canReviewSurveys } from "@/lib/survey-access";
import { RATING_QUESTIONS, SURVEYS, ratingScaleText, surveysEnabled } from "@/lib/surveys";
import { A_MEMBER, cap, opensText, repeatNote, TEAM_LABEL, THE_MEMBER_SURVEYS } from "@/lib/survey-text";
import { academyConfig } from "@/content/academy.config";
import SurveyShareBox from "@/components/academy/surveys/SurveyShareBox";

// Print / Save as PDF: questions only, light colours, one survey per page.
const PRINT_CSS = `@media print {
  @page { size: letter; margin: 0.6in; }
  #academy-root { background: #fff !important; --academy-fg: #1F2937; --academy-fg-rgb: 31 41 55; --academy-bg: #fff;
    --academy-bg-rgb: 255 255 255; --academy-accent: #8A5F12; --academy-accent-rgb: 138 95 18; }
  #academy-root > header, #academy-root aside, .no-print { display: none !important; }
  .survey-print-grid { display: block !important; }
  .survey-print-grid > section { break-inside: avoid; background: #fff !important; border-color: #d1d5db !important; margin-bottom: 0; }
  .survey-print-grid > section + section { break-before: page; }
}`;

export const dynamic = "force-dynamic";

// Static class names (Tailwind only sees whole literals).
const COLS: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default async function SurveyPreviewPage() {
  if (!surveysEnabled) notFound();
  const userId = await getAcademyUserId();
  if (!userId) redirect("/academy?next=/academy/surveys/preview");
  if (!canReviewSurveys(await getUserById(userId))) notFound();
  // Only sent to the team (checked above); they already joined with it.
  const codeEnv = academyConfig.signup.accessCodeEnv;
  const programCode = (codeEnv && process.env[codeEnv]?.trim()) || "";
  const printedOn = new Date().toLocaleDateString("en-US", { timeZone: "America/Denver", dateStyle: "long" });

  return (
    <div className="[overflow-wrap:anywhere]">
      <style>{PRINT_CSS}</style>
      <h1 className="font-heading text-3xl font-bold">Survey Preview</h1>
      <p className="mt-1 text-academy-fg/75">
        <span className="no-print">{`${cap(TEAM_LABEL)} only. `}</span>
        {`Every question in ${THE_MEMBER_SURVEYS}.${repeatNote() ? ` ${repeatNote()}` : ""}`}
        <span className="no-print">{` Click through any survey as ${A_MEMBER} would. Nothing is saved.`}</span>
      </p>
      <p className="hidden text-sm text-academy-fg/70 print:block">
        {`${academyConfig.academy.kicker} ${academyConfig.academy.name} · questions as of `}{printedOn}
      </p>

      <SurveyShareBox programCode={programCode} codeNeeded={Boolean(codeEnv)} />

      <div className={`survey-print-grid mt-6 grid gap-4 ${COLS[SURVEYS.length] ?? "lg:grid-cols-3"}`}>
        {SURVEYS.map((s) => (
          <section key={s.slug} aria-labelledby={`preview-${s.slug}`} className="flex flex-col rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-5">
            <h2 id={`preview-${s.slug}`} className="font-heading text-xl font-bold">
              {s.title}
            </h2>
            <p className="mt-1 text-sm text-academy-fg/70">{opensText(s)}</p>
            <p className="mt-3 text-sm italic text-academy-fg/80">&ldquo;{s.intro}&rdquo;</p>

            <ol className="mt-4 flex-1 space-y-3 text-sm">
              {RATING_QUESTIONS.map((q, i) => (
                <li key={q.id}>
                  <span className="font-semibold">{i + 1}. {q.prompt}</span>
                  <span className="mt-0.5 block text-academy-fg/65">Tap one: {ratingScaleText(q)}</span>
                </li>
              ))}
              {s.shortAnswers.map((q, i) => (
                <li key={q.id}>
                  <span className="font-semibold">{RATING_QUESTIONS.length + i + 1}. {q.prompt}</span>
                  <span className="mt-0.5 block text-academy-fg/65">Short answer (optional)</span>
                </li>
              ))}
            </ol>

            <Link
              href={`/academy/surveys/preview/${s.slug}`}
              className="no-print mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-academy-primary px-4 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark"
            >
              <Eye size={16} aria-hidden />{` Click through as ${A_MEMBER} `}<ArrowRight size={16} aria-hidden />
            </Link>
          </section>
        ))}
      </div>

      <Link
        href="/academy/surveys/review"
        className="no-print mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-academy-fg/75 hover:bg-academy-fg/10 hover:text-academy-fg"
      >
        <ArrowLeft size={16} aria-hidden /> Survey Results
      </Link>
    </div>
  );
}
