#!/usr/bin/env bash
#
# Copy pt-tools' documentation into this site's content tree.
#
# WHAT THIS IS FOR
#
# The pt-tools repository owns every word on firlab.app/pt-tools/: the guide lives in its
# `docs/` (Chinese at the root, English under `en/`) next to the code it describes, so a
# pull request that changes behaviour updates the page in the same commit, and the same
# files read correctly on GitHub. This repository owns the site: VitePress configuration,
# theme, components, the build checks and the presentation assets (`src/public/og.*`).
#
# To change a sentence on the live site, edit the pt-tools repository. Every path this
# script writes is replaced on the next sync.
#
# USAGE
#   scripts/sync-pt-tools-docs.sh <path-to-pt-tools-checkout>
#
# pt-tools' `.github/workflows/publish-docs-site.yml` runs it on every push to main that
# touches the pages, and `docs-site.yml` on pull requests, so a local run and CI produce the
# same tree. It fails before writing anything when the content breaks one of the contracts
# checked below. It needs GNU grep (-P), as on the Linux runners.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-pt-tools-checkout>" >&2
  exit 2
fi

PT_ROOT="$(cd "$1" && pwd)"
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$PT_ROOT/docs"
DEST="$SITE_ROOT/src"

if [ ! -f "$SRC/index.md" ] || [ ! -d "$SRC/en" ]; then
  echo "error: $SRC has no index.md or en/; is '$1' a pt-tools checkout with the docs site?" >&2
  exit 1
fi

# The guide. The Chinese pages sit at the docs/ root, the whole English tree under en/,
# at the same paths. docs/README.md (the index GitHub shows for the folder), docs/brand.md
# and the design log docs/design/webui-board-spec.md are not site pages.
SYNCED_DIRS=(guide reference en)
SYNCED_FILES=(index.md configuration.md faq.md sites.md)
# Files under the synced directories that are not pages of the site: a pointer kept so old
# GitHub links keep working.
SKIP_PAGES=(guide/chatops-mcp-agent-design.md)

# Written in Chinese for contributors and copied as they are. Each also gets an English
# placeholder at the same path under /en/: VitePress's language switch maps the current
# path onto the other locale unchanged, so without one the English entry in the language
# menu would lead to a 404.
CHINESE_ONLY=(development.md design/chatops-mcp-agent.md design/phase4-mcp.md design/phase5-agent.md)
chinese_only_title() {
  case "$1" in
    development.md) echo "Development guide" ;;
    design/chatops-mcp-agent.md) echo "ChatOps, MCP and agent architecture" ;;
    design/phase4-mcp.md) echo "MCP server contract" ;;
    design/phase5-agent.md) echo "AI agent design" ;;
    *) echo "$1" ;;
  esac
}

# Assets pt-tools owns: the screenshots and the community assets (the WeChat Official
# Account QR on the home page). Everything else under src/public/ belongs to this repository.
PUBLIC_DIRS=(screens community)
# The mark itself, from the web UI's public assets (pt-tools docs/brand.md: the source of truth).
LOGO="$PT_ROOT/web/frontend/public/logo.svg"

# Components a page may use: the ones src/.vitepress/theme/index.ts registers, plus
# VitePress's own Badge. An unknown tag would render as an empty custom element with
# only a console warning, so it fails the sync instead.
ALLOWED_COMPONENTS=(Badge HomeIndex HomeSteps SplitBlock HomeDeploy HomePrivacy HomeRoadmap ScreenFigure StatusTag QrCode)

fail=0
problem() {
  echo "error: $*" >&2
  fail=1
}

skipped() {
  local rel="$1" skip
  for skip in "${SKIP_PAGES[@]}"; do
    [ "$rel" = "$skip" ] && return 0
  done
  return 1
}

# ---------------------------------------------------------------------------
# Contracts, checked before anything is written.
# ---------------------------------------------------------------------------

for dir in "${SYNCED_DIRS[@]}"; do
  [ -d "$SRC/$dir" ] || problem "expected directory docs/$dir is missing"
done
for file in "${SYNCED_FILES[@]}"; do
  [ -f "$SRC/$file" ] || problem "expected file docs/$file is missing"
done
for file in "${CHINESE_ONLY[@]}"; do
  [ -f "$SRC/$file" ] || problem "expected Chinese-only page docs/$file is missing"
done
for dir in "${PUBLIC_DIRS[@]}"; do
  [ -d "$SRC/public/$dir" ] || problem "expected directory docs/public/$dir is missing"
done
[ -f "$LOGO" ] || problem "expected the mark web/frontend/public/logo.svg is missing"
[ "$fail" -eq 0 ] || exit 1

# The pages of the site, relative to docs/: the synced files, and every Markdown file in the
# synced directories except the skipped ones.
pages() {
  local file
  for file in "${SYNCED_FILES[@]}"; do printf '%s\0' "$file"; done
  for dir in "${SYNCED_DIRS[@]}"; do
    while IFS= read -r -d '' file; do
      file="${file#"$SRC"/}"
      skipped "$file" || printf '%s\0' "$file"
    done < <(find "$SRC/$dir" -name '*.md' -print0)
  done
}

