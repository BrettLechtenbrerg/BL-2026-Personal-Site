# Session Notes — Academy

## NEXT SESSION — FIRST ITEM TO DISCUSS

**NotebookLM automation pipeline.** Brett is very interested in the unofficial
Python route ("it would be amazing if we got it to work"). Plan agreed on
Aug 29, 2026:

1. **Layer 1 (solid, build first)**: flashcard support on Academy modules +
   an install script — Brett downloads any NotebookLM artifact (audio, video,
   flashcards), one command wires it to the right module and deploys.
2. **Layer 2 (experiment, build after)**: the unofficial `notebooklm-py`
   library — one command sends a module's lesson text to NotebookLM, waits,
   downloads the podcast/video/flashcards, installs them automatically.
   Caveats to keep in mind: unofficial, rides Brett's Google session, could
   break at any time, must never be load-bearing. Consumer NotebookLM has no
   official API (Enterprise-only, preview).

## State at end of Aug 29, 2026 session

- Academy LIVE at /academy (enrollment code EDGE2026), 4 courses, 43 modules,
  ~236 quiz questions. All modules unlocked (preview mode) while Brett decides
  final layout — linear per-course unlock preserved in a comment in
  `unlockedSlugs()` (src/content/academy/modules.ts).
- Framework course (module 43, from book Appendix A) is the planned **free
  giveaway** — NOT yet public, still behind the enrollment code by Brett's
  choice. A code-free lead-magnet signup was offered, not yet requested.
- Module 43 has NotebookLM deep-dive AUDIO installed and live
  (public/academy/masters-edge-framework/deep-dive.m4a, 39MB).
- VIDEO overview: Brett is generating it in NotebookLM; will hand over the
  file same way (Desktop + filename). Both self-hosted video (videoFiles) and
  the YouTube placeholder (videoUrl) render side-by-side ON PURPOSE — Brett
  will compare and pick one. >90MB files go to Supabase Storage, not the repo.
- All 43 placeholder videos still cycle Brett's 3 TV appearances; real lesson
  videos pending.

## Open decisions (Brett)

- Final course/unlock layout (preview mode until decided)
- YouTube embed vs self-hosted video after comparing both
- Whether Framework course becomes a public code-free lead magnet
