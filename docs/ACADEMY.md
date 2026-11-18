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

1. **Env vars** — ✅ set in Vercel production: `ACADEMY_SESSION_SECRET`,
   `CRON_SECRET`, `CERTIFIER_TOKEN`, `CERTIFIER_GROUP_ID` (Sep 7 2026; also in
   `.env.local`), plus the pre-existing Supabase vars, plus the Stripe vars
   in **Paywall** below. If any is removed, production fails closed:
   sessions return 503, checkout 503. (`ACADEMY_ACCESS_CODE` / code
   **EDGE2026** was retired Sep 8 2026 — signup is open now.)
2. **Schema** — ✅ already applied to the `bl-comms-hub` Supabase project
   (all `me_` tables). To re-apply or apply elsewhere, paste
   `supabase/academy-schema.sql` into the Supabase SQL editor (idempotent).
3. **Swap placeholder videos** — all 15 modules currently cycle through Brett's
   3 media-appearance videos. Replace each module's `videoUrl` in
   `src/content/academy/modules.ts` with its real unlisted lesson video
   (`https://www.youtube.com/embed/<id>`) as they get filmed. Every module
   also has a full written lesson, so reading-first members are covered
   even before the real videos exist.
4. Push to `main` → Vercel deploys. Share `brettlechtenberg.com/academy`
   directly with members (no code needed).

> ⚠️ The Supabase free-tier project **pauses after ~1 week of inactivity**
> (it was paused when we built this — we restored it). A paused project takes
> both the Academy and the Comms Hub down. `/api/cron/keepalive` is pinged 3x/day
> (Vercel cron + GitHub Actions) and auto-restores via the Management API if it finds the project
> paused (see `docs/SESSION-NOTES.md` → Sep 6 for the runbook).

## Paywall (Sep 8, 2026)

- Signup is free; every course is a one-time Stripe purchase — **Framework
  $99**, **Business Tools $499**, **Reclaiming the Clock $499**, **The
  Master's Edge Book $999** — or free with that course's gift code. Ownership lives in `me_course_access` (one row per member
  × course; `source` = free/stripe/legacy/admin). Everyone enrolled before
  Sep 8 2026 22:00 UTC was grandfathered into all 4 (`legacy`).
- **Enforced server-side**: `src/lib/academy-access.ts` `getOwnedCourses()`
  feeds `unlockedSlugs()` (progress + quiz APIs) AND the module page, which
  renders a Locked panel instead of the lesson. Fails closed (DB error → only
  free courses).
- **Lesson video and audio are gated too (18 Nov 2026)**: they play from a
  private Cloudflare R2 bucket through a members-only gate; see "Lesson media
  on R2" below. **Still public by URL**: PDFs, covers and certificate art
  under `public/academy/`. Lesson text, flashcards and quizzes are gated.
- **Flow**: banner “Unlock course · $X” → `POST /api/academy/checkout` →
  Stripe Checkout (promo-code field on) → `/academy/checkout/success`
  fulfils immediately, `/api/stripe/webhook` fulfils again (idempotent) for
  the case where the buyer never returns. Price shown = the Stripe Price
  amount (dashboard is the source of truth; no redeploy to change a price).
- **Env** (Vercel prod + `.env.local`): `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_FRAMEWORK`, `STRIPE_PRICE_BUSINESS_TOOLS`,
  `STRIPE_PRICE_CLOCK`, `STRIPE_PRICE_BOOK` (`price_…` ids; `priceEnv` on each `AcademyCourse`).
  Test vs live = swap the env values.
