#!/usr/bin/env bash
#==============================================================================
# Install / remove / inspect the Academy NotebookLM batch LaunchAgent.
#   bash scripts/academy-batch-ctl.sh install   # start running every 20 min
#   bash scripts/academy-batch-ctl.sh remove    # stop + uninstall
#   bash scripts/academy-batch-ctl.sh status    # queue + last log lines
#==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.brettlechtenberg.academy-notebooklm"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"

case "${1:-}" in
  install)
    mkdir -p "$HOME/Library/LaunchAgents" "$ROOT/.notebooklm"
    sed -e "s|__ROOT__|$ROOT|g" -e "s|__HOME__|$HOME|g" "$ROOT/scripts/academy-batch.plist" > "$PLIST"
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    launchctl bootstrap "$DOMAIN" "$PLIST"
    echo "Installed $LABEL — first run starts now, then every 20 min."
    echo "Watch: tail -f $ROOT/.notebooklm/batch.log"
    ;;
  remove)
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    rm -f "$PLIST"; rm -rf "$ROOT/.notebooklm/batch.lock"
    echo "Removed $LABEL."
    ;;
  status)
    if launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then echo "LaunchAgent: loaded"; else echo "LaunchAgent: not loaded"; fi
    node "$ROOT/scripts/academy-batch.mjs" --status
    echo "--- last log lines ---"
    tail -n 8 "$ROOT/.notebooklm/batch.log" 2>/dev/null || echo "(no log yet)"
    ;;
  *)
    echo "usage: $0 install|remove|status"; exit 1 ;;
esac
