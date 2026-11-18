# BL 2026 Personal Site — Next Session Restart Prompt

## ▶ RESUME HERE (18 Nov 2026, Session 45: academy lesson media on Cloudflare R2 + Read Aloud on all 44 lessons, both live)

**State at close (18 Nov 2026):** everything is committed, on GitHub and live. Nothing is half-done. Brett played lessons and a Read Aloud signed in on the live site ("it sounds good"). First thing next time: open item 1 below (Vercel storage figure).

**18 Nov 2026 (Session 45): LESSON MEDIA ON R2, LIVE (main `a0a4394`; Brett's "go"; plan `~/.gg/plans/bl-academy-media-to-r2.md`):**
- **Why:** Vercel's storage warning. The 89 lesson video and audio files (3.37 GB, 44 lessons) made every deployment about 3.3 GB.
- **What changed:** the live site plays them from the private Cloudflare R2 bucket `bl-academy-media` (Brett's Cloudflare account,
  free tier) through a members-only gate. Signed out -> "Not signed in"; course not owned -> refused. The Vercel build copies any new
  media to R2, checks it, then leaves it out of the deployment. **Nothing was deleted:** the files are still in the repo and on GitHub.
- **Checked:** 89 of 89 copies match the originals (size + fingerprint, and a full download-and-compare). Vercel build passed and left
  3.37 GB out. Live, signed out: lesson files locked, 12 other pages and images unchanged. **Brett, signed in on the live site
  (18 Nov): videos, quiz and flashcards worked.** Not checked: a real iPhone.
- **How it works, commands, keys, undo:** `docs/ACADEMY.md` -> "Lesson media on R2". Undo = revert `a0a4394` and redeploy.
- **Open from this session:**
  1. **Confirm the storage figure with Brett in the Vercel dashboard** (19 Nov or later). One 3.3 GB deployment from 16 Nov remains
     as a quick rollback; Vercel drops it by itself once three newer ones exist.
  2. **Read Aloud for all 44 lessons: PUBLISHED 18 Nov (Brett's "go"; the commit after `86b1be3`).** Woman's voice `af_heart`, the same as the
     Parent Training System (Brett heard a sample and chose it); narrator label is now "your Master's Edge guide" (profile
     `~/dev/academy-forge/brands/bl/academy.json`, config regenerated with the generator only). 44
     `public/academy/<slug>/read-aloud.m4a` (117 MB, 2.6 hours; on R2, 132 of 132 copies verified); Rockstar Team was redone to match.
     Made with `node scripts/academy-lesson.mjs narrate <slug>`. Only one lesson was listened to before release; Brett played a Read Aloud live afterwards. Sword in the Shrine and The Master's Edge
     Framework read the OLD pillar order aloud until that open item is fixed (then re-narrate those two, free).
     **PDF downloads: still only Rockstar Team has one;** PDFs for the other 43 would have to be written first (not started).
  3. Empty, misspelled bucket `bl-academy-meida` in Cloudflare: unused, Brett can delete it.
  4. Later, Brett's call: take the media out of the repo (grows about 80 MB a lesson); same set-up for TSAI in its own Cloudflare
     account (then the gate moves into the Academy Forge).

## Earlier: 16 Nov 2026, Session 44: speed, mobile, clean-up and Google SEO pass, all live

**State at close (16 Nov 2026):** everything is committed, on GitHub and live on www.brettlechtenberg.com. Nothing from Session 44 is
unfinished. Commits: speed + mobile `8cacacb`, clean-up `8279efa`, old homepage sections removed `c4186bd` (restore tag
`pre-old-sections-removal-2026-11-16`), Google SEO pass `f581308`. Details of each are in the Session 44 entry just below.

**WHAT'S NEXT (the list Brett chose to keep, 16 Nov 2026: "i like your list so we are going to keep it"):**
1. **Three public GoHighLevel webhook addresses** (the only item with a security angle; about 15 minutes of Brett's time in the GHL
   dashboard). Steps: "⭐ FIRST OPEN ITEM" below.
2. **Brett, in Google Search Console (10 minutes):** confirm the site is included in "Search generative AI features"; look at the Core
   Web Vitals and Pages reports. Until then the "meets Google's standards" answer covers only what can be checked from outside.
3. **Google PageSpeed scores:** not run on 16 Nov (free daily quota used up). Re-run on another day:
   `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<page>&strategy=mobile`.
4. **Pricing for coaching and the 12-Week Program** (removed 31 Oct): once Brett sets it, it goes back on the program page and Stripe
   payments get connected ("Brett's plan" item 3 below).
5. **Edge CRM, retiring Go High Level** ("Brett's plan" item 1 below; say "resume Edge CRM"). Phase 2 plan waits for Brett's approval.
6. **Power Hub Budget:** expenses side next; monthly backup of the budget data outside Supabase still open (`docs/BUDGET.md`).
7. **Optional, Brett's call:** AVIF images (smaller, but more Vercel image-processing use); shrink the blog image PNGs (1.5-2.7 MB, also the
   social-share images, so their addresses would change); check the site on a real phone; remove `src/components/ui/AnimatedCounter.tsx`
   and `TiltCard.tsx` (only the removed old homepage sections used them; they never reach visitors).
8. **Parked, from older notes, not re-checked on 16 Nov:** the published book's About the Author + Amazon description say "seven books"
   (book project); /books top image is the pre-publication mockup; /speaking: America First letter of recommendation to replace a quote
   card when it arrives, and the speaking stats bar to verify or retire; hub emails landing in spam (sending-domain setup).


**16 Nov 2026 (Session 44): SPEED + MOBILE PASS, LIVE (Brett: "make any of your suggested changes live and committed"; main `8cacacb`, checked on www.brettlechtenberg.com):**
all 19 public pages tested at iPhone size on slow 4G (main content in 1.2-2.9 s, no sideways scroll, no broken images). Changes:
- **Sizzle reel loads only on tap** (`LiveClip` `preload="none"`; it pulled ~4 MB per visit). Measured live, phone: /speaking 5.6 -> 1.4 MB,
  /book-brett 4.9 -> 0.8 MB, /media-kit 5.4 -> 1.2 MB; the reel still plays on tap on all three.
- **/books "Bestseller" badge** ran past the card edge on phones and at 900-1023px: it now sits above the title there (`horizon.css` `.book-head`).
- **Source images shrunk** (about 43 MB -> 4 MB): `speaking-gallery/speaking-1/2/3` and `referral-community` and `books/travel-safety-program`
  are now `.jpg` (the `.png` files are gone); `murray-chamber-2.jpeg`, `speaking-4.jpg`, the six `images/quiz/gap-*.webp` and
  `books/reclaiming-the-clock.png` were re-saved smaller under the same names. Not touched: media-kit download photos, blog images (their
  addresses are shared on social), `usa-today/`.
- **Security headers** in `next.config.ts`: nosniff, Referrer-Policy, Permissions-Policy (camera, microphone, location off),
  `frame-ancestors 'self' https://*.brettlechtenberg.com`. No full Content-Security-Policy (would need every script source listed).
- **/quiz-results-gallery** (internal preview): first card image preloads (3.5 -> 2.9 s), 11px labels -> 12px.
- **brettlechtenberg.com -> www is now a permanent (308) redirect** (Vercel project domain setting, changed through `vercel api`; was 307).
- **Clean-up (Brett: "remove the clip and any unnecessary clutter"):** 18 files that no page used were removed from `public/` (13 MB):
  `videos/juan-diego-clip.mp4` + poster (old /speaking clip, replaced by the sizzle reel), the stock `heroes/speaking.jpg`, `heroes/about.jpg`,
  `heroes/ai-advisory-hero.webp`, `books/masters-edge-devices.jpg`, `-shelf.jpg` and `masters-edge.png`, `usa-today/usa-today-logo.png`, four
  unused `logos/*.svg` and the five Next.js starter icons. All are in git history. Kept: `google609cf9c0414c568d.html` (Google Search Console
  proof) and the two square blog images (used for social posts).
- **Old homepage sections removed (Brett: "remove the old pieces as long as we can find them later"):** the eight pre-Horizon components in
  `src/components/sections/` (Hero, LogoScroller, Testimonials, Credibility, Solution, Pathways, MediaFeature, QuizPromo; imported nowhere
  since 30 Oct) and the old homepage banner `public/heroes/homepage.jpg` (only Hero used it). To get them back:
  `git checkout pre-old-sections-removal-2026-11-16 -- src/components/sections public/heroes/homepage.jpg` (tag is on GitHub; the whole old
  site is also at `pre-horizon-2026-10-30`). The four style options (A-D) are a separate project, `~/dev/bl-style-mockups`, untouched.
- **Google SEO check (16 Nov, against Google Search Central's documentation changelog to 12 Nov 2026 + its May 2026 AI-features guide):** all 22
  sitemap pages scanned. Fixed: `/og-image.jpg` did not exist (7 pages pointed their share/preview image at it; 4 more had none): it is now a
  real 1200x630 JPG (the dual portrait on black, same picture as `brett-hero.webp`) and every page uses it or its own image; page titles no
  longer repeat "Brett Lechtenberg" twice (root template adds it once; blog titles 20 characters shorter); sitemap no longer stamps every
  static page with the build time as "last changed" (blog posts keep their real dates); WebSite schema lost its SearchAction (no site
  search; Google retired the search box); Article publisher logo pointed at a missing `/icon.png` (now `/logo.jpg`); `og:type` on every
  page; /privacy and /terms no longer share the homepage's `og:url`. Check script idea: every sitemap page must have one h1, canonical =
  its own address, a share image that loads, and no brand twice in the title.
  Known and left: FAQPage on blog posts and Course on /masters-edge give no Google rich result any more (FAQ retired 7 May 2026, course
  info in 2025) but are harmless and other engines read them; `llms.txt` is ignored by Google (fine to keep); home description is 250
  characters (Google trims it). **Brett, in Search Console:** confirm the site is included in "Search generative AI features" (now required
  to appear in AI Overviews / AI Mode), and look at the Core Web Vitals and Pages reports.
Lint 0/0, tsc and build pass. Left as is: AVIF images (would raise Vercel image-processing use: a cost decision for Brett), blog image PNGs (1.5-2.7 MB each, also the
social-share images), Google PageSpeed scores (free daily quota was used up on 16 Nov; re-run another day).

**15 Nov 2026 (Session 43): /hub/tools "My tools" LIVE** (5 dashboard tiles with live status, `src/lib/my-tools.ts`,
`/api/hub/tools`, test `scripts/my-tools-unit-test.ts`), /coaching FAQ links launch.brettlechtenberg.com, dashboards added
to `docs/BUSINESS-ASSETS.md`. Commit `bc2b066`, deployed with `vercel --prod`. Full record:
`~/Desktop/BL - Brett Lechtenberg/Projects/Connect Dashboards - Nov 2026/RESUME-PROMPT.md`.

**⭐ FIRST OPEN ITEM (raise with Brett): three public GoHighLevel webhook addresses.** The eBook, Book Brett and
Master's Edge application webhook addresses are public (this repo is public and they were in the site's code until
10 Nov; they are still the fallbacks in `src/app/api/ghl-form/route.ts`). A spammer who has them can skip the site
and post straight to GoHighLevel. Brett, 10 Nov: "no time now". The fix, when he is ready:
1. Brett makes three new Inbound Webhook addresses in the GHL dashboard (one per workflow: free eBook, Book Brett,
   Master's Edge application). Walk him through one at a time; GHL workflows cannot be edited through the API.
2. Save each in Vercel (production) as `GHL_EBOOK_WEBHOOK_URL`, `GHL_BOOK_BRETT_WEBHOOK_URL`,
   `GHL_APPLY_WEBHOOK_URL` (the route already reads them first). Never paste them into the repo or the notes.
3. Remove the three fallback addresses from `src/app/api/ghl-form/route.ts`, redeploy, test each form with a real
   entry (Brett's OK first: it creates a real lead), then turn the old webhook triggers off in GHL.
Also ask Brett whether spam still arrives; have him forward any that gets through, then widen
`src/lib/spam-signals.ts` (tests first). Offered, not decided: Cloudflare Turnstile as a second layer.

**12 Nov 2026 (Session 42, last), /media-kit BOTTOM BAND, LIVE (Brett: "push it all live … this is our new source of truth"):**
the last stock photo (`/heroes/speaking.jpg`, another speaker) is gone from the site: "Ready to Book Brett?" now sits over Brett smiling at
the room (Phoenix 10:59.7, wider camera), placed at the left edge so he shows beside the panel (`media-kit-final-phoenix-3.jpg`, 2760x1080:
the frame plus a blurred extension to the right). horizon-check PASS.

**12 Nov 2026 (Session 42, later), MORE BACKGROUND VIDEOS, LIVE (Brett: "all of these updates … are great. lets make this live and our new source of truth"; main `a7bb3c8`, every video and still checked byte-identical on www.brettlechtenberg.com):**
Brett: "go with your suggestions … different clips for each page … keep it private". Every page now has its own clip (grey, 10 s, still =
first frame): /book-brett hero = Phoenix 3:56 (Brett head to knees, `book-brett-hero-phoenix.mp4`); /media-kit hero = NO video (Brett didn't
like it): a still of Brett smiling (Phoenix 10:08.9, `media-kit-brett-smile3.jpg`, `beside` layout; 300px of blurred wall added above
the frame so the menu bar never covers his face); /testimonials hero = the earlier USA Martial Arts talk 11:59.5 (`testimonials-hero-usama.mp4`,
source `Brett's Sizzle Reel/Source Videos/Brett_Lechtenberg_Speech USAMA.mov`); /speaking bottom band = Phoenix wide, room raising hands 0:06
(`speaking-final-phoenix.mp4`, `FinalCta` has a new `video` prop); homepage Speaking card = Brett smiling, same moment (`speaking-card-phoenix-smile2.jpg`; first pick had "a weird expression").
Image files get a new name when replaced: Next/Vercel cache optimized images by URL.
Then (Brett: /speaking "initial image is a little frozen … should at least have my eyes open"; "both could use a better smile"): /speaking
hero still = the loop's frame at 1.5 s (`speaking-phoenix-2.jpg`, eyes open) and `PageHero videoStart={1.5}`: `HeroVideo` now loads, waits
1.5 s (was 2.9 s), seeks to `start` and plays, then fades in, so the photo-to-video change is seamless. Card + /media-kit = Phoenix 10:06.6
(big smile, eyes open): `speaking-card-phoenix-smile3.jpg`, `media-kit-brett-smile4.jpg`.
This replaces every use of the stock `/heroes/speaking.jpg` except the /media-kit bottom band. `HeroVideo` now takes an `id` (toggle via
`aria-controls`) so a page can have two, and loads only when near the screen. horizon-check PASS on all five pages; lint + build pass.

**12 Nov 2026 (Session 42), /speaking HERO VIDEO, LIVE (Brett approved; main `27440b5`, verified on brettlechtenberg.com, horizon-check PASS live):** the
stock "speaker on stage" hero photo is replaced by a 10-second grey loop of Brett from the Phoenix "Raise Your Stone" talk (Brett picked
take "C3", source 11:49.66; `public/videos/speaking-hero-phoenix.mp4`, 0.8 MB; still = its first frame, `public/heroes/speaking-phoenix.jpg`).
`PageHero` has a new optional `video` prop (`src/components/horizon/HeroVideo.tsx`): loads only on screens 768px+ with motion allowed and
Data Saver off (phones and reduce-motion keep the still), fades in after the hero's load animation, pause/play button (WCAG 2.2.2), same
`--pos`/`--shift` as the photo (shift 18% on wide screens keeps Brett left of the copy and a child at the frame edge out of view).
horizon-check PASS (1440/1920/2560). The bottom "First Step" band still uses the stock photo. Project notes:
`~/Desktop/BL - Brett Lechtenberg/Projects/Website Background Video - Nov 2026/`.

**12 Nov 2026 (Session 42), SIZZLE REEL v5.10 LIVE:** `public/videos/sizzle-reel-2026.mp4` replaced with v5.10 (Brett approved):
three shots from the 7 Nov Phoenix "Raise Your Stone" talk + background music down 40%. Same length (3:26.6), so the "3:27"
captions on /speaking, /media-kit and /book-brett are unchanged; poster unchanged (same opening). Master + rollback (v5.7 archive):
`~/Desktop/BL - Brett Lechtenberg/Projects/Brett's Sizzle Reel/00 CURRENT - APPROVED (v5.10 FINAL, 12 Nov 2026)/`.

**10 Nov 2026 (Session 41), LIVE (main `eec1779`, Vercel Ready, re-tested on brettlechtenberg.com): SPAM FILTER.**
Brett was getting fake leads on the PMMA site (example: `l.e.k.uv.i.m.o.v.u.j353@gmail.com`, message
`cveyQWXcRnQplXSeWVxDI`), sent by a real browser so the usual bot checks pass; he asked for the same fix here.
Same filter as the PMMA site (`src/lib/spam-signals.ts`, layer 5 of `checkBotSignals`): refuses a Gmail address with
4+ dots and a name, company or message that is one random mixed-case word; answers 422 "please email brett@" (never a
silent drop). The eBook box, /book-brett and /masters-edge-program/apply used to post straight from the browser to
GoHighLevel with no checks; they now go through `/api/ghl-form` (bot gate + filter, body forwarded unchanged, so the
GHL workflows see the same fields). `/api/workbook-lead` got the gate too; honeypot is now read-only + hidden (TSAI's
4 Nov AutoFill fix). /book-brett no longer shows "Request Received" when the filter refuses. Tests:
`node --test --experimental-strip-types scripts/spam-signals-unit-test.ts` (3). Live checks 10 Nov: spam refused on
all five forms (eBook, Book Brett, Apply, team quiz, workbook) and in a real browser on the three page forms; a
real-person entry was tested only locally against a stand-in (a live one would create a real GHL lead). Sister
changes the same day: PMMA `0ddcfa2`, TSAI-Site `418dc50`.

**State before Session 41:** everything committed, pushed and live (main = `a3763b7`, Vercel Ready, checked on brettlechtenberg.com).
Session 40 = the site no longer looks narrow on big monitors (see the "Session 40" entry below; no open items from it;
next is still Brett's plan below, item 1 = own CRM). Earlier state: main was `ddff9f2` / `horizon-inner` before Sessions 38–40. Horizon redesign
COMPLETE on every public page; workbook typing fix + samurai background; Bill's quote = book back cover; no prices on
the site; full-site ESLint 0/0. Details in the Session 37 entries below.

**1 Nov 2026 (Session 38), LIVE (main f3b33f9):** /masters-edge book band cover is now the `Book3D` (real spine, hover
turn, `.cover-3d`); /books free Rockstar Team eBook is a straight `Book3D` from the real eBook cover
(`public/horizon/books/rockstar-team-cover.jpg`, page 1 of the PDF), tilted white card removed, hover turn on the whole card.
Workbook (`/masters-edge/workbook`): toolbar now pinned at the very top (`sticky top-0`, no `pt-24`); it had left
room for a site menu the workbook never had, showing a gap above it (main 4efb144).

**1 Nov 2026 (Session 39), LIVE (main dd2cbcb): POWER HUB + BUDGET & SALES.** `/hub` is now the **Power Hub** (left
menu: Dashboard (Budget) · Monthly Setup · Messaging · Academy · CRM soon); login lands on `/hub/budget`, a port of the
PMMA Budget fitted to Brett: 6 income lines (group / individual coaching, company / hourly consulting at $500/hr, other,
not-BL-business), Stripe read-only catch-up (`BL_STRIPE_READ_KEY`), checks / transfers / cash / other, calendar-day pace,
Clients + Needs-attention cards, CSV, 19th/20th reminders (OFF). 5 new `bl_budget_*` tables (Brett ran the SQL; RLS on).
New `HUB_PASSWORD` set by Brett. November set up by Brett. Everything: `docs/BUDGET.md`. Plan item 2 below = DONE (income
side); expenses come after the income dashboard is proven. Open: monthly CSV backup outside Supabase + check Supabase
backups (free plan); Stripe matching words are guesses until real BL payments arrive.

**1 Nov 2026 (Session 40), LIVE: WIDE SCREENS.** Brett: the site looked narrow on big monitors. Every size, gap and
font in `src/styles/horizon.css` is now `calc(Npx * var(--bl-k))`; `--bl-k` = 1 below 1680px (phones/tablets/laptops
pixel-identical to before, checked on all 19 pages), then 1.08 / 1.15 / 1.24 / 1.32 at 1680 / 1880 / 2160 / 2440px.
Section padding (`--sec-pad`), footer padding, form-card padding and the praise quote mark stay unscaled so empty
bands stay under the Horizon 220px limit. Quiz + Privacy/Terms (Tailwind) scale via Tailwind's size variables on
`.quiz-host` / `.legal`. **Any new CSS in horizon.css: write px sizes as `calc(Npx * var(--bl-k))`.** All pages pass
`horizon-check.cjs` at 1440/1920/2560; no sideways scroll up to 3840px.

**NEXT SESSION — Brett's plan (31 Oct 2026):**
1. **Build our own CRM and retire Go High Level.** This CONTINUES the existing **Edge CRM** project (say "resume Edge
   CRM"; notes `docs/crm/RESUME-PROMPT.md` + `docs/crm/DECISIONS.md`): Phase 1 shipped 17 Sep 2026 (/hub off GHL: Twenty
   CRM + Resend); Phase 2 plan (`docs/crm/05-PHASE2-PLAN.md`) has been waiting for Brett's approval since then. Start there,
   don't start a new CRM. **2 Nov 2026: TSAI's first form (GEW free book, totalsuccessai.com/gew) was built on Edge CRM** in
   TSAI-Site branch `wip/2026-11-02-gew-book-download` (see `docs/crm/RESUME-PROMPT.md`); reuse its `lib/lead.ts` pattern here. Every GHL touch point still on this site today (move each one over, then remove GHL):
   - Booking link `links.booking` in `src/lib/utils.ts` (GHL booking widget) — used by every "Talk With Brett" button.
   - Book Brett form → GHL webhook (`src/app/book-brett/page.tsx`).
   - 12-Week Program application → GHL webhook + tags (`src/app/masters-edge-program/apply/page.tsx`; tags
     me-lead, ME - Group Coaching Interest, ME - Personal Coaching Interest, ME - Wants Call).
   - Free eBook form → GHL webhook (`src/components/ui/EbookModal.tsx`).
   - Rockstar Team Quiz → `/api/team-lead` → env `GHL_TEAM_WEBHOOK_URL` (`src/app/api/team-lead/route.ts`).
   - Workbook started/completed → `/api/workbook-lead` → env `GHL_WORKBOOK_STARTED_URL` / `GHL_WORKBOOK_COMPLETED_URL`.
   - Comms Hub messaging (`src/lib/messaging-render.ts`, "GHL lead" merge vars; hub email deliverability item below).
   Supabase (project `yrfsquzzbgnmkfbuapfk`, already used by the Academy + Comms Hub) is the natural home for contacts.
   Plan first, keep every form working during the switch, and test with webhooks intercepted (never real test leads).
   Load the `durable` skill before creating or reshaping any stored data.
2. ~~**Build our own budgeting workflows**~~ DONE 1 Nov 2026 (income side: Power Hub → Budget, `docs/BUDGET.md`); expenses next, after it's proven.
3. **Connect the site to the Brettlechtenberg Stripe account** (`acct_16xJo3Kq6AqfCeIO`). The Academy already uses it
   (see "STATE AT END OF SESSION 30": `src/lib/stripe.ts`, `api/academy/checkout`, `api/stripe/webhook`; key in Vercel
   prod + `.env.local`, rotate with `scripts/add-stripe-key.sh`). Next: coaching/program payments once Brett sets his
   new pricing models (prices were removed 31 Oct; they go back in the 12-Week Program "Two Ways to Work With Brett"
   section and the Apply options).


**Updated:** September 27, 2026 (end of Session 32: website copy + one-sheets)
**Since then:** Oct 9, 2026, Session 33: TSAI logo image fixed on /about and /ai-advisory (`0def7f4`, live).
Oct 11, 2026, Session 34: sizzle reel v5 (3:25) replaced v3.1 in `public/videos/sizzle-reel-2026.mp4`; captions 2:56 -> 3:25 on /speaking,
/media-kit, /book-brett (`a482d98`, live, verified). Reel project: `~/Desktop/BL - Brett Lechtenberg/Projects/Brett's Sizzle Reel/RESUME_PROMPT.md`.
Oct 18, 2026, Session 35: sizzle reel v5.7 (3:27) replaced v5 in `public/videos/sizzle-reel-2026.mp4`; captions 3:25 -> 3:27
(v5 archived in the reel project for rollback).
Oct 16, 2026: Academy Forge engine upgrade (`0e93315`, live via vercel --prod): the academy gained "Back to main site"
(header, menu moves to a second row; and a big button at the foot of every academy page), Change password on Profile,
and the light/dark fix. Member surveys are installed but OFF (`src/content/academy/surveys.ts` empty) until Brett
approves `~/Desktop/BL - Brett Lechtenberg/Projects/Academy Upgrade - Oct 2026/Survey questions - DRAFT for approval.md`;
before turning them on, paste `supabase/academy-schema.sql` in BL's Supabase SQL editor (no access token here).
Later on Oct 16 (`0c5b17b`, live): surveys turned ON with PROPOSED questions so Brett can try them (database done; Brett is
on the survey team). Wording edits go in `src/content/academy/surveys.ts`.
Restore tag `pre-engine-upgrade-2026-10-16`. Engine notes: `~/dev/academy-forge/RESUME-PROMPT.md`.
Oct 20, 2026, Session 36: THE MASTER'S EDGE BOOK IS OUT (published Oct 19: paperback amazon.com/dp/B0HNHZ2D7M,
Kindle amazon.com/dp/B0HNJ378J6). Every "coming October 2026" is now "out now": /books/masters-edge rebuilt (real cover,
Buy Paperback / Kindle buttons, about-the-book, 19 chapters, Sam Beard quote, Book JSON-LD with ISBN, new OG image
public/books/masters-edge-og.jpg), /books card, /masters-edge (new book band), /media-kit (bio + real cover), /about,
/speaking, llms.txt, Academy book-course banner (public/academy/covers/masters-edge-book.jpg), both one-sheets
re-rendered + synced. Later Oct 20: Brett confirmed EIGHT books (5 bestsellers); count updated site-wide (home, /about, /books, /media-kit,
/speaking, /book-brett, /masters-edge-program) + one-sheets, business card, pull-up banner re-rendered and synced.
Still open: the published book's About the Author + KDP description still say "seven books" (book project, not this repo); /books hero background
still uses the old stack mockup (pre-publication cover, dimmed); Bill's quote deliberately NOT added to the book page.
Nothing else changed; the state below still holds.

**Oct 30, 2026, Session 37: HORIZON REDESIGN LIVE (Version D).** Brett approved and it went live on main.
New home page plus new header and footer on all 20 public pages, built from the Horizon master
(`~/dev/pts-style-mockups/HORIZON-D-MASTER.md`, tag `horizon-d-master`) in Brett's brand (Montserrat + Inter;
cranberry/gold/black/white). Same words, links, numbers, forms, academy, analytics and SEO. Files: `src/styles/horizon.css`
(scoped `.bl-h`), `src/components/horizon/HorizonMotion.tsx`, `src/components/layout/Header.tsx` + `Footer.tsx`, motion flag in
`src/app/layout.tsx`, photos in `public/horizon/` (Limitless hero from Brett's original file; compass + climber CC0 rawpixel).
Good Things Utah video loads from YouTube only on Play (Brett OK'd). "How Brett Works With You" = three cards side by side
(Brett: the sideways strip looked out of balance on full screen). Inner pages kept their own content; only header/footer changed.
**Restore point:** tag `pre-horizon-2026-10-30` (main before this). Every change must pass
`node ~/dev/pts-style-mockups/_tools/horizon-check.cjs https://www.brettlechtenberg.com/` (empty band ≤ 220px).
Not done (Brett's call): restyling the inner pages' own content in Horizon.

**Oct 30, 2026, Session 37 (later): HORIZON INNER PAGES, GROUP 1 LIVE (About, Coaching, The Master's Edge).**
Brett chose **Option A**: dark Horizon tops and feature bands, warm off-white (`--paper`) for reading sections; gold never as
text on light. Shared kit: `src/components/horizon/kit.tsx` (HorizonPage, PageHero, FinalCta, Btn) + the inner-page block
in `src/styles/horizon.css` (`.bl-h-page`, `.sec-paper` / `.sec-night`, cards, quotes, honors). `HorizonMotion` now runs on
any page with `.bl-h-motion` (home + inner). The header stays transparent over photo tops only on paths listed in
`src/components/horizon/pages.ts`: **add each page there when it is converted.** About: top photo = Brett receiving his
8th Dan certificate from Grand Master Na (`public/horizon/about-8th-dan-certificate.jpg`, Brett's pick; the karate kid
"has nothing to do with me"); The Journey = travelling golden line (`src/app/about/Journey.tsx`); "Also" = five honor cards.
Words checked word-for-word against the live pages (only change: About's five typed "•" became drawn dots).
**Restore point:** tag `pre-horizon-inner-2026-10-30`. **Next:** Group 2 (Speaking, AI Advisory, 12-Week Program,
Testimonials), then 3 (Books, Master's Edge book, Media Kit, Blog), then 4 (Book Brett, Contact, Apply, Thank-you, Quiz,
Privacy, Terms: look only, forms and quiz logic untouched). Each group: preview + Brett's OK before main.

**Oct 30, 2026, Session 37 (later): HORIZON INNER PAGES, GROUP 2 LIVE (Speaking, AI Advisory, 12-Week Program, Testimonials).**
Kit additions in `src/components/horizon/kit.tsx`: `LogoStrip` (single client-logo list; home uses it too), `VideoPoster`
(YouTube loads only on Play), `Stats`. Speaking talks = `src/app/speaking/TalkCard.tsx` (flagship open, others collapse);
12-Week questions = `src/app/masters-edge-program/ProgramFaq.tsx` (all answers show without JS). Word check vs live:
AI Advisory + Program identical; Speaking only its 4 counters (real numbers instead of "0+"); Testimonials only the 6
initials badges (now real photos). AI Advisory top = `public/horizon/ai-advisory-soft.jpg`; video posters in
`public/horizon/video/`. **Hover pop** on every box (Brett's request), site-wide at the end of `horizon.css`: uses the
`translate`/`scale` properties because the scroll-in animation leaves an inline `transform` that cancels :hover transforms.
**Gap check at 2560x1300:** the official `horizon-check.cjs` ignores a SIZES env var; patch a copy to test Brett's screen.
**Next:** Group 3 (Books, Master's Edge book, Media Kit, Blog + posts), then Group 4.

**Oct 31, 2026, Session 37 (cont.): HORIZON GROUP 3 LIVE (Books, The Master's Edge book, Media Kit, Blog + 5 posts).**
- `Book3D` in `src/components/horizon/kit.tsx`: a real cover on a CSS 3D book. Master's Edge + Powerful AI use their
  real spines (cut from the print cover PDFs into `public/horizon/books/*-spine.jpg`). Desktop's 3D "Bullyproof" image is
  Volume 4, a different book: do not use it.
- Blog posts: progress bar, sticky "In this article" guide (`src/app/blog/[slug]/PostToc.tsx`), numbered sections,
  drop cap, "Keep reading". Post dates format in UTC (were a day early when built in Utah).
- Flow state post: **no Jamie Wheal** (Brett has no relationship with him), Flow Research Collective / Kotler down to
  one plain-text credit, and **no links to the Flow Research Collective anywhere** (no ongoing relationship).
- **Fonts are stored with the site** (`src/fonts/`, `next/font/local` in `src/app/layout.tsx`): builds no longer
  download from Google Fonts, which failed two Vercel builds. Never switch back to `next/font/google`.
- Readability scan of all converted pages: `/tmp/g1/contrast.cjs` (recreate if gone) – all pass.
- **SEO fix:** `/masters-edge-program`, `/apply`, `/thank-you`, `/privacy`, `/terms` were inheriting the home page's
  canonical (root layout default). Each page now sets `alternates.canonical` to itself; thank-you (noindex) is out
  of the sitemap. **Every new page must set its own canonical.**
**Oct 31, 2026, Session 37 (cont.): HORIZON GROUP 4 LIVE. Every public page is now in the Horizon design.**
Book Brett, Contact, Apply, Thank-you, Rockstar Quiz, Privacy, Terms. Forms unchanged in behaviour (submit handlers
byte-identical to before; same field names, required marks, options, Go High Level webhooks, tags, redirect); labels
now tied to fields. `src/components/RockstarTeamQuiz.tsx` untouched (it sits outside the Horizon wrapper in
`.quiz-host`). Privacy/Terms legal text untouched, shown in `.legal` / `.legal-sheet` (plain CSS, outside `.bl-h`).
Quiz top photo `public/horizon/quiz-team-soft.jpg` (lightly smoothed America First team photo). Books: free-eBook
form loads on demand (`next/dynamic` in `src/app/books/BooksClient.tsx`). **Testing forms:** intercept the webhooks
(never submit test data to the real Go High Level hooks or `/api/team-lead`).
**Not converted on purpose:** `/academy` (own design), `/hub`, `/quiz-results-gallery`.
Books top photo = `public/horizon/books-shelf-soft.jpg` (lighter copy): live slow-phone LCP ~2.0–2.6s (was ~3.0s).
**Workbook (`/masters-edge/workbook`, hidden course):** typing bug fixed 31 Oct (helpers moved outside the page; test:
type a sentence into every box in all 4 weeks). Background = the site's samurai drawing, greyscale at 30% (Brett).
Full-site ESLint is now 0 errors / 0 warnings: keep it that way.
**No prices on the site (Brett, 31 Oct 2026: changing his pricing models).** 12-Week Program "Investment" section is now
"Two Ways to Work With Brett" (Group Coaching = the cohort; Personal Coaching = one-on-one, links to /coaching); details
and investment "shared personally in your conversation with Brett". Apply form question is now "Which coaching option
are you interested in?" (group / personal / not-sure). Go High Level tags: "me-lead" and "ME - Wants Call" unchanged;
"ME - Founding Member Interest" / "ME - Pay in Full Interest" replaced by "ME - Group Coaching Interest" /
"ME - Personal Coaching Interest"; field `investment_preference` kept (now holds the option label).
**Restore points:** `pre-horizon-2026-10-30` (before any Horizon), `pre-horizon-inner-2026-10-30` (home only).

A copy of this file is also at `~/Desktop/BL - Brett Lechtenberg/Projects/_Resume Prompts Archive/Collected 2026-09-28/From Desktop/BrettLechtenberg-Site-RESUME-PROMPT.txt`
(filed off the Desktop 2026-09-28; move log: `~/Documents/File Organization Records/2026-09-28/MOVE-LOG.md`).
Paste the block below into a fresh session.

---

```
Resume work on brettlechtenberg.com (website, speaker one-sheets, and the Master's Edge Academy LMS).

Repo: /Users/brettlechtenberg/dev/BL-2026-Personal-Site  (ONLY this path)
Live: https://www.brettlechtenberg.com   Deploy: `git push origin main`
      (Vercel GitHub auto-deploy fired on every push Sep 27 2026, ~5-9 min per build;
       check `vercel ls --yes`. Fallback only if nothing builds: `npx vercel --prod --yes`)
      PUSH NOTE: the Mac's active gh account is PMMARocks, which gets 403 on this repo.
       Run `gh auth switch -u BrettLechtenbrerg` before pushing (or push with that token).

ADD A LESSON (the usual job now — one line, the `academy` skill does the rest):
  Take ~/Desktop/<file> and add it as a lesson in the business-tools course in the BL.com academy.
  Cheat sheet: ~/Desktop/LMS-HOW-TO.md · prompts: ~/dev/academy-forge/docs/lms/PROMPTS.md · resume: Academy: resume ~/Desktop/LMS - <Title>/

ACADEMY ENGINE (Sep 19 2026): the Academy is now the shared **Academy Forge** engine
  (~/dev/academy-forge — one engine, four brands: BL.com · PMMA · TSAI · GIFT CONNECT).
  BL is consumer #1. Engine files under src/app/academy, src/components/academy, src/lib/academy-*
  are OVERWRITTEN by `bash ~/dev/academy-forge/install.sh bl` — fix engine bugs in the Forge, then reinstall.
  Brand values: src/content/academy.config.ts (generated from brands/bl/academy.json). Tag `pre-academy-forge` = before.

READ FIRST, in order:
  1. docs/SESSION-NOTES.md  — top section (Session 31: Lesson Forge; Session 30: paywall)
  2. docs/ACADEMY.md        — how the Academy is built; "Paywall" section
  3. CLAUDE.md              — project rules + page inventory

FIRST COMMANDS:
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site pull
  git -C /Users/brettlechtenberg/dev/BL-2026-Personal-Site status

STATE AT END OF SESSION 32 (Sep 27, 2026) — everything committed, pushed, deployed, verified live:
- Did ALL of Website-Fixes-For-Coding-Agent.md (tasks 1-5) and
  Speaker-Sheet-Changes-For-Coding-Agent.md (both now in ~/Desktop/Brett's Personal File Website -
  Resume - Coaching Programs 2026/Website and Speaker One-Sheet - Sept 2026/). Brett's writing rules = section 2
  of the website file; the terminology rules are now in CLAUDE.md "Credential Standards".
- /speaking: new wording, testimonials (Lindsey Powers under the reel; Danny Larson,
  Sam Beard, Bill Schuffenhauer in grid), Flow Research Collective pull quote, gallery
  captions with real event names, logo strip in Brett's client order (USA Martial Arts hidden).
- /media-kit: 10 talks, new bios/intros, reel under the one-sheet, Stage and Event Photos,
  Master's Edge cover. Talk subtitles now MATCH /speaking; A Category of One uses
  "Position Yourself So Far Ahead That Comparison Becomes Irrelevant" everywhere.
- /books: Powerful AI Strategies for Business Owners added (cover public/books/powerful-ai-strategies.jpg,
  Amazon dp/B0HH6YZYQV). The Master's Edge = "Coming October 2026".
- /masters-edge: Layer 1 The Science (Three Pillars: First Principles, Frontloading, Flow),
  Layer 2 The Methodology (Mind, Skills, Systems: Mindset Mastery, Skillset Enhancement,
  Systems Design), Layer 3 The Transformation. Workbook pairs them per week.
- Site-wide copy sweep: no em dashes, banned words, acronyms or AI-sounding phrasing
  (two bee sub-agents + manual passes).
- One-sheets rebuilt from scripts/one-sheet/*.html (website + agency), synced to all three
  branding folders. render.cjs now prints a page-fit check and accepts CHROMIUM_PATH.

DONE (Oct 31 2026): Bill Schuffenhauer's quote now matches the back cover of The Master's Edge everywhere
(source of truth, see CLAUDE.md). Both one-sheet PDFs re-rendered and synced to the three branding folders.

OPEN QUESTIONS FOR BRETT (nothing blocked; don't guess):
- RESOLVED Oct 20 2026: Brett says 8 books, 5 bestsellers.
- Pull-up banner (scripts/one-sheet/pullup-banner.html) still says "8 U.S. Presidents";
  one-sheets and website now say "8 United States Presidents". Re-render banner if Brett wants.
- Agency one-sheet page 2 bottom sits ~0.3in into the margin (was like this before Sep 27;
  nothing is cut off). Tighten only if Brett asks.

STATE AT END OF SESSION 31 (Sep 19, 2026):
- Academy Lesson Forge built: scripts/academy-lesson.mjs (init/validate/add/price/
  produce/narrate/ship/status/run), lesson.json schema, docs/lms/*, skill
  ~/.gg/skills/academy.md, narration via ~/dev/audiobook-studio/narrate.sh
  (Kokoro am_michael). Parked ideas: docs/lms/PARKED.md.

STATE AT END OF SESSION 30 (Sep 8, 2026) — everything committed, pushed, deployed:
- Academy per-course PAYWALL is LIVE and smoke-tested in production.
  Signup is free/open (enrollment code EDGE2026 is RETIRED). Each course is a
  one-time Stripe purchase: Framework $99, Business Tools $499, Reclaiming the
  Clock $499, Master's Edge Book $999 — or free with that course's gift code:
  FRAMEWORK-3CTT · TOOLS-V384 · CLOCK-2JJU · BOOK-SXBP (unlimited redemptions).
  Ownership = me_course_access table. Brett's account owns all 4 (legacy).
- Stripe: account "Brettlechtenberg" (acct_16xJo3Kq6AqfCeIO), LIVE mode.
  Products/prices/coupons/webhook all created there. Secret key is in Vercel
  prod + .env.local only (rotate with scripts/add-stripe-key.sh). Stripe CLI is
  paired to that account (`stripe login` if it expired).
- Code map: src/lib/academy-access.ts (ownership), src/lib/stripe.ts,
  api/academy/checkout, api/stripe/webhook, academy/checkout/success,
  modules/[slug]/page.tsx (server-side Locked panel), ModulesGrid (Unlock button).
- NotebookLM batch FINISHED all 43 modules Sep 8 16:16 UTC; LaunchAgent unloaded.
  Nothing is running in the background.
- Brett's operator one-pager: ~/Desktop/Academy-Course-Access-Guide.pdf
  (regenerate: python3 scripts/academy-onepager.py ~/Desktop/Academy-Course-Access-Guide.pdf)

KNOWN LIMITS / IDEAS (not started):
- Media files under public/academy/<slug>/ are public by URL (lesson text,
  flashcards, quizzes ARE gated). Upgrade: private Supabase Storage + signed URLs.
- Gift codes are unlimited-use; make single-use ones in Stripe → Coupons when needed.
- Preview mode still ON inside owned courses (all modules open); linear
  unlock is one commented line in unlockedSlugs() (src/content/academy/modules.ts).
- Sizzle-reel homepage placement (see STATE.md). Quizzes stay hand-written.

Supabase project ref: yrfsquzzbgnmkfbuapfk (Comms Hub + Academy share it).
If paused, docs/SESSION-NOTES.md has the one-line restore command.
Management API token is in macOS Keychain: security find-generic-password -s "Supabase CLI" -w
```

---

## Quick facts (if the docs are unavailable)

- **Working dir:** `/Users/brettlechtenberg/dev/BL-2026-Personal-Site`
  (NEVER `~/Desktop/Claude Projects/...` — dead iCloud copy, corrupts git)
- **GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site
  (gh account `BrettLechtenbrerg`)
- **Academy admin:** `brett@brettlechtenberg.com` (`me_users.role = 'admin'`);
  signup is open (no code); admin review at `/hub/academy`.
- **Stripe:** dashboard.stripe.com → account **Brettlechtenberg** (not
  "Personal Mastery M…"). Webhook endpoint `we_1UDY6lKq6AqfCeIObUIYlrqP`.
- **NotebookLM:** Google AI Pro account, logged in via `notebooklm` CLI
  (`~/.notebooklm/profiles/default/`). Re-auth: `notebooklm login --browser chrome`.
- **Supabase keep-alive:** Vercel cron daily + GitHub Actions 2×/day
  (`.github/workflows/supabase-keepalive.yml`), auto-restores if paused.

## Older open items (pre-Academy, still parked)

- **Hub email → spam** — needs GHL dedicated sending domain DNS. Hub SMS parked
  (location has no phone number). Context: `docs/COMMS_HUB.md`.
- **Speaking stats verification** — 100+/50+/10K+ bar omitted; verify or retire.
- **AFCU letter of recommendation** (Lindsey Powers) — replace her text quote
  card on /speaking when it arrives.
- Sizzle reel v3.1 swipe-cut variant awaiting Brett + Rupert review.
