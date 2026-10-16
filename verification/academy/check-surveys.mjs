// Academy Forge — member survey rules, against THIS site's surveys (engine-owned,
// copied by install.sh). No server, no database. Run from the site repo:
//   node --experimental-strip-types --import ./verification/academy/ts-resolve.mjs verification/academy/check-surveys.mjs
// With no surveys defined it checks that the feature is off; otherwise it
// checks answer checking, the schedule, averages, change and the spreadsheet
// using the site's own questions.
import assert from "node:assert/strict";

const S = await import("@/lib/surveys");
const T = await import("@/lib/survey-text");
const { SURVEYS, RATING_QUESTIONS } = S;

// --- shared rules, with or without surveys ------------------------------------
assert.equal(S.csvCell("=SUM(A1)"), `"'=SUM(A1)"`, "formula text is defused");
assert.equal(S.csvCell("-1"), `"'-1"`);
assert.equal(S.csvCell(3), `"3"`);
assert.equal(S.csvCell(NaN), "");
assert.equal(S.csvCell('say "hi"'), `"say ""hi"""`);
assert.ok(S.responsesCsv([]).startsWith("\uFEFF"), "spreadsheet starts with a BOM");
assert.equal(S.isSurveySlug("review"), false, "fixed pages are never survey slugs");
assert.equal(S.isSurveySlug("preview"), false);
assert.equal(S.isSurveySlug("__proto__"), false);

if (!SURVEYS.length) {
  assert.equal(S.surveysEnabled, false);
  assert.deepEqual(S.surveySchedule([]), []);
  assert.equal(S.validateSubmission("anything", {}).ok, false);
  console.log("surveys: none defined → feature off (no button, pages and API 404) — OK");
  process.exit(0);
}

assert.equal(S.surveysEnabled, true);
const first = SURVEYS[0];
assert.equal(first.opensAfterDays, 0, "first survey opens straight away");

// A full, valid set of ratings (first option of each).
const ratings = Object.fromEntries(RATING_QUESTIONS.map((q) => [q.id, q.options[0].value]));
const high = Object.fromEntries(RATING_QUESTIONS.map((q) => [q.id, q.options[q.options.length - 1].value]));

// --- answer checking ---------------------------------------------------------
for (const def of SURVEYS) {
  const text = Object.fromEntries(def.shortAnswers.map((q, i) => [q.id, i === 0 ? "  Hello\r\nthere  " : ""]));
  const good = S.validateSubmission(def.slug, { ratings, text });
  assert.equal(good.ok, true, `${def.slug}: a full answer is accepted`);
  assert.deepEqual(good.answers.ratings, ratings);
  assert.equal(good.answers.text.length, def.shortAnswers.length, "every short question is saved, even if skipped");
  if (def.shortAnswers.length) {
    assert.equal(good.answers.text[0].answer, "Hello\nthere", "trimmed, Windows line breaks normalised");
    assert.equal(good.answers.text[0].prompt, def.shortAnswers[0].prompt, "question wording is kept");
    assert.equal(S.validateSubmission(def.slug, { ratings, text: { [def.shortAnswers[0].id]: "x".repeat(S.MAX_ANSWER_CHARS + 1) } }).ok, false, "too long");
    assert.equal(S.validateSubmission(def.slug, { ratings, text: { [def.shortAnswers[0].id]: 42 } }).ok, false, "not text");
  }
  if (RATING_QUESTIONS.length) {
    const { [RATING_QUESTIONS[0].id]: _, ...missing } = ratings;
    assert.equal(S.validateSubmission(def.slug, { ratings: missing, text }).ok, false, "a rating is required");
    assert.equal(S.validateSubmission(def.slug, { ratings: { ...ratings, [RATING_QUESTIONS[0].id]: 999 }, text }).ok, false, "only offered values");
  }
  assert.equal(S.validateSubmission(def.slug, null).ok, false);
}
assert.equal(S.validateSubmission("no-such-survey", { ratings }).ok, false, "unknown survey refused");

