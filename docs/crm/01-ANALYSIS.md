# Replacing GoHighLevel — Analysis & Recommendation
**Date:** Sept 6, 2026 · **Status:** ANALYSIS ONLY — nothing built. Decision owed by Brett.
Sources: repo audits of BL-2026-Personal-Site, PMMA-Website-2026-Master, TSAI-Site + `docs/CUSTOM-CRM-IDEA.md`; vendor docs/GitHub verified today.

---

## 1. What GHL actually does for you today (audited from code)

| Site | GHL jobs still in use | Notes |
|---|---|---|
| **BrettLechtenberg.com** | 5 inbound webhooks (book-brett, Master's Edge apply, ebook, workbook, team-lead) · booking widget (`utils.ts`) · Comms Hub reads/sends via GHL Contacts + Conversations API | Email already lands in **spam** (no sending domain); SMS **parked** (no number). Little to lose. |
| **PersonalMasteryMartialArts.com** | 7 webhook URLs · 4 event workflows + 7 outreach branches · Messaging Center (SMS carrier, A2P registered) · 3 calendar widgets | **Supabase is already the system of record** (students, attendance, stripes, waivers, Laser List). GHL = "3-job mailman". Team uses Messaging Center daily. |
| **TotalSuccessAI.com** | Embedded GHL form (contact/terms) · ~12 registration API routes POSTing to hard-coded GHL webhooks · quiz lead (webhook URL never set) | No SMS, no Supabase, email-only. Easiest to move. |

**The wall (why leave):** GHL has **no public workflow-builder API**. Every automation ends in "paste this into the GHL UI" — Claude can't finish the job. Verified again via the 92-tool GHL MCP in `~/dev/ai-chief-of-staff` (list/enroll only).

**Business caveat:** TSAI *sells* GHL setup ("AI Chief of Staff" configures GHL for clients; `/tools/ghl-webhook-wizard`). You may need to keep one GHL account for **client work** even after your own businesses leave — or turn the replacement into the product ("own your CRM, AI runs it"), which is on-brand.

---

## 2. What a "solid CRM" needs — and who provides it

Contacts + custom fields + tags · pipelines/opportunities · notes/tasks/timeline · two-way SMS + email inbox · booking · forms · drip automations · broadcasts · consent/opt-out · reporting.

### Verified landscape (Sept 2026)

| Category | Winner | Why | Runner-up |
|---|---|---|---|
| **CRM UI (pipelines, tasks, timeline)** | **Twenty** (AGPL, 56k★, released this week; self-host free, cloud $9/user) | Workflows, pipelines, objects are plain JSON records over REST/GraphQL → Claude can create/diff/PUT them. Gmail/Calendar sync. No native SMS (HTTP action → Twilio). | Krayin (MIT, lighter), Mautic 7 (deepest drip campaigns, API-definable, heavy PHP) |
| **Drip / sequence engine** | **Vercel Workflows** (GA; `'use workflow'`, sleep minutes→months, hooks for "wait for reply") | Lives inside your existing Next.js repos, no extra server, plain TypeScript = Claude's native language. | Inngest (7-day sleep cap on free), n8n self-host (visual editor if the team wants one; workflows are JSON + API) |
| **SMS** | **Telnyx** (~$0.004/seg, $2/mo campaign, 10DLC fully API-driven, STOP handled + surfaced in webhook) | ~half Twilio cost. | **Twilio** if you want Chatwoot/n8n/Twenty ecosystem plug-ins |
| **Email** | **Resend** (free 3k/mo; Pro $20; Broadcasts for newsletters; auto-unsubscribe) | Best API, React Email templates. | Postmark ($15), Brevo (email+SMS, but no automation API) |
| **Booking** | **Cal.com Cloud** (Free 1 user; Teams $12/user for round-robin) via `@calcom/embed-react` + webhooks | ⚠️ Cal.com went **closed-source Apr 2026**; the OSS fork "Cal.diy" is labeled *non-production*. Don't self-host. | SavvyCal ($10), Calendly API |
| **Team inbox** | **Reuse your Power Hub / Comms Hub inbox** (already built + ported twice) pointed at Telnyx/Resend inbound webhooks | Zero new infra. | Chatwoot CE (MIT) if team needs mobile app / assignment |

**Rejected:** HubSpot (workflow API sunsets Mar 2027, no free workflows) · Attio (no workflow API) · Brevo automation (no API) · Dittofeed (dormant since Mar 2026) · EspoCRM (workflows paywalled) · Papercups (maintenance mode) · Temporal (overkill).

---

## 3. Options

### Option A — "Own it": one central **Edge CRM** app (RECOMMENDED)
New repo, one Vercel deploy, one Supabase, **multi-tenant by business** (PMMA / BL / TSAI / P4P / MACC…) — mirrors GHL's sub-accounts.
- Contacts, consent, messages ledger, sequences, templates, pipelines in Postgres.
- Vercel Workflows = automations (Claude writes them as TS files; PR-reviewable, testable).
- Telnyx SMS + Resend email adapters. Cal.com embeds + webhooks.
- UI = the Power Hub Messaging Center you already own, generalized.
- The 3 sites change **one thing**: webhook URLs point at Edge CRM instead of GHL.
- PMMA students/attendance/stripes **stay in the PMMA repo** — only leads + messaging move.

**Cost:** ~$35–60/mo (cheap) · ~$130–200/mo (Twilio + Resend Pro + Cal Teams).
**Effort:** ~1 week to run parallel on one flow; 3–5 weeks to migrate all 3 sites.
**Risk you own:** A2P 10DLC re-registration (1–3 weeks carrier approval — **the critical path**), email domain auth/warmup, deliverability reputation.

### Option B — Twenty CRM + the same messaging layer
Same as A but Twenty supplies the pipeline/tasks/timeline UI instead of building it. Adds one VPS (~$20/mo) to babysit; contacts split between Twenty and Supabase (sync work); workflow-step schema is undocumented internally.
**Switch to B when:** you find yourself missing kanban pipelines, tasks, and Gmail sync badly enough to run another server.

### Option C — Stay on GHL, move logic out
Keep GHL only as SMS/email carrier; put sequencing in Vercel Workflows. Least effort, but keeps the fee and the wall, and still no workflow API.

---

## 4. Recommended migration order
1. **Start 10DLC registration at Telnyx (or Twilio) today** — it's the long pole. Ask GHL whether the PMMA number can port out of LC Phone; otherwise get a new number and re-register brand + campaign.
2. **TSAI first** (email-only, ~12 webhooks, no team): prove the stack end-to-end.
3. **BL second** (Comms Hub already abstracted behind `src/lib/ghl-*.ts` — swap adapters; booking → Cal.com embed).
4. **PMMA last** (team + SMS + 11 workflows): run Laser List in parallel as pilot, then event workflows one at a time.
5. Cancel GHL for owned businesses; keep an agency account only if client work needs it.

---

## 4b. Confirmed requirement (Sept 6): pipeline board with stage-change triggers
PMMA uses GHL Opportunities daily — e.g. appointment missed → card moved to "Missed" → rebook workflow fires.
So the replacement MUST have: kanban board · drag-to-stage · stage-change fires a workflow · calendar no-show auto-moves the card.

| | Option A (build) | Option B (Twenty) |
|---|---|---|
| Board + drag | Build (~2–3 days; one `opportunities` table + board page in Power Hub) | Built-in, polished |
| Stage change → workflow | Trivial: DB trigger/route starts a Vercel Workflow | Built-in "record updated" trigger → HTTP/webhook step |
| Missed appointment → auto-move | Cal.com `no_show` webhook → update stage → workflow | Cal.com webhook → Twenty API → workflow |
| Extra infra | None | One VPS + contact sync with Supabase |

Verdict unchanged: **A**, with the board scoped into week 1–2. B only if the team wants a richer prebuilt UI (tasks, timeline, Gmail sync) more than simplicity.

## 5. Decisions needed from Brett before any code
1. **Option A (build central Edge CRM) vs B (Twenty + messaging) vs C (stay)?** → My pick: **A**.
2. **SMS provider:** Telnyx (cheaper, API-first) vs Twilio (ecosystem)? → My pick: **Telnyx**, Twilio if you want Chatwoot later.
3. **Keep a GHL account for TSAI client work?** (affects whether the "GHL webhook wizard" / Chief-of-Staff GHL connector stays a product.)
4. **Current GHL monthly cost** (sets the savings number and justifies scope).
5. **Does the PMMA team need a visual workflow editor**, or is code-as-source-of-truth (Laser List pattern) acceptable? → Determines whether n8n is added.
