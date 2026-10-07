#!/usr/bin/env bash
#
# Copy Voltip's authored documentation into this site's content tree.
#
# WHAT THIS IS FOR
#
# The voltip repository owns every word on voltip.firlab.app: the user guide lives in
# `docs/site/` (English at the root, Chinese under `zh/`) next to the code it
# describes, so a pull request that changes behaviour updates the page in the same
# commit. This repository owns the site: VitePress configuration, theme, components,
# the deploy pipeline and the presentation assets (`src/public/og.*`, `robots.txt`,
# `_headers`).
#
# To change a sentence on the live site, edit the voltip repository. Every path this
# script writes is replaced on the next sync.
#
# USAGE
#   scripts/sync-voltip-docs.sh <path-to-voltip-checkout>
#
# voltip's `.github/workflows/publish-site.yml` runs it on every push to main and
# `docs-site.yml` runs it on pull requests, so a local run and CI produce the same
# tree. It fails before writing anything when the content breaks one of the
# contracts checked below. It needs GNU grep (-P), as on the Linux runners.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-voltip-checkout>" >&2
  exit 2
fi

VOLTIP_ROOT="$(cd "$1" && pwd)"
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$VOLTIP_ROOT/docs/site"
DEST="$SITE_ROOT/src"

if [ ! -d "$SRC" ]; then
  echo "error: $SRC is not a directory; is '$1' a voltip checkout?" >&2
  exit 1
fi

# The user guide. English sections sit at the root, the whole Chinese tree under zh/.
SYNCED_DIRS=(guide dictation recognition phone reference zh)
SYNCED_FILES=(index.md privacy.md roadmap.md developers.md)

# Design documents, written in Chinese for contributors, copied as they are to
# /zh/dev/. Each also gets an English placeholder at /dev/<name>: VitePress's
# language switch maps the current path onto the other locale unchanged, so without
# one the English entry in the language menu would lead to a 404.
DESIGN_DOCS=(architecture dictation frontend pairing protocol threat-model state-machines feedback)
design_title() {
  case "$1" in
    architecture) echo "Architecture" ;;
    dictation) echo "The dictation pipeline" ;;
    frontend) echo "Interface and IPC contract" ;;
    pairing) echo "Pairing" ;;
    protocol) echo "Wire protocol" ;;
    threat-model) echo "Threat model" ;;
    state-machines) echo "State machines" ;;
    feedback) echo "In-app feedback" ;;
    *) echo "$1" ;;
  esac
}

# Assets voltip owns. Everything else under src/public/ belongs to this repository,
# including the tutorial videos in media/ (VideoFigure): a 13 MB render would grow voltip's
# history on every re-render. OPTIONAL_PUBLIC_DIRS are copied when voltip has them and
# removed here when it does not, so they can land in voltip after this script knows them.
PUBLIC_DIRS=(screens)
OPTIONAL_PUBLIC_DIRS=(community)
PUBLIC_FILES=(voltip-logo.svg)

# The app's built-in polish presets (id and prompt), which the try page's functions send as the
# system prompt (functions/_lib/presets.ts), so the page polishes as the app does.
PRESETS_SRC="$VOLTIP_ROOT/packages/shared/src/fixtures/ipc/presets-builtin.json"
PRESETS_DEST="$SITE_ROOT/src/.vitepress/theme/data/presets-builtin.json"

# Components a page may use: the ones src/.vitepress/theme/index.ts registers, plus
# VitePress's own Badge. An unknown tag would render as an empty custom element with
# only a console warning, so it fails the sync instead.
ALLOWED_COMPONENTS=(Badge HomeIndex HomeSteps SplitBlock HomePlatforms HomeModels HomePrivacy HomeRoadmap ScreenFigure StatusTag VideoFigure QrCode TryVoltip)

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
for name in "${DESIGN_DOCS[@]}"; do
  [ -f "$VOLTIP_ROOT/docs/$name.md" ] || problem "expected design document docs/$name.md is missing"
