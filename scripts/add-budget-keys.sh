#!/bin/bash
# Power Hub Budget — store the secrets Brett types (never shown, never logged).
#   bash scripts/add-budget-keys.sh            → Production: BL_STRIPE_READ_KEY + new HUB_PASSWORD
#   bash scripts/add-budget-keys.sh --preview  → Preview for branch power-hub-budget only (to test before merging)
# The Stripe key must be a RESTRICTED read-only key (rk_live_…). A new HUB_PASSWORD
# signs out every existing Power Hub session (src/lib/hub-session.ts).
# Uses the vercel CLI already installed on this Mac (no download).
set -euo pipefail
cd "$(dirname "$0")/.."
BRANCH=power-hub-budget
command -v vercel >/dev/null || { echo "The vercel command isn't installed on this Mac. Nothing saved."; exit 1; }

ask_secret() { # $1 prompt → $REPLY_SECRET
  local a
  read -r -s -p "$1" a; echo
  REPLY_SECRET="$a"
}
add() { # name env [branch] ← $VALUE
  # Vercel's own messages stay visible (they never contain the value) so any question it asks isn't hidden.
  if printf '%s' "$VALUE" | vercel env add "$1" "$2" ${3:+"$3"} --force --yes; then
    echo "  ✓ $1 saved ($2${3:+, branch $3})"
  else
    echo "  ✗ $1 could not be saved to Vercel ($2). Stopped."; exit 1
  fi
}
envlocal() { grep -E "^$1=" .env.local | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }

ask_password() {
  ask_secret "New Power Hub password (16+ characters, hidden), then Enter: "; local p1="$REPLY_SECRET"
  ask_secret "Type it again: "; local p2="$REPLY_SECRET"
  [ "$p1" = "$p2" ] || { echo "The two passwords don't match. Nothing saved."; exit 1; }
  [ ${#p1} -ge 16 ] || { echo "Please use at least 16 characters. Nothing saved."; exit 1; }
  NEW_PASSWORD="$p1"
}

if [ "${1:-}" = "--preview" ]; then
  echo "Preview setup for branch $BRANCH (Production is not touched)."
  K=$(envlocal BL_STRIPE_READ_KEY); [ -n "$K" ] || { echo "Run the Production step first (it saves the Stripe key here too)."; exit 1; }
  ask_secret "Power Hub username (hidden), then Enter: "; HUB_USER="$REPLY_SECRET"
  [ -n "$HUB_USER" ] || { echo "No username. Nothing saved."; exit 1; }
  ask_password
  VALUE="$K" add BL_STRIPE_READ_KEY preview $BRANCH
  VALUE="$HUB_USER" add HUB_USERNAME preview $BRANCH
  VALUE="$NEW_PASSWORD" add HUB_PASSWORD preview $BRANCH
  VALUE="$(openssl rand -hex 32)" add HUB_SESSION_SECRET preview $BRANCH
  VALUE="$(envlocal NEXT_PUBLIC_SUPABASE_URL)" add NEXT_PUBLIC_SUPABASE_URL preview $BRANCH
  VALUE="$(envlocal SUPABASE_SERVICE_ROLE_KEY)" add SUPABASE_SERVICE_ROLE_KEY preview $BRANCH
  unset K HUB_USER NEW_PASSWORD VALUE REPLY_SECRET
  echo "DONE"
  exit 0
fi

echo "Step 1 of 2: the read-only Stripe key"
ask_secret "Paste the rk_live key (hidden), then Enter: "; K="$REPLY_SECRET"
case "$K" in
  rk_live_*) ;;
  sk_*) echo "That is a FULL secret key (sk_). Please create a restricted key (rk_live_). Nothing saved."; exit 1 ;;
  *) echo "That doesn't look like a restricted live key (should start with rk_live_). Nothing saved."; exit 1 ;;
esac
VALUE="$K" add BL_STRIPE_READ_KEY production
sed -i '' '/^BL_STRIPE_READ_KEY=/d' .env.local
printf 'BL_STRIPE_READ_KEY=%s\n' "$K" >> .env.local
echo "  ✓ also saved in .env.local (this Mac only, never committed)"
unset K

echo "Step 2 of 2: a new Power Hub password"
ask_password
VALUE="$NEW_PASSWORD" add HUB_PASSWORD production
unset NEW_PASSWORD VALUE REPLY_SECRET
echo "DONE. The new password works after the next deploy; old sessions end then."
