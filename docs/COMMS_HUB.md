# Comms Hub — brettlechtenberg.com

**Built July 3, 2026** — a lean, Leads-only clone of PMMA's Power Hub
communication system (per `PMMA-MESSAGING-CLONE-GUIDE.md`, the system proven
live on PMMA July 2, 2026). Message any GHL contact — speaking inquiries,
workbook leads, Master's Edge applications — without logging into GHL.

## What it is

- **`/hub`** — login (HMAC session cookie, 30-day, credential-bound:
  rotating `HUB_PASSWORD` in Vercel kills all sessions instantly)
- **`/hub/messaging`** — the whole tool, three tabs:
  - **Compose** — pick leads (tag filter, search, newest first), SMS or
    email, `{{first_name}}`/`{{last_name}}` merge tags, live preview,
    marketing-SMS consent gate, batch dedupe, confirm modal. Plus lead
    management: **Add lead** button (name/phone/email/tags; 409 on
    duplicates) and a per-row **trash icon** that permanently deletes the
    contact from GHL after a destructive-confirm modal.
  - **Inbox** — recent GHL conversations, unread + "needs reply" badges,
    full thread view, in-place replies
  - **Log** — append-only audit of every attempt (`hub_messages` table)

Hidden: noindex layout, not in sitemap, not in nav. Real security = the
session guard on every `/api/hub/*` route (`src/lib/hub-session.ts`).

## Architecture (all ported from PMMA @ 4f6fb07)

| File | Role |
|---|---|
| `src/lib/hub-session.ts` | HMAC session guard — every API route calls `requireHubSession()` |
| `src/lib/supabase-admin.ts` | service-role Supabase client (no anon fallback) |
| `src/lib/ghl-messaging.ts` | send SMS/Email via GHL Conversations (Version 2021-04-15!) |
| `src/lib/ghl-leads.ts` | paginated contact pull + tag grouping (cursor rides per-contact — do NOT "fix") |
| `src/lib/ghl-conversations.ts` | inbox list + thread fetch |
| `src/lib/ghl-contacts.ts` | sms_consent_marketing reader (fail-safe gate) + createContact/deleteContact |
| `src/lib/messaging-render.ts` | merge tags + HTML-escaped email wrapper |
| `src/app/api/hub/auth/route.ts` | login/logout/session-check, rate-limited (8 fails/15 min/IP) |
| `src/app/api/hub/messaging/{leads,send,log,inbox}/…` | the four data routes |
| `src/app/api/hub/leads/…` | POST create lead + DELETE lead (need contacts.write) |
| `src/app/hub/…` | login + messaging UI |
| `supabase/migrations/20260703120000_create_hub_messages.sql` | audit table, RLS locked down |

Differences from PMMA: no Students audience (no roster), single admin role,
table named `hub_messages` (no `student_id`), lockdown RLS from day one.

## Env vars (Vercel → Project → Settings → Environment Variables)

| Var | What |
|---|---|
| `HUB_USERNAME` | hub login username (pick one) |
| `HUB_PASSWORD` | hub login password (rotating it logs everyone out) |
| `HUB_SESSION_SECRET` | `openssl rand -hex 32` |
| `GHL_PIT_TOKEN` | Private Integration token from Brett's PERSONAL GHL location |
| `GHL_LOCATION_ID` | that location's ID (Settings → Business Profile) |
| `NEXT_PUBLIC_SUPABASE_URL` | the new BL Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | its service_role secret (server-only) |

Until these are set, the hub fails closed: login returns 503, APIs return
503/401, the public site is unaffected.

## GHL PIT scopes required

- `contacts.readonly` (View Contacts)
- `contacts.write` (Edit Contacts) — for the hub's Add/Delete lead feature
- `conversations.readonly` (View Conversations)
- `conversations/message.readonly` (View Conversation Messages) ← near-twin
  of the one above; you need BOTH "View" scopes
- `conversations/message.write` (Edit/Send Conversation Messages)

Adding scopes to an existing PIT and saving WITHOUT regenerating applies in
place. Regenerating mints a new token → paste into Vercel again.

## Test plan (mirrors the PMMA live test)

1. In GHL, tag yourself (a contact with your real cell) `test-lead`.
2. `/hub` → log in → Compose → tag filter `test-lead` → SMS, marketing OFF
   → send. Expect `1 sent` + a text on your phone.
   - `failed: messaging scope` → write scope missing on the PIT.
   - sent-but-no-text → check the contact for a DND flag / wrong number.
3. Inbox → open the conversation → thread renders (amber banner = missing
   `conversations/message.readonly`) → reply → text arrives.
4. Log tab → both sends recorded.

## Known behaviors (not bugs)

- After a successful send the selection clears on purpose (anti-double-blast).
- Marketing SMS mostly skips with `no_consent` — that's the compliance gate;
  operational messages send normally.
- Leads pull is capped at the 1,000 newest contacts, cached ~60s per instance.
- Email lands in spam until a dedicated sending domain is set up in GHL
  (Settings → Email Services). SMS requires the location to have a phone
  number + A2P registration — the hub needs zero code changes when added.

## Cloning the site (hub travels with it as one unit)

The entire hub — UI, API routes, GHL libs, session guard — lives in this
repo. **Zero business identifiers are hardcoded**: every GHL id, token,
Supabase key, and credential comes from env vars. Clone the repo and the
hub clones with it, dormant until env vars are set (fails closed, public
site unaffected). To stand up a clone for a new business:

1. **Repo** → clone/fork; deploy to Vercel. Done — site + hub code travel together.
2. **Supabase** → new project; run
   `supabase/migrations/20260703120000_create_hub_messages.sql` in the SQL
   editor (includes the service_role GRANT — required when "Automatically
   expose new tables" is disabled at project creation, which it should be).
3. **GHL** → the clone points at whichever location its `GHL_LOCATION_ID` +
   `GHL_PIT_TOKEN` name. Create a Private Integration on the TARGET
   location with the 5 scopes listed above. The hub stores nothing in GHL
   beyond normal contacts/conversations — so even a full GHL account
   export/rebuild only requires minting a new PIT token and updating two
   env vars; no code or data migration.
4. **Env vars** → set all 7 (table above) in the new Vercel project; redeploy.
5. **Verify** → run the test plan above.

What does NOT travel automatically: the Supabase audit history (export
`hub_messages` as CSV if it matters) and the GHL contacts themselves
(they belong to the GHL location, not the site). Also note two site pages
outside the hub — `src/app/masters-edge-program/apply/page.tsx` and
`src/app/book-brett/page.tsx` — have GHL inbound-webhook URLs hardcoded;
a clone for a different business must swap those.

See also: the original cross-business recipe this was built from —
`PMMA-MESSAGING-CLONE-GUIDE.md` (Desktop) / PMMA repo `docs/MESSAGING-CLONE-GUIDE.md`.
