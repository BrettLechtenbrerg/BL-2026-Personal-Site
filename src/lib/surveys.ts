//==============================================================================
// Academy — member surveys: the rules (engine-owned).
//==============================================================================
// The QUESTIONS live in the site-owned content/academy/surveys.ts (seeded empty:
// no surveys = feature off — no Surveys button, survey pages and API 404). This
// file holds the pure rules: answer checking, when each survey opens,
// averages, spreadsheet export. Wording that uses the brand's words lives in
// lib/survey-text.ts.
//
// Shape (GIFT CONNECT, 7 Oct 2026, is the reference): the rating questions are
// identical in every survey so change can be measured; the short answers
// differ per survey. The FIRST survey is the starting point: it opens straight
// away, and every later one opens N days after it and is compared with it.
// Each saved response keeps a copy of the short-answer wording, so rewording a
// question later never changes what an older answer was answering.
//==============================================================================

import { RATING_QUESTIONS, SURVEYS, SURVEY_TEXT } from "@/content/academy/surveys";

export { RATING_QUESTIONS, SURVEYS, SURVEY_TEXT };

export type SurveySlug = string;
export type RatingId = string;

export interface RatingOption {
  value: number;
  label: string;
}

export interface RatingQuestion {
  /** Stable key in saved answers (lowercase letters, digits, dashes). Never rename after launch. */
  id: RatingId;
  prompt: string;
  /** Column name in the team's results and the spreadsheet. */
  short: string;
  options: RatingOption[];
  /**
   * Words under the first and last button on number scales. A question WITH these is a
   * number scale and counts towards the overall score ("Change" on the results page).
   */
  lowLabel?: string;
  highLabel?: string;
}

export interface ShortQuestion {
  /** Stable key in saved answers, e.g. "a1". */
  id: string;
  prompt: string;
}

export interface SurveyDef {
  /** URL part: /academy/surveys/<slug>. Lowercase letters, digits, dashes. Never rename after launch. */
  slug: SurveySlug;
  title: string;
  shortTitle: string;
  intro: string;
  /** Days after the first survey before this one is offered. The first survey must be 0. */
  opensAfterDays: number;
  shortAnswers: ShortQuestion[];
}

/** Optional wording for this site's survey set; every field has a plain default. */
export interface SurveyText {
  /** "Starting Point, 6-week and 12-week" — used in "Your … surveys" and "Every member's … answers". */
  listPhrase?: string;
  /** Sentence in the team's share message, before "Log in with your own account first." */
  shareIntro?: string;
  /** Shown in the share message when signup needs a program code, e.g. "ask Brett for the program code". */
  joinHelp?: string;
  /** Under "Group averages" on the results page (before "n = how many … answered."). */
  averagesNote?: string;
  /** Thank-you line after sending. */
  thankYou?: string;
  /** "about N minutes" (default 5). */
  minutes?: number;
}

export const MAX_ANSWER_CHARS = 1500;
const DAY_MS = 86_400_000;
const SLUG_RE = /^[a-z0-9-]{1,40}$/;
/** Fixed pages under /academy/surveys/ — a survey can't use these names. */
const RESERVED = new Set(["review", "preview"]);

//------------------------------------------------------------------------------
// Definitions check — runs once at import, so a bad survey file fails the build.
//------------------------------------------------------------------------------
function checkDefinitions(): void {
  const fail = (why: string) => {
    throw new Error(`content/academy/surveys.ts: ${why}`);
  };
  if (SURVEYS.length > 4) fail("at most 4 surveys");
  if (SURVEYS.length && !RATING_QUESTIONS.length && SURVEYS.every((s) => !s.shortAnswers.length)) fail("surveys need questions");
  const slugs = new Set<string>();
  SURVEYS.forEach((s, i) => {
    if (!SLUG_RE.test(s.slug) || RESERVED.has(s.slug) || slugs.has(s.slug)) fail(`bad or repeated survey slug "${s.slug}"`);
    slugs.add(s.slug);
    if (i === 0 ? s.opensAfterDays !== 0 : !(Number.isInteger(s.opensAfterDays) && s.opensAfterDays >= 0)) {
      fail(`"${s.slug}": the first survey opens after 0 days; later ones after a whole number of days`);
    }
    if (s.shortAnswers.length > 8) fail(`"${s.slug}": at most 8 short answers`);
    const ids = new Set<string>();
    for (const q of s.shortAnswers) {
      if (!SLUG_RE.test(q.id) || ids.has(q.id)) fail(`"${s.slug}": bad or repeated short-answer id "${q.id}"`);
      ids.add(q.id);
    }
  });
  const ids = new Set<string>();
  for (const q of RATING_QUESTIONS) {
    if (!SLUG_RE.test(q.id) || ids.has(q.id)) fail(`bad or repeated rating id "${q.id}"`);
    ids.add(q.id);
    if (q.options.length < 2 || new Set(q.options.map((o) => o.value)).size !== q.options.length) fail(`"${q.id}": needs 2+ distinct options`);
  }
}
checkDefinitions();

