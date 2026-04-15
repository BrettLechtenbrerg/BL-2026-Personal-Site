# BL 2026 Personal Site - Project State

**Last Updated:** April 15, 2026 @ 6:30 AM
**Current Phase:** ✅ LIVE - Site launched at brettlechtenberg.com

---

## Current Focus

**Status:** Site is LIVE at brettlechtenberg.com - All systems operational

### Completed (April 15, 2026 - Morning Session - HEADLINE UPDATE)

#### Homepage Headline & Subheadline Refresh
1. ✅ New headline: "Transform the Way You Focus, Lead, and Perform"
2. ✅ Gradient applied only to "Focus, Lead," and "Perform" (not "and")
3. ✅ New subheadline: "Brett Lechtenberg helps leaders, teams, and business owners unlock peak performance through transformational speaking, flow state mastery, leadership development, and practical AI strategies."

#### Repo Cleanup
4. ✅ Deleted 5 duplicate macOS files (" 2" copies)
5. ✅ Deleted broken git branch "main 2"
6. ✅ Working tree now clean

#### Technical Implementation
- Updated: `src/components/sections/Hero.tsx` (headline/subheadline with split gradient spans)

---

### Completed (April 14, 2026 - Morning Session - CONTENT UPDATES)

#### Video Testimonials Section
1. ✅ Added 6 video testimonials to `/testimonials` page
2. ✅ New dark section after Hero with 3-column grid
3. ✅ YouTube embeds with glow effects on hover
4. ✅ Videos: Dana Fisher, Bob Morris, Joyce Mathie, Rich Lavine, Roger Knecht, Matt Gibbons

#### Amazon Book Links
5. ✅ Added clickable Amazon links to 6 book cards on `/books` page
6. ✅ Books linked: Reclaiming The Clock, Anti-Bully Program, Anti-Cyber Bully, Bullyproof, Travel Safety, Protecting Your Castle
7. ✅ Cards open Amazon in new tab when clicked
8. ✅ Master's Edge (coming soon) and Rockstar Team (free eBook modal) unchanged

#### Homepage Headline Update (superseded by April 15 update)
9. ✅ Previous headline: "Where Human Performance, Leadership, and Innovation Come Together"

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
| eBook Lead Capture | ✅ Complete |
| Video Testimonials | ✅ Complete |
| Amazon Book Links | ✅ Complete |

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
**Last Commit:** `7c87a8a` - Make 'and' white in headline, keep gradient on Focus, Lead, Perform
**Uncommitted Changes:** None (working tree clean)

### Recent Commits (April 15, 2026)
```
7c87a8a Make 'and' white in headline, keep gradient on Focus, Lead, Perform
16dc240 Update homepage headline and subheadline
```

### Recent Commits (April 14, 2026)
```
9f7885e Update project state files - April 14, 2026 Session 10
b60df04 Update homepage headline and subheadline
c3ac07b Add Amazon purchase links to book cards
4253afd Add 6 video testimonials section to testimonials page
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
│   ├── logos/ (14 client logos)
│   ├── media-kit/ (5 headshots)
│   ├── speaking-gallery/ (7 photos)
│   ├── testimonials/ (6 headshots)
│   ├── timeline/ (7 images + TSAI logo)
│   └── usa-today/ (6 articles)
├── src/
│   ├── app/
│   │   ├── layout.tsx (root + SEO)
│   │   ├── page.tsx (homepage + laptop Value Pillars section)
│   │   ├── sitemap.ts (13 pages)
│   │   ├── robots.ts
│   │   ├── globals.css
│   │   └── [13 page directories]
│   ├── components/
│   │   ├── layout/ (Header, Footer)
│   │   ├── sections/ (Hero with desktop pillars, Solution, etc.)
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

### Lead Capture ✅ COMPLETE
- [x] eBook modal created
- [x] GHL webhook integrated
- [x] PDF hosted for download
- [x] Form tested and working

### Content Enhancements ✅ COMPLETE
- [x] Video testimonials section (6 videos)
- [x] Amazon book links (6 books)
- [x] Updated homepage messaging (April 15 refresh)

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
9. **GHL Webhook:** Sends firstName, lastName, email, tags["rockstar ebook"]
10. **Video Testimonials:** 6 YouTube embeds on /testimonials (3-column grid)
11. **Amazon Links:** 6 books clickable → open Amazon in new tab
12. **Current Headline:** "Transform the Way You Focus, Lead, and Perform" (gradient on Focus, Lead, Perform only)

---

## Blockers

*None - site is LIVE at brettlechtenberg.com with all features working*