// --- schedule ----------------------------------------------------------------
const none = S.surveySchedule([]);
assert.equal(none[0].state, "open", "first survey is open straight away");
for (const s of none.slice(1)) assert.deepEqual([s.state, s.opensAt], ["upcoming", null], "later surveys wait for the first");
const t0 = "2026-01-01T12:00:00.000Z";
const day = 86_400_000;
const after = S.surveySchedule([{ survey_slug: first.slug, submitted_at: t0 }], new Date(Date.parse(t0) + day));
assert.equal(after[0].state, "done");
SURVEYS.slice(1).forEach((def, i) => {
  const st = after[i + 1];
  assert.equal(st.opensAt, new Date(Date.parse(t0) + def.opensAfterDays * day).toISOString(), `${def.slug} opens ${def.opensAfterDays} days later`);
  assert.equal(st.state, def.opensAfterDays <= 1 ? "open" : "upcoming");
});
assert.equal(S.surveySchedule([{ survey_slug: "unknown", submitted_at: t0 }])[0].state, "open", "unknown slugs are ignored");

// --- averages, change, spreadsheet ---------------------------------------------
const rows = [
  { survey_slug: first.slug, answers: { ratings, text: [] } },
  { survey_slug: first.slug, answers: { ratings: high, text: [] } },
  { survey_slug: first.slug, answers: "garbage" },
];
const avg = S.ratingAverages(rows);
for (const q of RATING_QUESTIONS) {
  const lo = q.options[0].value, hi = q.options[q.options.length - 1].value;
  assert.deepEqual(avg[first.slug][q.id], { avg: Math.round(((lo + hi) / 2) * 10) / 10, n: 2 }, `${q.id} average skips unreadable rows`);
}
if (S.SCORE_RATING_IDS.length) {
  const change = S.scoreChange(S.readAnswers({ ratings }), S.readAnswers({ ratings: high }));
  assert.ok(change > 0, "higher answers show a positive change");
} else {
  assert.equal(S.scoreChange(S.readAnswers({ ratings }), S.readAnswers({ ratings: high })), null, "no number scales → no change score");
}
assert.equal(S.scoreChange(null, S.readAnswers({ ratings })), null);
if (SURVEYS.length > 1) {
  const last = SURVEYS[SURVEYS.length - 1].slug;
  assert.equal(S.latestAfterFirst({ [first.slug]: 1, [SURVEYS[1].slug]: 2, [last]: 3 }), 3, "latest is the last survey sent");
  assert.equal(S.latestAfterFirst({ [first.slug]: 1 }), undefined, "the first survey is never the 'latest'");
}
const csv = S.responsesCsv([{ name: "=Evil", email: "a@b.c", survey_slug: first.slug, submitted_at: t0, answers: { ratings, text: [{ id: "x", prompt: "Q", answer: "+A" }] } }]);
const [header, line] = csv.slice(1).trim().split("\r\n");
assert.equal(header.split('","').length, 4 + RATING_QUESTIONS.length + 2 * S.MAX_SHORT_ANSWERS, "one column per rating, two per short answer");
assert.ok(line.startsWith(`"'=Evil","a@b.c","${first.title}","2026-01-01"`), "name defused, survey title, date");
if (S.MAX_SHORT_ANSWERS) assert.ok(line.includes(`"Q","'+A"`), "answer text defused");

// --- wording builds from the site's words ----------------------------------------
assert.match(T.opensText(first), /^Offered right away, when an? \w/);
for (const def of SURVEYS.slice(1)) assert.match(T.opensText(def), new RegExp(`after the ${first.shortTitle}$`));
assert.ok(T.myIntro().length > 20 && T.changeNote().includes(first.shortTitle) && T.averagesNote().includes(T.MEMBERS));
assert.ok(T.teamMessage("https://x.test", "", true).includes(`https://x.test/academy/surveys/${first.slug}`));
assert.ok(T.teamMessage("https://x.test", "CODE1", true).includes("with program code CODE1"));
assert.ok(T.teamMessage("https://x.test", "", false).endsWith("Join at https://x.test/academy."));
assert.equal(T.shareLinks().length, SURVEYS.length + 2);
console.log(`surveys: ${SURVEYS.length} defined (${SURVEYS.map((s) => s.slug).join(", ")}), ${RATING_QUESTIONS.length} ratings — answer checking, schedule, averages, change, spreadsheet, wording — OK`);
