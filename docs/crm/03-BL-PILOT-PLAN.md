# BrettLechtenberg.com — GHL Replacement Pilot Plan
**Date:** Sept 6, 2026 · **Status:** PLAN FOR REVIEW — nothing built.
**Repo:** `/Users/brettlechtenberg/dev/BL-2026-Personal-Site` (only). PMMA + TSAI untouched.
Companions: `CRM-REPLACEMENT-ANALYSIS.md`, `EDGE-CRM-ARCHITECTURE.md`.

---

## Goal
Run brettlechtenberg.com with **zero GHL** — same SMS/email power you have in GHL today, plus what GHL can't do: Claude builds/attaches automations and moves people through stages by conversation.

## What SMS you can do today in GHL → what you'll have after

| GHL today | After (Twilio direct) |
|---|---|
| Send SMS to a contact from a workflow | Workflow step `sms(contact, text)` — Claude writes it |
| Two-way inbox, reply from UI | Hub Inbox tab (already built) fed by Twilio inbound webhook |
| Bulk/blast SMS to tagged list | Hub Compose tab (already built) — swap adapter only |
| Appointment reminders (24h / 1h) | Cal.com booking webhook → workflow with `sleep()` → SMS |
| STOP/HELP opt-out | Twilio Advanced Opt-Out (carrier-side) + consent recorded in Supabase |
| Missed-call text-back | Twilio voice webhook → SMS (add later if wanted) |
| Merge tags `{{contact.first_name}}` | Same merge tags — `messaging-render.ts` already does this |
| Delivery status | Twilio status callback → `hub_messages.status` |

**DECISION (Sept 6): SMS is PAUSED until the rest of the system is built.** Everything ships email-first; the `sms()` step is stubbed to log-only until a Twilio number is added. Adding it later = Phase 6, no re-architecture (adapter + env vars).

**Calendar:** keep your **existing Google Calendar** — the same one GHL syncs today. Cal.com connects to it (two-way: busy times block slots, bookings write events). Nothing moves; GHL's connection is simply disconnected at cutover.

---

## Architecture (BL only)

```
 brettlechtenberg.com forms ──► /api/lead ──► spam gate ──► Supabase contacts
   (book-brett, ME apply,          │            (honeypot+timing+Turnstile+       │
    ebook, workbook, team)         │             rate limit+email/phone check)    ▼
                                   │                                    Twenty CRM (board, notes,
                                   ▼                                    Gmail sync, MCP ← you talk)
                         Vercel Workflow (TS file per automation)               │ stage-change webhook
                            sleep · branch · sms() · email()  ◄─────────────────┘
                                   │            │
                              Twilio SMS    Resend email
                                   ▲
                    Twilio inbound + status webhooks ──► /api/twilio ──► hub_messages ──► /hub Inbox
 Cal.com (embed replaces GHL widget) ──► /api/cal ──► booked / no-show ──► workflow
 Stripe (Academy, books, ME program) ──► /api/stripe ──► purchased stage ──► welcome workflow
```

---

## Phases

