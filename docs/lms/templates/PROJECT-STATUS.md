# PROJECT STATUS — <title> (Academy lesson)

Last updated: <date>
Status: **scaffolded — lesson.json not written yet**

## 1. What this is
An Academy lesson package for the Master's Edge Academy (brettlechtenberg.com/academy).
Slug: `<slug>`. Course: <fill in>. Built with the `academy` skill from the files in `source/`.

## 2. Files
| File | What it is | Status |
|---|---|---|
| `lesson.json` | **source of truth** — lesson, key points, quiz, badge, course | ⏳ |
| `source/` | raw material (read-only, never edited) | ✅ |
| `narration.md` | what the narrator reads (generated) | — |
| `quiz-draft.json` | NotebookLM's quiz suggestions (never auto-applied) | — |
| `.state.json` | pipeline progress (machine-written) | — |

## 3. Decisions made (don't re-litigate)
-

## 4. How to rebuild / resume
```bash
cd ~/dev/BL-2026-Personal-Site
node scripts/academy-lesson.mjs validate "<dir>/lesson.json"
node scripts/academy-lesson.mjs run "<dir>/lesson.json"          # → gate
node scripts/academy-lesson.mjs run "<dir>/lesson.json" --go     # → produce + ship
node scripts/academy-lesson.mjs status <slug>
```

## 5. Open ideas / next steps
- YouTube lesson video (placeholder until filmed)

## 6. Session log
- **<date>:** scaffolded.

## Pipeline

<!-- pipeline:start — rewritten by academy-lesson.mjs; edit outside this block -->
(not run yet)
<!-- pipeline:end -->
