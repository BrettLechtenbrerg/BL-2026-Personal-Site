# Edge CRM — Cost, Twilio, and How It All Fits
**Date:** Sept 6, 2026 · Companion to `CRM-REPLACEMENT-ANALYSIS.md` · Nothing built yet.

---

## 1. Monthly cost (all 3 businesses)

| Piece | Job | Cost / mo |
|---|---|---|
| **Twilio** (yours, kept) | SMS send/receive, 10DLC already registered | ~$1/number + ~$0.0083/msg → **$25–40** at 3k msgs |
| **Resend** | Email: transactional + newsletters (Broadcasts) | Free ≤3k emails · **$20** Pro (50k) |
| **Cal.com Cloud** | Booking pages, Google Calendar sync, no-show webhooks | **$0** (1 user) · $12 for round-robin/team |
| **Twenty CRM** | Contacts, kanban pipelines, tasks, Gmail sync, **built-in MCP** | Cloud **$9/user** *or* self-host ~$20 VPS |
| **Vercel Workflows** | Drip sequences ("wait 2 days → SMS") | **$0** inside your existing Vercel plan (50k events free) |
| **Supabase** | Already paid; PMMA students/attendance stay here | **$0 extra** |
| **Zoom** | Already have | $0 |

**Estimate: $55–90 / mo total.** (Twenty Cloud, Resend Pro, Twilio at 3k msgs.)
Cheapest: ~$35 (Resend free, Twenty self-host on VPS you already run).
**vs. GHL:** you tell me the current bill — typical is $97–$497 + LC Phone usage.

---

## 2. Twilio — keep it. Zero re-registration.

Your GHL sends SMS through **your own Twilio account** (the "Twilio / email rails" in `docs/POWER-HUB-MESSAGING.md`). That means:
- The **phone number, A2P brand, and campaign belong to you**, not GHL.
- Migration = change the number's **inbound webhook** in Twilio console from GHL's URL to Edge CRM's URL. **5 minutes. No carrier approval. No downtime.**
- STOP/HELP opt-outs: Twilio Advanced Opt-Out keeps handling them; Edge CRM just records the state.
- **Verify first:** Twilio Console → Phone Numbers → is the PMMA number listed? If instead it's "LC Phone" (GHL-owned), we'd port it out (2–4 weeks) or buy a new one and re-register (~1–3 weeks). Either way Twilio stays the provider.

---

## 3. The diagram

```
                        YOU (plain language)
                 "Create a workflow for my booking calendar…"
                 "XX missed their appointment, move them to rebooking"
                                  │
                                  ▼
        ┌─────────────────────────────────────────────────────┐
        │   CLAUDE  (Claude Code / Desktop / AI Chief of Staff) │
        │   • writes workflow files  → git push → Vercel        │
        │   • calls Twenty MCP        → move card / add note     │
        │   • calls Edge MCP          → send SMS / start sequence│
        └───────────┬────────────────────────────┬─────────────┘
                    │ MCP (built-in)             │ MCP (we build, ~50 lines)
                    ▼                            ▼
┌───────────────────────────┐        ┌──────────────────────────────────┐
│  TWENTY CRM  (the brain)  │◄──────►│  EDGE CRM  (the hands)           │
│  people · companies       │ webhook│  Next.js on Vercel + Supabase    │
│  opportunities (kanban)   │  + API │  /api/lead      ← site forms     │
│  stage-change triggers    │        │  /api/twilio    ← inbound SMS    │
│  tasks · notes · Gmail    │        │  /api/cal       ← bookings/no-show│
│  workflows (JSON via API) │        │  Vercel Workflows = drips        │
└───────────────────────────┘        │  messages ledger · consent       │
                                     │  Power Hub inbox (already built) │
                                     └───┬─────────┬──────────┬────────┘
                                         │         │          │
                          ┌──────────────┘         │          └──────────────┐
                          ▼                        ▼                         ▼
                  ┌──────────────┐        ┌───────────────┐         ┌───────────────┐
                  │   TWILIO     │        │    RESEND     │         │   CAL.COM     │
                  │  SMS in/out  │        │ email + news  │         │ booking + Zoom│
                  │  (yours)     │        │               │         │ Google Cal    │
                  └──────────────┘        └───────────────┘         └───────────────┘
                          ▲                        ▲                         ▲
                          └────────────────────────┴─────────────────────────┘
                                                   │
                        ┌──────────────────────────┴──────────────────────────┐
                        │  BrettLechtenberg.com · PMMA.com · TotalSuccessAI.com│
                        │  forms POST to /api/lead  · Cal.com embed on pages   │
                        │  (PMMA students/attendance/stripes stay in PMMA repo)│
                        └─────────────────────────────────────────────────────┘
```

**Two roles, on purpose:**
- **Twenty = brain** — where humans look: the board, who's in what stage, notes, tasks, Gmail threads.
- **Edge CRM = hands** — where things happen: sends, waits, webhooks, ledger. Code Claude owns.

---

## 4. Your two examples, end to end

### Example A — "Create a workflow so lead-form fillers get my booking + Zoom link"
1. You say it. Claude writes `workflows/lead-booking-invite.ts`:
   ```
   on lead created (source = website)
     → create person + opportunity in Twenty (stage: New Lead)
     → Resend email: booking link (Cal.com) + Zoom link
     → sleep 2 days
     → if no booking yet: SMS nudge via Twilio
     → sleep 3 days
     → if still none: move opportunity → "Cold", task for Brett
   ```
2. Claude commits + deploys. Live in ~2 minutes. Editable forever by talking.
3. When they book, Cal.com webhook → Edge CRM → moves card to **Booked**, sends confirmation with Zoom link.

### Example B — "XX missed their appointment, move them to rebooking"
**Manual path:** you tell Claude → Twenty MCP finds XX → moves card to **Missed** → Twenty fires its stage-change webhook → Edge CRM starts `rebooking-sequence` (SMS "sorry we missed you, grab a new time: link" → wait 1 day → email → wait 2 days → task for staff).
**Automatic path (no you needed):** Cal.com marks no-show → webhook → same thing.

---

## 5. Build order (once you say go)

| Week | Work | Result |
|---|---|---|
| **0** | Confirm Twilio number ownership · Twenty Cloud trial · Resend domain DNS · Cal.com account + Zoom link | Accounts ready, nothing broken |
| **1** | Edge CRM repo: `/api/lead`, `/api/twilio`, `/api/cal`, Twilio + Resend adapters, messages/consent tables, Edge MCP | Can send, receive, log |
| **2** | Twenty: pipelines per business, stage-change webhooks → Edge; first 2 workflows (Examples A + B) | **TSAI** switched over (email-only, safest) |
| **3** | BL site: swap `ghl-*.ts` adapters, Cal.com embed replaces GHL widget | **BL** switched over |
| **4–5** | PMMA: Laser List pilot in parallel with GHL → 4 event workflows → 7 outreach branches → flip Twilio webhook | **PMMA** switched; cancel GHL |

---

## 6. What you give up vs GHL (be honest)
- GHL's visual workflow canvas → replaced by *talking to Claude* + readable TS files. Team can't drag boxes; they *can* read the file.
- One login → now two UIs: Twenty (board) + Power Hub (messaging). Could later embed Power Hub inbox inside Twenty; not day-one.
- GHL funnels/websites/forms builder → you already build sites in Next.js; unaffected.
- Reputation & deliverability → yours to own (domain auth done once; Twilio unchanged).
