#!/bin/bash
# One-shot helper: store the three Cloudflare R2 values in .env.local and Vercel production.
# Usage: bash scripts/add-r2-keys.sh
# In Terminal it prompts (hidden as you type); run without a Terminal it shows pop-up boxes.
# The values are tested against the bucket first, and are never printed.
set -euo pipefail
cd "$(dirname "$0")/.."
VERCEL="$(command -v vercel || true)"
[ -n "$VERCEL" ] || { echo "Vercel CLI not found. Nothing saved."; exit 1; }
[ -f .env.local ] || { echo ".env.local not found in $(pwd). Nothing saved."; exit 1; }

ask() {
  local v
  if [ -t 0 ]; then
    read -r -s -p "$1 (stays hidden), then Enter: " v; echo >&2
  else
    v="$(osascript - "$1" <<'OSA'
on run argv
  set q to item 1 of argv
  try
    tell application "System Events"
      activate
      with timeout of 900 seconds
        set r to display dialog q default answer "" with hidden answer with title "Cloudflare R2 keys" buttons {"Cancel", "Save"} default button "Save" giving up after 880
      end timeout
    end tell
  on error number n
    if n is -128 then error number -128
    set r to display dialog q default answer "" with hidden answer with title "Cloudflare R2 keys" buttons {"Cancel", "Save"} default button "Save" giving up after 880
  end try
  if gave up of r then error number -128
  return text returned of r
end run
OSA
)" || return 1
  fi
  printf '%s' "$v" | tr -d '[:space:]' | tr 'A-F' 'a-f'
}

# $1 = what to paste, $2 = how many characters it must be
get() {
  local v label="$1" n
  for n in 1 2 3; do
    v="$(ask "$label")" || { echo "Cancelled. Nothing saved." >&2; return 1; }
    v="$(printf '%s' "$v" | grep -oE "[0-9a-f]{$2,}" | head -1 || true)"
    if [ "${#v}" -eq "$2" ]; then printf '%s' "$v"; return 0; fi
    label="That one didn't look right (it should be $2 letters and numbers). Try again: $1"
  done
  echo "Three tries without a match. Nothing saved." >&2; return 1
}

ACCOUNT="$(get "1 of 3: paste the S3 address from Cloudflare (https://....r2.cloudflarestorage.com) or the Account ID" 32)"
ACCESS="$(get "2 of 3: paste the Access Key ID" 32)"
SECRET="$(get "3 of 3: paste the Secret Access Key" 64)"

echo "Testing the keys against the bucket..."
printf '%s\n%s\n%s\n' "$ACCOUNT" "$ACCESS" "$SECRET" | node --input-type=module -e '
import { readFileSync } from "node:fs";
import { presignUrl, r2Config } from "./src/lib/r2-presign.mjs";
const [a, k, s] = readFileSync(0, "utf8").split("\n");
const config = r2Config({ R2_ACCOUNT_ID: a, R2_ACCESS_KEY_ID: k, R2_SECRET_ACCESS_KEY: s });
const call = async (what, opts, okStatus, init = {}) => {
  let res;
  try { res = await fetch(presignUrl({ config, expiresSeconds: 60, ...opts }), { method: opts.method || "GET", ...init }); }
  catch { console.log("Could not reach Cloudflare for that Account ID."); process.exit(1); }
  if (res.status === okStatus) return;
  const code = ((await res.text()).match(/<Code>([^<]+)<\/Code>/) || [])[1] || "no reason given";
  console.log(`${what} was refused: ${res.status} ${code}`);
  process.exit(1);
};
await call("Listing the bucket", { query: { "list-type": "2", "max-keys": "1" } }, 200);
await call("Writing a test file", { method: "PUT", key: "_key-check.txt" }, 200, { body: "ok" });
await call("Removing the test file", { method: "DELETE", key: "_key-check.txt" }, 204);
' || { echo "The keys did not pass the test. Nothing saved."; exit 1; }
echo "Keys work: can list, write and remove in the bucket."

sed -i '' -e '/^# Cloudflare R2 (academy lesson media/d' -e '/^R2_ACCOUNT_ID=/d' -e '/^R2_ACCESS_KEY_ID=/d' -e '/^R2_SECRET_ACCESS_KEY=/d' .env.local
printf '# Cloudflare R2 (academy lesson media, private bucket bl-academy-media)\nR2_ACCOUNT_ID=%s\nR2_ACCESS_KEY_ID=%s\nR2_SECRET_ACCESS_KEY=%s\n' "$ACCOUNT" "$ACCESS" "$SECRET" >> .env.local
echo "Saved to .env.local (3 values)."

add() {
  local out
  out="$(printf '%s' "$2" | "$VERCEL" env add "$1" production --force 2>&1)" || { echo "Vercel refused $1:"; echo "$out" | tail -3; exit 1; }
  echo "Added to Vercel production: $1"
}
add R2_ACCOUNT_ID "$ACCOUNT"
add R2_ACCESS_KEY_ID "$ACCESS"
add R2_SECRET_ACCESS_KEY "$SECRET"
unset ACCOUNT ACCESS SECRET
echo "DONE"
