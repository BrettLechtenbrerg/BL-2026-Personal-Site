# BL 2026 Personal Site - Project State

**Last Updated:** August 6, 2026 (Session 20)
**Current Phase:** ✅ LIVE - Site launched at brettlechtenberg.com

---

## Current Focus

**Status:** Site is LIVE at brettlechtenberg.com - All systems operational.

### Completed (August 6, 2026 — SESSION 20: CLEANUP + MASTER'S EDGE HERO SWAP)

- ✅ **/hero-test DELETED** (open item closed) — leftover April Session 3
  hero A/B/C comparison page + 3 unused HeroOption components removed
  (`16fa3af`). Verified live 404. It had NO noindex, so it was an SEO risk.
- ✅ **/books/masters-edge hero image swapped** — new cleaner landscape
  bookstore-shelf mockup from Desktop `mockup-bookstore-shelf copy.png`,
  optimized 2.1MB PNG → 395KB JPG over the same path
  `public/books/masters-edge-shelf.jpg` (now 1536x1024 landscape).
  Image column widened max-w-md → max-w-xl; Image width/height props
  flipped to 1536/1024; alt text updated (no staff-pick card in new shot).
  Commits `5cc6d9a` + `236ea29`. Verified live via screenshot.

### Completed (August 5, 2026 — SESSION 19: AMERICA FIRST CREDIT UNION EVENT)

Brett delivered "Super Ethical Sales & Team Building" for America First Credit
Union's business development team, Aug 4 2026, 9–11am (booked by Lindsey Powers).

- ✅ Logo `public/logos/america-first.png` added to LogoScroller ticker (all pages using it) + masters-edge-program clientLogos
- ✅ Group photo `public/speaking-gallery/america-first-training.jpg` (optimized from Desktop PNG, ceiling cropped) — top-left large tile in /speaking "Brett in Action" bento; gallery reordered L,m,m,L,m,m,L,L for gap-free 5-row tiling
- ✅ Lindsey Powers text-message testimonial added as second card next to Matt Gibbons on /speaking
- ✅ Honest Close proof line now LIVE (rendered via new optional `proof` field on Talk): "Field-tested with America First Credit Union's business development team."
- ✅ Client-list text mentions added: /about "Also" bullet, /media-kit long bio + long intro, /speaking trust-bar SEO line

