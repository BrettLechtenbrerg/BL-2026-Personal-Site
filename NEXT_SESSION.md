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

**Production URL:** https://bl-2026-personal-site.vercel.app
**GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site

**What's Complete:**
- ✅ All 9 pages built with bold colorful design
- ✅ Dark gradient heroes with animated floating orbs
- ✅ Glowing cards with consistent hover effects (site-wide)
- ✅ 6 Featured Testimonials with glow-on-hover and visible face images (15% opacity)
- ✅ 4-Video Media Grid with lazy loading
- ✅ Client logos with scrolling animation
- ✅ **Mobile optimized for Google Core Web Vitals 2025-2026**
- ✅ Touch targets 44-52px site-wide
- ✅ Reduced motion support (accessibility)
- ✅ Deployed to Vercel & pushed to GitHub (working tree clean)

**Pending Tasks:**
1. Connect custom domain (brettlechtenberg.com)
2. Add Brett's professional headshot
3. SEO optimization (meta tags refinement)

**What I Need Help With:**
[Describe your specific focus]

Let's continue!

---

## QUICK START COMMANDS

```bash
cd "/Users/brettlechtenberg/Desktop/Claude Projects/BL-2026-Personal-Site"
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
vercel --prod --yes  # Deploy to Vercel
```

---

## KEY FILES

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage |
| `src/app/testimonials/page.tsx` | Testimonials (6 featured, glow effects) |
| `src/app/books/page.tsx` | Books & Media (4-video grid, lazy loading) |
| `src/lib/utils.ts` | Brand colors, links |
| `src/components/layout/Header.tsx` | Navigation (48px mobile touch targets) |
| `src/components/layout/Footer.tsx` | Footer (44px touch targets) |
| `src/components/ui/Button.tsx` | CTA buttons (44-52px touch targets) |
| `src/components/sections/Hero.tsx` | Hero section (bubbles at bottom-28) |
| `src/components/sections/LogoScroller.tsx` | Animated scrolling logos |
| `src/app/globals.css` | Global styles + mobile accessibility |
| `public/testimonials/` | Testimonial headshot images |

---

## TESTIMONIALS (6 Featured)

| Name | Title |
|------|-------|
| Sam Beard | Creator 6 Presidential Programs for 8 U.S. Presidents |
| Bill Schuffenhauer | Olympic Silver Medalist & 3x Olympian |
| Sal Rossano | Green Beret (Ret.) - Trauma Survival Specialist |
| Matt Gibbons | President, Murray Chamber of Commerce |
| Jerry Fontanez | 8-Time World Karate Champion |
| John Nottingham | Sword and Shield Security, Phoenix, AZ |

---

## MEDIA VIDEOS (4)

| Video | Source | Optimization |
|-------|--------|--------------|
| Good Things Utah - The Master's Edge | YouTube | lazy loading |
| Profiles in Caring | YouTube | lazy loading |
| The Daily Dish - CW30 | Direct MP4 | preload="none" |
| Good Things Utah - Wild Bear X | Direct MP4 | preload="none" |

---

## MOBILE OPTIMIZATION (Google 2025-2026)

| Metric | Requirement | Status |
|--------|-------------|--------|
| LCP | < 2.5s | ✅ Lazy loading |
| INP | < 200ms | ✅ Touch targets 44-52px |
| CLS | < 0.1 | ✅ Stable layouts |
| Touch Targets | Min 48px | ✅ Fixed site-wide |
| Reduced Motion | Respect preference | ✅ CSS media query |

---

## RECENT COMMITS

```
c878256 Enhance featured testimonial cards styling
442e9cb Fix quote icon overlapping testimonial text
5079c54 Mobile optimization for Google Core Web Vitals 2025-2026
23df121 Add 4-video grid to Brett in the Media section
c766d89 Add Jerry Fontanez & John Nottingham featured testimonials
```

---

## DEPLOYMENT

```bash
# Commit changes
git add . && git commit -m "Description" && git push

# Deploy to Vercel
vercel --prod --yes
```

---

*Last updated: April 5, 2026 @ 3:45 PM*
