# Session Notes — Academy

## ⚡ Sep 6, 2026 — END OF SESSION STATE (read this first)

**Unattended batch is RUNNING** (macOS LaunchAgent
`com.brettlechtenberg.academy-notebooklm`): every 20 min it generates NotebookLM
audio + video + flashcards for one module, commits, pushes, deploys. Started
18:47 UTC at module 3/43 (`decision-journal`). ETA all 43 ≈ 14 hrs of the Mac
being awake. It unloads itself when done.

Check:   `bash scripts/academy-batch-ctl.sh status`
Log:     `.notebooklm/batch.log` (gitignored)
Stop:    `bash scripts/academy-batch-ctl.sh remove`
Restart: `bash scripts/academy-batch-ctl.sh install`   (safe — skips done modules)

If a session resumes while it's running: **do not** edit `modules.ts` or run
`vercel --prod` by hand mid-tick (it commits/pushes on its own). Pull first:
`git pull` — the batch pushes to origin/main every ~20 min.

**Known ceilings (not blockers today):**
- Vercel Hobby: function bundle ≤ 250 MB (FIXED Sep 6 — flashcards moved to
  `src/content/academy/flashcards/`, `outputFileTracingExcludes` for
  `public/academy`). CLI upload ≤ 100 MB per deploy — the CLI dedupes, so only
  the new module's ~70 MB goes up each tick. If a deploy ever fails on upload
  size, move media to Supabase Storage (installer refuses >90 MB files already).
- Repo will grow to ~3 GB of media in `public/academy/`. GitHub accepts it
  (per-file <100 MB). If that becomes painful, migrate to Storage + URLs.
- NotebookLM Pro quota: 20 audio + 20 video per rolling 24 h. Batch pauses
  60 min when it sees a quota error; nothing is lost.
- NotebookLM auth: cookies in `~/.notebooklm/profiles/default/`. If the batch
  log shows "Not signed in", run `notebooklm login --browser chrome` once.

**Vercel GitHub auto-deploy is NOT firing** — always `npx vercel --prod --yes`.

## Sep 6, 2026 — GHL parity build (all DEPLOYED)

GHL-style community channels: sidebar (General, Welcome Aboard, Announcements
[admin-only], Wins, Accountability, Office Hours, Tools), post titles, pinned
posts, `?channel=` URLs. Channel list: `src/content/academy/channels.ts`.
Admin = `me_users.role = 'admin'` (Brett's academy account; set via SQL).

Live DB: schema applied, Brett = admin, end-to-end post/pin tested Sep 6.

**Supabase paused again (Sep 6) despite the Mon+Thu cron.** Fixed two ways:
- Vercel Hobby crons are once/day max (deploy REJECTS more) → Vercel cron daily
  (`0 9 * * *`) + GitHub Actions `.github/workflows/supabase-keepalive.yml` at
  03:00 & 15:00 UTC (repo secret CRON_SECRET, rotated Sep 6). Note: Vercel's
  GitHub auto-deploy did NOT fire this session — deploy with `npx vercel --prod`.
- Cron auto-restores: on ping failure it calls the Supabase Management API
  (`POST /v1/projects/<ref>/restore`) using Vercel env `SUPABASE_ACCESS_TOKEN`
  + `SUPABASE_PROJECT_REF` (set Sep 6; token = the local Supabase CLI login).

Manual restore runbook (if ever needed again):
```
TOKEN=$(security find-generic-password -s "Supabase CLI" -w)
curl -X POST -H "Authorization: Bearer $TOKEN" https://api.supabase.com/v1/projects/yrfsquzzbgnmkfbuapfk/restore
# ~3 min to ACTIVE_HEALTHY. Apply SQL without the dashboard:
#   POST .../projects/<ref>/database/query  {"query": "<sql>"}
```

GHL-parity DONE Sep 6: Events (`/academy/events`), Members directory
(`/academy/members`, bio + last_seen_at), course banners (`cover` field on
AcademyCourse — drop art in `/public/academy/covers/` and set the path; brand
gradient until then), community About card, leaderboard 7/30-day/all-time tabs
+ belt distribution.

DONE Sep 6: NotebookLM Layer 1 — flashcard deck component + sidecar loader +
`scripts/academy-install.mjs` (CSV/JSON flashcards, audio, video, quiz→TS).
Sample 5-card deck installed on masters-edge-framework.

Layer 2 built Sep 6: `scripts/academy-notebooklm.mjs` (wraps the notebooklm
CLI 0.8.2, installed via uv tool). First real run Sep 6 on `fire-yourself`:
40 flashcards + 41 MB podcast + 31 MB video + 10-question quiz (printed, not
pasted) — all installed and deployed. ~12–25 min wall time per module. Brett's
account is **Google AI Pro (tier 2)**: 20 audio + 20 video per rolling 24 h.
Then `scripts/academy-batch.mjs` + launchd for the remaining 41 (see top).

Also Sep 6: visual podcast player (`PodcastPlayer.tsx` — two hosts, mic,
animated bars), 3D flip flashcards with step prompts + progress bar,
profile photo upload (Supabase Storage `academy-avatars`), channel sidebar on
every academy page.

(Was: Layer 2 (notebooklm-py
0.8.2 automation — verified Sep 6 it can generate+download audio/video/
flashcards/quiz JSON; unofficial, never load-bearing).

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
- Module 43 has BOTH NotebookLM artifacts installed and verified streaming:
  - AUDIO: public/academy/masters-edge-framework/deep-dive.m4a (39MB)
  - VIDEO: public/academy/masters-edge-framework/video-overview.mp4 (88MB,
    "Engineering Human Performance: The Master's Edge Stack")
  Page order (Brett's request): Video Overview → Listen → YouTube placeholder
  → written lesson. Both video players stay until Brett picks one.
  Future files >90MB go to Supabase Storage, not the repo.
- All 43 placeholder videos still cycle Brett's 3 TV appearances; real lesson
  videos pending.

## Open decisions (Brett)

- Final course/unlock layout (preview mode until decided)
- YouTube embed vs self-hosted video after comparing both
- Whether Framework course becomes a public code-free lead magnet
