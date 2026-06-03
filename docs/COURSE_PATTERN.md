# Course / Workbook Pattern — BrettLechtenberg.com

> **Purpose:** This is the canonical recipe for adding a new hidden, interactive
> online course (a "workbook") to the personal site. Follow it and a new course
> takes ~1 file. The first reference implementation is **The Master's Edge**
> at `/masters-edge/workbook`.

---

## What a "course" is here

A self-contained, interactive **participant workbook** rendered as a single
client page. Participants open an unlisted URL, fill in activities on any
device, and export their results to PDF or email. It is **hidden** (not indexed,
not in nav, not in sitemap) so you share the link directly with a class/cohort.

This mirrors the proven pattern from the Total Success AI site
(`/workshop/<slug>`), adapted to this site's stack and brand.

### Live reference
- Page: `https://brettlechtenberg.com/masters-edge/workbook`
- Source: `src/app/masters-edge/workbook/page.tsx`
- Hidden via: `src/app/masters-edge/workbook/layout.tsx`
- Lead capture API: `src/app/api/workbook-lead/route.ts`

---

## The 3 ingredients of every course

| File | Role |
|------|------|
| `src/app/<route>/page.tsx` | The interactive workbook (the whole course) |
| `src/app/<route>/layout.tsx` | `robots: noindex/nofollow` — makes it hidden |
| `src/app/api/<name>-lead/route.ts` | (Optional) GHL lead capture webhook |

"Hidden" = **noindex layout + NOT in `src/app/sitemap.ts` + NOT linked in
`src/components/layout/Header.tsx`.** That's the entire mechanism. To later
*promote* a course publicly, reverse those three (see "Promote a course").

---

## The engine inside `page.tsx` (reusable skeleton)

Every workbook page is `"use client"` and contains these building blocks. Copy
the Master's Edge page as your starting template and swap the content model.

1. **Data model + defaults**
   - A `WorkbookData` interface (all the fields a participant fills in).
   - A `defaultData` object initialized to empty strings / `false`.
   - A unique `STORAGE_KEY` (e.g. `bl_<course>_workbook`) — **must be unique per
     course** so localStorage doesn't collide.

2. **Section model**
   - `const sections = ["welcome", ...] as const;` defines the tab order.
   - `sectionMeta` maps each section to `{ label, short, icon, color }`.
   - Icons come from **`lucide-react`** (this site does NOT use react-icons).

3. **State + autosave**
   - `useState` for `data`, `currentSection`, `saveStatus`, `showHelp`, `isPrinting`.
   - On mount: load from `localStorage`.
   - Debounced effect: save `{ data, section }` to `localStorage` (shows "Saved ✓").

4. **Lead webhook** — `sendWebhook("started" | "completed")` POSTs to the
   lead API; fire-and-forget so it never blocks the UI.

5. **Sticky toolbar** — progress bar (% filled), Save status, **PDF**, **Email**,
   **Help** buttons, and the section tabs.

6. **Export**
   - **PDF** via the html2pdf CDN script (`<Script src=".../html2pdf.bundle.min.js" />`)
     rendering `#workbookContent` while `isPrinting` shows all sections.
   - **Email** builds a plain-text body and opens a `mailto:` to the participant.

7. **Section blocks** — each section renders when
   `(isPrinting || currentSection === "<section>")` so PDF export captures all of them.

8. **Help modal** — a simple overlay explaining autosave / PDF / Email.

### ⚠️ Critical gotcha — input components MUST be module-level
Define field components (`Field`, `HabitTracker`, etc.) **outside** the page
component (module scope), passing `value` + `onChange` as props. If you define
them *inside* the component, every keystroke remounts them and the input
**loses focus after one character.** (This was a real bug; it's fixed in the
reference page — keep it that way.)

---

## Brand + styling rules (this site)

- **Stack:** Next.js 16 + React 19 + **Tailwind CSS v4** (`@tailwindcss/postcss`)
  + Framer Motion + **Lucide React**. NOT Tailwind v3, NOT react-icons.
