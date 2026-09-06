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

## ⚠️ Working Directory Rule (REQUIRED)

**Always work in `/Users/brettlechtenberg/dev/BL-2026-Personal-Site`.**

An old copy lived at `~/Desktop/Claude Projects/BL-2026-Personal-Site` (iCloud-synced)
which corrupts `.git/` and causes chronic session freezes — the same issue we hit
on the TSAI and Murray Chamber projects. Project was migrated to `~/dev/` on
2026-04-27. Never work in any iCloud / Google Drive / Dropbox path.

## Quick Start

```bash
cd ~/dev/BL-2026-Personal-Site
npm install           # Install dependencies
npm run dev           # Start dev server (localhost:3000)
npm run build         # Build for production
git push origin main  # Vercel auto-deploys on push
```

This project is on Brett's personal Vercel team (`bretts-projects-3e254e58`),
so the git author rule that applies to the Murray Chamber site (commits must
be authored as `Power Hub CMS`) does NOT apply here. Any commit author works.

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
│   │   ├── masters-edge/workbook/   # HIDDEN interactive course (noindex)
│   │   │   ├── page.tsx             #   - the 4-week workbook (reference course)
│   │   │   └── layout.tsx           #   - robots:noindex makes it hidden
│   │   ├── api/workbook-lead/       # GHL lead capture for courses (TODO: env vars)
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
├── docs/
│   └── COURSE_PATTERN.md            # Canonical recipe for adding new courses
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

### Hidden Courses (noindex — not in nav/sitemap; share URL directly)

| Course | Path | Status | Description |
|--------|------|--------|-------------|
| The Master's Edge Workbook | `/masters-edge/workbook` | ✅ Live | Interactive 4-week participant workbook (Clarify → Simplify → Maximize → Integration). Autosave, PDF export, email results, GHL lead capture. |
| Master's Edge Academy | `/academy` | ✅ LIVE (Aug 29 2026) — preview mode: all modules unlocked | Full private LMS: enrollment-code signup (code EDGE2026), 4 courses / 43 modules (Business Tools, Reclaiming the Clock, Master's Edge Book, + Framework free-giveaway course with NotebookLM audio & video overviews), written lesson + quiz per module, 80% pass gate, XP + belts, badges, community, leaderboard, certification + certificate. Admin review at `/hub/academy`. Env vars set; keep-alive cron 2×/day with auto-restore. **Read `docs/ACADEMY.md` + `docs/SESSION-NOTES.md`**. |

### Hidden Draft Pages (noindex — side-by-side review, July 3 2026)

| Draft | Path | Status | Description |
|-------|------|--------|-------------|
| ~~Speaking v2/v3~~ | ~~`/speaking-v2`, `/speaking-v3`~~ | ✅ PROMOTED July 3 PM | v3 (four lanes + live imagery + Juan Diego video + accordion talk cards) is now the live /speaking; both draft routes deleted. |
| ~~Media Kit v2~~ | ~~`/media-kit-v2`~~ | ✅ PROMOTED July 3 | Four-lane Talk Topics is now the live /media-kit; draft route deleted. |

### Comms Hub (noindex — internal tool, July 3 2026)

| Tool | Path | Status | Description |
|------|------|--------|-------------|
| Comms Hub | `/hub` → `/hub/messaging` | ✅ LIVE — email verified | GHL messaging center (Compose/Inbox/Log + Add/Delete leads) — Leads-only clone of PMMA's Power Hub system. **Read `docs/COMMS_HUB.md`** (architecture, env vars, 5 GHL scopes, test plan, cloning). Email send verified end-to-end (spam until dedicated sending domain). SMS parked — location has no phone number/A2P yet. ⚠️ TEMP login bladmin/bl-dev-2026 — rotate HUB_PASSWORD before real use. |

> **Adding a new course?** Read **`docs/COURSE_PATTERN.md`** — it's the canonical,
> step-by-step recipe. Copy `src/app/masters-edge/workbook/` as the template.
> "Hidden" = noindex layout + not in `sitemap.ts` + not linked in `Header.tsx`.
> GHL lead capture is wired in `src/app/api/workbook-lead/route.ts` but inert
> until `GHL_WORKBOOK_STARTED_URL` / `GHL_WORKBOOK_COMPLETED_URL` env vars are
> set in Vercel (TODO).

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

- **Years in Business:** 30+ (founded August 4, 1996 — 30th anniversary
  celebrated Aug 4, 2026; compute current figure from founding date)
