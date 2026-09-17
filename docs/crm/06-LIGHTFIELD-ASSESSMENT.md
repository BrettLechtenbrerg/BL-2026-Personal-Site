# Lightfield (lightfield.app) — Competitive Assessment
**Date:** Sept 17, 2026 · **Status:** ANALYSIS ONLY — nothing built. Brett asked "is it legit, and can Edge CRM match it?"
Sources: lightfield.app home + /pricing (fetched today); press on the Sept 9, 2026 Series A (SiliconANGLE, Unite.AI, Contrary Research, SaaStr).

---

## 1. Is it legit? Yes.

- **Money:** $47M Series A announced Sept 9, 2026, led by a16z; Lightspeed, Coatue, Greylock, Maverick, Audacious, Alumni Ventures participated.
- **Team:** the Tome founders (Keith Peiris, Henri Liriani, ex-Meta). Tome hit ~25M users and a $300M valuation; they cut 70 → 7 in 2024, spent a year in stealth, relaunched as Lightfield Nov 2025.
- **Traction:** "5,000+ companies signed up" — company-reported signups, not paying customers, not audited.
- **Spin to ignore:** "world model of your business" = a contacts/accounts/deals graph with every email, transcript and Slack message attached and timestamped. Real and useful; not magic.

## 2. Can it deliver what it says? Mostly.

**Credible:** auto-capture from Gmail/Outlook/Calendar/Slack, meeting recording + transcription, self-updating records, natural-language queries over everything, API/MCP/CLI, email sequences. All well-trodden 2026 tech (Attio, Granola, Gong do pieces); Lightfield bundles it.

**Caveat 1 — built for someone else.** Target customer is a venture-backed B2B software company moving from founder-led sales to a sales team. Design assumes deals happen over email threads and Zoom calls between reps and buyers. BL / PMMA / TSAI run on website forms, SMS to parents, booking pages, event follow-up. Different animal.

**Caveat 2 — the agent claims are the soft part.** "Finds prospects that look like your best customers and books meetings" needs hundreds of closed deals and a LinkedIn-shaped market. PMMA's best customers are local families; no enrichment API finds those.

**Pricing (from /pricing, Sept 17, 2026):**
| Tier | Price | Notes |
|---|---|---|
| Starter | $89 / user / mo | max 3 seats, **no workflows, no sequences** |
| Pro | $999 / mo, billed annually (~$12k/yr) | first tier with workflows/automations; 5 capture seats |
| Growth | $1,999 / mo annual | multi-channel sequences, LinkedIn, enrichment |
| Enterprise | custom | RBAC, SSO, bi-directional CRM sync |

**No SMS. No booking pages.** For our three businesses we'd need Pro *and* still bolt on Twilio + Cal.com. That is the GHL problem again at ~10× the price. Edge CRM plan: $55–90/mo all-in.

## 3. Edge CRM vs Lightfield, feature by feature

| Lightfield claim | Edge CRM today | Verdict |
|---|---|---|
| Open platform — API, MCP, CLI; agents read/write every record | **Have it.** Twenty MCP in Claude Code, Twenty REST/GraphQL, Vercel Workflows as plain TS in git | Parity on the principle. This is the part that matters most and it's the part we already beat GHL on. |
| Self-updating record from email/calendar | **Partial.** Twenty has Gmail + Google Calendar sync (Gmail sync was part of Phase 1 — verify both are actually connected). Resend webhooks log every outbound email event to `hub_messages`. | ~70% by enabling Twenty Gmail sync + routing Cal.com bookings/no-shows (and later SMS) into the timeline. Cheap. → Phase 3 |
| Meeting recording + transcription → auto notes | **Brett already uses Fathom.** | Do NOT build a recorder. Fathom → webhook (or Zapier-style POST) → `/api/fathom` → Twenty note on the matching person/opportunity. → Phase 3 |
| Temporal context graph — "what did churned accounts have in common?" | **Not built; raw material already collected** (`lead_events`, `hub_messages`, consent, opportunity stages). | Add `stage_history` (opportunity_id, from_stage, to_stage, reason, actor, created_at). Claude via MCP can then answer "why did Q3 leads stall". 80% of the practical value at our size. → Phase 3 |
| Agents that find lookalike prospects and book meetings | No | **Skip.** Our funnel is inbound (forms, referrals). Our version = Phase 3 sequences: stage change → sequence → booking link → auto-move on no-show. |
| Workflows described in plain language | **Have it, arguably better.** Describe → Claude writes TS → commit → deploy. Reviewable in git; no credit metering. | Parity+. |
| White-glove migration | Claude + GHL MCP (reads) | Same idea, no CSM. |
| Enrichment, LinkedIn sync, inbox warming, voice dialer | No | **Skip.** That's where their $47M goes; none of it moves a PMMA parent or a keynote booking. |

## 4. Bottom line

- Lightfield is a strong product for a Series A SaaS company with five AEs living in Gmail and Zoom. That is not us.
- The one idea worth stealing: **every interaction lands in the record automatically, with time preserved, so an agent can reason from it.** Our architecture (Twenty = brain, Edge = hands, everything logged) already points there.
- The gap is three small items, all Phase 3, none of which changes anything in `DECISIONS.md`:
  1. Verify Twenty Gmail + Calendar sync are connected for Brett's account; enable whichever isn't.
  2. `stage_history` table + write to it from every stage change (hub, Twenty webhook, Cal.com no-show).
  3. Fathom summary ingest → Twenty note (`/api/fathom`).
- Do not chase recording, enrichment, or prospecting agents.

## 5. Decision

**My recommendation (Brett to confirm):** stay the course on Edge CRM. Don't switch to Lightfield; don't evaluate it further unless the business becomes B2B-outbound-heavy.
