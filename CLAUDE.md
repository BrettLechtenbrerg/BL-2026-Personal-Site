# Brett Lechtenberg Personal Website 2026

## Project Overview

**Project Name:** BL 2026 Personal Site
**Purpose:** World-class personal website for Brett Lechtenberg - Peak Performance Coach, Speaker, Author
**Started:** April 4, 2026
**Status:** ✅ LIVE - All pages complete with bold color design

**Production URL:** https://bl-2026-personal-site-n0tpyx0dh-bretts-projects-3e254e58.vercel.app
**Target Domain:** https://brettlechtenberg.com (pending DNS setup)
**GitHub:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site
**Vercel Project:** `bretts-projects-3e254e58/bl-2026-personal-site`

---

## Quick Start

```bash
cd "/Users/brettlechtenberg/Desktop/Claude Projects/BL-2026-Personal-Site"
npm install           # Install dependencies
npm run dev           # Start dev server (localhost:3000)
npm run build         # Build for production
vercel --prod --yes   # Deploy to Vercel
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.2 | Framework with App Router |
| React | 19.2.4 | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.38.0 | Animations |
| Lucide React | 1.7.0 | Icons |
| Vercel | - | Deployment |

---

## Brand Identity

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Cranberry | `#9B1B30` | Primary - Headers, CTAs, key accents |
| Gold | `#D4AF37` | Highlights, achievements, premium elements |
| Black | `#1A1A1A` | Body text, backgrounds |
| White | `#FFFFFF` | Backgrounds, text on dark |
| Cranberry Dark | `#7A1526` | Hover states |
| Cranberry Light | `#C4324A` | Secondary buttons |
| Gold Dark | `#B8982E` | Hover states |
| Gold Light | `#E8C84A` | Background tints |
| Warm Gray | `#4A4A4A` | Secondary text |

### Typography

| Role | Font | Weights |
|------|------|---------|
| Headlines | Montserrat | 400, 500, 600, 700, 900 |
| Body | Inter | 400, 500, 600 |

### Voice & Tone
- **Warm** — "I care about you as a person"
- **Wise** — "Here's what I've learned"
- **Encouraging** — "You're closer than you think"
- **Direct** — "This won't be easy. But you're capable."
- **Humble** — "I don't have all the answers"
- **Accessible** — "Let me break this down"

---

## Project Structure

```
BL-2026-Personal-Site/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage (colorful hero, pathways, testimonials)
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles & Tailwind
│   │   ├── about/page.tsx           # About Brett page
│   │   ├── ai-advisory/page.tsx     # AI Advisory (Total Success AI)
│   │   ├── books/page.tsx           # Books & Media page
│   │   ├── coaching/page.tsx        # Coaching services page
│   │   ├── contact/page.tsx         # Contact page
│   │   ├── masters-edge/page.tsx    # The Master's Edge methodology
│   │   ├── speaking/page.tsx        # Speaking & Training page
│   │   └── testimonials/page.tsx    # Testimonials page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   └── Footer.tsx           # Site footer
│   │   ├── sections/
│   │   │   ├── Hero.tsx             # Homepage hero section
│   │   │   ├── Solution.tsx         # Solution section
│   │   │   ├── Pathways.tsx         # Service pathways
│   │   │   ├── Credibility.tsx      # Credentials section
│   │   │   ├── Testimonials.tsx     # Testimonials carousel
│   │   │   └── MediaFeature.tsx     # YouTube video embed
│   │   └── ui/
│   │       └── Button.tsx           # Reusable button component
│   └── lib/
│       └── utils.ts                 # Brand colors, links, utilities
├── public/
│   └── logos/
│       ├── american-express.svg     # Client logo
│       ├── delta.svg                # Client logo
│       └── citigroup.svg            # Client logo
├── CLAUDE.md                        # This file - project documentation
├── STATE.md                         # Current development state
├── SESSION_LOG.md                   # Session history
├── NEXT_SESSION.md                  # Ready-to-paste restart prompt
└── package.json                     # Dependencies
```

---

## Site Pages

