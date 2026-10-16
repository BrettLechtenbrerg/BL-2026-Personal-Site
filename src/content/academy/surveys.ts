//==============================================================================
// Master's Edge Academy — member surveys (SITE-OWNED: the Academy Forge seeds
// this file once and never overwrites it; the rules live in lib/surveys.ts).
// 16 Oct 2026: PROPOSED wording, live so Brett can try it and choose. Draft +
// notes: ~/Desktop/BL - Brett Lechtenberg/Projects/Academy Upgrade - Oct 2026/
// Never rename a slug or id once real members answer (answers are keyed on them).
//==============================================================================

import type { RatingOption, RatingQuestion, SurveyDef, SurveyText } from "@/lib/surveys";

const oneToFive = (): RatingOption[] => [1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) }));
const words = (...labels: string[]): RatingOption[] => labels.map((label, i) => ({ value: i + 1, label }));

export const RATING_QUESTIONS: RatingQuestion[] = [
  { id: "clarity", prompt: "How clear are you on the one result that matters most in your business right now?", short: "Clarity", options: oneToFive(), lowLabel: "Not clear at all", highLabel: "Completely clear" },
  { id: "frontloading", prompt: "How often do you prepare for your hardest work before you start it?", short: "Frontloading", options: words("Rarely", "A few times a month", "Weekly", "Daily") },
  { id: "flow", prompt: "How often do you get into deep, focused work where time disappears?", short: "Flow", options: oneToFive(), lowLabel: "Almost never", highLabel: "Most days" },
  { id: "right-problems", prompt: "How confident are you that you're solving the right problems, not inherited ones?", short: "Right problems", options: oneToFive(), lowLabel: "Not confident", highLabel: "Very confident" },
];

export const SURVEYS: SurveyDef[] = [
  {
    slug: "start",
    title: "Starting Point Survey",
    shortTitle: "Starting Point",
    intro: "Before you start training, tell us where you are today. There are no right or wrong answers.",
    opensAfterDays: 0,
    shortAnswers: [
      { id: "a1", prompt: "What's the biggest obstacle between you and your next level right now?" },
      { id: "a2", prompt: "What have you already tried to fix it?" },
      { id: "a3", prompt: "What do you want from the Master's Edge Academy?" },
      { id: "a4", prompt: "Which one habit, if you built it in the next 12 weeks, would change the most?" },
    ],
  },
  {
    slug: "week-6",
    title: "6-Week Check-in",
    shortTitle: "6 weeks",
    intro: "Six weeks in. Tell us what you've put into practice so we can sharpen the training.",
    opensAfterDays: 42,
    shortAnswers: [
      { id: "a1", prompt: "What have you applied from the academy so far?" },
      { id: "a2", prompt: "What has made the biggest difference?" },
      { id: "a3", prompt: "What has been unclear, hard or missing?" },
      { id: "a4", prompt: "What should the next module cover?" },
    ],
  },
  {
    slug: "week-12",
    title: "12-Week Reflection",
    shortTitle: "12 weeks",
    intro: "Twelve weeks. Look back at what has changed in how you think, prepare and perform.",
    opensAfterDays: 84,
    shortAnswers: [
      { id: "a1", prompt: "What's different in your results since you started?" },
      { id: "a2", prompt: "Which module or tool helped you most?" },
      { id: "a3", prompt: "What should we change before more members join?" },
      { id: "a4", prompt: "Would you recommend the Master's Edge Academy to another business leader? Why?" },
    ],
  },
];

export const SURVEY_TEXT: SurveyText = {
  listPhrase: "Starting Point, 6-week and 12-week",
  averagesNote: '1 to 5 scales, except "Frontloading" (1 Rarely to 4 Daily).',
  thankYou: "It helps us sharpen the training for every member.",
  minutes: 5,
};
