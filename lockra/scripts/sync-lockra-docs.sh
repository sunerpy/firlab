#!/usr/bin/env bash
#
# Copy Lockra's authored documentation into this site's content tree.
#
# WHAT THIS IS FOR
#
# The lockra repository owns every word on firlab.app/lockra: the user guide lives in
# `docs/site/` (English at the root, Chinese under `zh/`) next to the code it describes, so a
# pull request that changes behaviour updates the page in the same commit. This repository
# owns the site: VitePress configuration, theme, components, the deploy pipeline and the
# presentation assets (`src/public/og.*`).
#
# To change a sentence on the live site, edit the lockra repository. Every path this script
# writes is replaced on the next sync.
#
# USAGE
#   scripts/sync-lockra-docs.sh <path-to-lockra-checkout>
#
# lockra's `.github/workflows/publish-site.yml` runs it on every push to main and
# `docs-site.yml` runs it on pull requests, so a local run and CI produce the same tree. It
# fails before writing anything when the content breaks one of the contracts checked below.
# It needs GNU grep (-P) and perl, as on the Linux runners.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-lockra-checkout>" >&2
  exit 2
fi

LOCKRA_ROOT="$(cd "$1" && pwd)"
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$LOCKRA_ROOT/docs/site"
DEST="$SITE_ROOT/src"
REPO="https://github.com/sunerpy/lockra"

if [ ! -d "$SRC" ]; then
  echo "error: $SRC is not a directory; is '$1' a lockra checkout?" >&2
  exit 1
fi

# The user guide. English sections sit at the root, the whole Chinese tree under zh/.
SYNCED_DIRS=(guide accounts transfer backup security reference zh)
SYNCED_FILES=(index.md privacy.md roadmap.md developers.md)

# Design documents, written in English for contributors, copied to /dev/. Each also gets a
# Chinese placeholder at /zh/dev/<name>: VitePress's language switch maps the current path onto
# the other locale unchanged, so without one the Chinese entry in the language menu would lead
# to a 404.
DESIGN_DOCS=(architecture formats security release)
design_title() {
  case "$1" in
    architecture) echo "Architecture|架构" ;;
    formats) echo "File formats|文件格式" ;;
    security) echo "Security model|安全模型" ;;
    release) echo "Releasing|发布流程" ;;
    *) echo "$1|$1" ;;
  esac
}

# Assets lockra owns. Everything else under src/public/ belongs to this repository.
PUBLIC_DIRS=(screens)
PUBLIC_FILES=(lockra-logo.svg)

# Components a page may use: the ones src/.vitepress/theme/index.ts registers, plus
# VitePress's own Badge. An unknown tag would render as an empty custom element with only a
# console warning, so it fails the sync instead.
ALLOWED_COMPONENTS=(Badge HomeIndex HomeSteps SplitBlock HomePlatforms HomePrivacy HomeScope ScreenFigure StatusTag)

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
  [ -f "$LOCKRA_ROOT/docs/$name.md" ] || problem "expected design document docs/$name.md is missing"
done
for dir in "${PUBLIC_DIRS[@]}"; do
  [ -d "$SRC/public/$dir" ] || problem "expected directory docs/site/public/$dir is missing"
done
for file in "${PUBLIC_FILES[@]}"; do
  [ -f "$SRC/public/$file" ] || problem "expected file docs/site/public/$file is missing"
done
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

# Markdown with fenced code blocks and inline code removed, prefixed with line numbers, so the
# checks below never trip over a command or a file name.
prose() {
  awk '
    /^[[:space:]]*(```|~~~)/ { fence = !fence; next }
    !fence { gsub(/`[^`]*`/, ""); printf "%d:%s\n", NR, $0 }
  ' "$1"
}

allowed=" ${ALLOWED_COMPONENTS[*]} "

