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
# zip exit 12 = "nothing to do", 18 = "some files unreadable/changed"; both are
# non-fatal for a backup, so don't let `set -e` abort the whole run on them.
zip -r -q -X "${TMP_ZIP}" "${PROJECT_NAME}" \
  -x "${PROJECT_NAME}/node_modules/*" \
  -x "${PROJECT_NAME}/.next/*" \
  -x "${PROJECT_NAME}/.git/*" \
  -x "${PROJECT_NAME}/.vercel/*" \
  -x "*/.DS_Store" \
  -x "*.log" || { code=$?; [ "$code" -le 18 ] || { echo "zip failed (exit $code)"; exit "$code"; }; }

if [ ! -s "${TMP_ZIP}" ]; then
  echo "ERROR: archive was not created or is empty: ${TMP_ZIP}" >&2
  exit 1
fi

SIZE="$(du -h "${TMP_ZIP}" | cut -f1)"
echo "    archive size: ${SIZE}"

# copy_to <label> <dest-dir> <availability-root>
# Skips (non-fatal) if the availability-root isn't present, e.g. an unmounted
# external drive or a not-yet-synced iCloud folder.
copy_to() {
  local label="$1" dir="$2" root="$3"
  if [ ! -d "${root}" ]; then
    echo "==> SKIP ${label} (not available: ${root})"
    return 0
  fi
  mkdir -p "${dir}"
  if cp "${TMP_ZIP}" "${dir}/${ARCHIVE}"; then
    echo "==> SAVED ${label}: ${dir}/${ARCHIVE}"
  else
    echo "==> WARN  ${label} copy failed (continuing)"
  fi
}

# Availability roots: a parent that only exists when the destination is usable.
copy_to "local"    "${LOCAL_DIR}"    "/Users/brettlechtenberg/dev"
copy_to "iCloud"   "${ICLOUD_DIR}"   "/Users/brettlechtenberg/Library/Mobile Documents/com~apple~CloudDocs/Backups"
copy_to "external" "${EXTERNAL_DIR}" "/Volumes/Brett's 8 TB"

rm -f "${TMP_ZIP}"
echo "==> Done. Backup '${ARCHIVE}' (${SIZE}) fanned out to all available destinations."
