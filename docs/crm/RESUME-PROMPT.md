# Edge CRM (GHL replacement) — Resume Prompt

**Updated:** September 6, 2026 (Phase 1 shipped · Phase 2 plan drafted, awaiting approval)

**How to restart:** open a new session and say
> "I want to work on the CRM system for brettlechtenberg.com — read `~/Desktop/EDGE-CRM-RESUME-PROMPT.md` and pick up where we left off."

That file is a copy of this one. All project docs live in the repo at `docs/crm/`.

---

```
Resume the Edge CRM project — replacing GoHighLevel on brettlechtenberg.com (pilot).

Repo: /Users/brettlechtenberg/dev/BL-2026-Personal-Site  (ONLY this path)
Live: https://www.brettlechtenberg.com   Deploy: `npx vercel --prod --yes`

READ FIRST, in order:
  1. docs/crm/DECISIONS.md          — every decision so far (do not re-litigate)
  2. docs/crm/03-BL-PILOT-PLAN.md   — phases, what's done, what's next
  3. docs/crm/02-ARCHITECTURE.md    — diagram + how the pieces fit
  4. docs/COMMS_HUB.md              — the existing /hub we're re-wiring off GHL
  5. CLAUDE.md                      — project rules

FIRST COMMANDS:
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site pull --ff-only
  bash /Users/brettlechtenberg/dev/BL-2026-Personal-Site/scripts/academy-batch-ctl.sh status
  claude mcp list | grep twenty        # expect "✔ Connected"

The Academy NotebookLM LaunchAgent may still be running (auto commits + deploys
every 20 min). If running: pull before editing; don't deploy by hand mid-tick.

STATE: Phase 1 SHIPPED (commit 42ac491 + phone fix). /hub sends email via Resend,
  leads from Twenty, log + inbox from hub_messages. GHL fully out of the hub.
  ✅ Twenty Cloud workspace: brettlechtenberg.twenty.com (has AI-generated sample
     fields + a "New opportunity follow-up" workflow — reshape via API later)
  ✅ Vercel env (production, sensitive): TWENTY_API_KEY, RESEND_API_KEY
  ✅ Twenty MCP wired in Claude Code (user scope, OAuth) — Claude can read/write the CRM
  ✅ Resend: existing Free account, auth.brettlechtenberg.com verified
  ✅ Phase 1 built + verified live (docs/crm/04-PHASE1-PLAN.md)
  ✅ Migration 20260907090000_crm_phase1.sql applied in Supabase (bl-comms-hub)
  ✅ Vercel env also has UNSUBSCRIBE_HMAC_SECRET, HUB_USERNAME/PASSWORD reset
  ✅ Resend webhook live (all email events) → /api/webhooks/resend, secret in Vercel
  ⏳ Cal.com account — not created yet (needed in Phase 3)
  ⏸ SMS/Twilio — paused by Brett until Phase 6

NEXT: Get Brett's answers to the 4 Phase 2 decisions, then BUILD Phase 2.
  Plan: docs/crm/05-PHASE2-PLAN.md (drafted, NOT yet approved). Decisions open:
    1. Stages NEW→REVIEW→CONTACTED→BOOKED→MISSED→ENROLLED→LOST — OK or rename?
    2. One pipeline for all 5 forms (my pick) vs separate?
    3. Form submit = email-marketing consent w/ copy under button — OK?
    4. Delete /api/workbook-lead + /api/team-lead outright (my pick) vs alias?
    5. Dual-send to GHL until Phase 3 (my pick) vs clean cut?
  Brett understands: GHL stays live; BL forms just stop feeding it. Cancel = Phase 5.
  Brett's Phase 2 to-do: create free Cloudflare Turnstile site (~5 min) when asked.
```

---

## Quick facts

- **Twenty:** https://brettlechtenberg.twenty.com — Settings → MCP & APIs for keys/webhooks.
- **Resend:** shared with Speaker's Edge (`speakers-edge-next` ADR 0003). 100 emails/day cap on Free.
- **GHL still live** on BL until Phase 5 cutover; env vars `GHL_*` untouched so far.
- **Other sites:** PMMA and TSAI are NOT in scope until the BL pilot passes its definition of done.
- **Source of truth is `docs/crm/` in this repo.** The only Desktop copies are this resume prompt (`~/Desktop/EDGE-CRM-RESUME-PROMPT.md` and `~/Desktop/Resume Prompts/`); the analysis/architecture/plan docs live here only.
