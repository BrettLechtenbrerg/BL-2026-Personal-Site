# BL 2026 Personal Site - Project State

**Last Updated:** July 3, 2026
**Current Phase:** ✅ LIVE - Site launched at brettlechtenberg.com

---

## Current Focus

**Status:** Site is LIVE at brettlechtenberg.com - All systems operational.

### Completed (July 3, 2026 — V2 DRAFT PAGES + COMMS HUB)

#### Hidden draft pages for side-by-side review
(spec: Desktop `CLAUDE_CODE_SPEC_Speaking_Page_v2.md` by "Flo", July 3)
- **`/speaking-v2`** — four-lane restructure (Peak Performance & Mindset /
  Leadership & Team Culture / Sales & Ethical Influence / AI for Humans),
  10 talks total, flagship cards featured, "Hacks are for hacks" pull-quote
  band between Lanes 1–2, new hero copy, trust-bar SEO sentence, media-kit
  block, closing CTA. NO stats anywhere (old 100+/10K+ stats bar dropped per
  spec — those numbers are pending verification).
- **`/media-kit-v2`** — identical to live /media-kit except Talk & Training
  Topics uses the four-lane grouping (10 talks, compact row format).
- Both: noindex/nofollow, out of sitemap + nav. Live /speaking + /media-kit
  UNTOUCHED. Brett is doing a day-or-two side-by-side comparison before
  approving promotion (then: move v2 content over live, restore indexing,
  delete draft routes).
- Honest Close proof line ("Field-tested with America First Credit Union…")
  is a commented-out placeholder in speaking-v2/page.tsx — uncomment after Aug 4.

#### Comms Hub — GHL messaging center at /hub (NEW)
- **Leads-only clone of PMMA's proven Power Hub communication system**
  (per Desktop `PMMA-MESSAGING-CLONE-GUIDE.md`; PMMA system verified live
  July 2). Full architecture + setup + test plan: **`docs/COMMS_HUB.md`**.
- `/hub` login → `/hub/messaging` with three tabs: **Compose** (lead picker
  w/ tag filter + search, SMS/email, {{first_name}}/{{last_name}} merge tags,
  live preview, marketing-SMS consent gate, batch dedupe, confirm modal),
  **Inbox** (GHL conversations, unread + needs-reply badges, thread view,
  in-place replies), **Log** (append-only audit → `hub_messages` table).
- Security: HMAC credential-bound session cookie (`src/lib/hub-session.ts`);
  every `/api/hub/*` route calls `requireHubSession()`; login rate-limited
  (8 fails/15 min/IP); fails closed (503) when env vars missing in prod.
  Rotating HUB_PASSWORD in Vercel kills all sessions instantly.
- Hidden: noindex layout, not in sitemap/nav.
- **⚠️ TEMP CREDENTIALS LIVE (July 3):** HUB_USERNAME=`bladmin` /
  HUB_PASSWORD=`bl-dev-2026` + random HUB_SESSION_SECRET set in Vercel
  (production) via CLI so Brett could preview the live hub. These are the
  dev fallbacks documented in the repo — **CHANGE HUB_PASSWORD to something
  strong before real lead conversations happen.**
- **NOT YET DONE (Brett's part, ~30 min — click-by-click in docs/COMMS_HUB.md):**
  1. Supabase project + run
     `supabase/migrations/20260703120000_create_hub_messages.sql` in SQL editor
  2. GHL PIT token on Brett's PERSONAL location with 4 scopes (View Contacts,
     View Conversations, View Conversation Messages, Edit Conversation Messages)
  3. Vercel env: GHL_PIT_TOKEN, GHL_LOCATION_ID, NEXT_PUBLIC_SUPABASE_URL,
     SUPABASE_SERVICE_ROLE_KEY → redeploy
  4. Live test: tag self `test-lead` → SMS send → inbox reply round-trip
- Until then: hub UI loads + login works, but Leads/Inbox show
  "GHL_PIT_TOKEN not set" and sends log-but-fail. Public site unaffected.

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
**Last Commit:** `e40eb3c` - Update Master's Edge application form to use new GHL inbound webhook
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
