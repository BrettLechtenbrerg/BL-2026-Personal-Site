#!/usr/bin/env bash
#==============================================================================
# Academy Forge — install / remove / inspect this site's NotebookLM batch
# LaunchAgent (runs scripts/academy-batch.mjs every 20 min until done).
#   bash scripts/academy-batch-ctl.sh install            # generate + install, no publishing
#   bash scripts/academy-batch-ctl.sh install --deploy   # also commit + publish each module
#   bash scripts/academy-batch-ctl.sh remove             # stop + uninstall
#   bash scripts/academy-batch-ctl.sh status             # queue, pause, last log lines
# Runs only while the Mac is awake. It unloads itself when every module is done.
#==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="$(node -e '
  const fs = require("fs"), p = require("path");
  for (const d of ["src", ""]) {
    const f = p.join(process.argv[1], d, "content", "academy.config.ts");
    if (fs.existsSync(f)) { const m = fs.readFileSync(f, "utf8").match(/academyConfig: AcademyConfig = (\{[\s\S]*\});\s*$/); if (m) { process.stdout.write(JSON.parse(m[1]).slug); process.exit(0); } }
  }
  process.exit(1);' "$ROOT")" || { echo "academy.config.ts not found — run install.sh for this brand first"; exit 1; }
LABEL="com.brettlechtenberg.academy-batch.$SLUG"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"
NODE="$(command -v node)"

case "${1:-}" in
  install)
    DEPLOY_ARG=""
    [[ "${2:-}" == "--deploy" ]] && DEPLOY_ARG="<string>--deploy</string>"
    mkdir -p "$HOME/Library/LaunchAgents" "$ROOT/.notebooklm"
    sed -e "s|__ROOT__|$ROOT|g" -e "s|__HOME__|$HOME|g" -e "s|__LABEL__|$LABEL|g" \
        -e "s|__NODE__|$NODE|g" -e "s|__DEPLOY_ARG__|$DEPLOY_ARG|g" \
        "$ROOT/scripts/academy-batch.plist" > "$PLIST"
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    launchctl bootstrap "$DOMAIN" "$PLIST"
    echo "Installed $LABEL — first run starts now, then every 20 min${DEPLOY_ARG:+ (publishing each finished module)}."
    echo "Watch: tail -f $ROOT/.notebooklm/batch.log"
    ;;
  remove)
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    rm -f "$PLIST"
    echo "Removed $LABEL."
    ;;
  status)
    if launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then echo "LaunchAgent: loaded ($LABEL)"; else echo "LaunchAgent: not loaded"; fi
    node "$ROOT/scripts/academy-batch.mjs" --status
    echo "--- last log lines ---"
    tail -n 8 "$ROOT/.notebooklm/batch.log" 2>/dev/null || echo "(no log yet)"
    ;;
  *)
    echo "usage: $0 install [--deploy] | remove | status"; exit 1 ;;
esac
