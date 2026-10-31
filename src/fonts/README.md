# Brand fonts (stored with the site)

- `Montserrat-latin-variable.woff2`: Montserrat v31, latin, variable weight 100-900 (headings).
- `Inter-latin-variable.woff2`: Inter v20, latin, variable weight 100-900 (body text).

Both come from Google Fonts and are under the SIL Open Font License 1.1 (free to self-host). They are loaded in
`src/app/layout.tsx` with `next/font/local`, so builds never need to download fonts (two Vercel builds failed on
30-31 Oct 2026 when Google's font download failed). To update, re-download the "latin" file each font's Google Fonts
CSS points to and replace these files.
