#!/bin/bash
# One-shot helper: store the Stripe live secret key in Vercel prod + .env.local.
# Usage: bash scripts/add-stripe-key.sh   (prompts; the key is never echoed)
set -e
cd "$(dirname "$0")/.."
read -r -s -p "Paste the sk_live key, then press Enter (it stays hidden): " K
echo
case "$K" in
  sk_live_*) ;;
  *) echo "That doesn't look like a live secret key (should start with sk_live_). Nothing saved."; exit 1 ;;
esac
printf '%s' "$K" | npx vercel env add STRIPE_SECRET_KEY production --force
sed -i '' '/^STRIPE_SECRET_KEY=/d' .env.local
printf 'STRIPE_SECRET_KEY=%s\n' "$K" >> .env.local
unset K
echo "DONE"