| Page | Path | Status | Description |
|------|------|--------|-------------|
| Homepage | `/` | ✅ Complete | Hero, social proof, pathways, testimonials, video |
| The Master's Edge | `/masters-edge` | ✅ Complete | Methodology explanation |
| Speaking & Training | `/speaking` | ✅ Complete | Keynotes, workshops, corporate training |
| Coaching | `/coaching` | ✅ Complete | One-on-one coaching services |
| AI Advisory | `/ai-advisory` | ✅ Complete | Total Success AI partnership |
| About Brett | `/about` | ✅ Complete | Bio, credentials, story |
| Books & Media | `/books` | ✅ Complete | 7 books, media appearances |
| Testimonials | `/testimonials` | ✅ Complete | Featured testimonials |
| Contact | `/contact` | ✅ Complete | Booking calendar, email |

---

## Design System

### Visual Patterns (Applied to ALL pages)

1. **Dark Gradient Heroes**
   - `bg-gradient-to-br from-black via-gray-900 to-black`
   - Animated floating orbs with scale/opacity animation
   - Grid pattern overlays

2. **Animated Orbs**
   ```tsx
   <motion.div
     animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
     transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
     className="absolute w-[500px] h-[500px] bg-cranberry/40 rounded-full blur-[120px]"
   />
   ```

3. **Gradient Sections**
   - `bg-gradient-to-b from-white via-cranberry/5 to-gold/5`
   - Alternating dark/light for visual rhythm

4. **Glowing Cards**
   ```tsx
   <div className="absolute -inset-1 bg-gradient-to-r from-cranberry to-gold rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
   ```

5. **Glassmorphism**
   - `bg-white/5 backdrop-blur-sm border border-white/10`

---

## Credential Standards (USE EXACT FIGURES)

- **Years in Business:** 30+
- **Martial Arts Rank:** 8th-Degree Black Belt
- **Martial Arts Experience:** 40+ years
- **Books:** 7 books, 5 bestsellers
- **People Trained:** Thousands (no specific numbers)
- **Research:** Flow state researcher validated by Flow Research Collective
- **Methodology:** The Master's Edge (always capitalized with "The")
- **AI Company:** Total Success AI (co-founded with Manny Torres)
- **Location:** Sandy, Utah

---

## Key Links (Configured in `src/lib/utils.ts`)

| Purpose | URL |
|---------|-----|
| Booking CTA | https://www.speaktobrett.com |
| Email | mailto:Brett@BrettLechtenberg.com |
| Martial Arts School | https://personalmasterymartialarts.com |
| AI Company | https://totalsuccessai.com |

---

## Deployment Workflow

### Standard Deploy Process:
```bash
# 1. Make code changes

# 2. Commit and push to GitHub
git add .
git commit -m "Description of changes"
git push origin main

# 3. Deploy directly via Vercel CLI
vercel --prod --yes
```

### Useful Commands:
```bash
vercel --prod          # Deploy to production
vercel                 # Create preview deployment
vercel ls              # List deployments
vercel logs            # View deployment logs
```

---

## Work History

### April 4, 2026
- **All pages built** with bold color treatment
- **Design System:** Dark heroes, animated orbs, glowing cards, gradient sections
- **Client logos added:** American Express, Delta, Citigroup
- **YouTube video embed:** Good Things Utah interview
- **Deployed to Vercel** via CLI
- **Git pushed** to GitHub

---

## DO NOT USE (Retired Elements)

- "Clarity Map" (evolved into The Master's Edge)
- "A.M.P. program" (evolved into The Master's Edge)
- "7 #1 Best-Selling Books" (incorrect - use "7 books, 5 bestsellers")
- "Grand Master" in non-martial-arts contexts
- pmmarocks.com (use personalmasterymartialarts.com)
- Template placeholder content

---

## Pre-Launch Checklist

- [x] Uses official credential standards
- [x] Copy leads with transformation, not features
- [x] The Master's Edge named as methodology
- [x] Clarify → Simplify → Maximize as outcome promise
- [x] Brand colors/fonts/voice followed
- [x] All CTAs link to speaktobrett.com
- [x] No retired elements present
- [x] Mobile responsive
- [x] Bold colorful design throughout
- [ ] Connect custom domain (brettlechtenberg.com)
- [ ] Add Brett's professional headshot
- [ ] SEO optimization (sitemap, meta tags)

---

## Session Management

**State File:** `STATE.md` - Current focus and progress
**Session Log:** `SESSION_LOG.md` - Historical record
**Next Session:** `NEXT_SESSION.md` - Ready-to-paste restart prompt

When ending a session, run: "update state and close out"
