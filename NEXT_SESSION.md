# BL 2026 Personal Site - Next Session Restart Prompt

Copy and paste this prompt to continue where we left off:

---

## RESTART PROMPT

I want to continue working on my personal website (Brett Lechtenberg).

**Project Location:**
```
/Users/brettlechtenberg/Desktop/Claude Projects/BL-2026-Personal-Site
```

**Read these files first:**
1. `CLAUDE.md` - Full project context
2. `STATE.md` - Current progress and focus

**Production URL:** https://brettlechtenberg.com ✅ LIVE
**Vercel Preview:** https://bl-2026-personal-site.vercel.app
**GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site
**Vercel Dashboard:** https://vercel.com/bretts-projects-3e254e58/bl-2026-personal-site

**Site Status: ✅ LIVE**

**What's Complete:**
- ✅ All 16 pages built (was 13, +3 new Master's Edge Program pages)
- ✅ Full SEO optimization (meta tags, OG, Twitter, sitemap, robots.txt)
- ✅ Dark gradient heroes with animated floating orbs
- ✅ Glowing cards with consistent hover effects (site-wide)
- ✅ **Master's Edge Program (NEW - April 18, 2026):**
  - `/masters-edge-program` - Full sales landing page (10 sections)
  - `/masters-edge-program/apply` - Application form with GHL webhook
  - `/masters-edge-program/thank-you` - Confirmation page
  - Navigation dropdown added under "The Master's Edge"
  - Member limit: 12 per cohort
  - Pricing: $997/mo × 3 or $2,691 pay in full
- ✅ 6 Featured Testimonials with glow-on-hover
- ✅ 6 Video Testimonials on /testimonials
- ✅ Amazon Book Links (6 books)
- ✅ eBook Lead Capture Modal with GHL
- ✅ USA Martial Arts Logo on all pages
- ✅ **Current Homepage Headline:**
  - "Transform the Way You Focus, Lead, and Perform"
- ✅ **Current Program Headline:**
  - "12 Weeks That Change How You Focus, Lead, Operate, and Perform"
  - Gradient on Focus, Lead, Operate, Perform only
- ✅ **Current Subheadline:**
  - "Applications are now open for the upcoming cohorts."
- ✅ 4-Video Media Grid (all YouTube embeds)
- ✅ Media Kit with professional headshots + hero image + Speaker One-Sheet PDF
- ✅ USA Today Carousel - Auto-scroll with pause-on-hover
- ✅ Speaking Gallery - Bento grid with 7 photos, stats bar
- ✅ About Page - Light mode Journey timeline
- ✅ Client logos with scrolling animation (USA Martial Arts added)
- ✅ Mobile optimized for Google Core Web Vitals 2025-2026
- ✅ Custom domain connected (brettlechtenberg.com)
- ✅ Value Pillars responsive (desktop floating, laptop section, mobile hidden)

**Navigation Structure:**
```
The Master's Edge ▼
├── The Methodology      → /masters-edge
└── 12-Week Program      → /masters-edge-program

Speaking ▼
├── Speaking Overview    → /speaking
├── Book Brett          → /book-brett
└── Media Kit           → /media-kit
```

**Post-Launch Tasks:**
1. [ ] Verify in Google Search Console
2. [ ] Submit sitemap: https://brettlechtenberg.com/sitemap.xml
3. [ ] Test social sharing debuggers (Facebook, Twitter, LinkedIn)

**What I Need Help With:**
[Describe your specific focus]

Let's continue!

---

## WORKFLOW RULES

| Rule | Setting |
|------|---------|
| **Project** | `BL-2026-Personal-Site` only |
| **Local Path** | `/Users/brettlechtenberg/Desktop/Claude Projects/BL-2026-Personal-Site` |
| **GitHub** | `BrettLechtenbrerg/BL-2026-Personal-Site` |
| **Vercel** | `bretts-projects-3e254e58/bl-2026-personal-site` |
| **Dev Server** | ❌ **NO** - not using it |
| **Workflow** | Edit → Commit → Push → Vercel auto-deploys |

---

## QUICK START COMMANDS

```bash
cd "/Users/brettlechtenberg/Desktop/Claude Projects/BL-2026-Personal-Site"
npm run dev          # Start dev server (localhost:3000) - IF NEEDED
npm run build        # Build for production
vercel --prod --yes  # Manual deploy to Vercel (usually not needed)
```

---

## KEY FILES

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout + SEO metadata |
| `src/app/page.tsx` | Homepage + laptop Value Pillars section |
| `src/app/sitemap.ts` | Sitemap (15 pages) |
| `public/robots.txt` | Search engine directives |
| `src/components/sections/Hero.tsx` | Hero + desktop floating pillars + headline |
| `src/components/layout/Header.tsx` | Navigation with Master's Edge & Speaking dropdowns |
| `src/components/sections/LogoScroller.tsx` | Client logos (includes USA Martial Arts) |
| `src/components/ui/EbookModal.tsx` | Lead capture popup for eBook |
| `src/components/seo/JsonLd.tsx` | Structured data |
| `src/lib/utils.ts` | Brand colors, links |
| `src/app/masters-edge-program/page.tsx` | Program sales landing page |
| `src/app/masters-edge-program/apply/page.tsx` | Program application form |

---

## MASTER'S EDGE PROGRAM DETAILS

| Item | Value |
|------|-------|
| **Landing Page** | `/masters-edge-program` |
| **Apply Page** | `/masters-edge-program/apply` |
| **Thank You** | `/masters-edge-program/thank-you` |
| **Member Limit** | 12 per cohort |
| **Pricing - Monthly** | $997/mo × 3 = $2,991 |
| **Pricing - Pay in Full** | $2,691 (save $300) |
| **GHL Tags** | `ME Prospect`, pricing preference tags |

---

## EBOOK LEAD CAPTURE

| Item | Value |
|------|-------|
| **GHL Webhook** | `https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/6b344d66-7b41-4533-a8e1-e747a3da3143` |
| **PDF Download** | `https://brettlechtenberg.com/books/how-to-build-a-rockstar-team.pdf` |
| **Tag** | `rockstar ebook` |
| **Fields** | firstName, lastName, email |

---

## PAGES (16 Total)

| Page | Route | SEO |
|------|-------|-----|
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

## RECENT COMMITS (April 18, 2026)

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

## DEPLOYMENT

```bash
# Commit changes
git add . && git commit -m "Description" && git push

# Auto-deploys to Vercel on push to main
```

---

*Last updated: April 18, 2026 @ 6:45 AM*
