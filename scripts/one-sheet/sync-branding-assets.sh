#!/bin/bash
# Sync Brett Lechtenberg branding assets to all three storage locations.
# Run AFTER any re-render of one-sheets / business card / banner:
#   bash scripts/one-sheet/sync-branding-assets.sh
#
# Canonical source of truth: this repo (scripts/one-sheet/ + public/).
# Never edit files inside the destination folders directly — change the
# HTML here, re-render, then run this script.

set -euo pipefail
SRC="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$SRC/../.." && pwd)"
FOLDER="Brett Lechtenberg Branding Assets Aug 2026"

DESTS=(
  "/Users/brettlechtenberg/Desktop/The Masters Edge Book/$FOLDER"
  "/Users/brettlechtenberg/Desktop/Brett's Personal File Website - Resume - Coaching Programs 2026/$FOLDER"
  "/Volumes/Brett's 8 TB/$FOLDER"
)

FILES=(
  "$REPO/public/brett-lechtenberg-speaker-one-sheet.pdf"
  "$SRC/Brett-Lechtenberg-Speaker-One-Sheet-AGENCY.pdf"
  "$SRC/Brett-Lechtenberg-Business-Card.pdf"
  "$SRC/Brett-Lechtenberg-PullUp-Banner-30x60.pdf"
)

# Rename map: website one-sheet gets a clearer name in the asset folders
declare -a NAMES=(
  "Brett-Lechtenberg-Speaker-One-Sheet-WEBSITE.pdf"
  "Brett-Lechtenberg-Speaker-One-Sheet-AGENCY.pdf"
  "Brett-Lechtenberg-Business-Card.pdf"
  "Brett-Lechtenberg-PullUp-Banner-30x60.pdf"
)

failures=0
for dest in "${DESTS[@]}"; do
  base="$(dirname "$dest")"
  if [ ! -d "$base" ]; then
    echo "SKIP (not mounted / missing): $base" >&2
    failures=1
    continue
  fi
  mkdir -p "$dest"
  for i in "${!FILES[@]}"; do
    cp "${FILES[$i]}" "$dest/${NAMES[$i]}"
  done
  # Banner viewing copy if present on Desktop
  if [ -f "/Users/brettlechtenberg/Desktop/Brett-Lechtenberg-PullUp-Banner-VIEW.png" ]; then
    cp "/Users/brettlechtenberg/Desktop/Brett-Lechtenberg-PullUp-Banner-VIEW.png" "$dest/"
  fi
  # Social banner set
  if [ -d "$SRC/social" ]; then
    mkdir -p "$dest/Social Banners"
    cp "$SRC/social/"*.png "$dest/Social Banners/"
  fi
  cat > "$dest/README.txt" <<'EOF'
BRETT LECHTENBERG BRANDING ASSETS - AUG 2026
=============================================
Brand: cranberry #9B1B30 / gold #D4AF37 / black #1A1A1A
Fonts: Montserrat (headings) + Inter (body)

FILES
- Speaker One-Sheet WEBSITE.pdf ... the one-sheet live on brettlechtenberg.com
- Speaker One-Sheet AGENCY.pdf .... classic layout for speaker agency meetings
- Business Card.pdf ............... 3.75x2.25in = 3.5x2in trim + 0.125in bleed
- PullUp Banner 30x60.pdf ......... exact size, no bleed (ask printer for spec)
- PullUp Banner VIEW.png .......... easy on-screen viewing copy of the banner
- Social Banners/ ................. Facebook cover 1640x624, LinkedIn banner
                                    1584x396, YouTube channel art 2560x1440
                                    (text sits in the center safe zone),
                                    Instagram square 1080x1080, Zoom virtual
                                    background 1920x1080, email signature
                                    banner 600x200

DO NOT EDIT THESE FILES DIRECTLY.
Source of truth: ~/dev/BL-2026-Personal-Site/scripts/one-sheet/
To modify: edit the HTML there, re-render with render.cjs, then run
sync-branding-assets.sh - it updates all three storage locations at once.
EOF
done

echo "Synced to:"
for dest in "${DESTS[@]}"; do
  [ -d "$dest" ] && echo "  ✓ $dest" && ls "$dest" | sed 's/^/      /'
done
exit $failures
