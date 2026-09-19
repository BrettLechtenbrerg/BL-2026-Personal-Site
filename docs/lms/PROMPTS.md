# Academy Lesson Forge — prompt kit

## The one-line prompt (same shape as the Forge)

```
Take <file or folder on my Desktop> and add it as a <lesson in the COURSE course | new course COURSE for $N> in the BL.com academy.
```

Examples:

- `Take "Creating a culture.docx" from my Desktop and add it as a lesson in the rockstar-teams course in the BL.com academy.`
- `Take the folder "The 7 Deadly Sins of Business" from my Desktop and create a new course "7 Deadly Sins" for $79 in the BL.com academy.`
- `Take "Time Blocking.pdf" from my Desktop and add it to the reclaiming-the-clock course in the BL.com academy — no review.`

That one sentence runs the whole Rockstar Team sequence: written lesson + key points + 10-question
quiz + badge → gate for your "go" → NotebookLM podcast, video overview, flashcards → Read Aloud
narration in your voice → PDFs → Stripe price (new paid course) → commit, deploy, live URL.
Academies today: **BL.com** (brettlechtenberg.com/academy). PMMA and TSAI are parked until their
sites get the Academy feature (see `docs/lms/PARKED.md` #5).

---

Six fill-in variants follow. Paste one as the first message of a new thread. The agent uses the
`academy` skill; anything you leave out gets a sensible default (placeholder video, all
five media pieces, a proposed badge, review gate on) — **except placement**.

**Placement is always confirmed.** A *course* is its own entry in the Courses dropdown, its own
section on the courses page, and its own price (e.g. *Rockstar Teams* — a book in progress with
many lessons to come). A *lesson* is one module inside a course. If your sentence doesn't say
which, the agent asks one question with its recommendation before it writes anything.

---

## 1. Add a lesson to an EXISTING course (existing dropdown entry)

```
Add lesson **<Lesson Title>** from `~/Desktop/<file or folder>` to the **<business-tools | reclaiming-the-clock | masters-edge-book | framework>** course on the BL.com LMS.
```

Optional extras, any order: `YouTube: <embed url>` · `badge: <emoji> <name>` · `no video` ·
`only narration` · `no review`.

## 2. New PAID course (new dropdown entry + Stripe price)

```
Create a new paid course **<Course Title>** for **$<N>** on the BL.com LMS from the folder on my Desktop called `<folder>` — <k> lessons, one per file. First lesson: **<Lesson Title>**.
```

The Stripe price is created once, after you approve the first lesson's gate. Later lessons use
prompt 1 with the new course id.

## 3. New FREE course (new dropdown entry, no price)

```
Create a new free course **<Course Title>** on the BL.com LMS from `~/Desktop/<file or folder>`. First lesson: **<Lesson Title>**.
```

## 4. Resume

```
Academy: resume ~/Desktop/LMS - <Lesson Title>/
```

(The project's own `RESUME-PROMPT.md` has the long form.)

## 5. Apply feedback

```
Academy: apply FEEDBACK.md in ~/Desktop/LMS - <Lesson Title>/ and re-ship.
```

Write your notes in that project's `FEEDBACK.md` first. The agent edits `lesson.json`,
re-validates, shows you the gate summary, then re-runs only what changed.

## 6. Re-produce one piece

```
Academy: re-produce <audio | video | flashcards | quiz | narration> for <slug> (force).
```

Use when NotebookLM quota ran out yesterday, or you want the narration re-read after a copy change.

---

### What you get back

A gate summary before anything costs quota or money:

```
LESSON READY FOR REVIEW — The Trust Trinity → Business Tools (module 16; 16–43 renumbered to 17–44)
…
Reply "go" (or "go, no video" / edits).
```

Then, after "go", a <120-word report with the live URL and the resume line.
