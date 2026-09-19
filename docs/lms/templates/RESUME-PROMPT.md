# Resume Prompt — <title>

Copy everything below the line and paste it as the first message of a new thread.

---

Academy: resume `<dir>/` using the `academy` skill.

Read in this order before doing anything:
1. `PROJECT-STATUS.md` — what exists, decisions, pipeline state
2. `lesson.json` — the single source of truth (lesson, quiz, badge, course)
3. `FEEDBACK.md` — my review notes (if empty, ask me for feedback)

Rules that still apply:
- Make changes by editing `lesson.json` and re-running the pipeline — never hand-edit `modules.ts` for this lesson.
- Nothing that costs quota or money runs before I say "go".
- Do not delete or overwrite anything in `source/`.
- `node scripts/academy-lesson.mjs status <slug>` shows what is done; `run "<dir>/lesson.json" --go` finishes the rest.

Then tell me, in under 120 words: current state, and what you propose to do next.
