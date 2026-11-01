# BL Power Hub — Budget & Sales (brettlechtenberg.com/hub/budget)

Built and live 1 Nov 2026 (Brett's request; "our own budgeting workflows", NEXT_SESSION plan item 2). Ported from the
PMMA Budget (`~/dev/PMMA-Website-2026-Master/docs/BUDGET.md`) and fitted to Brett's business. Plan:
`~/.gg/plans/bl-power-hub-budget.md`. Desktop record: `~/Desktop/BL - Brett Lechtenberg/Projects/Power Hub Budget/RESUME-PROMPT.md`.

## The Power Hub
`/hub` is now the **Power Hub** (was "Comms Hub"): same login (`HUB_USERNAME` / `HUB_PASSWORD`, signed cookie in
`src/lib/hub-session.ts`), lands on `/hub/budget`. Left menu (`src/components/hub/HubShell.tsx`, wrapped around every
hub page except the login by `HubFrame` in `src/app/hub/layout.tsx`): Dashboard (Budget) · Monthly Setup · Messaging ·
Academy · CRM ("soon", for Edge CRM Phase 2). Messaging and Academy pages are unchanged inside the menu.

## Income lines (`src/lib/budget.ts`, keys are stored in the data; labels and words can change)
| Key | Line | Estimate |
|---|---|---|
| `group_coaching` | Group Coaching | members × price |
| `individual_coaching` | Individual Coaching | clients × price |
| `company_consulting` | Company Consulting | engagements × price |
| `hourly_consulting` | Hourly Consulting ($500/hr) | hours × $500 |
| `other_income` | Other Income (books, Academy, speaking…) | optional |
| `not_counted` | Not BL business (personal / PMMA) | never; kept on record, never counted |

Stripe payments file themselves from the description, Checkout product name or invoice line (`matchLine()`: exact
word, small typos, longest word inside; consulting that mentions hours → hourly; hours = amount ÷ $500). Unmatched →
**Needs a category** (shown, not added to totals until Brett picks a line; never overwritten by a later sync).

## What's different from PMMA
No MSI billing, no closed days, no nightly cash close-out; pace runs on the **calendar days** of the month. Money in by
Stripe, check, bank transfer, cash or other (Zelle/Venmo). Checks and transfers can wait "not in the bank yet" until
Brett marks them received. "Entered by" is always Brett. Growth card → **Clients**; Close-out card → **Needs attention**.
The payments list and running total cover the whole month (tap a day to narrow it).

## Pieces
| Piece | File |
|---|---|
| Tables (5, `bl_budget_*`, RLS on, service role only; run in the Supabase SQL editor 1 Nov 2026, verified 5 × rowsecurity true) | `supabase/migrations/20261102120000_create_bl_budget.sql` |
| Lines, matching, pace, totals (pure) | `src/lib/budget.ts` |
| Loaders + table names | `src/lib/budget-db.ts` |
| Stripe catch-up (read-only key) | `src/lib/budget-stripe.ts` |
| Reminder emails (19th + 20th, to brett@brettlechtenberg.com, OFF until switched on) | `src/lib/budget-email.ts` |
| API (hub session) | `src/app/api/hub/budget/route.ts` |
| Daily cron 14:00 UTC (Stripe catch-up + reminders; `CRON_SECRET`, fails closed) | `src/app/api/cron/budget/route.ts`, `vercel.json` |
| Pages | `src/app/hub/budget/page.tsx`, `src/app/hub/budget/setup/page.tsx`, `src/components/hub/budget/*` |
| Secrets helper (hidden typing) | `scripts/add-budget-keys.sh` (Production key + password · `--password` · `--preview`) |
| Tests | `node --test --experimental-strip-types scripts/budget-unit-test.ts` (9) · `node --experimental-strip-types scripts/budget-e2e.ts` (27, local `next dev -p 3123`; writes only `note = 'E2E TEST'` rows + month 2099-12 and deletes them; `--demo` screenshot data, `--cleanup`) |

## Stripe connection
`BL_STRIPE_READ_KEY` = restricted key **"BL Power Hub Budget (read only)"** (`rk_live_…qZEt`) on the Brettlechtenberg
account `acct_16xJo3Kq6AqfCeIO`, created by Brett 1 Nov 2026. Read only: Charges, Refunds, PaymentIntents, Customers,
Checkout Sessions, Invoices, Disputes (Stripe needs Disputes Read to list charges). It cannot charge, refund or change
anything. The full Academy key (`STRIPE_SECRET_KEY`) is never used here. Saved in Vercel Production + Preview
(`power-hub-budget`) + `.env.local`. To replace: Stripe → Developers → API keys → roll it, then
`bash scripts/add-budget-keys.sh`. Rows are keyed by Stripe id (UNIQUE, insert-or-skip): re-runs never duplicate and
never overwrite Brett's line choice. Stripe rows can't be voided (refunds arrive as negative rows).

## Security
Every page and API call needs the hub login; tested 1 Nov 2026: no login → 401 / back to sign-in, forged cookie → 401,
cron without its secret → 401. Pages are noindex, `/hub/` is disallowed in robots, not in the sitemap. Previews also sit
behind Vercel's own login. A new `HUB_PASSWORD` (set 1 Nov 2026 by Brett, never seen by the agent) signs out every old session.

## Data safety
Shared Supabase project `yrfsquzzbgnmkfbuapfk` (Academy + hub): budget tables are additions only, prefixed `bl_`.
Hand-entered rows are voided, never deleted. **Not done yet:** a monthly CSV copy outside Supabase (checks, transfers
and cash can't be rebuilt from Stripe) and confirming what backups the Supabase plan includes (the project is on the
FREE plan; check Supabase → Database → Backups before relying on any backup). Until then, use
"Download CSV" at month end and save it in the Desktop project folder.

## Later
Expenses / accounting side (after the income dashboard is proven, Brett 1 Nov 2026); CRM in the Power Hub (Edge CRM
Phase 2); payout-to-bank matching; monthly CSV backup job.
