# BL 2026 Personal Site — Next Session Restart Prompt

**Updated:** September 27, 2026 (end of Session 32: website copy + one-sheets)
**Since then:** Oct 9, 2026, Session 33: TSAI logo image fixed on /about and /ai-advisory (`0def7f4`, live). Nothing else changed; the state below still holds.

A copy of this file is also at `~/Desktop/BL - Brett Lechtenberg/Projects/_Resume Prompts Archive/Collected 2026-09-28/From Desktop/BrettLechtenberg-Site-RESUME-PROMPT.txt`
(filed off the Desktop 2026-09-28; move log: `~/Documents/File Organization Records/2026-09-28/MOVE-LOG.md`).
Paste the block below into a fresh session.

---

```
Resume work on brettlechtenberg.com (website, speaker one-sheets, and the Master's Edge Academy LMS).

Repo: /Users/brettlechtenberg/dev/BL-2026-Personal-Site  (ONLY this path)
Live: https://www.brettlechtenberg.com   Deploy: `git push origin main`
      (Vercel GitHub auto-deploy fired on every push Sep 27 2026, ~5-9 min per build;
       check `vercel ls --yes`. Fallback only if nothing builds: `npx vercel --prod --yes`)
      PUSH NOTE: the Mac's active gh account is PMMARocks, which gets 403 on this repo.
       Run `gh auth switch -u BrettLechtenbrerg` before pushing (or push with that token).

ADD A LESSON (the usual job now — one line, the `academy` skill does the rest):
  Take ~/Desktop/<file> and add it as a lesson in the business-tools course in the BL.com academy.
  Cheat sheet: ~/Desktop/LMS-HOW-TO.md · prompts: ~/dev/academy-forge/docs/lms/PROMPTS.md · resume: Academy: resume ~/Desktop/LMS - <Title>/

ACADEMY ENGINE (Sep 19 2026): the Academy is now the shared **Academy Forge** engine
  (~/dev/academy-forge — one engine, four brands: BL.com · PMMA · TSAI · GIFT CONNECT).
  BL is consumer #1. Engine files under src/app/academy, src/components/academy, src/lib/academy-*
  are OVERWRITTEN by `bash ~/dev/academy-forge/install.sh bl` — fix engine bugs in the Forge, then reinstall.
  Brand values: src/content/academy.config.ts (generated from brands/bl/academy.json). Tag `pre-academy-forge` = before.

READ FIRST, in order:
  1. docs/SESSION-NOTES.md  — top section (Session 31: Lesson Forge; Session 30: paywall)
  2. docs/ACADEMY.md        — how the Academy is built; "Paywall" section
  3. CLAUDE.md              — project rules + page inventory

FIRST COMMANDS:
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site pull
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site status

STATE AT END OF SESSION 32 (Sep 27, 2026) — everything committed, pushed, deployed, verified live:
- Did ALL of Website-Fixes-For-Coding-Agent.md (tasks 1-5) and
  Speaker-Sheet-Changes-For-Coding-Agent.md (both now in ~/Desktop/Brett's Personal File Website -
  Resume - Coaching Programs 2026/Website and Speaker One-Sheet - Sept 2026/). Brett's writing rules = section 2
  of the website file; the terminology rules are now in CLAUDE.md "Credential Standards".
- /speaking: new wording, testimonials (Lindsey Powers under the reel; Danny Larson,
  Sam Beard, Bill Schuffenhauer in grid), Flow Research Collective pull quote, gallery
  captions with real event names, logo strip in Brett's client order (USA Martial Arts hidden).
- /media-kit: 10 talks, new bios/intros, reel under the one-sheet, Stage and Event Photos,
  Master's Edge cover. Talk subtitles now MATCH /speaking; A Category of One uses
  "Position Yourself So Far Ahead That Comparison Becomes Irrelevant" everywhere.
- /books: Powerful AI Strategies for Business Owners added (cover public/books/powerful-ai-strategies.jpg,
  Amazon dp/B0HH6YZYQV). The Master's Edge = "Coming October 2026".
- /masters-edge: Layer 1 The Science (Three Pillars: First Principles, Frontloading, Flow),
  Layer 2 The Methodology (Mind, Skills, Systems: Mindset Mastery, Skillset Enhancement,
  Systems Design), Layer 3 The Transformation. Workbook pairs them per week.
- Site-wide copy sweep: no em dashes, banned words, acronyms or AI-sounding phrasing
  (two bee sub-agents + manual passes).
- One-sheets rebuilt from scripts/one-sheet/*.html (website + agency), synced to all three
  branding folders. render.cjs now prints a page-fit check and accepts CHROMIUM_PATH.

ASK BRETT FIRST THING (he asked for this reminder, Sep 27 2026):
- DOUBLE-CHECK BILL SCHUFFENHAUER'S QUOTE. Three versions are live; ask Brett which
  is word-for-word what Bill said (and which title to use), then make all 6 places match:
    A "Brett really knows flow, peak performance, and goals. I have been around a ton of
      business coaches and high-level performers, and Brett is a top-tier trainer,
      teacher, and coach."   <- src/app/speaking/page.tsx, src/app/masters-edge-program/page.tsx,
      src/components/sections/Testimonials.tsx (home), scripts/one-sheet/one-sheet.html
    B "Brett knows flow, peak performance and goals. I have been around a ton of business
      coaches and high level performers and Brett is a top tier trainer, teacher and coach."
      <- src/app/testimonials/page.tsx
    C "Brett really knows how to increase flow states and peak performance. I have been
      around a ton of business coaches and high-level performers, and Brett is a top-tier
      trainer, teacher, and coach."   <- scripts/one-sheet/agency-one-sheet.html
  Titles also vary: "3-Time Olympian" (speaking, website one-sheet); "Olympic Silver
  Medalist & 3x Olympian" (testimonials); "Olympic Silver Medalist, 3x Olympian" (home);
  "3x Olympian, Olympic Silver Medalist" (program); "Olympic Silver Medalist &
  3-Time Olympian" (agency one-sheet). After editing either one-sheet HTML, re-render it
  and run scripts/one-sheet/sync-branding-assets.sh. Do NOT change the quote without his answer.

OPEN QUESTIONS FOR BRETT (nothing blocked; don't guess):
- /books lists 8 titles but the site says "seven books, five bestsellers": which isn't counted?
- Pull-up banner (scripts/one-sheet/pullup-banner.html) still says "8 U.S. Presidents";
  one-sheets and website now say "8 United States Presidents". Re-render banner if Brett wants.
- Agency one-sheet page 2 bottom sits ~0.3in into the margin (was like this before Sep 27;
  nothing is cut off). Tighten only if Brett asks.

STATE AT END OF SESSION 31 (Sep 19, 2026):
- Academy Lesson Forge built: scripts/academy-lesson.mjs (init/validate/add/price/
  produce/narrate/ship/status/run), lesson.json schema, docs/lms/*, skill
  ~/.gg/skills/academy.md, narration via ~/dev/audiobook-studio/narrate.sh
  (Kokoro am_michael). Parked ideas: docs/lms/PARKED.md.

STATE AT END OF SESSION 30 (Sep 8, 2026) — everything committed, pushed, deployed:
- Academy per-course PAYWALL is LIVE and smoke-tested in production.
  Signup is free/open (enrollment code EDGE2026 is RETIRED). Each course is a
  one-time Stripe purchase: Framework $99, Business Tools $499, Reclaiming the
  Clock $499, Master's Edge Book $999 — or free with that course's gift code:
  FRAMEWORK-3CTT · TOOLS-V384 · CLOCK-2JJU · BOOK-SXBP (unlimited redemptions).
  Ownership = me_course_access table. Brett's account owns all 4 (legacy).
- Stripe: account "Brettlechtenberg" (acct_16xJo3Kq6AqfCeIO), LIVE mode.
  Products/prices/coupons/webhook all created there. Secret key is in Vercel
  prod + .env.local only (rotate with scripts/add-stripe-key.sh). Stripe CLI is
  paired to that account (`stripe login` if it expired).
- Code map: src/lib/academy-access.ts (ownership), src/lib/stripe.ts,
  api/academy/checkout, api/stripe/webhook, academy/checkout/success,
  modules/[slug]/page.tsx (server-side Locked panel), ModulesGrid (Unlock button).
- NotebookLM batch FINISHED all 43 modules Sep 8 16:16 UTC; LaunchAgent unloaded.
  Nothing is running in the background.
- Brett's operator one-pager: ~/Desktop/Academy-Course-Access-Guide.pdf
  (regenerate: python3 scripts/academy-onepager.py ~/Desktop/Academy-Course-Access-Guide.pdf)

KNOWN LIMITS / IDEAS (not started):
- Media files under public/academy/<slug>/ are public by URL (lesson text,
  flashcards, quizzes ARE gated). Upgrade: private Supabase Storage + signed URLs.
- Gift codes are unlimited-use; make single-use ones in Stripe → Coupons when needed.
- Preview mode still ON inside owned courses (all modules open); linear
  unlock is one commented line in unlockedSlugs() (src/content/academy/modules.ts).
- Sizzle-reel homepage placement (see STATE.md). Quizzes stay hand-written.

Supabase project ref: yrfsquzzbgnmkfbuapfk (Comms Hub + Academy share it).
If paused, docs/SESSION-NOTES.md has the one-line restore command.
Management API token is in macOS Keychain: security find-generic-password -s "Supabase CLI" -w
```

---

## Quick facts (if the docs are unavailable)

- **Working dir:** `/Users/brettlechtenberg/dev/BL-2026-Personal-Site`
  (NEVER `~/Desktop/Claude Projects/...` — dead iCloud copy, corrupts git)
- **GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site
  (gh account `BrettLechtenbrerg`)
- **Academy admin:** `brett@brettlechtenberg.com` (`me_users.role = 'admin'`);
  signup is open (no code); admin review at `/hub/academy`.
- **Stripe:** dashboard.stripe.com → account **Brettlechtenberg** (not
  "Personal Mastery M…"). Webhook endpoint `we_1UDY6lKq6AqfCeIObUIYlrqP`.
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
