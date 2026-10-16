//==============================================================================
// Academy — SITE-OWNED member surveys (seeded once by the Academy Forge
// installer, never overwritten). EMPTY = surveys are off: no Surveys button,
// survey pages and API return "not found".
//==============================================================================
// To turn surveys on, fill in RATING_QUESTIONS and SURVEYS (1–4 surveys), then
// make the survey team: update me_users set survey_reviewer = true where
// lower(email) = '<email>';  (Academy admins can always see results.)
//
// Rules (checked when the site builds):
// - The rating questions are asked in EVERY survey, so change can be measured.
//   A rating with lowLabel/highLabel is a number scale and counts towards the
//   "Change" score; one without (e.g. Rarely / Daily) is shown as words.
// - The FIRST survey opens straight away (opensAfterDays 0); each later one
//   opens that many days after the first and is compared with it.
// - Slugs and ids: lowercase letters, digits, dashes. Never rename one after
//   launch (saved answers are keyed on them). Each saved answer keeps its
//   question wording, so rewording a prompt later is safe.
// Reference: GIFT CONNECT's file (parent-training-system-partners).
//==============================================================================

import type { RatingQuestion, SurveyDef, SurveyText } from "@/lib/surveys";

export const RATING_QUESTIONS: RatingQuestion[] = [];

export const SURVEYS: SurveyDef[] = [];

/** Optional wording (see SurveyText in lib/surveys.ts); every field has a default. */
export const SURVEY_TEXT: SurveyText = {};