### Phase 0 — Accounts (Brett, ~1 hr, no code)
- [ ] ~~Twilio~~ — PAUSED (Phase 6).
- [x] Resend: **use the existing Free account** (set up July 17 for Speaker's Edge; `auth.brettlechtenberg.com` verified). Brett mints a **second send-only API key** for BL → Vercel env `RESEND_API_KEY`. Test sends go from `auth.brettlechtenberg.com`. Free limits: 3k/mo, **100/day**, one domain. Upgrade to Pro ($20, proper `mail.` domain + broadcasts) only at cutover if needed.
- [ ] Cal.com Cloud free: connect the **existing Google Calendar** (same Google account GHL uses), create "Speak with Brett" event with Zoom link.
- [ ] Twenty Cloud ($9): create workspace, generate API key, note MCP URL.
- [ ] Stripe: create restricted key (webhooks read) — only if Academy/book sales should update the CRM.
- [ ] Tell me current GHL monthly cost (for the record).

### Phase 1 — Messaging rails, email-first (Claude, ~2 days)
- Supabase: `contacts`, `contact_consent`, extend `hub_messages` (provider_id, status, direction, channel).
- `src/lib/messaging/resend.ts` (send + Resend inbound/status webhooks) and a `sms.ts` **stub** (logs, returns `paused`) so workflows compile now and light up later.
- Hub: replace `ghl-messaging.ts` / `ghl-conversations.ts` / `ghl-leads.ts` / `ghl-contacts.ts` (801 lines) with Resend/Supabase adapters. **UI unchanged**; SMS toggle shows "paused".
- Test: send email from Hub → inbox; reply → Inbox tab (Resend inbound); unsubscribe → consent flips.

### Phase 2 — Lead intake + spam gate (Claude, ~2 days)
- Single `/api/lead` with `form_id` allow-list (mirrors PMMA `botDefense.ts` — port it).
- Add Cloudflare Turnstile (free) + rate limit + disposable-email/phone validation + "Review" quarantine.
- Repoint 5 forms: book-brett, masters-edge apply, EbookModal, workbook-lead, team-lead. Remove hardcoded GHL webhook URLs.
- Lead → Supabase → Twenty person + opportunity (pipeline per source: Speaking / Master's Edge / Ebook).

### Phase 3 — Automations + booking (Claude, ~3 days)
- Vercel Workflows in `src/workflows/`:
  - `speaking-inquiry`: email w/ Cal.com + Zoom link → 2d → email nudge → 3d → task for Brett.
  - `masters-edge-apply`: confirmation → notify Brett (email) → 1d follow-up.
  - `ebook-delivery`: send PDF → 3d value email → 7d ME invite.
  - `booking-reminders`: on Cal.com booked → email 24h + 1h before, with Zoom link (Cal.com can also send these natively).
  - `rebooking`: on no-show or stage = Missed → email w/ link → 2d second email → task.
  - Each has an `sms()` line already in place, commented `// paused until Phase 6`.
- `/api/cal` webhook (booked / rescheduled / cancelled / no-show).
- Replace GHL booking widget (`utils.ts`) with `@calcom/embed-react`.
- Twenty stage-change webhook → `/api/twenty` → start matching workflow.

### Phase 4 — Talk to it (Claude, ~1 day)
- Twenty MCP added to Claude Code/Desktop config (OAuth).
- Small **Edge MCP** (`send_sms`, `send_email`, `start_workflow`, `set_consent`, `lead_lookup`) so "XX missed, move to rebooking" works in one sentence.
- Optional: Stripe webhook → "Purchased" stage → welcome workflow.

### Phase 5 — Cutover (~½ day)
- Parallel-run 1 week (leads go to both GHL + new stack). Compare.
- Flip: remove GHL env vars, delete PIT token, remove `ghl-*.ts`, disconnect Google Calendar from GHL.
- Cancel BL GHL location (keep agency account if TSAI client work needs it).

### Phase 6 — SMS (when Brett says go, ~1 day)
- Buy BL Twilio number → add to existing brand as a campaign → Advanced Opt-Out on.
- Fill in `sms.ts`, add `/api/twilio/inbound` + `/status` (signature-verified), STOP → consent.
- Uncomment `sms()` lines in workflows. Hub SMS toggle live. Test the table at the top of this doc.

---

## Cost (BL only)
Resend $0 · Cal.com $0 · Twenty $9 · Vercel Workflows $0 → **~$9/mo** (Twilio adds ~$5–10 in Phase 6).

## Risks
- **Campaign approval** when SMS is switched on: days, occasionally 1–2 weeks — start it a couple of weeks before Phase 6.
- **Email warmup:** send low volume first week from the new domain.
- **Twenty Cloud** is a new vendor; export is plain Postgres/CSV; self-host escape hatch exists (AGPL).
- **Secrets:** Twilio auth token, Resend key, Twenty key, Turnstile secret live only in Vercel env — never in git.

## Definition of done (Phases 1–5)
1. Fill the book-brett form → email with booking link arrives; card appears in Twenty.
2. Book on Cal.com → event lands on your existing Google Calendar; confirmation + reminder emails with Zoom link.
3. Say "Sarah missed her call, move her to rebooking" → card moves, rebooking email goes out.
4. Unsubscribe → no further email; Hub shows opted-out.
5. Spam submission → blocked or quarantined, never triggers a message.
6. No `leadconnectorhq.com` left in the repo.

## Decisions
- ✅ Google Calendar: keep existing one (Sept 6).
- ✅ Booking tool: **Cal.com** (Zoom in invites is required; Google booking page = Meet only, TidyCal = no webhooks) (Sept 6).
- ✅ Twenty Cloud workspace created: `brettlechtenberg.twenty.com` (Sept 6).
- ✅ SMS: paused until system is built; Phase 6 (Sept 6).
- ✅ Resend: stay on existing Free account, `auth.` subdomain, as the test rail (Sept 6).
- Open: Twenty Cloud ($9) or self-host? → **Cloud** for the pilot.
- Open: Stripe → CRM hook now or later? → **Later** (Phase 4 optional).