# Every page exists in both languages, at the same path.
while IFS= read -r -d '' rel; do
  case "$rel" in
    en/*) other="${rel#en/}" ;;
    *) other="en/$rel" ;;
  esac
  [ -f "$SRC/$other" ] || problem "docs/$rel has no counterpart docs/$other"
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

# Words a user page does not use. The internal ones are names of pt-tools' own code that
# mean nothing to a user (AGENTS.md "Core Contracts"); the colloquial ones keep the register
# the guide is written in (standard, readable written language — docs/README.md).
ZH_COLLOQUIAL='还没|没能|免得|搭的|咋|啥|搞定|折腾'
EN_COLLOQUIAL='\bjust\b(?! now)|\bgonna\b|\bstuff\b'
INTERNAL='\b(UnifiedPTSite|PTSiteInter|ConfigStore|GlobalCfg|DiskBudget|PushMutex|MessageChain|goroutines?)\b|§'

while IFS= read -r -d '' rel; do
  page="$SRC/$rel"
  text="$(prose "$page")"

  while IFS= read -r tag; do
    [ -n "$tag" ] || continue
    case "$allowed" in
      *" $tag "*) ;;
      *) problem "docs/$rel uses <$tag>, which the site does not register (allowed: ${ALLOWED_COMPONENTS[*]})" ;;
    esac
  done < <(grep -oP '<\K[A-Z][A-Za-z0-9]*' <<<"$text" | sort -u)

  case "$rel" in
    en/*) colloquial="$EN_COLLOQUIAL" ;;
    *) colloquial="$ZH_COLLOQUIAL" ;;
  esac
  # The contributors' page may name the internals.
  case "$rel" in
    reference/developers.md | en/reference/developers.md) pattern="$colloquial" ;;
    *) pattern="$colloquial|$INTERNAL" ;;
  esac
  while IFS= read -r hit; do
    [ -n "$hit" ] && problem "docs/$rel:${hit%%:*} uses an internal or colloquial word: $(cut -d: -f2- <<<"$hit" | grep -oP "$pattern" | sort -u | paste -sd ' ')"
  done < <(grep -P "$pattern" <<<"$text" || true)
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
done
for skip in "${SKIP_PAGES[@]}"; do
  rm -f "${DEST:?}/$skip"
done
for dir in "${SYNCED_DIRS[@]}"; do
  printf '  %-26s %s pages\n' "$dir/" "$(find "$DEST/$dir" -name '*.md' | wc -l | tr -d ' ')"
done

for file in "${SYNCED_FILES[@]}"; do
  cp "$SRC/$file" "$DEST/$file"
  printf '  %-26s ok\n' "$file"
done

# The Chinese-only pages. en/ was replaced above, so the placeholders are generated here
# alone; design/ is replaced wholesale for the same reason as the synced directories.
rm -rf "${DEST:?}/design"
for rel in "${CHINESE_ONLY[@]}"; do
  mkdir -p "$(dirname "$DEST/$rel")" "$(dirname "$DEST/en/$rel")"
  cp "$SRC/$rel" "$DEST/$rel"
  title="$(chinese_only_title "$rel")"
  path="/${rel%.md}"
  cat >"$DEST/en/$rel" <<MD
---
title: $title
editLink: false
head:
  - - meta
    - name: robots
      content: noindex
---

# $title

This page is written in Chinese, for people working on pt-tools itself.

- [Read it on this site (Chinese)]($path)
- [Source on GitHub](https://github.com/sunerpy/pt-tools/blob/main/docs/$rel)
MD
done
printf '  %-26s %s pages + English placeholders\n' "development, design/" "${#CHINESE_ONLY[@]}"

mkdir -p "$DEST/public"
for dir in "${PUBLIC_DIRS[@]}"; do
  rm -rf "${DEST:?}/public/$dir"
  mkdir -p "$DEST/public/$dir"
  cp -R "$SRC/public/$dir/." "$DEST/public/$dir/"
  printf '  %-26s %s files\n' "public/$dir/" "$(find "$DEST/public/$dir" -type f | wc -l | tr -d ' ')"
done
cp "$LOGO" "$DEST/public/pt-tools-logo.svg"
printf '  %-26s ok\n' "public/pt-tools-logo.svg"

# A stamp so a stale sync is visible on the site (the footer shows the commit).
# Recorded as data, not prose. A second run from the same commit keeps the old time,
# so re-running the workflow never produces a commit that changes only a timestamp.
COMMIT=$(git -C "$PT_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)
SHORT=$(git -C "$PT_ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo unknown)
if [ -n "$(git -C "$PT_ROOT" status --porcelain -- docs web/frontend/public/logo.svg 2>/dev/null)" ]; then
  SHORT="$SHORT-dirty"
fi
STAMP="$DEST/.vitepress/synced.json"
synced_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -f "$STAMP" ] && grep -q "\"shortCommit\": \"$SHORT\"" "$STAMP" && grep -q "\"commit\": \"$COMMIT\"" "$STAMP"; then
  synced_at="$(sed -n 's/.*"syncedAt": "\([^"]*\)".*/\1/p' "$STAMP")"
fi
cat >"$STAMP" <<JSON
{
  "source": "https://github.com/sunerpy/pt-tools",
  "commit": "$COMMIT",
  "shortCommit": "$SHORT",
  "syncedAt": "$synced_at"
}
JSON

echo "synced from pt-tools@$SHORT"
