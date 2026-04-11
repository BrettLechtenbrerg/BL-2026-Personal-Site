# BL 2026 Personal Site - Project State

**Last Updated:** April 11, 2026 @ 2:55 PM
**Current Phase:** ✅ LIVE - Site launched at brettlechtenberg.com

---

## Current Focus

**Status:** Site is LIVE at brettlechtenberg.com - All systems operational

### Completed (April 11, 2026 - Afternoon Session - RESPONSIVE FIX)

#### Value Pillars Fix (Clarify, Simplify, Maximize)
1. ✅ Fixed pillars overlapping hero content on laptops, iPads, and iPhones
2. ✅ Removed absolute-positioned pillars from `Hero.tsx`
3. ✅ Added new section in `page.tsx` with pillars in normal document flow
4. ✅ Pillars now visible on lg+ screens (1024px+) — laptops and desktops
5. ✅ Hidden on mobile/tablet (below 1024px)
6. ✅ **Cannot overlap any content** — physically sits below the hero

---

### Completed (April 9, 2026 - Morning Session - SITE TWEAKS)

#### Media Kit Updates
1. ✅ Added Speaker One-Sheet PDF download section (`brett-lechtenberg-speaker-one-sheet.pdf`)
2. ✅ Added "Twins" dual portrait image to headshots (`brett-twins.png`)
3. ✅ Added "Twins" transparent background version (`brett-twins-nobg.png`)

#### Site-Wide Copy Change
4. ✅ Changed "Talk to Brett" → "Talk With Brett" across 10 files
   - Header.tsx (2 instances), page.tsx, ai-advisory, testimonials, books, about, Hero.tsx, HeroOptionA.tsx, HeroOptionC.tsx

#### Logo Scroller Update
5. ✅ Increased logo sizes by 25% in "Trusted by Leading Organizations" section
   - Container height: h-20 → h-[100px]
   - Image height: h-10 → h-[50px]
   - All logo widths increased proportionally

#### Homepage Hero Updates
6. ✅ Moved gradient from "Meant" to "Gain The Master's Edge" in headline
7. ✅ Updated subheadline to viewer-focused tagline: "Unlock Your Peak Performance. Master Flow States. Lead Without Limits."
8. ✅ Replaced hero image with twins no-background version

#### Why Brett Section Updates
9. ✅ Changed "8th°" → "8th" with "Degree Black Belt" label
10. ✅ Added apostrophe: "1000s" → "1000's"

#### Contact Page Update
11. ✅ Replaced "BL" initials with casual portrait image in Quick Reference section

---

### Completed (April 7, 2026 - Afternoon Session - MOBILE FIX)

#### iPhone 15 Hero Fix
1. ✅ Fixed "Clarify, Simplify, Maximize" pillars overlapping text on iPhone 15
2. ✅ Hero section: `min-h-[90vh]` → `min-h-screen sm:min-h-[90vh]` (full height on mobile)
3. ✅ Pillar positioning: `bottom-28` → `bottom-8 sm:bottom-28` (closer to bottom on mobile)

---

### Completed (April 6, 2026 - Morning Session - PRE-LAUNCH)

#### Hero Image Brightness (All Pages)
1. ✅ Increased hero image opacity by 10% across all 11 pages

#### AI Advisory Page Updates
2. ✅ Redesigned 3-Step Process section - removed cartoonish icons
3. ✅ Added "STEP 1/2/3" gradient labels with animated underlines
4. ✅ Large faded step numbers in background
5. ✅ Replaced robot icon with TSAI logo in "Powered by" section

#### Books & Media Page Updates
6. ✅ Added "How to Build a Rockstar Team" eBook
7. ✅ Made it the free giveaway (replaced Reclaiming the Clock)
8. ✅ Added green freebie styling with glow and pulsing badge
9. ✅ Fixed YouTube links (Profiles in Caring, Wild Bear X)

#### About Page - Journey Timeline
10. ✅ Converted from dark to light mode
11. ✅ Gray gradient background with white cards

#### SEO Optimization (LAUNCH READY)
12. ✅ Created robots.txt with sitemap reference
13. ✅ Added metadata layouts for book-brett and media-kit pages
14. ✅ Updated sitemap with all 13 pages
15. ✅ Fixed OG image reference (brett-hero.webp)

---

## Project Status

