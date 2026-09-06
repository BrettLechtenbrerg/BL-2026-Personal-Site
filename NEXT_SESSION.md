# BL 2026 Personal Site — Next Session Restart Prompt

**Updated:** September 6, 2026 (end of Session 28)

A copy of this file is also at `~/Desktop/BrettLechtenberg-Site-RESUME-PROMPT.txt`.
Paste the block below into a fresh session.

---

```
Resume work on brettlechtenberg.com (Master's Edge Academy LMS).

Repo: /Users/brettlechtenberg/dev/BL-2026-Personal-Site  (ONLY this path)
Live: https://www.brettlechtenberg.com   Deploy: `npx vercel --prod --yes`
      (Vercel's GitHub auto-deploy is NOT firing — always deploy via CLI)

READ FIRST, in order:
  1. docs/SESSION-NOTES.md  — top section "END OF SESSION STATE"
  2. docs/ACADEMY.md        — how the Academy is built
  3. CLAUDE.md              — project rules + page inventory

FIRST COMMANDS:
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site pull
  bash /Users/brettlechtenberg/dev/BL-2026-Personal-Site/scripts/academy-batch-ctl.sh status

An unattended macOS LaunchAgent was left running at the end of Session 28. It
generates NotebookLM podcast + video + flashcards for one Academy module every
20 min and commits/pushes/deploys on its own until all 43 modules are done,
then unloads itself. The status command above tells you whether it is still
running, finished, or stuck. If it is still running: `git pull` before editing
anything, and do NOT edit src/content/academy/modules.ts or deploy by hand
mid-tick. If a module shows "GAVE UP", read .notebooklm/batch.log for why.

Supabase project ref: yrfsquzzbgnmkfbuapfk (Comms Hub + Academy share it).
If it is paused, docs/SESSION-NOTES.md has the one-line restore command.

Open ideas not started: course cover art (drop images in public/academy/covers/
and set `cover` on each course), pasting NotebookLM quiz output into modules,
sizzle-reel homepage placement (see STATE.md).
```

---

## Quick facts (if the docs are unavailable)

- **Working dir:** `/Users/brettlechtenberg/dev/BL-2026-Personal-Site`
  (NEVER `~/Desktop/Claude Projects/...` — dead iCloud copy, corrupts git)
- **GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site
  (gh account `BrettLechtenbrerg`)
- **Academy admin:** `brett@brettlechtenberg.com` (`me_users.role = 'admin'`);
  member enrollment code `EDGE2026`; admin review at `/hub/academy`.
- **NotebookLM:** Google AI Pro account, logged in via `notebooklm` CLI
  (`~/.notebooklm/profiles/default/`). Re-auth: `notebooklm login --browser chrome`.
- **Supabase keep-alive:** Vercel cron daily + GitHub Actions 2×/day
  (`.github/workflows/supabase-keepalive.yml`), auto-restores if paused.

## Older open items (pre-Academy, still parked)

- **Hub email → spam** — needs GHL dedicated sending domain DNS. Hub SMS parked
  (location has no phone number). Context: `docs/COMMS_HUB.md`.
- **Speaking stats verification** — 100+/50+/10K+ bar omitted; verify or retire.
- **AFCU letter of recommendation** (Lindsey Powers) — replace her text quote
  card on /speaking when it arrives.
- Sizzle reel v3.1 swipe-cut variant awaiting Brett + Rupert review.
