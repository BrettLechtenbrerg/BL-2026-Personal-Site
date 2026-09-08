# BL 2026 Personal Site — Next Session Restart Prompt

**Updated:** September 8, 2026 (end of Session 30)

A copy of this file is also at `~/Desktop/BrettLechtenberg-Site-RESUME-PROMPT.txt`.
Paste the block below into a fresh session.

---

```
Resume work on brettlechtenberg.com (Master's Edge Academy LMS).

Repo: /Users/brettlechtenberg/dev/BL-2026-Personal-Site  (ONLY this path)
Live: https://www.brettlechtenberg.com   Deploy: `npx vercel --prod --yes`
      (Vercel's GitHub auto-deploy is NOT firing — always deploy via CLI;
       the CLI often times out waiting, that's fine — check `npx vercel ls --prod`)

READ FIRST, in order:
  1. docs/SESSION-NOTES.md  — top section (Session 30) + "END OF SESSION STATE"
  2. docs/ACADEMY.md        — how the Academy is built; "Paywall" section
  3. CLAUDE.md              — project rules + page inventory

FIRST COMMANDS:
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site pull
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site status

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
