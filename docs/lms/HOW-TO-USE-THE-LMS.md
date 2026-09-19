# How to feed the Academy (BL.com LMS) — cheat sheet

**One sentence in, a live module out.** The agent writes the lesson, quiz, key points and badge
from your material, makes the NotebookLM audio/video/flashcards, narrates the lesson in your
Audiobook Studio voice (`am_michael`), commits, deploys, and hands you the URL.

## Say it like this

- `Add lesson **The Trust Trinity** from ~/Desktop/Trust Trinity notes.docx to the **Business Tools** course on the BL.com LMS.`
- `Create a new paid course **Rockstar Teams** for **$99** from the Desktop folder "Rockstar Teams" — three lessons.`
- `Academy: resume ~/Desktop/LMS - The Trust Trinity/`

More in `docs/lms/PROMPTS.md` (six templates).

## What happens

1. A project folder appears: `~/Desktop/LMS - <Title>/` (your source copied into `source/`, never edited).
2. The agent writes `lesson.json` and validates it (word count, 10 questions, answers in the lesson, no TODOs).
3. **Gate.** You get a short summary: module number, sections, quiz count, badge, what it will produce,
   whether a Stripe price will be created. Nothing has cost anything yet. Reply **go**, **go, no video**, or edits.
4. It produces media (NotebookLM: ~3 audio + 3 video per day on the free tier; narration: ~3 min per 1,000 words),
   commits, deploys, checks the live URL.
5. Report (<120 words) with the URL and the resume line.

## Things to know

- **Renumbering:** a lesson added to Business Tools becomes module 16 and everything after shifts by one.
  Members' progress is stored by slug, so nothing breaks — the labels just change.
- **Certification** requires every module, so each new lesson raises the bar.
- **Video:** a placeholder plays until you send the YouTube embed link. Then: `Academy: set YouTube for <slug> to <url>`.
- **Paid course:** the Stripe price is created live (from `.env.local`), pushed to Vercel, and wired via `STRIPE_PRICE_<COURSE>`.
- **NotebookLM ran out?** Tomorrow: `Academy: resume ~/Desktop/LMS - <Title>/` — it retries only what failed.
- **Fix wording later:** write notes in the project's `FEEDBACK.md`, then `Academy: apply FEEDBACK.md in …`.
- Media files under `public/academy/` are reachable by URL without buying (parked: move to signed URLs).

## Under the hood (for the agent, not you)

`~/dev/BL-2026-Personal-Site/scripts/academy-lesson.mjs` — `init · validate · add · price · produce · narrate · ship · status · run`.
Skill: `~/.gg/skills/academy.md` (source `docs/lms/SKILL.md`). Narration: `~/dev/audiobook-studio/narrate.sh`.
