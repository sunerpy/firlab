#!/usr/bin/env bash
#
# Copy CodeGraph's documentation into this site's content tree.
#
# WHAT THIS IS FOR
#
# The codegraph-rust repository owns every word on firlab.app/codegraph/: the guide lives in
# its `docs/site/` (Chinese at the root, English under `en/`) next to the code it describes, so
# a pull request that changes behaviour updates the page in the same commit, and the same files
# read correctly on GitHub. Its canonical technical references (`docs/<name>.md`, English only)
# are published here unchanged under /en/reference/ and /en/dev/. This repository owns the site:
# VitePress configuration, theme, components, the build checks and the presentation assets
# (`src/public/og.*`).
#
# To change a sentence on the live site, edit the codegraph-rust repository. Every path this
# script writes is replaced on the next sync.
#
# USAGE
#   scripts/sync-codegraph-docs.sh <path-to-codegraph-rust-checkout>
#
# codegraph-rust's `.github/workflows/publish-site.yml` runs it on every push to main that
# touches the pages, and `docs-site.yml` on pull requests, so a local run and CI produce the
# same tree. It fails before writing anything when the content breaks one of the contracts
# checked below. It needs GNU grep (-P) and python3, as on the Linux runners.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-codegraph-rust-checkout>" >&2
  exit 2
fi

CG_ROOT="$(cd "$1" && pwd)"
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$CG_ROOT/docs/site"
DOCS="$CG_ROOT/docs"
DEST="$SITE_ROOT/src"

if [ ! -f "$SRC/index.md" ] || [ ! -f "$SRC/en/index.md" ]; then
  echo "error: $SRC has no index.md or en/index.md; is '$1' a codegraph-rust checkout with the website pages?" >&2
  exit 1
fi

# The canonical references, English only, copied as they are. Each also gets a Chinese
# placeholder at the same path without /en/: VitePress's language switch maps the current path
# onto the other locale unchanged, so without one the Chinese entry in the language menu would
# lead to a 404. Keep these lists, ENGLISH_ONLY and editLinkPattern in
# src/.vitepress/config/shared.ts, and the sidebars in config/{zh,en}.ts in step.
REFERENCE_DOCS=(cli mcp ui languages godot troubleshooting)
DEV_DOCS=(architecture data-model equivalence grammar-manifest embedded-extraction benchmark benchmark-results)
zh_title() {
  case "$1" in
    cli) echo "CLI 参考" ;;
    mcp) echo "MCP 参考" ;;
    ui) echo "浏览器查看器参考" ;;
    languages) echo "支持的语言" ;;
    godot) echo "Godot 静态分析" ;;
    troubleshooting) echo "故障排查" ;;
    architecture) echo "架构" ;;
    data-model) echo "数据模型" ;;
    equivalence) echo "等价性校验" ;;
    grammar-manifest) echo "语法 ABI 清单" ;;
    embedded-extraction) echo "嵌入式提取" ;;
    benchmark) echo "基准测试方法" ;;
    benchmark-results) echo "基准测试结果" ;;
    *) echo "$1" ;;
  esac
}

# Assets codegraph-rust owns. Everything else under src/public/ belongs to this repository.
PUBLIC_DIRS=(screens)
PUBLIC_FILES=(codegraph-logo.svg)

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

for name in "${REFERENCE_DOCS[@]}" "${DEV_DOCS[@]}"; do
  [ -f "$DOCS/$name.md" ] || problem "expected reference docs/$name.md is missing"
done
for dir in "${PUBLIC_DIRS[@]}"; do
  [ -d "$SRC/public/$dir" ] || problem "expected directory docs/site/public/$dir is missing"
done
for file in "${PUBLIC_FILES[@]}"; do
  [ -f "$SRC/public/$file" ] || problem "expected file docs/site/public/$file is missing"
done
[ "$fail" -eq 0 ] || exit 1

