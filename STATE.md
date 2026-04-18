# BL 2026 Personal Site - Project State

**Last Updated:** April 18, 2026 @ 6:45 AM
**Current Phase:** ✅ LIVE - Site launched at brettlechtenberg.com

---

## Current Focus

**Status:** Site is LIVE at brettlechtenberg.com - All systems operational

### Completed (April 18, 2026 - Morning Session - MASTER'S EDGE PROGRAM BUILD)

#### Master's Edge Program - NEW PAGES BUILT
1. ✅ Created `/masters-edge-program` - Full sales landing page with 10 sections:
   - Hero with scarcity badge
   - Problem section
   - 3-Phase Program (Clarify → Simplify → Maximize)
   - What's Included (8 deliverables)
   - Who It's For / Not For
   - About Brett with stats and logos
   - 6 Testimonials
   - Pricing (Founding Member $997/mo vs Pay in Full $2,691)
   - FAQ accordion (8 questions)
   - Final CTA

2. ✅ Created `/masters-edge-program/apply` - Application form page:
   - Full Name, Email, Phone, Company, Role
   - Revenue Range, Referral Source
   - Challenge & Success outcome textareas
   - Investment option radio buttons
   - GHL webhook integration with tags
   - Dark gradient background with orbs

3. ✅ Created `/masters-edge-program/thank-you` - Confirmation page:
   - Success checkmark animation
   - "Book a Conversation" CTA
   - What Happens Next (3 steps)

#### Content Updates
4. ✅ Headline: "12 Weeks That Change How You Focus, Lead, Operate, and Perform"
5. ✅ Gradient on Focus, Lead, Operate, Perform only (white "and")
6. ✅ Subheadline: "Applications are now open for the upcoming cohorts."
7. ✅ Changed member limit from 8 → 12 everywhere

#### Navigation Updates
8. ✅ Added Master's Edge dropdown to site navigation:
   - The Methodology → /masters-edge
   - 12-Week Program → /masters-edge-program
9. ✅ Both desktop and mobile navigation updated

#### Logo Updates
10. ✅ Added USA Martial Arts logo to /masters-edge-program page
11. ✅ Added USA Martial Arts logo to LogoScroller (all pages)
12. ✅ Copied usa-martial-arts.png to public/logos/

#### Git Cleanup
13. ✅ Deleted 5 duplicate macOS " 2" files from earlier session

---

## Project Status

### Infrastructure
| Item | Status |
|------|--------|
| GitHub Repo | ✅ Done |
| Vercel Deployment | ✅ Done |
| Custom Domain | ✅ Connected |
| robots.txt | ✅ Created |
| sitemap.xml | ✅ All 15 pages (was 13, +2 new) |
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

### Pages (16 Total - was 13)
| Page | Route | SEO Metadata |
|------|-------|--------------|
| Homepage | `/` | ✅ |
| The Master's Edge | `/masters-edge` | ✅ |
| **Master's Edge Program** | `/masters-edge-program` | ✅ NEW |
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
**Last Commit:** `67d27fc` - Update subheadline: founding cohort → upcoming cohorts
**Uncommitted Changes:** None (working tree clean)

### Recent Commits (April 18, 2026)
```
67d27fc Update subheadline: founding cohort → upcoming cohorts
48cd23f Add Master's Edge Program to navigation and update member count
196caa7 Replace Good Things Utah logo with USA Martial Arts logo
62b3f69 Add dark gradient background with orbs to apply page form section
3dc9f27 Update Master's Edge Program subheadline
b0367ad Update Master's Edge Program headline and add more logos
ea364a9 Add Master's Edge Program pages (hidden from nav)
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
│   ├── logos/ (15 client logos - added usa-martial-arts.png)
│   ├── media-kit/ (5 headshots)
│   ├── speaking-gallery/ (7 photos)
│   ├── testimonials/ (6 headshots)
│   ├── timeline/ (7 images + TSAI logo)
│   └── usa-today/ (6 articles)
├── src/
│   ├── app/
│   │   ├── layout.tsx (root + SEO)
│   │   ├── page.tsx (homepage + laptop Value Pillars section)
│   │   ├── sitemap.ts (15 pages - updated)
│   │   ├── robots.ts
│   │   ├── globals.css
│   │   ├── masters-edge-program/ (NEW)
│   │   │   ├── page.tsx (sales landing page)
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

---

## Master's Edge Program Details

### Pricing
| Option | Price | Notes |
|--------|-------|-------|
| Founding Member | $997/mo × 3 | Total: $2,991 |
| Pay in Full | $2,691 | Save $300, bonus 1:1 session |

### What's Included
- 12 Weekly Group Coaching Sessions (90 min each)
- Custom Diagnostic Assessment (Week 1 & 12)
- The Master's Edge Toolkit (proprietary frameworks)
- Private Community Access
- 2 Private 1:1 Sessions with Brett (Week 1 & 6)
- Flow State Research Materials
- 30-Day Post-Program Support
- Lifetime Access to Program Materials

### GHL Integration
- **Webhook URL:** Same as eBook (existing account)
- **Tags Applied:**
  - `ME Prospect` (all applicants)
  - `ME - Founding Member Interest` (monthly option)
  - `ME - Pay in Full Interest` (pay in full)
  - `ME - Wants Call` (not sure yet)

---

## Blockers

*None - site is LIVE at brettlechtenberg.com with all features working*
