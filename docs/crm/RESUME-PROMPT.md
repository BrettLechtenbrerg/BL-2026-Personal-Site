# Edge CRM (GHL replacement) — Resume Prompt

**Updated:** September 6, 2026 (end of Phase 0)

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

STATE: Phase 0 DONE. No CRM code written yet.
  ✅ Twenty Cloud workspace: brettlechtenberg.twenty.com (has AI-generated sample
     fields + a "New opportunity follow-up" workflow — reshape via API later)
  ✅ Vercel env (production, sensitive): TWENTY_API_KEY, RESEND_API_KEY
  ✅ Twenty MCP wired in Claude Code (user scope, OAuth) — Claude can read/write the CRM
  ✅ Resend: existing Free account, auth.brettlechtenberg.com verified
  ✅ Phase 1 plan approved (docs/crm/04-PHASE1-PLAN.md)
  ⏳ Cal.com account — not created yet (needed in Phase 3)
  ⏸ SMS/Twilio — paused by Brett until Phase 6

NEXT: BUILD Phase 1 per docs/crm/04-PHASE1-PLAN.md (approved Sept 6).
  Work items 1-9 in order; site forms stay on GHL; delete ghl-*.ts only after
  the manual test passes. Env already set: TWENTY_API_KEY, RESEND_API_KEY,
  HUB_REPLY_TO_EMAIL. Still needed from Brett: RESEND_WEBHOOK_SECRET (create
  webhook in Resend dashboard pointing at /api/webhooks/resend).
```

---

## Quick facts

- **Twenty:** https://brettlechtenberg.twenty.com — Settings → MCP & APIs for keys/webhooks.
- **Resend:** shared with Speaker's Edge (`speakers-edge-next` ADR 0003). 100 emails/day cap on Free.
- **GHL still live** on BL until Phase 5 cutover; env vars `GHL_*` untouched so far.
- **Other sites:** PMMA and TSAI are NOT in scope until the BL pilot passes its definition of done.
- **Source of truth is `docs/crm/` in this repo.** The only Desktop copies are this resume prompt (`~/Desktop/EDGE-CRM-RESUME-PROMPT.md` and `~/Desktop/Resume Prompts/`); the analysis/architecture/plan docs live here only.
