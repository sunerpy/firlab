#!/usr/bin/env bash
#
# Copy Zuno's authored Markdown into this site's content tree.
#
# WHAT THIS IS FOR
#
# The zuno repository owns ALL documentation content. This repository owns only the
# site: the VitePress configuration, the theme, the deploy pipeline, and this
# script. Nothing under `src/` is authored here.
#
# That split is the point. Documentation lives next to the code it describes, where
# `crates/zuno-cli/tests/docs.rs` asserts on it and a developer changing behaviour
# updates the prose in the same commit. Publishing is a separate concern with a
# separate lifecycle, so it lives separately.
#
# Practical consequence: to change a sentence on zuno.firlab.app, edit the zuno
# repository. An edit made here is overwritten on the next sync, silently, because
# every path this script writes is deleted and recreated first.
#
# USAGE
#   scripts/sync-zuno-docs.sh <path-to-zuno-checkout>
#
# It is also what `.github/workflows/sync-zuno-docs.yml` runs, so a local dry run
# and CI produce the same tree.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-zuno-checkout>" >&2
  exit 2
fi

ZUNO_ROOT="$1"
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ZUNO_ROOT/docs"
DEST="$SITE_ROOT/src"

if [ ! -d "$SRC" ]; then
  echo "error: $SRC is not a directory; is '$ZUNO_ROOT' a zuno checkout?" >&2
  exit 1
fi

# Every documentation path. Adding a page to zuno means adding it here (or to a
# directory already listed), otherwise it will not appear on the site.
#
# `guides/`, `readme/`, `audits/` and `upstream/` are deliberately NOT synced:
# `srcExclude` in shared.ts already drops them, so copying them in would only
# create files the build ignores.
SYNCED_DIRS=(
  zh
  guide
  config
  operate
  cli
  reference
  design
)

SYNCED_FILES=(
  index.md
  faq.md
  harness-runtime.md
  logging.md
  migration.md
  orchestration.md
  perf-methodology.md
  plugins.md
  process-plugin-development.md
  resource-gates.md
  session-retention.md
)

echo "syncing from $SRC"

for dir in "${SYNCED_DIRS[@]}"; do
  if [ ! -d "$SRC/$dir" ]; then
    echo "error: expected directory $SRC/$dir is missing" >&2
    exit 1
  fi
  # `--delete` so a page removed upstream disappears here too; scoped to the one
  # directory, so it can never reach an authored path.
  rm -rf "$DEST/$dir"
  mkdir -p "$DEST/$dir"
  cp -R "$SRC/$dir/." "$DEST/$dir/"
  count=$(find "$DEST/$dir" -name '*.md' | wc -l | tr -d ' ')
  printf '  %-12s %s files\n' "$dir/" "$count"
done

for file in "${SYNCED_FILES[@]}"; do
  if [ ! -f "$SRC/$file" ]; then
    echo "error: expected file $SRC/$file is missing" >&2
    exit 1
  fi
  cp "$SRC/$file" "$DEST/$file"
  printf '  %-12s ok\n' "$file"
done

# A stamp so a stale sync is visible in the built site rather than invisible.
# Recorded as data, not prose, so the build can read it without parsing English.
COMMIT=$(git -C "$ZUNO_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)
SHORT=$(git -C "$ZUNO_ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)
cat > "$DEST/.vitepress/synced.json" <<JSON
{
  "source": "https://github.com/sunerpy/zuno",
  "commit": "$COMMIT",
  "shortCommit": "$SHORT",
  "syncedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
JSON

echo "synced from zuno@$SHORT"