- **Colors (globals.css tokens):** `cranberry` `#9B1B30` (primary),
  `gold` `#D4AF37` (accent), plus `cranberry-dark/light`, `gold-dark/light`,
  `warm-gray`, `black`. Use class names like `bg-cranberry`, `text-gold-dark`.
- **Fonts:** headings use `font-heading` (Montserrat); body is Inter.
- **Voice:** bold, confident, performance-driven. Keep workbook copy faithful to
  Brett's source material — don't rewrite his teaching content without approval.
- **Mobile-first:** inputs use `text-base`/16px to avoid iOS zoom; 44px tap targets.

---

## Step-by-step: add a NEW course

> Example new course slug: `peak-focus`. Adjust names to your course.

1. **Create the route folder:** `src/app/<area>/<slug>/`
   (e.g. `src/app/masters-edge/peak-focus/` or `src/app/courses/peak-focus/`).

2. **Copy the reference files** from `src/app/masters-edge/workbook/`:
   - Copy `page.tsx` → edit the content model (sections, fields, copy, icons).
   - Copy `layout.tsx` → update `title`/`description`/`openGraph.url` and keep
     `robots: { index: false, follow: false }`.

3. **Set a unique `STORAGE_KEY`** in the new `page.tsx`
   (e.g. `bl_peak_focus_workbook`). Do not reuse another course's key.

4. **Swap the content:**
   - Update `WorkbookData`, `defaultData`, `sections`, `sectionMeta`.
   - Replace each section's quote / "The Idea" / exercise fields / trackers.
   - Update the **email body builder** and **PDF filename** to match new fields.

5. **(Optional) Lead capture:** reuse `/api/workbook-lead` as-is (it's generic —
   send a different `workbook`/`workbook_name` in the payload), OR copy it to a
   new `/api/<course>-lead/route.ts` if you want separate GHL workflows.

6. **Verify locally:** `npm run build`, then `npm run dev` and open the route.
   Type into a field to confirm focus is retained; test PDF + Email.

7. **Keep it hidden** (default) — do nothing else. Share the URL directly.
   To list it publicly, see "Promote a course" below.

8. **Commit & push** to `main` (Vercel auto-deploys). Verify the LIVE url with
   `curl -I` and check `name="robots"` is `noindex` in the returned HTML.

---

## Lead capture (GoHighLevel) — finishing the automation

`src/app/api/workbook-lead/route.ts` is wired but inert until env vars are set.
When you're ready to capture leads:

1. In GHL, create two Workflows, each starting with an **Inbound Webhook**
   trigger: one for "Started", one for "Completed". Build the email/tag/pipeline
   automation inside each.
2. Copy each workflow's webhook URL into **Vercel → Project → Settings →
   Environment Variables**, then redeploy:
   - `GHL_WORKBOOK_STARTED_URL`
   - `GHL_WORKBOOK_COMPLETED_URL`
3. Until set, leads are accepted + logged but **not forwarded** (page never breaks).

---

## Promote a course (make it public/indexable)

Reverse the three "hidden" levers:
1. In `<slug>/layout.tsx`, set `robots: { index: true, follow: true }` and add a
   `canonical` in `alternates`.
2. Add the route to `src/app/sitemap.ts`.
3. Add a nav link in `src/components/layout/Header.tsx` (e.g. under the
   `mastersEdgeDropdown` array, or the main `navItems`).

---

## Quick reference — key files

- `src/app/masters-edge/workbook/page.tsx` — reference course (copy this)
- `src/app/masters-edge/workbook/layout.tsx` — noindex hidden recipe
- `src/app/api/workbook-lead/route.ts` — GHL lead capture + TODO notes
- `src/app/globals.css` — brand color tokens + fonts
- `src/components/ui/Button.tsx` — branded button (variants: primary/secondary/outline/ghost)
- `src/components/layout/Header.tsx` — nav (where to link a promoted course)
- `src/app/sitemap.ts` — add here only when promoting a course
- `src/lib/utils.ts` — `cn()`, `brandColors`, `links` (booking/email URLs)
