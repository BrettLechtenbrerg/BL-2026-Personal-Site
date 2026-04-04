# 🔄 RESTART PROMPT - Brett Lechtenberg Personal Website

## 📍 Current Status: ✅ LIVE (Production Ready)

Brett Lechtenberg's personal website is **live in production** with all 9 pages complete and bold colorful design throughout.

**Last Updated:** April 4, 2026
**Status:** All pages built and deployed

---

## 🌐 Live Production Site

**URL:** https://bl-2026-personal-site-n0tpyx0dh-bretts-projects-3e254e58.vercel.app
**Target Domain:** https://brettlechtenberg.com (pending DNS setup)
**Branch:** `main`
**Repository:** https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.2 | React framework with App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.38.0 | Animations |
| Lucide React | 1.7.0 | Icon library |
| Vercel | - | Hosting & deployment |

---

## 🎨 Design System

### Brand Colors
```
Cranberry:       #9B1B30 (primary)
Cranberry Dark:  #7A1526 (hover)
Cranberry Light: #C4324A (accents)
Gold:            #D4AF37 (highlights)
Gold Dark:       #B8982E (hover)
Gold Light:      #E8C84A (backgrounds)
Black:           #1A1A1A (text)
White:           #FFFFFF (backgrounds)
Warm Gray:       #4A4A4A (secondary text)
```

### Visual Patterns Applied

1. **Dark Gradient Heroes** - `from-black via-gray-900 to-black`
2. **Animated Floating Orbs** - Scale/opacity pulsing with Framer Motion
3. **Gradient Sections** - Alternating dark/light with colored tints
4. **Glowing Card Effects** - Blur-lg glow on hover
5. **Glassmorphism** - `backdrop-blur-sm` with `border-white/10`

---

## 📂 Repository Structure

```
BL-2026-Personal-Site/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   ├── about/page.tsx           # About Brett
│   │   ├── ai-advisory/page.tsx     # AI Advisory (Total Success AI)
│   │   ├── books/page.tsx           # Books & Media
│   │   ├── coaching/page.tsx        # Coaching services
│   │   ├── contact/page.tsx         # Contact page
│   │   ├── masters-edge/page.tsx    # The Master's Edge methodology
│   │   ├── speaking/page.tsx        # Speaking & Training
│   │   └── testimonials/page.tsx    # Testimonials
│   ├── components/
│   │   ├── layout/Header.tsx        # Navigation
│   │   ├── layout/Footer.tsx        # Site footer
│   │   ├── sections/Hero.tsx        # Homepage hero
│   │   ├── sections/Solution.tsx    # Problem/solution
│   │   ├── sections/Pathways.tsx    # Service pathways
│   │   ├── sections/Credibility.tsx # Credentials
│   │   ├── sections/Testimonials.tsx # Testimonials carousel
│   │   ├── sections/MediaFeature.tsx # YouTube video
│   │   └── ui/Button.tsx            # Button component
│   └── lib/utils.ts                 # Colors, links, utilities
├── public/logos/                    # Client logos (AmEx, Delta, Citigroup)
├── CLAUDE.md                        # Full project documentation
├── RESTART-PROMPT.md                # This file
├── STATE.md                         # Current state
├── SESSION_LOG.md                   # Session history
└── NEXT_SESSION.md                  # Quick restart prompt
```

---

## 📄 Key Pages Overview

| Page | Path | Status |
|------|------|--------|
| Homepage | `/` | ✅ Complete |
| The Master's Edge | `/masters-edge` | ✅ Complete |
| Speaking & Training | `/speaking` | ✅ Complete |
| Coaching | `/coaching` | ✅ Complete |
| AI Advisory | `/ai-advisory` | ✅ Complete |
| About Brett | `/about` | ✅ Complete |
| Books & Media | `/books` | ✅ Complete |
| Testimonials | `/testimonials` | ✅ Complete |
| Contact | `/contact` | ✅ Complete |

---

## 🔗 Current Link Configuration

All booking buttons link to: `https://www.speaktobrett.com`
Email: `Brett@BrettLechtenberg.com`
Martial Arts: `https://personalmasterymartialarts.com`
AI Company: `https://totalsuccessai.com`

---

## 🚀 Common Commands

```bash
# Navigate to project
cd "/Users/brettlechtenberg/Desktop/Claude Projects/BL-2026-Personal-Site"

# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run lint         # Run linter

# Git
git status           # Check current state
git log --oneline    # View commit history
git add . && git commit -m "message" && git push  # Commit & push

# Deploy to Vercel
vercel --prod --yes  # Deploy to production
```

---

## 📋 Git Commits (April 2026)

| Commit | Description |
|--------|-------------|
| `ec35c02` | Add bold colors to About, AI Advisory, Books, Testimonials, Contact pages |
| `d755c5c` | Add bold colors to Master's Edge, Speaking, and Coaching pages |
| `5de6800` | Add company logos and Good Things Utah video embed |
| `d423b2b` | Add bold colors and visual flair to all homepage sections |
| `66f3fe8` | Add all website pages |

---

## ✅ Current State Checklist

- [x] All 9 pages built
- [x] Bold colorful design on every page
- [x] Dark gradient heroes with animated orbs
- [x] Glowing card effects
- [x] Client logos (American Express, Delta, Citigroup)
- [x] YouTube video embed (Good Things Utah)
- [x] All booking links point to speaktobrett.com
- [x] Committed and pushed to GitHub
- [x] Deployed to Vercel
- [ ] **PENDING:** Connect custom domain (brettlechtenberg.com)
- [ ] **PENDING:** Add Brett's professional headshot
- [ ] **PENDING:** SEO optimization (sitemap, robots.txt, meta tags)

---

## ⏳ PENDING TASKS

### 1. Custom Domain Setup
Connect `brettlechtenberg.com` to Vercel deployment

### 2. Professional Headshot
Add Brett's photo to Hero section and About page

### 3. SEO Optimization
- Add sitemap.ts
- Add robots.ts
- Add Open Graph meta tags
- Add Twitter card meta tags

---

## 🎬 What To Do When You Return

1. **Read CLAUDE.md** for full documentation
2. **Check STATE.md** for current focus
3. **Run `npm run dev`** to start development
4. **Make changes** and commit with descriptive messages
5. **Deploy with `vercel --prod --yes`**

---

## 💡 Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage |
| `src/lib/utils.ts` | Brand colors, links |
| `src/components/layout/Header.tsx` | Navigation |
| `src/components/layout/Footer.tsx` | Footer |
| `src/app/globals.css` | Tailwind config & custom styles |
| `CLAUDE.md` | Full project documentation |

---

## 🔍 Verification URLs

| Resource | URL |
|----------|-----|
| Production Site | https://bl-2026-personal-site-n0tpyx0dh-bretts-projects-3e254e58.vercel.app |
| GitHub Repository | https://github.com/BrettLechtenbrerg/BL-2026-Personal-Site |
| Vercel Dashboard | https://vercel.com/bretts-projects-3e254e58/bl-2026-personal-site |

---

**Created By:** Agent Girl (Claude)
**Last Session:** April 4, 2026
**Working Directory:** `/Users/brettlechtenberg/Desktop/Claude Projects/BL-2026-Personal-Site`
