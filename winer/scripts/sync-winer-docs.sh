#!/usr/bin/env bash
#
# Copy winer's documentation into this site's content tree.
#
# WHAT THIS IS FOR
#
# The winer repository owns every word on firlab.app/winer/: the pages live in its
# `docs/site/` (Chinese at the root, English under `en/`) next to the code they describe, so a
# pull request that changes what a user sees updates the page in the same commit. This
# repository owns the site: VitePress configuration, theme, components, the build checks and
# the presentation assets (`src/public/og.*`).
#
# To change a sentence on the live site, edit the winer repository. Every path this script
# writes is replaced on the next sync.
#
# USAGE
#   scripts/sync-winer-docs.sh <path-to-winer-checkout>
#
# winer's `.github/workflows/publish-docs-site.yml` runs it on every push to main that touches
# the pages, and `docs-site.yml` on pull requests, so a local run and CI produce the same tree.
# It fails before writing anything when the content breaks one of the contracts checked below.
# It needs GNU grep (-P), as on the Linux runners.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-winer-checkout>" >&2
  exit 2
fi

WINER_ROOT="$(cd "$1" && pwd)"
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$WINER_ROOT/docs/site"
DEST="$SITE_ROOT/src"

if [ ! -f "$SRC/index.md" ] || [ ! -d "$SRC/en" ]; then
  echo "error: $SRC has no index.md or en/; is '$1' a winer checkout with the docs site?" >&2
  exit 1
fi

# The pages. The Chinese pages sit at the docs/site/ root, the whole English tree under en/,
# at the same paths. docs/site/README.md (the index GitHub shows for the folder) is not a page.
SYNCED_DIRS=(guide en)
SYNCED_FILES=(index.md rating.md faq.md privacy.md)

# Assets winer owns: the screenshots. Everything else under src/public/ belongs to this
# repository.
PUBLIC_DIRS=(screens)
# The mark itself: winer's generated master (scripts/brand/icons.py in winer).
LOGO="$WINER_ROOT/app/src-tauri/app-icon.svg"

# Components a page may use: the ones src/.vitepress/theme/index.ts registers, plus
# VitePress's own Badge. An unknown tag would render as an empty custom element with
# only a console warning, so it fails the sync instead.
ALLOWED_COMPONENTS=(Badge HomeIndex HomeSteps SplitBlock HomePrivacy ScreenFigure StatusTag)

fail=0
problem() {
  echo "error: $*" >&2
  fail=1
}

# ---------------------------------------------------------------------------
# Contracts, checked before anything is written.
# ---------------------------------------------------------------------------

for dir in "${SYNCED_DIRS[@]}"; do
  [ -d "$SRC/$dir" ] || problem "expected directory docs/site/$dir is missing"
done
for file in "${SYNCED_FILES[@]}"; do
  [ -f "$SRC/$file" ] || problem "expected file docs/site/$file is missing"
done
for dir in "${PUBLIC_DIRS[@]}"; do
  [ -d "$SRC/public/$dir" ] || problem "expected directory docs/site/public/$dir is missing"
done
[ -f "$LOGO" ] || problem "expected the mark app/src-tauri/app-icon.svg is missing"
[ "$fail" -eq 0 ] || exit 1

# The pages of the site, relative to docs/site/.
pages() {
  local file
  for file in "${SYNCED_FILES[@]}"; do printf '%s\0' "$file"; done
  for dir in "${SYNCED_DIRS[@]}"; do
    while IFS= read -r -d '' file; do
      printf '%s\0' "${file#"$SRC"/}"
    done < <(find "$SRC/$dir" -name '*.md' -print0)
  done
}