- **Martial Arts Rank:** 8th-Degree Black Belt
- **Martial Arts Experience:** 40+ years
- **Books:** 7 books, 5 bestsellers (2 more launching ~Q4 2026 — update to 9
  ONLY after they are actually live; never pre-count)
- **Speaking:** 250+ talks, trainings & seminars (verified by Brett Aug 8 2026;
  counts chamber events, corporate trainings, martial arts seminars — the
  broad label is what makes the number honest, so never shorten to
  "250+ keynotes" or "250+ corporate events")
- **Clients:** 100+ businesses coached (verified by Brett Aug 8 2026; counts
  short- and long-term consulting/coaching clients over the career — NOT
  concurrent clients, and NOT "corporate" clients)
- **People Trained:** Thousands (no specific numbers)
- **Sam Beard credit line:** "Creator of 6 Presidential Programs for 8 U.S.
  Presidents · Founder, National Development Council" — do NOT cite the
  Jefferson Awards (he co-founded it, but the org no longer exists; NDC is
  still active). Sam is writing the foreword to Brett's Human First AI book —
  add that credit when the book launches.
- **Research:** Flow state researcher validated by Flow Research Collective
- **Methodology:** The Master's Edge (always capitalized with "The")
- **AI Company:** Total Success AI (co-founded with Manny Torres)
- **Location:** Sandy, Utah
- **Public mailing address:** 8663 South Highland Dr, Sandy, UT 84093 — this is
  Personal Mastery Martial Arts (Brett's school) and is the ONLY street address
  ever published. Never put Brett's home address on any material.
- **Branding assets (print kit):** source of truth is `scripts/one-sheet/`
  (HTML + render.cjs — website one-sheet, agency one-sheet, business card,
  pull-up banner). After ANY re-render, ALWAYS run
  `bash scripts/one-sheet/sync-branding-assets.sh` — it pushes the PDFs to all
  three "Brett Lechtenberg Branding Assets Aug 2026" folders (Masters Edge Book
  folder, Brett's Personal File folder, 8 TB drive) simultaneously. Never edit
  those folder copies directly.

---

## Key Links (Configured in `src/lib/utils.ts`)

| Purpose | URL |
|---------|-----|
| Booking CTA | https://www.speaktobrett.com |
| Email | mailto:Brett@BrettLechtenberg.com |
| Martial Arts School | https://personalmasterymartialarts.com |
| AI Company | https://totalsuccessai.com |

---

## Backups (multi-location source-only ZIP)

Run before/after big changes. Mirrors the TSAI-Site convention.

```bash
./scripts/backup.sh                 # timestamped archive to all 3 destinations
./scripts/backup.sh my-label        # adds a label, e.g. ...-my-label.zip
```

Source-only (excludes `node_modules`, `.next`, `.git`, `.vercel`). Fans out to:
- **Local:** `~/dev/_backups/BL-2026-Personal-Site-source-only-*.zip`
- **iCloud:** `~/Library/Mobile Documents/com~apple~CloudDocs/Backups/BL-2026-Personal-Site/`
- **External:** `/Volumes/Brett's 8 TB/Backups/BL-2026-Personal-Site/`
  (drive label is "Brett's 8 TB"; if unmounted, that destination is skipped, not fatal)

**Restore:** `unzip <archive>.zip -d ~/dev/restored/ && cd ~/dev/restored/BL-2026-Personal-Site && npm install`

> GitHub `origin/main` is still the primary source of truth; these zips are an
> off-machine safety net (and capture untracked assets in `public/`).

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

### July 3, 2026
- **Hidden v2 drafts:** /speaking-v2 (four-lane restructure, 10 talks) +
  /media-kit-v2 built from Desktop spec; noindex; live pages untouched
- **Comms Hub:** /hub GHL messaging center (Compose/Inbox/Log) — see
  `docs/COMMS_HUB.md`; deployed fail-closed; temp login set, setup pending
- **(Afternoon)** Comms Hub fully configured + verified live (email
  delivered; SMS parked — no phone number). Add/Delete leads + login
  visibility toggles added. **/media-kit-v2 promoted to live /media-kit.**
- **(Evening)** Site-wide design flair (TiltCard 3D cards, AnimatedCounter,
  shimmer text, shine CTAs, scroll-progress bar, branded scrollbar).
  **Speaking v3 promoted to live /speaking**: four lanes + accordion talk
  cards + Juan Diego live video (LiveClip component) + bento gallery;
  -v2/-v3 draft routes deleted.

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
- "100+ Speaking Events" (replaced Aug 8 2026 → "250+ Talks, Trainings & Seminars")
- "50+ Corporate Clients" (misleading "corporate" → "100+ Businesses Coached")
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