export const SURVEY_SLUGS: readonly SurveySlug[] = SURVEYS.map((s) => s.slug);
export const RATING_IDS: readonly RatingId[] = RATING_QUESTIONS.map((q) => q.id);
/** Surveys are on for this site only when it defines at least one. */
export const surveysEnabled = SURVEYS.length > 0;
/** The starting-point survey every later one is compared with. */
export const FIRST_SURVEY: SurveyDef | undefined = SURVEYS[0];
export const SURVEY_MINUTES = SURVEY_TEXT.minutes ?? 5;
/** Number scales (with low/high labels) make up the overall score. */
export const SCORE_RATING_IDS: readonly RatingId[] = RATING_QUESTIONS.filter((q) => q.lowLabel !== undefined).map((q) => q.id);
/** Most short answers in any one survey (spreadsheet columns). */
export const MAX_SHORT_ANSWERS = Math.max(0, ...SURVEYS.map((s) => s.shortAnswers.length));

export function isSurveySlug(value: unknown): value is SurveySlug {
  return typeof value === "string" && SURVEY_SLUGS.includes(value);
}

export function surveyBySlug(slug: SurveySlug): SurveyDef {
  return SURVEYS.find((s) => s.slug === slug)!;
}

/** How many questions a survey asks (ratings + short answers). */
export function questionCount(def: SurveyDef): number {
  return RATING_QUESTIONS.length + def.shortAnswers.length;
}

/** The answer choices in one line, for the team's preview page. */
export function ratingScaleText(q: RatingQuestion): string {
  if (q.lowLabel) {
    const first = q.options[0];
    const last = q.options[q.options.length - 1];
    return `${first.label} (${q.lowLabel}) to ${last.label} (${q.highLabel ?? ""})`;
  }
  return q.options.map((o) => o.label).join(" · ");
}

//------------------------------------------------------------------------------
// Answers: what the browser sends, and what is saved
//------------------------------------------------------------------------------
export interface SavedTextAnswer {
  id: string;
  prompt: string;
  answer: string;
}

export interface SurveyAnswers {
  ratings: Record<RatingId, number>;
  text: SavedTextAnswer[];
}

export type ValidationResult = { ok: true; answers: SurveyAnswers } | { ok: false; error: string };

/** Check a submission from the browser and turn it into the saved shape. */
export function validateSubmission(slug: SurveySlug, raw: unknown): ValidationResult {
  if (!isSurveySlug(slug)) return { ok: false, error: "Unknown survey." };
  if (!raw || typeof raw !== "object") return { ok: false, error: "Your answers were missing. Please try again." };
  const body = raw as { ratings?: unknown; text?: unknown };
  const ratingsIn = (body.ratings && typeof body.ratings === "object" ? body.ratings : {}) as Record<string, unknown>;
  const textIn = (body.text && typeof body.text === "object" ? body.text : {}) as Record<string, unknown>;

  const ratings = {} as Record<RatingId, number>;
  for (const q of RATING_QUESTIONS) {
    const value = Object.hasOwn(ratingsIn, q.id) ? ratingsIn[q.id] : undefined;
    if (typeof value !== "number" || !q.options.some((o) => o.value === value)) {
      return { ok: false, error: `Please answer: "${q.prompt}"` };
    }
    ratings[q.id] = value;
  }

  const text: SavedTextAnswer[] = [];
  for (const q of surveyBySlug(slug).shortAnswers) {
    const value = Object.hasOwn(textIn, q.id) ? textIn[q.id] : undefined;
    if (value !== undefined && value !== null && typeof value !== "string") {
      return { ok: false, error: "One of your answers could not be read. Please try again." };
    }
    const answer = (value ?? "").replace(/\r\n?/g, "\n").trim();
    if (answer.length > MAX_ANSWER_CHARS) {
      return { ok: false, error: `Please keep each answer under ${MAX_ANSWER_CHARS} characters.` };
    }
    text.push({ id: q.id, prompt: q.prompt, answer });
  }
  return { ok: true, answers: { ratings, text } };
}

/** Read a saved answers object defensively (it came back from the database). */
export function readAnswers(value: unknown): SurveyAnswers {
  const v = (value && typeof value === "object" ? value : {}) as { ratings?: unknown; text?: unknown };
  const r = (v.ratings && typeof v.ratings === "object" ? v.ratings : {}) as Record<string, unknown>;
  const ratings = {} as Record<RatingId, number>;
  for (const id of RATING_IDS) ratings[id] = Object.hasOwn(r, id) && typeof r[id] === "number" ? (r[id] as number) : NaN;
  const text = Array.isArray(v.text)
    ? v.text
        .filter((t): t is Record<string, unknown> => !!t && typeof t === "object")
        .map((t) => ({ id: String(t.id ?? ""), prompt: String(t.prompt ?? ""), answer: String(t.answer ?? "") }))
    : [];
  return { ratings, text };
}

