# Phase 1 — Messaging rails, email-first (BL pilot)

**Status:** APPROVED by Brett, Sept 6 2026 — decisions below locked. Build may start.
**Repo:** `/Users/brettlechtenberg/dev/BL-2026-Personal-Site`
**Goal:** the `/hub` Messaging Center works with **zero GHL calls** — contacts from Supabase + Twenty, sends via Resend, log in Supabase. Same UI, same tabs. SMS stubbed (paused).

---

## What exists today (audited)

| Piece | Now | After Phase 1 |
|---|---|---|
| `src/lib/ghl-leads.ts` — lead picker list | GHL contacts/search | Twenty People via REST (`TWENTY_API_KEY`) |
| `src/lib/ghl-contacts.ts` — consent lookup, create/delete contact | GHL | Twenty People + `contact_consent` table |
| `src/lib/ghl-messaging.ts` — send SMS/Email | GHL Conversations | Resend (email) · `sms()` stub returns `paused` |
| `src/lib/ghl-conversations.ts` — Inbox tab | GHL conversations | Resend inbound webhook → `hub_messages` (direction=inbound) |
| `hub_messages` table | ghl_contact_id, ghl_message_id | + `contact_id` (Twenty id), `provider_message_id`, `direction`, `thread_key` |
| `/api/hub/messaging/{send,leads,inbox,log}` | call ghl-* libs | call new libs; **route contracts unchanged** so `page.tsx` needs no edits |

---

## Work items

### 1. Supabase migration `20260907_crm_phase1.sql`
- `hub_messages`: add `contact_id TEXT`, `provider_message_id TEXT`, `direction TEXT CHECK (in/out) DEFAULT 'outbound'`, `thread_key TEXT`, `delivered_at`, `opened_at`. Keep `ghl_*` columns (nullable) — dropped in Phase 5.
- New `contact_consent (contact_id PK, email_marketing BOOL, sms_marketing BOOL, email_unsubscribed_at, sms_stopped_at, source TEXT, updated_at)`.
- RLS: service-role only (same as `hub_messages`).

### 2. `src/lib/crm/twenty.ts` — single Twenty client
- `listPeople()`, `getPerson(id)`, `createPerson()`, `deletePerson()`, `findByEmail/Phone()`.
- Server-only, reads `TWENTY_API_KEY`, 100 req/min-aware (simple retry on 429), 60-record batches.
- Shapes mapped to the existing `GhlLead` / `ContactWriteResult` types so hub routes don't change.

### 3. `src/lib/messaging/resend.ts`
- `sendEmail({to, subject, html, replyTo})` using `resend` SDK (add dep, pin).
- From: `Brett Lechtenberg <brett@auth.brettlechtenberg.com>` (only verified domain on Free). **Reply-To: Brett's Gmail** so replies land where Twenty's Gmail sync sees them.
- Tags each send with `hub_message_id` for webhook correlation.

### 4. `src/lib/messaging/sms.ts` — stub
- `sendSms()` returns `{ok:false, skipped:'sms_paused'}`; hub logs `skipped` with `skip_reason='sms_paused'` (add to CHECK list). Compose tab shows "SMS paused" badge. Wired for real in Phase 6.

### 5. `src/lib/messaging/send.ts` — one entry point
- `sendMessage({channel, contactId, subject, body, marketing})` → consent check (`contact_consent`) → render merge tags (`messaging-render.ts`, unchanged) → provider → write `hub_messages`. Replaces `ghl-messaging.ts`.

### 6. Webhooks
- `POST /api/webhooks/resend` — verify **Svix signature** (`RESEND_WEBHOOK_SECRET`), handle `email.delivered / bounced / complained / opened` → update row; `email.received` → insert inbound row (thread by `In-Reply-To`/from-address).
- Unsubscribe: `List-Unsubscribe` header → `/api/unsubscribe?token=` (HMAC of contact_id) → flips `email_marketing=false`.

### 7. Hub route swaps (contracts unchanged)
- `leads` → `twenty.listPeople()` · `send` → `sendMessage()` · `log` → unchanged · `inbox` → query `hub_messages` grouped by `thread_key`.
- `page.tsx`: only copy changes ("GHL" → "CRM", SMS badge).

### 8. Delete
- `ghl-messaging.ts`, `ghl-conversations.ts`, `ghl-leads.ts`, `ghl-contacts.ts` (801 lines) — **after** parallel test passes. Site forms (`book-brett`, `apply`, `EbookModal`, `workbook`, `team-lead`) stay on GHL until Phase 2.

### 9. Env (Vercel, sensitive)
- ✅ `TWENTY_API_KEY`, ✅ `RESEND_API_KEY` · new: `RESEND_WEBHOOK_SECRET`, `UNSUBSCRIBE_HMAC_SECRET`, `HUB_REPLY_TO_EMAIL`.

---

## Tests (narrow, real code paths)
- `send.test.ts`: consent=false + marketing → `skipped/no_consent`; SMS → `skipped/sms_paused`; email → Resend called once, row written.
- `resend-webhook.test.ts`: bad signature → 401; `email.received` → inbound row with thread_key.
- Manual: Hub Compose → email to Brett → arrives; reply → Inbox tab shows it; unsubscribe link → consent flips; Log tab shows all.

## Definition of done
1. Send email from `/hub` with no `GHL_*` env var set.
2. Reply appears in Inbox tab within a minute.
3. Unsubscribe → next marketing send is `skipped/no_consent`.
4. SMS attempt → `skipped/sms_paused`, UI shows badge.
5. `grep leadconnectorhq src/app/hub src/app/api/hub` → 0 hits.

## Risks / limits
- **Resend Free: 100 emails/day** shared with Speaker's Edge auth mail. Hub blasts must stay under ~80/day until Pro.
- **Inbound email on Free** — receiving must be enabled on the domain (MX record on `auth.` subdomain, or Resend's `<id>.resend.app` address). ADR 0003 turned receiving off; enabling MX on `auth.` doesn't affect Speaker's Edge sends. **Fallback:** skip inbound in Phase 1; rely on Reply-To → Gmail → Twenty sync.
- Twenty sample data (Airbnb etc.) will show in the lead picker until deleted.

## Estimate
~2 days build + ½ day test. No downtime: GHL stays wired for site forms.

## Decisions (locked Sept 6)
1. ✅ Replies via **Reply-To + Twenty Gmail sync**; no Resend inbound in Phase 1 (item 6 `email.received` handling deferred to Phase 5).
2. ✅ `HUB_REPLY_TO_EMAIL=brett@brettlechtenberg.com` — set in Vercel production.
3. ✅ Delete Twenty sample companies/people before the lead picker goes live.
