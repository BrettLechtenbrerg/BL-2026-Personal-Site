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
- ✅ All 13 pages built with bold colorful design
- ✅ Full SEO optimization (meta tags, OG, Twitter, sitemap, robots.txt)
- ✅ Dark gradient heroes with animated floating orbs
- ✅ Glowing cards with consistent hover effects (site-wide)
- ✅ 6 Featured Testimonials with glow-on-hover
- ✅ 4-Video Media Grid (all YouTube embeds)
- ✅ Media Kit with professional headshots + hero image + Speaker One-Sheet PDF
- ✅ USA Today Carousel - Auto-scroll with pause-on-hover
- ✅ Speaking Gallery - Bento grid with 7 photos, stats bar
- ✅ About Page - Light mode Journey timeline
- ✅ "How to Build a Rockstar Team" as free eBook giveaway
- ✅ Client logos with scrolling animation (25% larger)
- ✅ Mobile optimized for Google Core Web Vitals 2025-2026
- ✅ Custom domain connected (brettlechtenberg.com)
- ✅ "Talk With Brett" CTAs site-wide
- ✅ Twins dual portrait images in Media Kit
- ✅ Viewer-focused hero subheadline
- ✅ **eBook Lead Capture Modal (April 13, 2026):**
  - Popup form: First Name, Last Name, Email
  - GHL webhook integration with "rockstar ebook" tag
  - Triggers from book card AND "Get the Free eBook" button
  - PDF hosted at: https://brettlechtenberg.com/books/how-to-build-a-rockstar-team.pdf
- ✅ **Value Pillars responsive fix:**
  - Desktop (2xl+): Floating inside hero at `bottom-40`
  - Laptop (lg-2xl): Section below hero with `-mt-24`
  - Mobile/Tablet: Hidden

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
| `src/app/sitemap.ts` | Sitemap (13 pages) |
| `public/robots.txt` | Search engine directives |
| `src/components/sections/Hero.tsx` | Hero + desktop floating pillars |
| `src/components/ui/EbookModal.tsx` | Lead capture popup for eBook |
| `src/components/seo/JsonLd.tsx` | Structured data |
| `src/lib/utils.ts` | Brand colors, links |

---

## EBOOK LEAD CAPTURE

| Item | Value |
|------|-------|
| **GHL Webhook** | `https://services.leadconnectorhq.com/hooks/OfcMDEmwDKM6qQZahiuf/webhook-trigger/6b344d66-7b41-4533-a8e1-e747a3da3143` |
| **PDF Download** | `https://brettlechtenberg.com/books/how-to-build-a-rockstar-team.pdf` |
| **Tag** | `rockstar ebook` |
| **Fields** | firstName, lastName, email |

---

## VALUE PILLARS RESPONSIVE BEHAVIOR

| Device | Breakpoint | Implementation |
|--------|------------|----------------|
| Desktop | 2xl+ (1536px+) | `Hero.tsx` - floating pillars with `hidden 2xl:block` at `bottom-40` |
| Laptop | lg-2xl (1024-1536px) | `page.tsx` - section with `hidden lg:block 2xl:hidden` |
| Mobile/Tablet | below lg | Hidden on both |

---

## PAGES (13 Total)

| Page | Route | SEO |
|------|-------|-----|
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

## RECENT COMMITS

```
41a6433 Add Rockstar Team eBook PDF for download link
12f35ce Remove duplicate files (macOS copies)
2689ed9 Add eBook lead capture modal with GoHighLevel integration
07238b6 Move floating pillars closer to hero content (bottom-28 to bottom-40)
64683db Revert: Restore 2xl breakpoint for floating pillars
```

---

## DEPLOYMENT

```bash
# Commit changes
git add . && git commit -m "Description" && git push

# Auto-deploys to Vercel on push to main
```

---

*Last updated: April 13, 2026 @ 6:20 AM*
