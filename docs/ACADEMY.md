# Master's Edge Academy — `/academy`

> Private, hidden (noindex) learning academy: 4 courses / 43 modules —
> Business Tools (1–15), Reclaiming the Clock (16–23), The Master's Edge Book
> (24–42), and the Framework free-giveaway course (43, with NotebookLM audio +
> video overviews). Each module: video, full written lesson, optional
> audio/videoFiles, and resources,
> typeform-style quizzes with an 80% pass gate, XP + martial-arts belt levels,
> badges, a members-only community feed, leaderboard, and a final certification
> (capstone project reviewed by Brett + auto-scored final exam) that prints a
> branded certificate.

Built August 29, 2026. Verified end-to-end locally against the live Supabase
project (signup → lesson → quiz fail/pass → badges/XP → community → leaderboard
→ certification → admin approve → certificate). Test data was removed after.

---

## Launch checklist

1. **Env vars** — ✅ all set in Vercel production (Aug 29 2026):
   `ACADEMY_ACCESS_CODE` (enrollment code **EDGE2026**), `ACADEMY_SESSION_SECRET`,
   `CRON_SECRET`, plus the pre-existing Supabase vars. If any is removed,
   production fails closed: signup/sessions return 503. To rotate the code:
   `npx vercel env rm ACADEMY_ACCESS_CODE production` then re-add + redeploy.
2. **Schema** — ✅ already applied to the `bl-comms-hub` Supabase project
   (all `me_` tables). To re-apply or apply elsewhere, paste
   `supabase/academy-schema.sql` into the Supabase SQL editor (idempotent).
3. **Swap placeholder videos** — all 15 modules currently cycle through Brett's
   3 media-appearance videos. Replace each module's `videoUrl` in
   `src/content/academy/modules.ts` with its real unlisted lesson video
   (`https://www.youtube.com/embed/<id>`) as they get filmed. Every module
   also has a full written lesson, so reading-first members are covered
   even before the real videos exist.
4. Push to `main` → Vercel deploys. Share `brettlechtenberg.com/academy` +
   the enrollment code directly with members.

> ⚠️ The Supabase free-tier project **pauses after ~1 week of inactivity**
> (it was paused when we built this — we restored it). A paused project takes
> both the Academy and the Comms Hub down. `/api/cron/keepalive` is pinged 3x/day
> (Vercel cron + GitHub Actions) and auto-restores via the Management API if it finds the project
> paused (see `docs/SESSION-NOTES.md` → Sep 6 for the runbook).

## How auth works

- One shared **enrollment code** gates signup; each member then has their own
  email + password (bcrypt-hashed) and avatar.
- Sessions: HMAC-signed HttpOnly cookie (`src/lib/academy-session.ts`,
  modeled on `hub-session.ts`). Every `/api/academy/*` route verifies it.
- Dev fallbacks (localhost only): code `masters-edge-dev`, dev session secret.
- Admin review reuses the existing hub login — no second admin account.

## Current mode (Aug 29, 2026)

- **Preview mode is ON**: all modules unlocked while Brett decides the final
  layout. Restore linear per-course unlocking via the commented block in
  `unlockedSlugs()` (src/content/academy/modules.ts).
- **Media on modules**: optional `audio` and `videoFiles` arrays render native
  players ABOVE the YouTube embed. Files live under
  `public/academy/<slug>/`; keep them under ~90MB (Supabase Storage beyond).
- **Flashcards**: `public/academy/<slug>/flashcards.json` (`[{front, back}]`),
  read at request time by `src/content/academy/media.ts` — modules.ts is not
  touched. Renders a flip-card deck between the lesson and Key Points.
- **Installing NotebookLM artifacts** (audio, video, flashcards CSV/JSON, quiz):
  `node scripts/academy-install.mjs <slug> <file> [--label "…"] [--deploy]`.
  Quizzes are printed as TS to paste (never auto-written). See script header.
- **Session log**: docs/SESSION-NOTES.md — read it first next session.

## Adding a module

1. Append an entry to `src/content/academy/modules.ts` (slug, title, order,
   video embed URL, `lesson` sections — the written material for readers —
   and quiz questions with `correctIndex` + `explanation`).
2. Drop PDFs/images into `public/academy/<slug>/` and list them in the entry.
3. Optionally add a badge name/emoji for it in `badges.ts` → `moduleBadgeMeta`.
Pages, linear unlock, quiz, XP, and the module badge all pick it up automatically.

**Never import `modules.ts` from a `"use client"` file** — it contains quiz
answers. Server components/API routes strip answers before data reaches the
browser (verified: no `correctIndex` in client bundles).

## Certification & awarding

- Unlocks when every module is passed. Two halves:
  **capstone project** (Brett approves at `/hub/academy`) and
  **final exam** (auto-scored, 80%+ = approved).
- Both approved → `certified-masters-edge` badge (Black Belt) + printable
  certificate at `/academy/certificate`.
- Review queue: `/hub/academy` (hub login) — approve or request revision with
  feedback; feedback shows on the member's certification page.

## Gamification

XP: lesson +50 · quiz pass +100 (+25 perfect) · post +10 · comment +5 ·
daily visit +5. Belts by XP (White → Red); Black Belt only via certification.
Badges in `src/content/academy/badges.ts`. Ledger table `me_xp_events`;
`me_users.xp` is the cached sum.

## Key files

| Area | Path |
|---|---|
| Schema (idempotent) | `supabase/academy-schema.sql` |
| Session + guard | `src/lib/academy-session.ts` |
| DB helpers (XP, badges, certify) | `src/lib/academy-db.ts` |
| Content (modules, quizzes, exam) | `src/content/academy/modules.ts` |
| Badges + belts | `src/content/academy/badges.ts` |
| Member APIs | `src/app/api/academy/*` |
| Admin API + page | `src/app/api/hub/academy/route.ts`, `src/app/hub/academy/page.tsx` |
| Member pages | `src/app/academy/*` |
