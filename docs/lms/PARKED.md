# Academy — parked items (kept, not lost)

Carried from Session 30 and the Lesson Forge build (Session 31). Each is a deliberate
"not now". Re-open by name; don't re-propose from scratch.

| # | Item | Why parked | Where to start |
|---|---|---|---|
| 1 | **Gate media files.** `public/academy/**` (mp4, m4a, pdf) is reachable by URL without buying. Move to private Supabase Storage + signed URLs from the module page. | Paywall gates the lesson/quiz already; media leak is low-stakes until a course sells. | `src/components/academy/ModuleDetail.tsx`, `src/app/academy/modules/[slug]/page.tsx`, `academy-install.mjs` (upload instead of copy) |
| 2 | **Linear module unlock.** Members currently see every module in a course they own. | Brett wants members to browse for now. | `unlockedSlugs` in `src/content/academy/modules.ts` — uncomment one line |
| 3 | **Single-use gift codes.** Today gift codes are Stripe promo codes with no redemption cap. | Fine while gifting by hand. | Stripe dashboard → promo code → max redemptions = 1 (no code change) |
| 4 | **Sizzle-reel homepage placement.** | Reel not final. | `src/app/page.tsx` hero |
| 5 | **Clone the Academy + Lesson Forge to PMMA and TSAI.** | BL.com must harden first. | Copy `src/app/academy`, `src/components/academy`, `src/lib/academy-*`, `src/content/academy`, `scripts/academy-*`; edit the CONFIG block in `academy-lesson.mjs`; add a row to the Targets table in `docs/lms/SKILL.md` |
| 6 | **One file per module.** Split `modules.ts` so `add` is a file drop, not a text insert. | Text insert + `tsc` + reload check is reliable today; 5,400-line file is the cost. | `src/content/academy/modules/<slug>.ts` + an index that sorts by `order` |
| 7 | **Narration speed.** Kokoro reads ~126 wpm at default speed; audiobooks are ~150. | Brett to listen to one full lesson first. | `narrate.sh` → add `-s 1.15` to the audiblez call |
| 8 | **Member-view smoke test in CI.** Module page needs a session + ownership, so local render checks stop at the login redirect. | Manual check on the live site works. | A dev-only signed cookie + seeded `me_course_access` row |
| 9 | **Course-certificate PDF/share link.** Course certificates are print-to-PDF only; the Master's Edge one has a Certifier share URL. | Print is enough until a member asks. | `CertificateCard.tsx` → server-rendered PDF or a public `/academy/certificate/<id>` verify page |
