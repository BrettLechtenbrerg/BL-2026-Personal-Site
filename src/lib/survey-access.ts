//==============================================================================
// Member surveys: who may read everyone's answers (server only)
//==============================================================================
// The survey team (me_users.survey_reviewer) and Academy admins. New signups
// are NOT added automatically; add one with
//   update me_users set survey_reviewer = true where lower(email) = '<email>';
// Everyone else sees only their own answers. Fails closed: before the schema
// update runs, the column is absent → nobody.
//==============================================================================

import type { MeUser } from "./academy-db";

export function canReviewSurveys(user: MeUser | null): boolean {
  return !!user && (user.role === "admin" || user.survey_reviewer === true);
}

/** True when the survey table hasn't been created yet (schema update not run). */
export function surveysNotSetUp(error: { code?: string } | null | undefined): boolean {
  return !!error && ["PGRST205", "42P01", "PGRST204", "42703"].includes(error.code ?? "");
}

export const NOT_SET_UP_MESSAGE = "Surveys are still being set up. Please try again soon.";