#### Session 19 continued (Aug 5, afternoon) — polish round
- ✅ HUB_PASSWORD ROTATED (open item #1 done!) — old bladmin/bl-dev-2026
  returns 401; new 20-char password verified 200 and stored in Brett's
  macOS Keychain (item "brettlechtenberg.com hub", account bladmin).
- ✅ /books/masters-edge CTA button fixed: white/black class conflict made
  "Talk With Brett" invisible → gold `secondary` variant.
- ✅ Master's Edge card on /books: bg image → device-bundle mockup
  `public/books/masters-edge-devices.jpg` (Brett rejected cover crop v1).
- ✅ Nav: "New: The Master's Edge" added to Books & Media dropdown →
  /books/masters-edge (desktop + mobile share nav data).
- ✅ America First ticker logo remade from AFCU's official site SVG,
  rendered 1240px in brand blue #00548E (Desktop PNG was 254px/ghosted);
  moved to slot 3 so it's fully visible on load (slot 1 hid under fade).
- ✅ Ticker speed/smoothness: 35s→24s loop + translate3d GPU compositing
  (fixes glitch that appeared when 12th logo lengthened the track).
- ✅ Ticker logo visual parity: trimmed internal padding from 6 logo files
  (packsize 76% pad, park-city 62%, usa-martial-arts 62%, murray 44%,
  purple 27%, membersolutions 14%) + per-logo `heightClass` in
  LogoScroller (squares 62-64px, ultra-wide 32-38px, default 50px).
- ✅ Rockstar quiz hero: "23+ years" → "30 years".
- ✅ FOUNDING DATE recorded in CLAUDE.md credential standards:
  **August 4, 1996** (30th anniversary Aug 4, 2026 — same day as the
  AFCU training). Compute years-in-business from this date.

#### Master's Edge book page — LIVE (Aug 5, same session)
- New public page `/books/masters-edge` (layout.tsx metadata + sitemap entry):
  hero with bookstore-shelf mockup (`public/books/masters-edge-shelf.jpg`),
  three-pillar "What's Inside" section, "Arriving 4th Quarter 2026" CTA.
  Deliberately NO specific release date — Q4 2026 only.
- /books hero background swapped to book-stack mockup
  (`public/books/masters-edge-stack.jpg`, replaces /heroes/books.jpg).
- Master's Edge card on /books: status now "Coming Q4 2026", clickable →
  /books/masters-edge ("Preview the book →" hint).
- Note: there was never a hidden book-release page; this was built fresh.

#### PENDING — America First letter of recommendation
Brett requested a formal letter of recommendation from Lindsey Powers (expected
within days after Aug 5). When it arrives: replace/upgrade the Lindsey Powers
text-message quote card on /speaking (marked with a code comment) and consider
adding it to /testimonials.

### Completed (July 3, 2026 — SESSION 18: DESIGN FLAIR + SPEAKING V3 PROMOTED)

#### Site-wide design flair ✅
- New utilities in globals.css: .text-shimmer, .shine (light sweep),
  .animate-float / -pulse-slow / -ring-pulse, branded scrollbar.
- New components: **TiltCard** (3D mouse-tracking tilt) and
  **AnimatedCounter** (count-up stats on scroll).
- Applied: all Buttons (shine), Header (scroll-aware glass + cranberry→gold
  scroll-progress bar + nav underlines), Footer, homepage Hero/Pathways/
  Credibility/Solution/Testimonials/MediaFeature/final CTA.
- TiltCard extended on request: /books cards, /testimonials cards (all 3
  sections), /about family photo. prefers-reduced-motion respected.

#### /speaking — v3 PROMOTED TO LIVE ✅ (replaces the v2-vs-v1 decision)
- v3 = v2's four-lane structure (10 talks) + v1's outcomes grid, bento
  "Brett in Action" gallery, Matt Gibbons testimonial + NEW "Live From
  the Room" section: 90s Juan Diego live speaking clip (LiveClip
  component, /videos/juan-diego-clip.mp4, cut from 8TB drive footage)
  paired with Danny Larson's Juan Diego testimonial.
- Talk cards are ACCORDIONS (Brett's wall-of-text fix): title/subtitle/
  duration always visible, details expand on click, flagship starts open.
- /speaking-v2 + /speaking-v3 routes DELETED. Live layout.tsx (indexed
  SEO metadata) untouched. Verified: index,follow · drafts 404 · video 200.
- Unverified stats bar (100+/50+/10K+) still omitted — open item #7.
- Honest Close proof line = placeholder comment in /speaking/page.tsx,
  uncomment after Aug 4.
- Video clip recommendations (not yet done): /book-brett, /media-kit,
  homepage, /masters-edge-program, YouTube speaker reel.

### Completed (July 3, 2026 — SESSION 2: COMMS HUB FULLY OPERATIONAL + MEDIA KIT PROMOTED)

#### Comms Hub — LIVE AND VERIFIED END-TO-END ✅
- **Full setup completed with Brett click-by-click:** Supabase project
  `bl-comms-hub` (yrfsquzzbgnmkfbuapfk) + migration + service_role GRANT;
  GHL PIT token "BL Coms Hub" on Brett's personal location (5 scopes incl.
  contacts.write); all 7 env vars set in Vercel via CLI.
- **Verified live:** login ✓ · 24 leads w/ tags loaded from GHL ✓ · inbox
  (17 conversations) ✓ · audit log ✓ · **EMAIL SEND DELIVERED** (Teresa
  test — landed in spam; dedicated sending domain TODO) ✓.
- **SMS: PARKED** — location has NO phone number. Send pipeline works
  (GHL accepted, status readback showed `failed` at carrier). Buy a number
  (~$1.15/mo) + A2P registration when ready; hub needs zero code changes.
- **NEW: Add/Delete leads from the hub** — "Add lead" modal (name/phone/
  email/tags, 409 on duplicates) + per-row trash w/ destructive confirm
  (permanently deletes from GHL). Verified live via API round-trip.
  Routes: POST /api/hub/leads + DELETE /api/hub/leads/[contactId].