//------------------------------------------------------------------------------
// Schedule: which survey is done, ready now, or still to come
//------------------------------------------------------------------------------
export interface ResponseStamp {
  survey_slug: string;
  submitted_at: string;
}

export type SurveyState = "done" | "open" | "upcoming";

export interface SurveyStatus {
  slug: SurveySlug;
  state: SurveyState;
  submittedAt: string | null;
  /** When it opens; null for the first survey or when the first survey isn't done yet. */
  opensAt: string | null;
}

export function surveySchedule(responses: ResponseStamp[], now: Date = new Date()): SurveyStatus[] {
  const sent = new Map(responses.filter((r) => isSurveySlug(r.survey_slug)).map((r) => [r.survey_slug, r.submitted_at]));
  const startAt = FIRST_SURVEY ? sent.get(FIRST_SURVEY.slug) : undefined;
  return SURVEYS.map((s, i) => {
    const submittedAt = sent.get(s.slug) ?? null;
    if (submittedAt) return { slug: s.slug, state: "done" as const, submittedAt, opensAt: null };
    if (i === 0) return { slug: s.slug, state: "open" as const, submittedAt: null, opensAt: null };
    if (!startAt) return { slug: s.slug, state: "upcoming" as const, submittedAt: null, opensAt: null };
    const opens = new Date(new Date(startAt).getTime() + s.opensAfterDays * DAY_MS);
    return {
      slug: s.slug,
      state: now >= opens ? ("open" as const) : ("upcoming" as const),
      submittedAt: null,
      opensAt: opens.toISOString(),
    };
  });
}

//------------------------------------------------------------------------------
// Results: averages and change over time
//------------------------------------------------------------------------------
export interface AnswerRow {
  survey_slug: string;
  answers: unknown;
}

export interface Average {
  avg: number | null;
  n: number;
}

export function ratingAverages(rows: AnswerRow[]): Record<SurveySlug, Record<RatingId, Average>> {
  const out = {} as Record<SurveySlug, Record<RatingId, Average>>;
  for (const slug of SURVEY_SLUGS) {
    out[slug] = {} as Record<RatingId, Average>;
    for (const id of RATING_IDS) {
      const values = rows
        .filter((r) => r.survey_slug === slug)
        .map((r) => readAnswers(r.answers).ratings[id])
        .filter((v) => Number.isFinite(v));
      out[slug][id] = {
        avg: values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null,
        n: values.length,
      };
    }
  }
  return out;
}

/** Average of the number-scale ratings (SCORE_RATING_IDS). */
export function overallScore(answers: SurveyAnswers): number | null {
  const values = SCORE_RATING_IDS.map((id) => answers.ratings[id]).filter(Number.isFinite);
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

/** Change in overall score from the first survey to the latest, rounded to one decimal. */
export function scoreChange(start: SurveyAnswers | null, latest: SurveyAnswers | null): number | null {
  if (!start || !latest) return null;
  const a = overallScore(start);
  const b = overallScore(latest);
  return a === null || b === null ? null : Math.round((b - a) * 10) / 10;
}

/** The latest survey (after the first) a member has sent, from a slug → response map. */
export function latestAfterFirst<T>(bySlug: Partial<Record<SurveySlug, T>>): T | undefined {
  for (const s of [...SURVEYS].slice(1).reverse()) if (bySlug[s.slug]) return bySlug[s.slug];
  return undefined;
}

//------------------------------------------------------------------------------
// Spreadsheet export (CSV)
//------------------------------------------------------------------------------
export interface CsvRow {
  name: string;
  email: string;
  survey_slug: string;
  submitted_at: string;
  answers: unknown;
}

/**
 * One spreadsheet cell. Quotes are doubled, and text starting with = + - @ or a
 * tab gets a leading apostrophe so Excel/Sheets show it instead of running it
 * as a formula.
 */
export function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined || (typeof value === "number" && !Number.isFinite(value))) return "";
  let s = String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function responsesCsv(rows: CsvRow[]): string {
  const slots = Array.from({ length: MAX_SHORT_ANSWERS }, (_, i) => i);
  const header = [
    "Name",
    "Email",
    "Survey",
    "Submitted",
    ...RATING_QUESTIONS.map((q) => q.short),
    ...slots.flatMap((i) => [`Question ${i + 1}`, `Answer ${i + 1}`]),
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const row of rows) {
    const a = readAnswers(row.answers);
    const title = isSurveySlug(row.survey_slug) ? surveyBySlug(row.survey_slug).title : row.survey_slug;
    const text = slots.flatMap((i) => [a.text[i]?.prompt ?? "", a.text[i]?.answer ?? ""]);
    lines.push(
      [row.name, row.email, title, row.submitted_at.slice(0, 10), ...RATING_IDS.map((id) => a.ratings[id]), ...text]
        .map(csvCell)
        .join(",")
    );
  }
  // Leading BOM so Excel opens accented and Spanish text correctly.
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}
