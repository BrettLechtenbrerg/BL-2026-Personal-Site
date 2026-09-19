---
name: academy
description: The Academy Lesson Forge — one phrase from Brett ("add lesson X from this file to course Y", "new paid course Z for $99 from this folder") becomes a full, live module on the Master's Edge Academy LMS at brettlechtenberg.com/academy — written lesson, key points, quiz, badge, NotebookLM deep-dive audio + video + flashcards, Kokoro-narrated "Read Aloud" audio, PDFs — committed, deployed and verified. Use whenever the user says "LMS", "Academy", "lesson package", "add lesson", "new course", "Master's Edge course", "resume lesson", or asks to turn notes, a doc, a chapter or a folder into an Academy module. Do NOT use for the public website, blog posts, decks/flyers (that is the Forge), or the PMMA/TSAI sites until the Targets table below has a row for them.
---

# The Academy Lesson Forge

Raw material in (a docx, PDF, notes, a folder), a live LMS module out — built from one
`lesson.json` so it can be validated, re-produced and resumed. The pipeline lives in the
site repo: `~/dev/BL-2026-Personal-Site/scripts/academy-lesson.mjs`. This file is the
source of truth for the skill; `install.sh`-style copy: `cp docs/lms/SKILL.md ~/.gg/skills/academy.md`.

## First, read (in this order)

1. `~/dev/BL-2026-Personal-Site/docs/lms/HOW-TO-USE-THE-LMS.md` — the cheat sheet (30 seconds)
2. `~/dev/BL-2026-Personal-Site/scripts/academy-lesson.mjs` — the header comment: commands and the CONFIG block
3. `~/dev/forge/brand-voice/brett-personal/WRITING_RULES.md` — Brett's voice (lessons are Brett teaching, first person where it fits, second person to the learner)
4. Two existing modules in `src/content/academy/modules.ts` for the house style (e.g. `fire-yourself`, `time-maze`)

If resuming: read the project's `PROJECT-STATUS.md`, `.state.json` and `FEEDBACK.md` first.

Before reading any Desktop source, run `ls -lO "<folder>" | grep -c dataless`. A non-zero count means
iCloud evicted the files: `brctl download "<file>"` each one, poll until the count is 0, then read.
(`init` refuses dataless sources for this reason.)

## Targets

| key | repo | site | voice | status |
|---|---|---|---|---|
| `bl` | `~/dev/BL-2026-Personal-Site` | https://brettlechtenberg.com/academy | `brand-voice/brett-personal` | **live — the only target for now** |
| `pmma` | — | — | `brand-voice/pmma` | parked: clone the academy feature + CONFIG block, add a row |
| `tsai` | — | — | `brand-voice/tsai` | parked: same |

Decision (2026-09-19, not to be re-litigated): everything site-specific lives in the CONFIG block at the
top of `academy-lesson.mjs`. Porting = copy the academy feature into the other repo, edit CONFIG, add a row here.

## The brief — fill these from Brett's sentence

| Slot | Required | Default / rule |
|---|---|---|
| Lesson title | yes | — |
| Source material | yes | A file or folder. Look only in `~/Desktop` (maxdepth 3). docx/pptx → `pandoc -t gfm`; pdf → `python3 -c "import fitz"` (PyMuPDF; `pdftotext` is not installed). **Source is read-only.** |
| **Placement** — existing course or NEW course? | **yes — always confirm** | See "The placement question" below. Never default. |
| Price (new course only) | yes if new | `free` (priceUsd 0) or `$N` — a Stripe price is created only after the gate |
| YouTube URL | no | `null` → rotating placeholder video; ask for the embed link later |
| PDFs to attach | no | every PDF in the source folder, labelled from its filename |
| Badge name + emoji | no | you propose one (2–3 words, martial-arts / mastery flavour, matches the existing set in `badges.ts`) |
| Pieces to produce | no | all five: `audio`, `video`, `flashcards`, `quiz`, `narration` |
| Review | yes | `gate` (default) or `no review` |

**Clarifying questions:** ask once, as ONE numbered list, only for slots you genuinely cannot fill,
each with your default. Never ask about things the sentence already settled. If Brett gives only a
title and a file, the defaults above are the answer — except placement, which is always confirmed.

### The placement question (always asked unless the sentence already answers it)

A course = one entry in the Academy nav's **Courses** dropdown, one section on the courses page, one
Stripe price. A lesson = one module inside a course. Before scaffolding, settle which this is:

> **Where does "<Title>" go?**
> 1. Into an existing course — `framework` · `business-tools` · `reclaiming-the-clock` · `masters-edge-book` · `rockstar-teams`
> 2. A **new course** with its own dropdown entry (a book-in-progress, a standalone program) — then: title, emoji, one-line blurb, `$N` or free
>
> My read: <your recommendation + one-line reason>.

