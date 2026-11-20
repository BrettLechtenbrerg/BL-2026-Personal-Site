# Brett Lechtenberg (BL): business assets

**Why this file exists:** TSAI and Brett Lechtenberg (BL) were separated on 15 Nov 2026 (Brett: "simply separate the
two businesses and have the contacts in both places"). This is the record of every account brettlechtenberg.com runs
on. TSAI's matching list: `~/dev/TSAI-Site/docs/BUSINESS-ASSETS.md`. Update this file whenever an account changes.

**Owner:** Brett Lechtenberg. Legal entity on the BL Stripe invoices: *Total Success Technologies* (the same company
name as TSAI's Stripe; worth knowing if either business is ever sold). "Not checked" = not confirmed yet.

| Asset | What / where | Account holder today | Cost | Notes |
|---|---|---|---|---|
| **Domain** | brettlechtenberg.com | Brett (registrar not checked) | not checked | |
| **Website** | brettlechtenberg.com, repo `BrettLechtenbrerg/BL-2026-Personal-Site` | Vercel team `bretts-projects-3e254e58`, project `bl-2026-personal-site` | Vercel plan shared with TSAI (not checked) | |
| **Database** | Supabase project `yrfsquzzbgnmkfbuapfk` | Brett's Supabase account | not checked | |
| **CRM** | Twenty **brettlechtenberg.twenty.com**: BL's alone since 15 Nov 2026. Keeps everyone (1,871 people on 15 Nov, 561 of them also marked TSAI); until 20 Nov 2026 new TSAI people were copied in each morning by the TSAI site; **that copy is switched off since 20 Nov 2026** (Brett: TSAI's CRM keeps its people only; nothing already here was removed) | brett@brettlechtenberg.com | not checked | Keys: "claude-code", "TSAI-Site" (the TSAI site's old key, no longer used since 15 Nov; can be revoked), "TSAI-copy-to-BL" (the nightly copy) |
| **Google Workspace** | brettlechtenberg.com Workspace (Business Standard; trial ends 5 Dec 2026): brett@ **and** info@totalsuccessai.com | Brett (admin: brett@) | ~$36/mo total | TSAI's info@ lives here for now (separation decision D3) |
| **Booking page** | BL "Talk With Brett" page for brettlechtenberg.com: planned (Edge plan step B2). The old TSAI page on brett@ stays open until ~6 Dec for old links | brett@ | Workspace | |
| **Sending email** | Resend domain **auth.brettlechtenberg.com** (BL, Speaker's Edge, the BL/PMMA/GIFT CONNECT academies). TSAI stopped using it on 15 Nov | Resend account (not checked whether shared with TSAI) | not checked | |
| **Payments** | Stripe account "BRETTLECHTENBERG.COM" (invoices: Total Success Technologies); read-only key `BL_STRIPE_READ_KEY` | Brett | Stripe fees | |
| **GoHighLevel** | BL's own GHL account (Edge plan Part B replaces it) | Brett | not checked | Brett's call alone |
| **Dashboards** | Speaker's Edge, Launch Portal, Visibility Edge, Book Studio, Audiobook Studio: BL property (Edge plan B7; Brett 15 Nov: "all these programs are mine not tsai"). One home: **brettlechtenberg.com/hub/tools** ("My tools", live status dots) | Brett | | Details below |

### Dashboards (connected 15 Nov 2026)

All on Vercel team `bretts-projects-3e254e58`, code on GitHub `BrettLechtenbrerg`. Each keeps its own sign-in. The
brettlechtenberg.com addresses are GoDaddy CNAMEs to `cname.vercel-dns.com` (added 15 Nov); the older addresses still work.
To hand one over: transfer the Vercel project + GitHub repo, and move or re-point its DNS record.

| Dashboard | Address | Vercel project / repo | Who can sign in | Cost |
|---|---|---|---|---|
| **Speaker's Edge Next** | speakers.brettlechtenberg.com (old: speakers-edge-next-staging.vercel.app) | `speakers-edge-next-staging` / `speakers-edge-next`; Supabase `lksqhqgsrrcbovycubxa` | Brett (emailed code; owner allowlist) | free plans |
| Speaker's Edge prototype (older) | speakersedge.brettlechtenberg.com | `speakers-edge-prototype` (read-only, rule 7) | personal code | free |
| **Launch Portal** | launch.brettlechtenberg.com (old: launch-portal-mu.vercel.app); public front page linked from /coaching | `launch-portal` / `launch-portal`; BL Supabase | clients by email link; Brett sees all | free |
| **Visibility Edge** | visibility.brettlechtenberg.com (also visibility.totalsuccessai.com) | `visibility-edge` / `visibility-edge` | open page; AI keys typed in the browser | AI calls per run |
| **Book Studio** | Author's Edge authorsedge.brettlechtenberg.com · PR Edge predge.brettlechtenberg.com · books in `~/BookStudio` | `authors-edge-personal` etc. / `authors-edge-prototype` | personal code | free (house AI keys not added yet) |
| **Audiobook Studio** | none: runs on the iMac (`~/dev/audiobook-studio`) | repo `audiobook-studio` | n/a | free |