- **Webhook endpoint** (Dashboard → Developers → Webhooks, test AND live):
  `https://www.brettlechtenberg.com/api/stripe/webhook`, events
  `checkout.session.completed` + `checkout.session.async_payment_succeeded`.
  Its signing secret is `STRIPE_WEBHOOK_SECRET`. Local: `stripe listen
  --forward-to localhost:3000/api/stripe/webhook` prints a `whsec_` for
  `.env.local`, and set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` there
  so Checkout's success/cancel URLs come back to your dev server.
- **Gift codes (100% off, still “buys” it)** — created Sep 8 2026, live,
  unlimited redemptions (cap or deactivate in Dashboard → Coupons):
  `FRAMEWORK-3CTT` · `TOOLS-V384` · `CLOCK-2JJU` · `BOOK-SXBP`.
  Each is locked to its own product. Recipient enrolls free, clicks Unlock,
  enters the code at checkout, pays $0 → access granted (session completes
  as `no_payment_required`). For a single-person code: Dashboard → Coupons
  → that course's “… — gift” coupon → “Add promotion code”, max redemptions 1.
- **Grant by hand** (no Stripe): SQL editor →
  `insert into me_course_access (user_id, course_id, source) values ('<uuid>', 'reclaiming-the-clock', 'admin') on conflict do nothing;`
- Certification still needs all 43 modules passed (all 4 courses).

## Lesson media on R2 (18 Nov 2026)

**Why:** 89 lesson video and audio files (3.4 GB) made every Vercel
deployment about 3.3 GB and set off Vercel's storage warning. They were also
playable by anyone who had the file's address.

**How it works**

- The files stay in the repo under `public/academy/<slug>/` exactly as before.
  Nothing was deleted; R2 is an extra copy that the live site plays from.
- `npm run build` first runs `scripts/academy-media-r2.mjs build`. **On
  Vercel** it copies any new or changed file to the private R2 bucket
  `bl-academy-media`, checks every copy against the original (size and
  fingerprint), then leaves the media out of the deployment. If R2 can't be
  reached or a copy doesn't match, the build fails and the current live site
  stays up. **On a Mac** that step does nothing and removes nothing.
- A lesson still points at `/academy/<slug>/video-overview.mp4` (no change in
  `modules.ts`). On Vercel no such file exists, so the rewrite in
  `next.config.ts` sends the request to the gate,
  `src/app/api/media/academy/[slug]/[file]/route.ts`: signed in and owns the
  course → redirect to a link on R2 that expires (6 hours, same link for the
  whole hour); signed out → 401; course not owned → 403; not a file the lesson
  lists → 404. On a Mac the file is still in `public/`, so `npm run dev`
  serves it directly and never goes through the gate.
- **New lessons need no extra step.** Add the files as usual and push; the
  Vercel build copies them to R2. Media must sit at
  `public/academy/<slug>/<lower-case-name>.mp4|m4a|mp3|mov|webm|wav` (the build
  stops if one doesn't) and be listed in the module's `audio` or `videoFiles`.

**Commands (on this Mac)**

```bash
node scripts/academy-media-r2.mjs upload          # copy anything new to R2 now, then check all
node scripts/academy-media-r2.mjs verify          # check all copies (size + fingerprint)
node scripts/academy-media-r2.mjs verify --deep   # also download every copy and compare
node --test --experimental-strip-types scripts/media-gate-unit-test.ts scripts/r2-presign-unit-test.mjs
```

**Keys:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` in
Vercel (Production only) and in `.env.local` on the iMac. The key ("bl-academy-media
site", made in Brett's Cloudflare account, R2 → Manage API Tokens) can read and
write objects in that one bucket only. To replace it: make a new token the
same way, then `bash scripts/add-r2-keys.sh` (tests the keys before saving).
A preview deployment has no keys, so its build would stop; add them to
Preview in Vercel if previews are ever used.

**Undo:** revert the commit that added this section and redeploy. The site
goes back to serving the files itself (and to 3.3 GB deployments).

**Good to know**

- A lesson left paused for more than about five hours needs a page refresh
  before it plays again (the link has expired).
- **Read Aloud (18 Nov 2026):** every lesson has `read-aloud.m4a`, made with `node scripts/academy-lesson.mjs narrate <slug>`
  (add `--force` to redo one) in the voice set in the Academy Forge profile (`af_heart`, shown as "Narrated by your
  Master's Edge guide"). After narrating: `node scripts/academy-media-r2.mjs upload`, commit, push.
- The script never deletes from R2. A file removed from the repo stays on R2
  until someone removes it in the Cloudflare dashboard.
- An empty, misspelled bucket `bl-academy-meida` was made by mistake on
  18 Nov 2026; it is unused and can be deleted in the Cloudflare dashboard.
- Later, Brett's call: take the media out of the repo (it grows about 80 MB a
  lesson); the same set-up for TSAI in its own Cloudflare account, at which
  point the gate moves into the Academy Forge.

## How auth works

- **Open signup** (honeypot + timing + origin + per-IP rate limit from
  `src/lib/bot-protection.ts`); each member has their own email + password
  (bcrypt-hashed) and avatar.
- Sessions: HMAC-signed HttpOnly cookie (`src/lib/academy-session.ts`,
  modeled on `hub-session.ts`). Every `/api/academy/*` route verifies it.
- Dev fallback (localhost only): dev session secret.
- Admin review reuses the existing hub login — no second admin account.

## Current mode (Aug 29, 2026)

- **Preview mode is ON within owned courses**: every module of a course you
  own is open. Restore linear per-course unlocking via the commented line in
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
- **Generating NotebookLM artifacts** (Layer 2, unofficial):
  `node scripts/academy-notebooklm.mjs <slug> [--only audio,video,flashcards,quiz] [--deploy]`
  turns the lesson into a NotebookLM notebook, generates, downloads to
  `.notebooklm/<slug>/` (gitignored), and runs the installer for each.
  One-time: `uv tool install "notebooklm-py[browser]"` + `notebooklm login`.
  Free tier ≈ 3 audio + 3 video/day. Rides Brett's Google session; may break
  when Google changes NotebookLM — never load-bearing.
- **Unattended batch**: `bash scripts/academy-batch-ctl.sh install|status|remove`
  installs a macOS LaunchAgent that runs `scripts/academy-batch.mjs` every
  20 min — one module per tick, auto-deploys, pauses 60 min on quota, gives
  up on a module after 3 real failures, unloads itself when all 43 are done.
  Mac must be awake. Log: `.notebooklm/batch.log`.
- **Session log**: docs/SESSION-NOTES.md — read it first next session.

## Adding a module

**Use the Lesson Forge — don't hand-edit `modules.ts` for a new lesson.** One
sentence to the `academy` skill ("Add lesson X from ~/Desktop/… to the Business
Tools course") produces `~/Desktop/LMS - X/lesson.json`, validates it, inserts
the module (order allocation + renumbering + course ranges + badge + PDFs,
proven by `tsc`), gates for Brett's "go", then generates NotebookLM audio /
video / flashcards, a Kokoro-narrated "Read Aloud" track, commits, deploys and
checks the live URL. Runbook: `docs/lms/HOW-TO-USE-THE-LMS.md`; prompts:
`docs/lms/PROMPTS.md`; skill source: `docs/lms/SKILL.md`; parked ideas:
`docs/lms/PARKED.md`.

```bash
node scripts/academy-lesson.mjs init "Lesson Title" --source ~/Desktop/notes.docx
node scripts/academy-lesson.mjs validate "~/Desktop/LMS - Lesson Title/lesson.json"
node scripts/academy-lesson.mjs run      "~/Desktop/LMS - Lesson Title/lesson.json"        # → gate
node scripts/academy-lesson.mjs run      "~/Desktop/LMS - Lesson Title/lesson.json" --go   # → produce + ship
node scripts/academy-lesson.mjs status   <slug>
```

Manual route (still valid for small fixes to existing modules): edit the entry in
`src/content/academy/modules.ts`, drop files into `public/academy/<slug>/`,
optional badge in `badges.ts` → `moduleBadgeMeta`. Pages, quiz, XP and the
badge pick it up automatically.

**Never import `modules.ts` from a `"use client"` file** — it contains quiz
answers. Server components/API routes strip answers before data reaches the
browser (verified: no `correctIndex` in client bundles).

## Certification & awarding

- Unlocks when every module is passed. Two halves:
  **capstone project** (Brett approves at `/hub/academy`) and
  **final exam** (auto-scored, 80%+ = approved).
- Both approved → `certified-masters-edge` badge (Black Belt) + printable
  certificate at `/academy/certificate`.
- **Third-party-verifiable credential** (Certifier, free tier 250/yr):
  `src/lib/certifier.ts` `ensureCredential()` issues once per user and stores
  the public URL in `me_awards.credential_url`; certificate page shows a
  "View verified credential" button (LinkedIn share on Certifier's page).
  Design template "Masters Edge Black Belt" lives in app.certifier.io; source
  art `public/academy/certificate/certifier-background.jpg`. If Certifier is
  down or env unset, badge + printable certificate still work; the button is
  hidden and the next page visit retries issuing.
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
| Course ownership (paywall) | `src/lib/academy-access.ts`, `src/lib/stripe.ts` |
| Lesson media on R2 (gate, links, build step) | `src/app/api/media/academy/[slug]/[file]/route.ts`, `src/lib/media-gate.ts`, `src/lib/r2-presign.mjs`, `scripts/academy-media-r2.mjs`, `next.config.ts` (rewrite) |
| Checkout / webhook / return | `src/app/api/academy/checkout`, `src/app/api/stripe/webhook`, `src/app/academy/checkout/success` |
| DB helpers (XP, badges, certify) | `src/lib/academy-db.ts` |
| Content (modules, quizzes, exam) | `src/content/academy/modules.ts` |
| Lesson Forge (new lessons end-to-end) | `scripts/academy-lesson.mjs`, `scripts/academy-lesson-schema.json`, `docs/lms/*`, `~/dev/audiobook-studio/narrate.sh` |
| Badges + belts | `src/content/academy/badges.ts` |
| Member APIs | `src/app/api/academy/*` |
| Admin API + page | `src/app/api/hub/academy/route.ts`, `src/app/hub/academy/page.tsx` |
| Member pages | `src/app/academy/*` |