- **NEW: login show/hide toggles** on username + password fields.
- **Cloneability documented** in docs/COMMS_HUB.md: site + hub clone as ONE
  unit (all env-driven, zero hardcoded ids in the hub); GHL rebuild only
  needs a new PIT + 2 env vars. Watch-outs: apply + book-brett pages have
  hardcoded webhook URLs a different-business clone must swap.
- **✅ CREDENTIALS ROTATED (Aug 5, 2026):** password in Brett's macOS
  Keychain ("brettlechtenberg.com hub"); old bl-dev-2026 login dead.

#### /media-kit — v2 PROMOTED TO LIVE ✅ (July 3, session 2)
- Four-lane Talk & Training Topics is now the real /media-kit.
- /media-kit-v2 draft route DELETED. Indexing metadata untouched (live
  layout.tsx was never modified).

#### /speaking-v2 — RESOLVED in Session 18 (v3 promoted, see above)

### Completed (July 3, 2026 — SESSION 1: V2 DRAFT PAGES + COMMS HUB BUILD)

- Built /speaking-v2 + /media-kit-v2 hidden drafts from Desktop spec
  `CLAUDE_CODE_SPEC_Speaking_Page_v2.md` (four lanes, 10 talks, no
  unverified stats).
- Built the Comms Hub (Leads-only clone of PMMA's system per Desktop
  `PMMA-MESSAGING-CLONE-GUIDE.md`): /hub login + /hub/messaging
  (Compose/Inbox/Log), HMAC credential-bound sessions, guarded /api/hub/*
  routes, rate-limited login, locked-down hub_messages audit table.
  Full architecture + env vars + scopes + test plan: **docs/COMMS_HUB.md**.

### Completed (June 3, 2026 - HIDDEN COURSE SYSTEM)

#### The Master's Edge Interactive Workbook (new hidden course)
- Built `/masters-edge/workbook` — an interactive 4-week participant workbook
  (Clarify → Simplify → Maximize → Integration), ported from the TSAI hidden-
  workshop pattern to this site's stack/brand (Tailwind v4, Lucide, cranberry/gold).
- Features: sticky progress toolbar, section tabs, localStorage autosave,
  PDF export (html2pdf CDN), email-results mailto, help modal, 7-day habit trackers.
- HIDDEN via `robots:noindex` layout + not in sitemap + not linked in nav.
  Verified live: page returns 200 with `noindex`. Share URL directly with cohorts.
- Content sourced from Masters-Edge-Workbook.docx (Feynman/Sun Tzu/Bruce Lee/
  Durant quotes, "The Idea," pillars, habits, in-room exercises).

#### Lead capture (GHL) — wired, automation TODO
- `src/app/api/workbook-lead/route.ts` fires `started`/`completed` events.
- INERT until env vars set in Vercel: `GHL_WORKBOOK_STARTED_URL` /
  `GHL_WORKBOOK_COMPLETED_URL`. Leads accepted + logged but not forwarded
  until then (page never breaks). Flagged with TODO in the route file.

#### Documentation added
- `docs/COURSE_PATTERN.md` — canonical, step-by-step recipe for adding new
  hidden interactive courses (copy the workbook as template; module-level field
  components to avoid focus loss; how to promote a course to public).
- Desktop restart prompt: `~/Desktop/BrettLechtenberg-Site-RESUME-PROMPT.txt`.

### Completed (April 19, 2026 - Session 14 - GHL WEBHOOK FIX)

#### Master's Edge Application Form - GHL Integration Fixed
1. ✅ Created new Inbound Webhook trigger in GHL "Master's Edge Nurture" workflow
2. ✅ Removed old Contact Tag trigger (was causing issues)
3. ✅ Updated webhook URL in application form code
4. ✅ Flattened payload structure for easier GHL field mapping
5. ✅ Set up Create Contact step with field mappings (email, name, phone, company)
6. ✅ Configured Create Or Update Opportunity (Master's Edge pipeline → New Lead)
7. ✅ Built Internal Notification email with all application details
8. ✅ Configured Add Tag step (me-lead)
9. ✅ **TESTED & VERIFIED WORKING:**
   - Contact created ✅
   - Opportunity created ✅
   - Tag applied ✅
   - Internal notification received ✅
   - Nurture sequence triggered ✅

#### GHL Webhook Payload (11 Fields)
| Field | Description |
|-------|-------------|
| `firstName` | First name |
| `lastName` | Last name |
| `full_name` | Full name |
| `email` | Email address |
| `phone` | Phone number |
| `company_name` | Business name |
| `job_title` | Role/title |
| `revenue_range` | Annual revenue |
| `referral_source` | How they found you |
| `main_challenge` | Their #1 challenge |
| `success_outcome` | What success looks like |
| `investment_preference` | Human-readable label |
| `additional_info` | Extra notes |
| `tags` | Comma-separated tags |
| `source` | "Master's Edge Program Application" |
| `submitted_at` | Timestamp |

### Completed (April 18, 2026 - Session 13 - COPY UPDATES)

#### Master's Edge Program Page - Major Copy Revisions
1. ✅ Added NEW Section 2: "Who This Program Is For" (after Hero)
2. ✅ Updated Hero subheadline: "approach to" → "way to operate in"
3. ✅ Updated Emotional Connection section (Section 3) copy
4. ✅ Replaced ALL 12 weekly descriptions in Program Framework
5. ✅ Simplified "What You Get" section (titles only, removed verbose descriptions)
6. ✅ Updated "Who It's For / Not For" lists
7. ✅ Rewrote About Brett bio paragraphs
8. ✅ Restored ALL 6 original testimonial quotes (were accidentally changed)
9. ✅ Added Rob Balderas back with +43% Revenue highlight
10. ✅ Updated FAQ answers (8 → 7 questions)
11. ✅ Minor Final CTA copy tweaks
12. ✅ Updated hero badge: "Limited Enrollment — Founding Cohort" → "Limited Enrollment for each Cohort"

#### Testimonials (6 Total - ALL CORRECT NOW)
| Person | Quote |
|--------|-------|
| Bill Schuffenhauer | "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach." |
| Sam Beard | "In my lifetime, I've had the opportunity to meet extraordinary people from around the world, and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW." |
| John Nottingham | "Brett has an innate ability to break down complicated subjects into easy to learn and quick to implement subject matter. He has helped me motivate my staff, implement more cash generation systems, and build a culture of fun and positive growth." |
| Matt Gibbons | "Brett is as good an instructor as I have been around. His training methods and information are always cutting-edge." |
| Flow Research Collective | "Excellent. The paper makes a compelling, empirical case for the utilization of flow for accelerated learning and skill acquisition." |
| Rob Balderas | "I have been blown away with the powerful mindset tools, branding systems, and business building strategies. I added 43 percent to my best month of the year." (+43% Revenue highlight) |

### Completed (April 18, 2026 - Session 12 - MASTER'S EDGE PROGRAM BUILD)

#### Master's Edge Program - NEW PAGES BUILT
1. ✅ Created `/masters-edge-program` - Full sales landing page with 11 sections
2. ✅ Created `/masters-edge-program/apply` - Application form with GHL webhook
3. ✅ Created `/masters-edge-program/thank-you` - Confirmation page

#### Content Updates
4. ✅ Headline: "12 Weeks That Change How You Focus, Lead, Operate, and Perform"
5. ✅ Gradient on Focus, Lead, Operate, Perform only (white "and")
6. ✅ Subheadline: "Applications are now open for the upcoming cohorts."
7. ✅ Changed member limit from 8 → 12 everywhere

#### Navigation Updates
8. ✅ Added Master's Edge dropdown to site navigation
9. ✅ Both desktop and mobile navigation updated

#### Logo Updates
10. ✅ Added USA Martial Arts logo to /masters-edge-program page
11. ✅ Added USA Martial Arts logo to LogoScroller (all pages)

---

## Project Status

### Infrastructure
| Item | Status |
|------|--------|
| GitHub Repo | ✅ Done |
| Vercel Deployment | ✅ Done |
| Custom Domain | ✅ Connected |
| robots.txt | ✅ Created |
| sitemap.xml | ✅ All 15 pages |
| SEO Meta Tags | ✅ Complete |
| Open Graph | ✅ Complete |
| Twitter Cards | ✅ Complete |
| JSON-LD Schema | ✅ Complete |
| PWA Manifest | ✅ Complete |
| Favicons/Icons | ✅ Complete |
| eBook Lead Capture | ✅ Complete |
| Video Testimonials | ✅ Complete |
| Amazon Book Links | ✅ Complete |
| Master's Edge Program | ✅ Complete |

### Pages (16 Total)
| Page | Route | SEO Metadata |
|------|-------|--------------|
| Homepage | `/` | ✅ |
| The Master's Edge | `/masters-edge` | ✅ |
| **Master's Edge Program** | `/masters-edge-program` | ✅ |
| **Program Application** | `/masters-edge-program/apply` | ✅ noindex |
| **Program Thank You** | `/masters-edge-program/thank-you` | ✅ noindex |
| Speaking & Training | `/speaking` | ✅ |
| Coaching | `/coaching` | ✅ |
| AI Advisory | `/ai-advisory` | ✅ |
| About Brett | `/about` | ✅ |
| Books & Media | `/books` | ✅ |
| Testimonials | `/testimonials` | ✅ |
| Contact | `/contact` | ✅ |
| Book Brett | `/book-brett` | ✅ |
| Media Kit | `/media-kit` | ✅ |
| Privacy Policy | `/privacy` | ✅ |
| Terms of Service | `/terms` | ✅ |

---

## Git Status

**Branch:** main
**Last Commit:** `91da623` - Promote speaking v3 to live /speaking with collapsible talk cards
**Uncommitted Changes:** None (working tree clean)

### Recent Commits (April 19, 2026 - Session 14)
```
e40eb3c Update Master's Edge application form to use new GHL inbound webhook
```

### Recent Commits (April 18, 2026 - Session 13)
```
19d8ade Update hero badge: Limited Enrollment for each Cohort
810de77 Add Rob Balderas testimonial back with +43% Revenue highlight
754022d Restore original testimonial quotes
858cfaa Revert Flow Research Collective testimonial to original
2f9c649 Fix TypeScript error: remove unused highlight rendering
c4c36ef Update Master's Edge Program page with new copy and structure
```

### Earlier Commits (April 18, 2026 - Session 12)
```
48efe3f Update project state files - April 18, 2026 Session 12
67d27fc Update subheadline: founding cohort → upcoming cohorts
48cd23f Add Master's Edge Program to navigation and update member count
196caa7 Replace Good Things Utah logo with USA Martial Arts logo
62b3f69 Add dark gradient background with orbs to apply page form section
```

---

## Deployment

**Production URL:** https://brettlechtenberg.com ✅ LIVE
**Vercel Preview:** https://bl-2026-personal-site.vercel.app
**Vercel Project:** `bretts-projects-3e254e58/bl-2026-personal-site`
**GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site
**GitHub Account:** `BrettLechtenbrerg`

---

## Files Structure

```
BL-2026-Personal-Site/
├── public/
│   ├── apple-touch-icon.png
│   ├── brett-hero.webp (OG image)
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── logo.jpg
│   ├── manifest.json
│   ├── robots.txt
│   ├── brett-lechtenberg-speaker-one-sheet.pdf
│   ├── books/
│   │   ├── rockstar-team.png (cover image)
│   │   ├── how-to-build-a-rockstar-team.pdf (downloadable eBook)
│   │   └── [7 other book covers]
│   ├── heroes/ (12 hero images)
│   ├── logos/ (15 client logos - includes usa-martial-arts.png)
│   ├── media-kit/ (5 headshots)
│   ├── speaking-gallery/ (7 photos)
│   ├── testimonials/ (6 headshots)
│   ├── timeline/ (7 images + TSAI logo)
│   └── usa-today/ (6 articles)
├── src/
│   ├── app/
│   │   ├── layout.tsx (root + SEO)
│   │   ├── page.tsx (homepage + laptop Value Pillars section)
│   │   ├── sitemap.ts (15 pages)
│   │   ├── robots.ts
│   │   ├── globals.css
│   │   ├── masters-edge-program/
│   │   │   ├── page.tsx (sales landing page - 11 sections)
│   │   │   ├── layout.tsx (SEO metadata)
│   │   │   ├── apply/
│   │   │   │   ├── page.tsx (application form)
│   │   │   │   └── layout.tsx (noindex)
│   │   │   └── thank-you/
│   │   │       ├── page.tsx (confirmation)
│   │   │       └── layout.tsx (noindex)
│   │   └── [13 other page directories]
│   ├── components/
│   │   ├── layout/ (Header with dropdowns, Footer)
│   │   ├── sections/ (Hero, LogoScroller with USA Martial Arts, etc.)
│   │   ├── seo/ (JsonLd)
│   │   └── ui/ (Button, EbookModal)
│   └── lib/
│       └── utils.ts (links, colors)
├── CLAUDE.md
├── STATE.md
├── SESSION_LOG.md
├── NEXT_SESSION.md
├── README.md
└── package.json
```

---

## Navigation Structure

### Desktop & Mobile Navigation
```
The Master's Edge ▼
├── The Methodology      → /masters-edge
└── 12-Week Program      → /masters-edge-program

Speaking ▼
├── Speaking Overview    → /speaking
├── Book Brett          → /book-brett
└── Media Kit           → /media-kit

Coaching                → /coaching
AI Advisory             → /ai-advisory
Books & Media           → /books
Testimonials            → /testimonials
About                   → /about
```

---

## Important Notes

1. Use speaktobrett.com for all "Talk With Brett" CTAs
2. The Master's Edge is always capitalized with "The"
3. All links configured in `src/lib/utils.ts`
4. OG image: `/brett-hero.webp`
5. Free eBook: "How to Build a Rockstar Team"
6. **eBook Download URL:** `https://brettlechtenberg.com/books/how-to-build-a-rockstar-team.pdf`
7. TSAI logo in AI Advisory "Powered by" section
8. **Value Pillars responsive behavior:**
   - Desktop (2xl+): Floating in Hero.tsx at `bottom-40`
   - Laptop (lg-2xl): Section in page.tsx with `-mt-24`
   - Mobile/Tablet: Hidden
9. **GHL Webhook (eBook):** Sends firstName, lastName, email, tags["rockstar ebook"]
10. **GHL Webhook (Program):** Sends firstName, lastName, email, phone, customFields, tags["ME Prospect"]
11. **Video Testimonials:** 6 YouTube embeds on /testimonials (3-column grid)
12. **Amazon Links:** 6 books clickable → open Amazon in new tab
13. **Homepage Headline:** "Transform the Way You Focus, Lead, and Perform"
14. **Program Headline:** "12 Weeks That Change How You Focus, Lead, Operate, and Perform"
15. **Program Member Limit:** 12 members per cohort
16. **USA Martial Arts Logo:** Added to LogoScroller and /masters-edge-program
17. **Program Testimonials:** 6 total with original quotes restored (including Rob Balderas)

---

## Master's Edge Program Details

### Page Sections (11 Total)
1. Hero with scarcity badge
2. Who This Program Is For (NEW)
3. Emotional Connection ("You've Built Something Real")
4. 3-Phase Program Framework (Clarify → Simplify → Maximize)
5. What's Included (8 items)
6. Who It's For / Not For
7. About Brett with stats and logos
8. 6 Testimonials (with Rob Balderas +43% highlight)
9. Pricing (Founding Member $997/mo vs Pay in Full $2,691)
10. FAQ accordion (7 questions)
11. Final CTA

### Pricing
| Option | Price | Notes |
|--------|-------|-------|
| Founding Member | $997/mo × 3 | Total: $2,991 |
| Pay in Full | $2,691 | Save $300, bonus 1:1 session |

### What's Included
- 12 Weekly Group Coaching Sessions
- Custom Diagnostic Assessment
- The Master's Edge Toolkit
- Private Community Access
- 2 Private 1:1 Sessions with Brett
- Flow State Research Materials
- 30-Day Post-Program Support
- Lifetime Access to Program Materials

### GHL Integration (VERIFIED WORKING - April 19, 2026)
- **Webhook URL:** `https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/035c7c0c-d9c7-47d5-ae85-4d0e6855d23e`
- **Workflow:** Master's Edge Nurture (Inbound Webhook trigger)
- **Pipeline:** Master's Edge → New Lead stage
- **Tags Applied:**
  - `me-lead` (all applicants)
  - `ME - Founding Member Interest` (monthly option)
  - `ME - Pay in Full Interest` (pay in full)
  - `ME - Wants Call` (not sure yet)
- **Internal Notification:** Email to Brett with full application details

---

## Blockers

*None - site is LIVE at brettlechtenberg.com with all features working*
