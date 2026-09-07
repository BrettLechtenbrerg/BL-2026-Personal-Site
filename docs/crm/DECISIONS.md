# Edge CRM — Decision Log

Append-only. One line per decision. Newest at the bottom.

| Date | Decision | Why |
|---|---|---|
| 2026-09-06 | Replace GHL; pilot on brettlechtenberg.com first | GHL has no workflow-builder API — Claude can't finish automations. BL is lowest risk (no team, no SMS). |
| 2026-09-06 | Architecture = Twenty CRM (brain) + Edge CRM in this repo (hands) | Twenty gives board/notes/MCP day one; sends, waits, webhooks stay as code Claude owns. |
| 2026-09-06 | Twenty **Cloud** ($9), workspace `brettlechtenberg.twenty.com` | No server to babysit for the pilot; self-host escape hatch (AGPL). |
| 2026-09-06 | Drip engine = **Vercel Workflows** | Lives in this repo, plain TS, unlimited sleep, no extra deploy. |
| 2026-09-06 | Email = existing **Resend Free** account, `auth.brettlechtenberg.com` | Already verified (Speaker's Edge). 100/day cap OK for test. Pro ($20) only at cutover if needed. |
| 2026-09-06 | **SMS paused** until rest of system is built (Phase 6) | Brett's call. `sms()` stubbed; Twilio stays the provider when enabled. |
| 2026-09-06 | Keep existing **Google Calendar** | Same one GHL syncs; Cal.com connects to it. |
| 2026-09-06 | Booking = **Cal.com Cloud**, not Google booking page or TidyCal | Zoom in invites required (Google = Meet only); TidyCal has no webhooks. |
| 2026-09-06 | Spam gate = port PMMA `botDefense.ts` + Turnstile + rate limit + quarantine stage | GHL webhooks accept anything; that's the root cause of spam. |
| 2026-09-06 | Twenty MCP via **OAuth** in Claude Code (user scope) | No key in config files. |
| 2026-09-06 | Secrets only in Vercel env (sensitive): `TWENTY_API_KEY`, `RESEND_API_KEY` | Never in git or chat. |
| 2026-09-06 | Phase 1 approved; replies via Reply-To `brett@brettlechtenberg.com` + Twenty Gmail sync, no Resend inbound yet | Zero DNS/risk on Free plan; Resend receiving revisited at Phase 5 with Pro domain. |
| 2026-09-06 | **Phase 1 SHIPPED** — hub runs with zero GHL calls; first email sent via Resend, logged, threaded | Verified live: Twenty leads picker, Add lead (US phone normalized), send → inbox in seconds, Log + Inbox tabs. Hub creds reset (`brett`). |
| 2026-09-06 | Gmail "be careful" banner on `auth.` sender is expected, Brett-only | Same display name as his Workspace account; goes away with `mail.` domain on Resend Pro at cutover. |