### Infrastructure
| Item | Status |
|------|--------|
| GitHub Repo | ✅ Done |
| Vercel Deployment | ✅ Done |
| Custom Domain | ✅ Connected |
| robots.txt | ✅ Created |
| sitemap.xml | ✅ All 13 pages |
| SEO Meta Tags | ✅ Complete |
| Open Graph | ✅ Complete |
| Twitter Cards | ✅ Complete |
| JSON-LD Schema | ✅ Complete |
| PWA Manifest | ✅ Complete |
| Favicons/Icons | ✅ Complete |

### Pages (13 Total)
| Page | Route | SEO Metadata |
|------|-------|--------------|
| Homepage | `/` | ✅ |
| The Master's Edge | `/masters-edge` | ✅ |
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
**Last Commit:** `db8e26a` - Move Clarify/Simplify/Maximize pillars below hero in normal flow
**Uncommitted Changes:** None (working tree clean)

### Recent Commits (April 11, 2026)
```
db8e26a Move Clarify/Simplify/Maximize pillars below hero in normal flow
a203a5d Hide Clarify/Simplify/Maximize pillars on screens smaller than 2xl
2332745 Fix logo scroller animation on mobile
74f162c Connect booking buttons to GoHighLevel calendar
9279dfd Fix favicon RGBA format for Next.js 16 Turbopack
```

---

## Deployment

**Production URL:** https://brettlechtenberg.com ✅ LIVE
**Vercel Preview:** https://bl-2026-personal-site.vercel.app
**Vercel Project:** `bretts-projects-3e254e58/bl-2026-personal-site`
**GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site

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
│   ├── books/ (8 book covers)
│   ├── heroes/ (12 hero images)
│   ├── logos/ (14 client logos)
│   ├── media-kit/ (5 headshots)
│   │   ├── brett-casual.webp
│   │   ├── brett-fullbody-nobg.webp
│   │   ├── brett-headshot-nobg.webp
│   │   ├── brett-twins.png
│   │   └── brett-twins-nobg.png
│   ├── speaking-gallery/ (7 photos)
│   ├── testimonials/ (6 headshots)
│   ├── timeline/ (7 images + TSAI logo)
│   └── usa-today/ (5 articles)
├── src/
│   ├── app/
│   │   ├── layout.tsx (root + SEO)
│   │   ├── page.tsx (homepage + Value Pillars section)
│   │   ├── sitemap.ts (13 pages)
│   │   ├── robots.ts
│   │   ├── globals.css
│   │   ├── about/
│   │   ├── ai-advisory/
│   │   ├── book-brett/
│   │   ├── books/
│   │   ├── coaching/
│   │   ├── contact/
│   │   ├── masters-edge/
│   │   ├── media-kit/
│   │   ├── privacy/
│   │   ├── speaking/
│   │   ├── terms/
│   │   └── testimonials/
│   ├── components/
│   │   ├── layout/ (Header, Footer)
│   │   ├── sections/ (Hero, Solution, etc.)
│   │   ├── seo/ (JsonLd)
│   │   └── ui/ (Button)
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

## Launch Checklist

### Before Going Live
- [x] All pages complete and tested
- [x] SEO optimization complete
- [x] robots.txt created
- [x] sitemap includes all pages
- [x] OG images configured
- [x] Mobile optimization complete
- [x] All commits pushed to GitHub
- [x] Vercel deployment successful

### Go Live ✅ COMPLETE
- [x] Add custom domain in Vercel (brettlechtenberg.com)
- [x] Update DNS at domain registrar
- [x] Site live at brettlechtenberg.com
- [ ] Verify in Google Search Console
- [ ] Submit sitemap to Google
- [ ] Test social sharing (Facebook, Twitter, LinkedIn)

---

## Important Notes

1. Use speaktobrett.com for all "Talk With Brett" CTAs
2. The Master's Edge is always capitalized with "The"
3. All links configured in `src/lib/utils.ts`
4. OG image: `/brett-hero.webp`
5. Free eBook: "How to Build a Rockstar Team" (not Reclaiming the Clock)
6. TSAI logo in AI Advisory "Powered by" section
7. Value Pillars now in `page.tsx` (not `Hero.tsx`) — in normal document flow

---

## Blockers

*None - site is LIVE at brettlechtenberg.com*
