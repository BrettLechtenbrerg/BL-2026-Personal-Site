//==============================================================================
// Academy — member surveys: wording in the brand's words (engine-owned).
//==============================================================================
// Team wording comes from the profile (surveys.teamName / teamLabel), the word
// for a learner from vocab.member(s), survey names from the site's
// content/academy/surveys.ts (SURVEYS + optional SURVEY_TEXT). Every line has a
// plain default, so a brand only sets what it wants to change.
//==============================================================================

import { academyConfig } from "@/content/academy.config";
import { cap } from "@/lib/academy-config";
import { FIRST_SURVEY, RATING_QUESTIONS, SCORE_RATING_IDS, SURVEYS, SURVEY_TEXT, type SurveyDef } from "@/lib/surveys";

/** In sentences: "Only you and the program team can see them." */
export const TEAM_NAME = academyConfig.surveys?.teamName ?? "the program team";
/** Short label: "(program team)", "Program team only." */
export const TEAM_LABEL = academyConfig.surveys?.teamLabel ?? "program team";
export const MEMBER = academyConfig.vocab.member ?? "member";
export const MEMBERS = academyConfig.vocab.members ?? "members";
/** "a member" / "an admin". */
export const A_MEMBER = `${/^[aeiou]/.test(MEMBER) ? "an" : "a"} ${MEMBER}`;
export { cap };

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const numberWord = (n: number) => WORDS[n] ?? String(n);

/** "a, b and c" */
export function joinAnd(items: string[]): string {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Lower-case the first letter unless the word is an acronym ("Brain knowledge" → "brain knowledge", "AI use" stays). */
function lowerFirst(s: string): string {
  return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

const FIRST_SHORT = FIRST_SURVEY?.shortTitle ?? "";
const FIRST_TITLE = FIRST_SURVEY?.title ?? "";

/** "the three surveys" / "the survey" */
export const THE_SURVEYS = SURVEYS.length === 1 ? "the survey" : `the ${numberWord(SURVEYS.length)} surveys`;
/** "the three parent surveys" */
export const THE_MEMBER_SURVEYS = SURVEYS.length === 1 ? `the ${MEMBER} survey` : `the ${numberWord(SURVEYS.length)} ${MEMBER} surveys`;
/** "Starting Point, 6-week and 12-week" */
export const LIST_PHRASE = SURVEY_TEXT.listPhrase ?? joinAnd(SURVEYS.map((s) => s.shortTitle));

/** When a survey is offered, in plain words, for the team's preview page. */
export function opensText(def: SurveyDef): string {
  if (def.slug === FIRST_SURVEY?.slug) return `Offered right away, when ${A_MEMBER} joins`;
  if (def.opensAfterDays % 7 === 0 && def.opensAfterDays > 0) {
    return `Offered ${def.opensAfterDays / 7} weeks (${def.opensAfterDays} days) after the ${FIRST_SHORT}`;
  }
  return `Offered ${def.opensAfterDays} days after the ${FIRST_SHORT}`;
}

/** My Surveys intro. */
export function myIntro(): string {
  const later = SURVEYS.slice(1).map((s) =>
    s.opensAfterDays % 7 === 0 && s.opensAfterDays > 0 ? `one at ${s.opensAfterDays / 7} weeks` : `one after ${s.opensAfterDays} days`
  );
  if (!later.length) return "One short survey, before you start. It helps us improve the program.";
  return `${cap(numberWord(SURVEYS.length))} short surveys: ${joinAnd(["one before you start", ...later])}. Together they show how far you've come and help us improve the program.`;
}

export const THANK_YOU = SURVEY_TEXT.thankYou ?? "It helps us make this program better for everyone.";
export const NEEDS_FIRST = `Please take your ${FIRST_TITLE} first.`;

/** Results page: what "Change" means. */
export function changeNote(): string {
  const names = RATING_QUESTIONS.filter((q) => SCORE_RATING_IDS.includes(q.id)).map((q) => lowerFirst(q.short));
  return `Change = average of ${joinAnd(names)}, latest survey minus ${FIRST_SHORT}. Click a name for full answers.`;
}

export function averagesNote(): string {
  return `${SURVEY_TEXT.averagesNote ? `${SURVEY_TEXT.averagesNote} ` : ""}n = how many ${MEMBERS} answered.`;
}

/** Preview page: which question numbers repeat. */
export function repeatNote(): string {
  const r = RATING_QUESTIONS.length;
  const s = Math.max(0, ...SURVEYS.map((d) => d.shortAnswers.length));
  if (!r || SURVEYS.length < 2) return "";
  const same = r === 1 ? "Question 1 is" : `Questions 1 to ${r} are`;
  if (!s) return `${same} the same each time so we can measure change.`;
  const differ = s === 1 ? `question ${r + 1} differs` : `questions ${r + 1} to ${r + s} differ`;
  return `${same} the same each time so we can measure change; ${differ}.`;
}

/** The team's ready-to-send message (Share box). */
export function teamMessage(origin: string, programCode: string, codeNeeded: boolean): string {
  const join = programCode
    ? `New to the site? Join at ${origin}/academy with program code ${programCode}.`
    : codeNeeded
      ? `New to the site? Join at ${origin}/academy (${SURVEY_TEXT.joinHelp ?? `ask ${academyConfig.academy.ownerFirstName} for the program code`}).`
      : `New to the site? Join at ${origin}/academy.`;
  const intro =
    SURVEY_TEXT.shareIntro ??
    `Our ${SURVEYS.length === 1 ? `${MEMBER} survey` : `${numberWord(SURVEYS.length)} ${MEMBER} surveys`} (${joinAnd(SURVEYS.map((s) => s.title))}) ${SURVEYS.length === 1 ? "is" : "are"} ready to try in the ${academyConfig.academy.name}.`;
  return [
    "Hi team,",
    "",
    `${intro} Log in with your own account first.`,
    "",
    `1. See every question side by side and click through any survey (nothing is saved): ${origin}/academy/surveys/preview`,
    `2. Take the ${FIRST_TITLE} for real (your answers are saved): ${origin}/academy/surveys/${FIRST_SURVEY?.slug ?? ""}`,
    `3. See everyone's answers: ${origin}/academy/surveys/review`,
    "",
    "Surveys are also in the top menu under \"Surveys\". Please send me any wording you would change.",
    "",
    join,
  ].join("\n");
}

/** Share box links: each survey, then the preview and results pages. */
export function shareLinks(): { label: string; path: string; note: string }[] {
  return [
    ...SURVEYS.map((s, i) => ({
      label: s.title,
      path: `/academy/surveys/${s.slug}`,
      note: i === 0 ? `For ${MEMBERS}. Send when they join.` : `For ${MEMBERS}, after the ${FIRST_SHORT}.`,
    })),
    { label: "Survey Preview (this page)", path: "/academy/surveys/preview", note: "For the team. Nothing is saved." },
    { label: "Survey Results", path: "/academy/surveys/review", note: "For the team. Everyone's answers." },
  ];
}

/** Spreadsheet file name stem: "parent-surveys". */
export const CSV_STEM = `${MEMBER.replace(/[^a-z0-9]+/g, "-")}-surveys`;