The sentence answers it when it names a course id ("to the Business Tools course") or says "new course".
A book, manual or multi-lesson program is almost always its own course; a single chapter, tool or
talk usually joins an existing one — say which you think and why, but let Brett decide. The scaffold
writes `course: "CHOOSE"` and `validate` refuses to pass until this is filled in, so it cannot be skipped.

## Workflow

1. **Scaffold** — `node scripts/academy-lesson.mjs init "<Title>" --source "<file-or-folder>"`
   → `~/Desktop/LMS - <Title>/` with `source/`, a skeleton `lesson.json`, `PROJECT-STATUS.md`,
   `RESUME-PROMPT.md`, `FEEDBACK.md`.
2. **Read the source fully** (convert it, read the whole text — never skim a summary).
3. **Author `lesson.json`** (rules below). This file is the single source of truth.
4. **Validate** — `validate "<project>/lesson.json"`. Fix every ✗; read every ⚠.
5. **Gate** — `run "<project>/lesson.json"` (validate → add → prints the gate summary; local edits only).
   Post the summary to Brett verbatim. Wait for "go" (or "go, no video" → add `--only …`, or edits → step 3).
   `no review` in the brief → `run … --no-review` straight through.
6. **Finish** — `run "<project>/lesson.json" --go` (price if new paid course → produce → ship).
   NotebookLM free tier ≈ 3 audio + 3 video a day; failures are recorded, not fatal.
7. **Report** in under 120 words (format below), then stop.

Resume at any point: `run "<project>/lesson.json" --go` — every step is idempotent; `.state.json`
remembers what is done. `status <slug>` shows it.

## Authoring rules for `lesson.json`

Schema: `scripts/academy-lesson-schema.json`. The validator enforces these; write to them.

- **Voice:** Brett teaching a business owner. Plain, specific, evidence-backed, no hype. Say what to do
  *this week*. Concrete numbers and examples from the source; if the source has none, use Brett's
  dojo/business examples in the style of the existing modules. Never invent statistics.
- **`tagline`:** 2–4 words naming the strand (e.g. "Strategic Thinking", "Team Systems").
- **`description`:** 1–2 sentences, 80–400 chars — the card blurb. What it is + what the learner walks away with.
- **`keyPoints`:** exactly 5, each one full, quotable sentence.
- **`lesson`:** 4–6 sections, 900–2,500 words total, ≥2 paragraphs each; bullets for lists/steps.
  Section 1 = the problem/why; last section = the action plan. Every quiz answer must be stated in the lesson.
- **`quiz`:** exactly 10 questions, 4 distinct options, `correctIndex`, one-to-two-sentence `explanation`
  that teaches (not "correct"). Mix recall and scenario ("An owner does X — what does the lesson say?").
  Spread across sections. **Spread `correctIndex` across 0–3** (no more than 4 of 10 on the same index — the
  validator warns). No trick questions, no "all of the above".
- **`badge`:** name ≤30 chars + emoji.
- Nothing left as `[VERIFY]`, `TODO`, `XXX`, `TBD`.
- Slug: lowercase-dashes, ≤60 chars, unused (validator checks).

## Non-negotiables

- **Never hand-edit `modules.ts` for a new lesson** — `add` does it (order allocation, renumbering of
  later modules, course ranges, badge, PDFs) and proves it with `tsc`. Edits after the fact go in
  `lesson.json` → re-run `run`/`add`: it detects the changed file, swaps the module block in place
  (same slug, same order, narration/NotebookLM entries kept) and **re-opens the gate**. Never change
  the slug of an added lesson (member progress is keyed on it).
- **Nothing costs quota or money before the gate.** `price` runs only after "go" and only with the `$N` Brett typed.
- **Source material is read-only.** Copy into `source/`, never modify.
- **Certification** requires every module — each new lesson raises the bar for everyone. Say so in the gate and the report.
- **Renumbering is cosmetic** (progress is slug-keyed) but say which modules shifted.
- Media under `public/academy/` is public by URL (parked item #1 in `docs/lms/PARKED.md`). Do not put
  anything there that must stay private.
- After each milestone the script backs up the project to `~/Backups/lms-<slug>/<date>/`.

## Gate message (post verbatim from `run`)

```
LESSON READY FOR REVIEW — <Title> → <Course> (module N; N–M renumbered to N+1–M+1)
Key points (5): …   Sections (k, w words): …
Quiz: 10 q   Badge: <emoji> <name>   PDFs: n
Will produce: NotebookLM audio + video + flashcards + quiz (uses today's quota), narration (am_michael, ~m min)
Needs from you: [none | Stripe price $99 for "<course>" will be created | YouTube link (placeholder for now)]
Note: certification will require N modules.
Reply "go" (or "go, no video" / edits).
```

## Report format (after `ship`, under 120 words)

Live URL · what was produced (and what failed, with the reason) · anything Brett must still supply
(YouTube link) · the renumber/certification note · the one-line resume prompt:
`Academy: resume ~/Desktop/LMS - <Title>/`. Then stop.
