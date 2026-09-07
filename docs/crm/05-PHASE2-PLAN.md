# Phase 2 — Lead intake + spam gate (BL pilot)

**Status:** DRAFT for Brett's review — no code yet.
**Repo:** `/Users/brettlechtenberg/dev/BL-2026-Personal-Site`
**Goal:** every website form lands in **Twenty** (person + opportunity card) through **one server route with a real spam gate**. GHL webhooks removed from the public site. Automations (Phase 3) then hang off Twenty stage changes.

---

## What exists today (audited Sept 6)

| Form | Where it posts | Spam gate today |
|---|---|---|
| Book Brett (`/book-brett`) | **browser → GHL webhook directly** | none |
| Master's Edge apply (`/masters-edge-program/apply`) | **browser → GHL webhook directly** | none |
| Ebook modal (`EbookModal.tsx`) | **browser → GHL webhook directly** | none |
| Workbook started/completed (`/api/workbook-lead`) | server → GHL webhook | none |
| Rockstar Team quiz (`/api/team-lead`) | server → GHL webhook | honeypot + timing (`bot-protection.ts`) ✅ |

**Root cause of spam:** 3 forms hand the GHL webhook URL to the browser — any bot can POST to it forever, no site involved. GHL accepts everything. Fixing this is the whole point of Phase 2.

Already in repo and reused as-is: `src/lib/bot-protection.ts` (honeypot `company_website`, signed `_ts` timing window) + `src/lib/useBotProtection.ts` (client hook).

---

## Design

```
form (browser) ──POST──► /api/lead ──► gate ──► Twenty person (dedupe by email/phone)
                                        │            └► Twenty opportunity (pipeline per form, stage NEW)
                                        │       ──► contact_consent (email_marketing=true, source=form:<id>)
                                        │       ──► lead_events row (audit: form, ip hash, verdict)
                                        └► spam → 200 OK to the bot, nothing created, verdict logged
```

**Gate, in order (fail fast, always answer 200 to bots so they learn nothing):**
1. `form_id` allow-list (`book-brett | masters-edge-apply | ebook | workbook | team-quiz`) — unknown → 400.
2. Honeypot + timing (existing `checkBotSignals`).
3. **Cloudflare Turnstile** token verified server-side (free, invisible; `TURNSTILE_SECRET_KEY`). Missing/invalid → reject.
4. **Rate limit**: 5 submissions / 10 min per IP+form, Postgres-backed (`lead_events` count) — no new infra.
5. **Field validation**: email syntax + MX-less disposable-domain blocklist (~30 domains, static); phone via `normalizeUsPhone`; body lengths capped.
6. **Quarantine heuristic**: URL in free-text, >3 links, all-caps name, name==email local-part → create the person but opportunity stage **`REVIEW`**, no consent granted, no Phase-3 automations fire.

**Twenty setup (one-time, via API in the build — Brett clicks nothing):**
- Opportunity `stage` options → `NEW, REVIEW, CONTACTED, BOOKED, MISSED, ENROLLED, LOST` (replaces sample NEW/SCREENING/…).
- Person custom field `source` (SELECT: book-brett, masters-edge, ebook, workbook, team-quiz, hub).
- Opportunity `name` = `"<Form label> — <Person name>"`; `pointOfContactId` = person.
- Form-specific answers (role, budget, goals, challenge, quiz score…) → a **Note** attached to the opportunity, so nothing is lost and no 20 custom fields.

---

## Work items

1. **Migration `20260907120000_crm_phase2.sql`** — `lead_events (id, form_id, contact_id, opportunity_id, verdict TEXT CHECK(accepted|quarantined|rejected_<reason>), ip_hash TEXT, ua TEXT, payload JSONB, created_at)`; RLS locked, service-role insert/select; index `(ip_hash, form_id, created_at)` for the rate limit.
2. **`src/lib/crm/twenty.ts`** — add `createOpportunity({name, stage, pointOfContactId})`, `createNote({targetId, body})`, `ensureStageOptions()` (idempotent metadata call, run once from a script).
3. **`src/lib/lead/gate.ts`** — the 6-step gate; pure function → `{verdict, reason}`. Turnstile verify helper.
4. **`src/lib/lead/intake.ts`** — `acceptLead(form_id, fields)` → find-or-create person → opportunity → note → consent → `lead_events`. Returns `{contact_id, opportunity_id}`.
5. **`/api/lead/route.ts`** — parse → gate → intake. Single route replaces `/api/workbook-lead` and `/api/team-lead` (kept as thin aliases for one release, then deleted).
6. **Forms** — `book-brett`, `masters-edge-program/apply`, `EbookModal`: swap the hard-coded GHL URL for `fetch("/api/lead")`, add `useBotProtection()` + Turnstile widget (`@marsidev/react-turnstile`, pinned). Workbook + quiz: point at `/api/lead`.
7. **Remove** every `leadconnectorhq.com` string and `GHL_*` env read from `src/`. Booking widget in `utils.ts` stays until Phase 3 (Cal.com).
8. **Hub tweak** — lead picker shows `source` chip (replaces the empty tag filter).
9. **Env (Vercel, sensitive):** `TURNSTILE_SECRET_KEY`; public: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

## Tests (narrow, real code paths)
- `gate.test.ts`: honeypot → rejected; too-fast → rejected; disposable email → rejected; URL in message → quarantined; clean → accepted; 6th submit in 10 min → rejected_rate.
- `intake.test.ts` (mock only the Twenty fetch): existing email → no duplicate person; opportunity + note created; consent row written with `form:<id>`.
- Manual: submit each of the 5 forms once → card appears in Twenty under the right pipeline stage NEW; note holds answers; hub picker shows the person with source chip.

## Definition of done
1. Zero `leadconnectorhq` / `GHL_` in `src/`.
2. All 5 forms create a Twenty person + opportunity; duplicates merge on email/phone.
3. Bot POST (no Turnstile token) → 200, nothing created, `lead_events.verdict = rejected_turnstile`.
4. Sketchy-but-human submission → stage `REVIEW`, visible on the Twenty board.
5. Brett can drag REVIEW → NEW in Twenty and it's a real lead (Phase 3 will fire on that).

## Risks / limits
- **Turnstile** adds a Cloudflare script to 3 pages; invisible mode = no visible captcha for humans.
- **Consent semantics**: a form submit = consent to *email* marketing from Brett (checkbox copy on each form says so). SMS consent stays false until Phase 6 adds an explicit SMS opt-in.
- **Twenty rate limit** (~100 req/min): intake makes ≤4 calls per lead — fine.
- **GHL history**: existing GHL contacts are *not* migrated in this phase (Phase 5 export/import).

## Estimate
~2 build days + ½ day test. Brett: ~15 min (Turnstile key + submit each form once).

## Decisions for Brett
1. **Pipeline stages** `NEW → REVIEW → CONTACTED → BOOKED → MISSED → ENROLLED → LOST` — OK, or rename any?
2. **One pipeline for all 5 forms** (filter by `source`) vs **separate pipelines** (Speaking / Master's Edge / Lead magnets)? → My pick: **one**, split later if the board gets noisy.
3. **Form submit = email-marketing consent** (with clear copy under the button) — OK?
4. Delete `/api/workbook-lead` + `/api/team-lead` immediately, or keep aliases one release? → My pick: **delete** (nothing external calls them).