# Every page exists in both languages, at the same path.
while IFS= read -r -d '' rel; do
  case "$rel" in
    en/*) other="${rel#en/}" ;;
    *) other="en/$rel" ;;
  esac
  [ -f "$SRC/$other" ] || problem "docs/site/$rel has no counterpart docs/site/$other"
done < <(pages)

# Markdown with fenced code blocks and inline code removed, prefixed with line numbers,
# so the checks below never trip over a command, a variable or a file name.
prose() {
  awk '
    /^[[:space:]]*(```|~~~)/ { fence = !fence; next }
    !fence { gsub(/`[^`]*`/, ""); printf "%d:%s\n", NR, $0 }
  ' "$1"
}

allowed=" ${ALLOWED_COMPONENTS[*]} "

# Words a user page does not use. The internal ones are names of winer's own code that mean
# nothing to a user; the colloquial ones keep the register the pages are written in
# (standard, readable written language — docs/site/README.md).
ZH_COLLOQUIAL='还没|没能|免得|搭的|咋|啥|搞定|折腾'
EN_COLLOQUIAL='\bjust\b(?! now)|\bgonna\b|\bstuff\b'
INTERNAL='\b(winer-core|winer_core|SeatRating|PlayerLine|CalloutRule|TierSet|FormTitle|GameTitle|MatchSummary)\b|§'

while IFS= read -r -d '' rel; do
  page="$SRC/$rel"
  text="$(prose "$page")"

  while IFS= read -r tag; do
    [ -n "$tag" ] || continue
    case "$allowed" in
      *" $tag "*) ;;
      *) problem "docs/site/$rel uses <$tag>, which the site does not register (allowed: ${ALLOWED_COMPONENTS[*]})" ;;
    esac
  done < <(grep -oP '<\K[A-Z][A-Za-z0-9]*' <<<"$text" | sort -u)

  case "$rel" in
    en/*) colloquial="$EN_COLLOQUIAL" ;;
    *) colloquial="$ZH_COLLOQUIAL" ;;
  esac
  pattern="$colloquial|$INTERNAL"
  while IFS= read -r hit; do
    [ -n "$hit" ] && problem "docs/site/$rel:${hit%%:*} uses an internal or colloquial word: $(cut -d: -f2- <<<"$hit" | grep -oP "$pattern" | sort -u | paste -sd ' ')"
  done < <(grep -P "$pattern" <<<"$text" || true)

  # Every screenshot a page names (the home frontmatter included) exists.
  while IFS= read -r shot; do
    [ -n "$shot" ] || continue
    [ -f "$SRC/public$shot" ] || problem "docs/site/$rel names $shot, which docs/site/public does not have"
  done < <(grep -oP '/screens/[A-Za-z0-9._-]+' "$page" | sort -u)
done < <(pages)

[ "$fail" -eq 0 ] || exit 1

# ---------------------------------------------------------------------------
# Copy.
# ---------------------------------------------------------------------------

echo "syncing from $SRC"

for dir in "${SYNCED_DIRS[@]}"; do
  # Replace the directory wholesale so a page removed upstream disappears here too.
  rm -rf "${DEST:?}/$dir"
  mkdir -p "$DEST/$dir"
  cp -R "$SRC/$dir/." "$DEST/$dir/"
  printf '  %-26s %s pages\n' "$dir/" "$(find "$DEST/$dir" -name '*.md' | wc -l | tr -d ' ')"
done

for file in "${SYNCED_FILES[@]}"; do
  cp "$SRC/$file" "$DEST/$file"
  printf '  %-26s ok\n' "$file"
done

mkdir -p "$DEST/public"
for dir in "${PUBLIC_DIRS[@]}"; do
  rm -rf "${DEST:?}/public/$dir"
  mkdir -p "$DEST/public/$dir"
  cp -R "$SRC/public/$dir/." "$DEST/public/$dir/"
  printf '  %-26s %s files\n' "public/$dir/" "$(find "$DEST/public/$dir" -type f | wc -l | tr -d ' ')"
done
cp "$LOGO" "$DEST/public/winer-logo.svg"
printf '  %-26s ok\n' "public/winer-logo.svg"

# A stamp so a stale sync is visible on the site (the footer shows the commit).
# Recorded as data, not prose. A second run from the same commit keeps the old time,
# so re-running the workflow never produces a commit that changes only a timestamp.
COMMIT=$(git -C "$WINER_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)
SHORT=$(git -C "$WINER_ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo unknown)
if [ -n "$(git -C "$WINER_ROOT" status --porcelain -- docs/site app/src-tauri/app-icon.svg 2>/dev/null)" ]; then
  SHORT="$SHORT-dirty"
fi
STAMP="$DEST/.vitepress/synced.json"
synced_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -f "$STAMP" ] && grep -q "\"shortCommit\": \"$SHORT\"" "$STAMP" && grep -q "\"commit\": \"$COMMIT\"" "$STAMP"; then
  synced_at="$(sed -n 's/.*"syncedAt": "\([^"]*\)".*/\1/p' "$STAMP")"
fi
cat >"$STAMP" <<JSON
{
  "source": "https://github.com/sunerpy/winer",
  "commit": "$COMMIT",
  "shortCommit": "$SHORT",
  "syncedAt": "$synced_at"
}
JSON

echo "synced from winer@$SHORT"