# The pages of the site, relative to docs/site/: every Markdown file except this directory's
# README.md (for maintainers) and the authors' tools/.
pages() {
  local file
  while IFS= read -r -d '' file; do
    file="${file#"$SRC"/}"
    case "$file" in
      README.md | tools/* | public/*) continue ;;
    esac
    printf '%s\0' "$file"
  done < <(find "$SRC" -name '*.md' -print0 | sort -z)
}

# A generated placeholder lives where a Chinese page would; an authored page there would be
# replaced without notice.
for name in "${REFERENCE_DOCS[@]}"; do
  [ ! -e "$SRC/reference/$name.md" ] && [ ! -e "$SRC/en/reference/$name.md" ] ||
    problem "docs/site/reference/$name.md or en/reference/$name.md would collide with the synced docs/$name.md"
done
for name in "${DEV_DOCS[@]}"; do
  [ ! -e "$SRC/dev/$name.md" ] && [ ! -e "$SRC/en/dev/$name.md" ] ||
    problem "docs/site/dev/$name.md or en/dev/$name.md would collide with the synced docs/$name.md"
done

# Every page exists in both languages, at the same path.
while IFS= read -r -d '' rel; do
  case "$rel" in
    en/*) other="${rel#en/}" ;;
    *) other="en/$rel" ;;
  esac
  [ -f "$SRC/$other" ] || problem "docs/site/$rel has no counterpart docs/site/$other"
done < <(pages)

# Markdown with fenced code blocks and inline code removed, prefixed with line numbers, so
# the checks below never trip over a command, a variable or a file name.
prose() {
  awk '
    /^[[:space:]]*(```|~~~)/ { fence = !fence; next }
    !fence { gsub(/`[^`]*`/, ""); printf "%d:%s\n", NR, $0 }
  ' "$1"
}

allowed=" ${ALLOWED_COMPONENTS[*]} "
check_components() { # file label
  local tag
  while IFS= read -r tag; do
    [ -n "$tag" ] || continue
    case "$allowed" in
      *" $tag "*) ;;
      *) problem "$2 uses <$tag>, which the site does not register (allowed: ${ALLOWED_COMPONENTS[*]})" ;;
    esac
  done < <(prose "$1" | grep -oP '<\K[A-Z][A-Za-z0-9]*' | sort -u)
}

# Words a user page does not use. The internal ones are CodeGraph's own crate names, which mean
# nothing to a user; the colloquial ones keep the register the guide is written in; the latency
# claim is the one codegraph-rust's docs-check.py bans on its READMEs (docs/site/README.md,
# "Writing").
ZH_COLLOQUIAL='还没|没能|免得|搭的|咋|啥|搞定|折腾'
EN_COLLOQUIAL='\bjust\b(?! now)|\bgonna\b|\bstuff\b'
INTERNAL='§|\bcodegraph-(core|extract|store|resolve|graph|mcp|watch|daemon|ui|cli|bench)\b'
LATENCY='(?i:sub-?\s?millisecond)|亚毫秒'

while IFS= read -r -d '' rel; do
  page="$SRC/$rel"
  check_components "$page" "docs/site/$rel"

  case "$rel" in
    en/*) colloquial="$EN_COLLOQUIAL" ;;
    *) colloquial="$ZH_COLLOQUIAL" ;;
  esac
  # The contributors' page may name the internals.
  case "$rel" in
    developers.md | en/developers.md) pattern="$colloquial|$LATENCY" ;;
    *) pattern="$colloquial|$INTERNAL|$LATENCY" ;;
  esac
  while IFS= read -r hit; do
    [ -n "$hit" ] && problem "docs/site/$rel:${hit%%:*} uses an internal, colloquial or unmeasured wording: $(cut -d: -f2- <<<"$hit" | grep -oP "$pattern" | sort -u | paste -sd ' ')"
  done < <(prose "$page" | grep -P "$pattern" || true)

  # A screenshot a page names (in a component or the home frontmatter) must exist.
  while IFS= read -r shot; do
    [ -n "$shot" ] || continue
    [ -f "$SRC/public$shot" ] || problem "docs/site/$rel shows $shot, which docs/site/public/ does not have"
  done < <(grep -oP '/screens/[A-Za-z0-9._-]+' "$page" | sort -u)
done < <(pages)

for name in "${REFERENCE_DOCS[@]}" "${DEV_DOCS[@]}"; do
  check_components "$DOCS/$name.md" "docs/$name.md"
done

[ "$fail" -eq 0 ] || exit 1

# ---------------------------------------------------------------------------
# Copy.
# ---------------------------------------------------------------------------

echo "syncing from $SRC and the references in $DOCS"

# Everything under src/ except the configuration and this repository's own public files is
# synced content: replace it wholesale, so a page removed upstream disappears here too.
find "$DEST" -mindepth 1 -maxdepth 1 ! -name .vitepress ! -name public -exec rm -rf {} +
while IFS= read -r -d '' rel; do
  mkdir -p "$(dirname "$DEST/$rel")"
  cp "$SRC/$rel" "$DEST/$rel"
done < <(pages)
printf '  %-28s %s pages\n' "guide, reference, home" "$(pages | tr -cd '\0' | wc -c | tr -d ' ')"

# The references, and a Chinese placeholder for each.
place_reference() { # name section
  local name="$1" section="$2" title
  mkdir -p "$DEST/en/$section" "$DEST/$section"
  cp "$DOCS/$name.md" "$DEST/en/$section/$name.md"
  title="$(zh_title "$name")"
  cat >"$DEST/$section/$name.md" <<MD
---
title: $title
editLink: false
head:
  - - meta
    - name: robots
      content: noindex
---

# $title

本页只有英文版。它是 CodeGraph 的规范技术参考，与代码一同保存在 codegraph-rust 仓库中。

- [在本站阅读英文版](/en/$section/$name)
- [在 GitHub 上查看源文件](https://github.com/sunerpy/codegraph-rust/blob/main/docs/$name.md)
MD
}
for name in "${REFERENCE_DOCS[@]}"; do place_reference "$name" reference; done
for name in "${DEV_DOCS[@]}"; do place_reference "$name" dev; done
printf '  %-28s %s references + Chinese placeholders\n' "en/reference, en/dev" "$((${#REFERENCE_DOCS[@]} + ${#DEV_DOCS[@]}))"

# Links. The pages link the references by their real path in codegraph-rust (`../../cli.md`),
# and the references link files that are not on this site (`design/viewer-d.md`, `../ui/LICENSE`).
# Rewrite both: a link to a synced reference becomes the relative path of its page here; any
# other link that leaves the synced tree becomes a GitHub link. Code blocks and inline code are
# left alone.
REFERENCES="${REFERENCE_DOCS[*]}" DEVS="${DEV_DOCS[*]}" python3 - "$CG_ROOT" "$DEST" <<'PY'
import os, posixpath, re, sys
from pathlib import Path

cg_root, dest = Path(sys.argv[1]), Path(sys.argv[2])
refs = os.environ["REFERENCES"].split()
devs = os.environ["DEVS"].split()
BLOB = "https://github.com/sunerpy/codegraph-rust/blob/main/"

# Where each published page came from in codegraph-rust, and the reverse.
site_of = {}  # repo path -> site path (relative to src/)
for name in refs:
    site_of[f"docs/{name}.md"] = f"en/reference/{name}.md"
for name in devs:
    site_of[f"docs/{name}.md"] = f"en/dev/{name}.md"
source_of = {site: repo for repo, site in site_of.items()}

link = re.compile(r"(\]\()([^)\s]+)((?:\s+\"[^\"]*\")?\))")
fence = re.compile(r"^\s*(```|~~~)")
code_span = re.compile(r"(`+)(.+?)\1")

def rewrite_target(target, repo_dir, site_dir):
    if re.match(r"^(?:[a-z][a-z0-9+.-]*:|#|/)", target):
        return target
    path, sep, anchor = target.partition("#")
    if not path:
        return target
    repo = posixpath.normpath(posixpath.join(repo_dir, path))
    if repo.startswith("../"):
        return target
    if repo in site_of:
        new = posixpath.relpath(site_of[repo], site_dir or ".")
    elif repo.startswith("docs/site/") and not repo.startswith(("docs/site/tools/", "docs/site/README.md")):
        return target
    else:
        new = BLOB + repo
    return new + (sep + anchor if sep else "")

def rewrite(text, repo_dir, site_dir):
    out, in_fence = [], False
    for line in text.splitlines(keepends=True):
        if fence.match(line):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue
        pieces, last = [], 0
        for m in code_span.finditer(line):
            pieces.append(("text", line[last:m.start()]))
            pieces.append(("code", m.group(0)))
            last = m.end()
        pieces.append(("text", line[last:]))
        out.append("".join(
            link.sub(lambda m: m.group(1) + rewrite_target(m.group(2), repo_dir, site_dir) + m.group(3), piece)
            if kind == "text" else piece
            for kind, piece in pieces
        ))
    return "".join(out)

changed = 0
for page in sorted(dest.rglob("*.md")):
    rel = page.relative_to(dest).as_posix()
    if rel.startswith(".vitepress/") or rel.startswith("public/"):
        continue
    repo_path = source_of.get(rel, f"docs/site/{rel}")
    if rel not in source_of and not (cg_root / repo_path).exists():
        continue  # a generated placeholder: its links are site paths already
    text = page.read_text(encoding="utf-8")
    new = rewrite(text, posixpath.dirname(repo_path), posixpath.dirname(rel))
    if new != text:
        page.write_text(new, encoding="utf-8")
        changed += 1
print(f"  {'links':<28} rewritten in {changed} pages")
PY

mkdir -p "$DEST/public"
for dir in "${PUBLIC_DIRS[@]}"; do
  rm -rf "${DEST:?}/public/$dir"
  mkdir -p "$DEST/public/$dir"
  cp -R "$SRC/public/$dir/." "$DEST/public/$dir/"
  printf '  %-28s %s files\n' "public/$dir/" "$(find "$DEST/public/$dir" -type f | wc -l | tr -d ' ')"
done
for file in "${PUBLIC_FILES[@]}"; do
  cp "$SRC/public/$file" "$DEST/public/$file"
  printf '  %-28s ok\n' "public/$file"
done

# A stamp so a stale sync is visible on the site (the footer shows the commit).
# Recorded as data, not prose. A second run from the same commit keeps the old time,
# so re-running the workflow never produces a commit that changes only a timestamp.
COMMIT=$(git -C "$CG_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)
SHORT=$(git -C "$CG_ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo unknown)
if [ -n "$(git -C "$CG_ROOT" status --porcelain -- docs 2>/dev/null)" ]; then
  SHORT="$SHORT-dirty"
fi
STAMP="$DEST/.vitepress/synced.json"
synced_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -f "$STAMP" ] && grep -q "\"shortCommit\": \"$SHORT\"" "$STAMP" && grep -q "\"commit\": \"$COMMIT\"" "$STAMP"; then
  synced_at="$(sed -n 's/.*"syncedAt": "\([^"]*\)".*/\1/p' "$STAMP")"
fi
cat >"$STAMP" <<JSON
{
  "source": "https://github.com/sunerpy/codegraph-rust",
  "commit": "$COMMIT",
  "shortCommit": "$SHORT",
  "syncedAt": "$synced_at"
}
JSON

echo "synced from codegraph-rust@$SHORT"