# Words the user guide does not use: the internals (the vault's container, the bridge between
# the interface and the core) and colloquial words, after the register rule of lockra's
# docs/site/README.md (standard, readable written language). Keep both in step with it.
ZH_BANNED='载荷|序列化|状态机|持久化|派发|密钥槽|数据密钥'
ZH_COLLOQUIAL='还没|没能|免得|搭的|咋|啥|说说|试试|看看|搞定'
EN_BANNED='\bDEK\b|\bKEK\b|\bnonce\b|\bAAD\b|\bpayload\b|\bwebview\b|\bdispatch\b'
EN_COLLOQUIAL='\bjust\b(?! now)|\bgonna\b|\bstuff\b|\bsimply\b'
INTERNAL='§|\bIPC\b|UiState|UiCommand|lockra-(otp|vault|transfer|core|bridge|desktop)|\bcrates?\b'

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

  # A screenshot a page names (in a component or the home frontmatter) must exist.
  while IFS= read -r shot; do
    [ -n "$shot" ] || continue
    [ -f "$SRC/public$shot" ] || problem "docs/site/$rel shows $shot, which docs/site/public$shot does not provide"
  done < <(grep -oP '/screens/[A-Za-z0-9._-]+' "$page" | sort -u)

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

# The design documents link to each other by file name, which VitePress resolves; any other
# relative link points into the repository and becomes a link to it on GitHub, so the build's
# dead-link check never meets a path that exists only in lockra.
design_links() {
  perl -pe 's{\]\((?!https?:|mailto:|#|/)(?!(?:architecture|formats|security|release)\.md(?:#[^)]*)?\))([^)\s]+)\)}{]('"$REPO"'/blob/main/docs/$1)}g' "$1"
}

# zh/ was replaced above, so zh/dev/ starts empty; dev/ is generated here alone.
mkdir -p "$DEST/zh/dev"
rm -rf "${DEST:?}/dev"
mkdir -p "$DEST/dev"
for name in "${DESIGN_DOCS[@]}"; do
  design_links "$LOCKRA_ROOT/docs/$name.md" >"$DEST/dev/$name.md"
  IFS='|' read -r title_en title_zh <<<"$(design_title "$name")"
  cat >"$DEST/zh/dev/$name.md" <<MD
---
title: $title_zh
editLink: false
head:
  - - meta
    - name: robots
      content: noindex
---

# $title_zh

这份设计文档以英文撰写，是代码遵循的约定，与代码一起保存在 lockra 仓库中。

- [在本站阅读（英文）](/dev/$name)
- [GitHub 上的源文件]($REPO/blob/main/docs/$name.md)
MD
  printf '  %-14s %s\n' "dev/$name.md" "$title_en"
done
printf '  %-14s %s Chinese placeholders\n' "zh/dev/" "${#DESIGN_DOCS[@]}"

mkdir -p "$DEST/public"
for dir in "${PUBLIC_DIRS[@]}"; do
  rm -rf "${DEST:?}/public/$dir"
  mkdir -p "$DEST/public/$dir"
  cp -R "$SRC/public/$dir/." "$DEST/public/$dir/"
  printf '  %-14s %s files\n' "public/$dir/" "$(find "$DEST/public/$dir" -type f | wc -l | tr -d ' ')"
done
for file in "${PUBLIC_FILES[@]}"; do
  cp "$SRC/public/$file" "$DEST/public/$file"
  printf '  %-14s ok\n' "public/$file"
done

# A stamp so a stale sync is visible on the site (the footer shows the commit). Recorded as
# data, not prose. A second run from the same commit keeps the old time, so re-running the
# workflow never produces a commit that changes only a timestamp.
COMMIT=$(git -C "$LOCKRA_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)
SHORT=$(git -C "$LOCKRA_ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo unknown)
if [ -n "$(git -C "$LOCKRA_ROOT" status --porcelain -- docs 2>/dev/null)" ]; then
  SHORT="$SHORT-dirty"
fi
STAMP="$DEST/.vitepress/synced.json"
synced_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -f "$STAMP" ] && grep -q "\"shortCommit\": \"$SHORT\"" "$STAMP" && grep -q "\"commit\": \"$COMMIT\"" "$STAMP"; then
  synced_at="$(sed -n 's/.*"syncedAt": "\([^"]*\)".*/\1/p' "$STAMP")"
fi
cat >"$STAMP" <<JSON
{
  "source": "$REPO",
  "commit": "$COMMIT",
  "shortCommit": "$SHORT",
  "syncedAt": "$synced_at"
}
JSON

echo "synced from lockra@$SHORT"
