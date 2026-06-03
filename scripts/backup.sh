#!/usr/bin/env bash
#
# backup.sh — Multi-location source-only ZIP backup for BL-2026-Personal-Site.
#
# Mirrors the TSAI-Site backup convention: one timestamped, source-only archive
# fanned out to three destinations (local, iCloud, external drive). Source-only
# = excludes node_modules, .next, .git, .vercel, and OS cruft, so archives stay
# small and restore cleanly with `npm install`.
#
# USAGE:
#   ./scripts/backup.sh                 # backup with timestamp
#   ./scripts/backup.sh my-tag          # append a label, e.g. ...-my-tag.zip
#
# RESTORE:
#   unzip <archive>.zip -d ~/dev/restored/ && cd ~/dev/restored/... && npm install
#
set -euo pipefail

PROJECT_NAME="BL-2026-Personal-Site"
PROJECT_DIR="/Users/brettlechtenberg/dev/${PROJECT_NAME}"
TAG="${1:-}"
STAMP="$(date +%Y%m%d-%H%M)"
SUFFIX="${STAMP}${TAG:+-$TAG}"
ARCHIVE="${PROJECT_NAME}-source-only-${SUFFIX}.zip"

# Destinations (parity with TSAI). Missing/unmounted ones are skipped, not fatal.
LOCAL_DIR="/Users/brettlechtenberg/dev/_backups"
ICLOUD_DIR="/Users/brettlechtenberg/Library/Mobile Documents/com~apple~CloudDocs/Backups/${PROJECT_NAME}"
EXTERNAL_DIR="/Volumes/Brett's 8 TB/Backups/${PROJECT_NAME}"

echo "==> Building source-only archive: ${ARCHIVE}"
cd "${PROJECT_DIR}/.."
TMP_ZIP="/tmp/${ARCHIVE}"
rm -f "${TMP_ZIP}"
# -r recurse, -q quiet, -X no extra attrs; exclude build/vcs/dep dirs.
# Exclude patterns are passed directly to zip (-x) so word-splitting can't drop them.
zip -r -q -X "${TMP_ZIP}" "${PROJECT_NAME}" \
  -x "${PROJECT_NAME}/node_modules/*" \
  -x "${PROJECT_NAME}/.next/*" \
  -x "${PROJECT_NAME}/.git/*" \
  -x "${PROJECT_NAME}/.vercel/*" \
  -x "*/.DS_Store" \
  -x "*.log"

SIZE="$(du -h "${TMP_ZIP}" | cut -f1)"
echo "    archive size: ${SIZE}"

copy_to() {
  local label="$1" dir="$2" parent
  parent="$(dirname "${dir}")"
  if [ ! -d "${parent}" ]; then
    echo "==> SKIP ${label} (not available: ${parent})"
    return 0
  fi
  mkdir -p "${dir}"
  cp "${TMP_ZIP}" "${dir}/${ARCHIVE}"
  echo "==> SAVED ${label}: ${dir}/${ARCHIVE}"
}

copy_to "local"    "${LOCAL_DIR}"
copy_to "iCloud"   "${ICLOUD_DIR}"
copy_to "external" "${EXTERNAL_DIR}"

rm -f "${TMP_ZIP}"
echo "==> Done. Backup '${ARCHIVE}' (${SIZE}) fanned out to all available destinations."