done
for dir in "${PUBLIC_DIRS[@]}"; do
  [ -d "$SRC/public/$dir" ] || problem "expected directory docs/site/public/$dir is missing"
done
for file in "${PUBLIC_FILES[@]}"; do
  [ -f "$SRC/public/$file" ] || problem "expected file docs/site/public/$file is missing"
done
if [ ! -f "$PRESETS_SRC" ]; then
  problem "expected file packages/shared/src/fixtures/ipc/presets-builtin.json is missing"
elif ! python3 -c '
import json, sys
presets = json.load(open(sys.argv[1]))
ok = isinstance(presets, list) and presets and all(
    isinstance(p, dict) and isinstance(p.get("id"), str) and isinstance(p.get("prompt"), str) and p["prompt"]
    for p in presets)
sys.exit(0 if ok else 1)
' "$PRESETS_SRC"; then
  problem "packages/shared/src/fixtures/ipc/presets-builtin.json is not a list of {id, prompt}"
fi
[ "$fail" -eq 0 ] || exit 1

# Every page exists in both languages, at the same path.
while IFS= read -r -d '' page; do
  rel="${page#"$SRC"/}"
  case "$rel" in
    README.md | public/*) continue ;;
    zh/*) other="${rel#zh/}" ;;
    *) other="zh/$rel" ;;
  esac
  [ -f "$SRC/$other" ] || problem "docs/site/$rel has no counterpart docs/site/$other"
done < <(find "$SRC" -name '*.md' -print0)

# Markdown with fenced code blocks and inline code removed, prefixed with line numbers,
# so the checks below never trip over a command or a file name.
prose() {
  awk '
    /^[[:space:]]*(```|~~~)/ { fence = !fence; next }
    !fence { gsub(/`[^`]*`/, ""); printf "%d:%s\n", NR, $0 }
  ' "$1"
}

allowed=" ${ALLOWED_COMPONENTS[*]} "

# Words the user guide does not use. The internal ones follow the interface's own
# guard (voltip packages/shared/src/i18n/copy.test.ts, docs/frontend.md §8); the
# colloquial ones are the same register rule (standard, readable written language).
# Keep both lists in step with that test when it changes.
ZH_BANNED='核心|边沿|注入|投递|(?<![A-Za-z])LLM|(?<!Qwen3-)ASR|握手|对端|票据|枚举|持久化|状态机|热键|收音'
ZH_COLLOQUIAL='还没|没能|免得|搭的|咋|啥|说说|试试|看看'
EN_BANNED='\binject|(?<![A-Za-z])LLMs?\b|(?<!Qwen3-)\bASR\b|handshake|\bpeers?\b|\btickets?\b|enumerat|persist|state machine|\bhotkeys?\b'
EN_COLLOQUIAL='\bjust\b(?! now)|\bgonna\b|\bstuff\b'
INTERNAL='§|\bIPC\b|UiState|voltip-core|\bcrates?\b'

while IFS= read -r -d '' page; do
  rel="${page#"$SRC"/}"
  [ "$rel" = README.md ] && continue
  text="$(prose "$page")"

  while IFS= read -r tag; do
    [ -n "$tag" ] || continue
    case "$allowed" in
      *" $tag "*) ;;
      *) problem "docs/site/$rel uses <$tag>, which the site does not register (allowed: ${ALLOWED_COMPONENTS[*]})" ;;
    esac
  done < <(grep -oP '<\K[A-Z][A-Za-z0-9]*' <<<"$text" | sort -u)

  case "$rel" in
    zh/*) banned="$ZH_BANNED" colloquial="$ZH_COLLOQUIAL" ;;
    *) banned="$EN_BANNED" colloquial="$EN_COLLOQUIAL" ;;
  esac
  # The developers page is written for contributors and may name the internals.
  case "$rel" in
    developers.md | zh/developers.md) pattern="$colloquial" ;;
    *) pattern="$banned|$colloquial|$INTERNAL" ;;
  esac
  while IFS= read -r hit; do
    [ -n "$hit" ] && problem "docs/site/$rel:${hit%%:*} uses an internal or colloquial word: $(cut -d: -f2- <<<"$hit" | grep -oP "$pattern" | sort -u | paste -sd ' ')"
  done < <(grep -P "$pattern" <<<"$text" || true)
done < <(find "$SRC" -name '*.md' -print0)

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
  printf '  %-14s %s pages\n' "$dir/" "$(find "$DEST/$dir" -name '*.md' | wc -l | tr -d ' ')"
done

for file in "${SYNCED_FILES[@]}"; do
  cp "$SRC/$file" "$DEST/$file"
  printf '  %-14s ok\n' "$file"
done

# zh/ was replaced above, so zh/dev/ starts empty; dev/ is generated here alone.
mkdir -p "$DEST/zh/dev"
rm -rf "${DEST:?}/dev"
mkdir -p "$DEST/dev"
for name in "${DESIGN_DOCS[@]}"; do
  cp "$VOLTIP_ROOT/docs/$name.md" "$DEST/zh/dev/$name.md"
  title="$(design_title "$name")"
  cat >"$DEST/dev/$name.md" <<MD
---
title: $title
editLink: false
head:
  - - meta
    - name: robots
      content: noindex
---

# $title

This design document is written in Chinese. It is the contract the code follows, kept
next to the code in the voltip repository.

- [Read it on this site (Chinese)](/zh/dev/$name)
- [Source on GitHub](https://github.com/sunerpy/voltip/blob/main/docs/$name.md)
MD
done
printf '  %-14s %s documents + English placeholders\n' "zh/dev/" "${#DESIGN_DOCS[@]}"

mkdir -p "$DEST/public"
for dir in "${PUBLIC_DIRS[@]}"; do
  rm -rf "${DEST:?}/public/$dir"
  mkdir -p "$DEST/public/$dir"
  cp -R "$SRC/public/$dir/." "$DEST/public/$dir/"
  printf '  %-14s %s files\n' "public/$dir/" "$(find "$DEST/public/$dir" -type f | wc -l | tr -d ' ')"
done
for dir in "${OPTIONAL_PUBLIC_DIRS[@]}"; do
  rm -rf "${DEST:?}/public/$dir"
  if [ -d "$SRC/public/$dir" ]; then
    mkdir -p "$DEST/public/$dir"
    cp -R "$SRC/public/$dir/." "$DEST/public/$dir/"
    printf '  %-14s %s files\n' "public/$dir/" "$(find "$DEST/public/$dir" -type f | wc -l | tr -d ' ')"
  else
    printf '  %-14s not in voltip, none here\n' "public/$dir/"
  fi
done
for file in "${PUBLIC_FILES[@]}"; do
  cp "$SRC/public/$file" "$DEST/public/$file"
  printf '  %-14s ok\n' "public/$file"
done

cp "$PRESETS_SRC" "$PRESETS_DEST"
printf '  %-14s ok\n' "presets"

# A stamp so a stale sync is visible on the site (the footer shows the commit).
# Recorded as data, not prose. A second run from the same commit keeps the old time,
# so re-running the workflow never produces a commit that changes only a timestamp.
COMMIT=$(git -C "$VOLTIP_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)
SHORT=$(git -C "$VOLTIP_ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo unknown)
if [ -n "$(git -C "$VOLTIP_ROOT" status --porcelain -- docs 2>/dev/null)" ]; then
  SHORT="$SHORT-dirty"
fi
STAMP="$DEST/.vitepress/synced.json"
synced_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -f "$STAMP" ] && grep -q "\"shortCommit\": \"$SHORT\"" "$STAMP" && grep -q "\"commit\": \"$COMMIT\"" "$STAMP"; then
  synced_at="$(sed -n 's/.*"syncedAt": "\([^"]*\)".*/\1/p' "$STAMP")"
fi
cat >"$STAMP" <<JSON
{
  "source": "https://github.com/sunerpy/voltip",
  "commit": "$COMMIT",
  "shortCommit": "$SHORT",
  "syncedAt": "$synced_at"
}
JSON

echo "synced from voltip@$SHORT"
