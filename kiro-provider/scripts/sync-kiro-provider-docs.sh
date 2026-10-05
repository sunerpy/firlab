#!/usr/bin/env bash
#
# Copy kiro-provider's documentation into this site's content tree.
#
# WHAT THIS IS FOR
#
# The kiro-provider repository owns every word on firlab.app/kiro-provider/: the guide lives in
# its `docs/site/` (English at the root, Chinese under `zh/`) next to the code it describes, so a
# pull request that changes behaviour updates the page in the same commit, and the same files
# read correctly on GitHub. Its canonical references are published here as well: the English
# text of each is `docs/<NAME>.md`, and most have a Chinese translation at
# `docs/readme/<NAME>.zh-CN.md`. This repository owns the site: VitePress configuration, theme,
# components, the build checks and the presentation assets (`src/public/og.*`).
#
# To change a sentence on the live site, edit the kiro-provider repository. Every path this
# script writes is replaced on the next sync.
#
# USAGE
#   scripts/sync-kiro-provider-docs.sh <path-to-kiro-provider-checkout>
#
# kiro-provider's `.github/workflows/publish-site.yml` runs it on every push to main that touches
# the pages, and `docs-site.yml` on pull requests, so a local run and CI produce the same tree.
# It fails before writing anything when the content breaks one of the contracts checked below.
# It needs GNU grep (-P) and python3, as on the Linux runners.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-kiro-provider-checkout>" >&2
  exit 2
fi

KP_ROOT="$(cd "$1" && pwd)"
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$KP_ROOT/docs/site"
DOCS="$KP_ROOT/docs"
DEST="$SITE_ROOT/src"

if [ ! -f "$SRC/index.md" ] || [ ! -f "$SRC/zh/index.md" ]; then
  echo "error: $SRC has no index.md or zh/index.md; is '$1' a kiro-provider checkout with the website pages?" >&2
  exit 1
fi

# The canonical references, as <site path>=<NAME>: the English text is docs/<NAME>.md and the
# Chinese translation docs/readme/<NAME>.zh-CN.md. They are published at /<site path> and
# /zh/<site path>. Keep these lists, ENGLISH_ONLY and editLinkPattern in
# src/.vitepress/config/shared.ts, and the sidebars in config/{en,zh}.ts in step.
REFERENCES=(
  clients/codex=CODEX
  clients/claude-code=CLAUDE_CODE
  clients/zuno=ZUNO
  clients/launchers=CLIENT_LAUNCHERS
  operate/service=SERVICE
  operate/troubleshooting=TROUBLESHOOTING
  reference/configuration=CONFIGURATION
  reference/protocol=PROTOCOL_COMPATIBILITY
  reference/usage=RESPONSES_USAGE
)

# References that exist in English only. Each gets a Chinese placeholder at /zh/<site path>:
# VitePress's language switch maps the current path onto the other locale unchanged, so
# without one the Chinese entry in the language menu would lead to a 404.
ENGLISH_ONLY=(
  reference/streaming-errors=STREAM_ERROR_CONTRACT
  reference/historical-tools=HISTORICAL_TOOLS
  dev/architecture=ARCHITECTURE
)
zh_title() {
  case "$1" in
    STREAM_ERROR_CONTRACT) echo "流式错误契约" ;;
    HISTORICAL_TOOLS) echo "历史工具调用与当前授权" ;;
    ARCHITECTURE) echo "架构" ;;
    *) echo "$1" ;;
  esac
}

# Assets kiro-provider owns. Everything else under src/public/ belongs to this repository.
PUBLIC_FILES=(kiro-provider-logo.svg)

# Components a page may use: the ones src/.vitepress/theme/index.ts registers, plus
# VitePress's own Badge. An unknown tag would render as an empty custom element with only a
# console warning, so it fails the sync instead.
ALLOWED_COMPONENTS=(Badge HomeIndex HomeSteps SplitBlock HomePlatforms HomePrivacy HomeScope StatusTag)

fail=0
problem() {
  echo "error: $*" >&2
  fail=1
}

# ---------------------------------------------------------------------------
# Contracts, checked before anything is written.
# ---------------------------------------------------------------------------

for entry in "${REFERENCES[@]}"; do
  name="${entry#*=}"
  [ -f "$DOCS/$name.md" ] || problem "expected reference docs/$name.md is missing"
  [ -f "$DOCS/readme/$name.zh-CN.md" ] || problem "expected translation docs/readme/$name.zh-CN.md is missing"
done
for entry in "${ENGLISH_ONLY[@]}"; do
  name="${entry#*=}"
  [ -f "$DOCS/$name.md" ] || problem "expected reference docs/$name.md is missing"
  # A translation that appears later belongs in REFERENCES, where it is published.
  [ ! -e "$DOCS/readme/$name.zh-CN.md" ] ||
    problem "docs/readme/$name.zh-CN.md exists: move $name from ENGLISH_ONLY to REFERENCES"
done
for file in "${PUBLIC_FILES[@]}"; do
  [ -f "$SRC/public/$file" ] || problem "expected file docs/site/public/$file is missing"
done
[ "$fail" -eq 0 ] || exit 1

# The pages of the site, relative to docs/site/: every Markdown file except this directory's
# README.md (for authors) and its public/ assets.
pages() {
  local file
  while IFS= read -r -d '' file; do
    file="${file#"$SRC"/}"
    case "$file" in
      README.md | public/*) continue ;;
    esac
    printf '%s\0' "$file"
  done < <(find "$SRC" -name '*.md' -print0 | sort -z)
}

# A synced reference lives where an authored page could; an authored page there would be
# replaced without notice.
for entry in "${REFERENCES[@]}" "${ENGLISH_ONLY[@]}"; do
  path="${entry%%=*}"
  [ ! -e "$SRC/$path.md" ] && [ ! -e "$SRC/zh/$path.md" ] ||
    problem "docs/site/$path.md or docs/site/zh/$path.md would collide with the synced docs/${entry#*=}.md"
done

# Every page exists in both languages, at the same path.
while IFS= read -r -d '' rel; do
  case "$rel" in
    zh/*) other="${rel#zh/}" ;;
    *) other="zh/$rel" ;;
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

# Words a guide page does not use, after the writing rules in kiro-provider's
# docs/site/README.md. The internal ones are source paths and the section sign of design
# notes, which mean nothing to a reader of the guide; the colloquial ones keep the register
# the guide is written in. The contributors' page may name the source tree.
ZH_COLLOQUIAL='还没|没能|免得|搭的|咋|啥|搞定|折腾|说说|试试|看看'
EN_COLLOQUIAL='\bjust\b(?! now)|\bgonna\b|\bstuff\b|\bsimply\b'
INTERNAL='§|\bsrc/(cli|server|protocol|kiro|core|storage|reasoning|config|web-search)/'

while IFS= read -r -d '' rel; do
  page="$SRC/$rel"
  check_components "$page" "docs/site/$rel"

  case "$rel" in
    zh/*) colloquial="$ZH_COLLOQUIAL" ;;
    *) colloquial="$EN_COLLOQUIAL" ;;
  esac
  case "$rel" in
    developers.md | zh/developers.md) pattern="$colloquial" ;;
    *) pattern="$colloquial|$INTERNAL" ;;
  esac
  while IFS= read -r hit; do
    [ -n "$hit" ] && problem "docs/site/$rel:${hit%%:*} uses an internal or colloquial word: $(cut -d: -f2- <<<"$hit" | grep -oP "$pattern" | sort -u | paste -sd ' ')"
  done < <(prose "$page" | grep -P "$pattern" || true)
done < <(pages)

for entry in "${REFERENCES[@]}"; do
  name="${entry#*=}"
  check_components "$DOCS/$name.md" "docs/$name.md"
  check_components "$DOCS/readme/$name.zh-CN.md" "docs/readme/$name.zh-CN.md"
done
for entry in "${ENGLISH_ONLY[@]}"; do
  check_components "$DOCS/${entry#*=}.md" "docs/${entry#*=}.md"
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
printf '  %-28s %s pages\n' "guide, home, zh/" "$(pages | tr -cd '\0' | wc -c | tr -d ' ')"

for entry in "${REFERENCES[@]}"; do
  path="${entry%%=*}" name="${entry#*=}"
  mkdir -p "$(dirname "$DEST/$path.md")" "$(dirname "$DEST/zh/$path.md")"
  cp "$DOCS/$name.md" "$DEST/$path.md"
  cp "$DOCS/readme/$name.zh-CN.md" "$DEST/zh/$path.md"
done
printf '  %-28s %s references in both languages\n' "clients, operate, reference" "${#REFERENCES[@]}"

for entry in "${ENGLISH_ONLY[@]}"; do
  path="${entry%%=*}" name="${entry#*=}"
  mkdir -p "$(dirname "$DEST/$path.md")" "$(dirname "$DEST/zh/$path.md")"
  cp "$DOCS/$name.md" "$DEST/$path.md"
  title="$(zh_title "$name")"
  cat >"$DEST/zh/$path.md" <<MD
---
title: $title
editLink: false
head:
  - - meta
    - name: robots
      content: noindex
---

# $title

本页只有英文版。它是 kiro-provider 的技术参考，与代码一同保存在 kiro-provider 仓库中。

- [在本站阅读英文版](/$path)
- [在 GitHub 上查看源文件](https://github.com/sunerpy/kiro-provider/blob/main/docs/$name.md)
MD
done
printf '  %-28s %s English-only references + Chinese placeholders\n' "reference, dev" "${#ENGLISH_ONLY[@]}"

# Links and the language line. The pages link the references by their real path in
# kiro-provider (`../../CONFIGURATION.md`), and the references link files that are not on this
# site (`audits/…`, `../config.example.json`). Rewrite both: a link to a synced reference
# becomes the relative path of its page here; any other link that leaves the synced tree
# becomes a GitHub link. Code blocks and inline code are left alone. Each reference opens with
# a GitHub language line (`[简体中文](readme/X.zh-CN.md) · English`), which the site's own
# language menu replaces, so it is dropped.
REFERENCES="${REFERENCES[*]}" ENGLISH_ONLY="${ENGLISH_ONLY[*]}" python3 - "$KP_ROOT" "$DEST" <<'PY'
import os, posixpath, re, sys
from pathlib import Path

kp_root, dest = Path(sys.argv[1]), Path(sys.argv[2])
BLOB = "https://github.com/sunerpy/kiro-provider/blob/main/"

# Where each published page came from in kiro-provider, and the reverse.
site_of = {}  # repo path -> site path (relative to src/)
for entry in os.environ["REFERENCES"].split():
    path, name = entry.split("=")
    site_of[f"docs/{name}.md"] = f"{path}.md"
    site_of[f"docs/readme/{name}.zh-CN.md"] = f"zh/{path}.md"
for entry in os.environ["ENGLISH_ONLY"].split():
    path, name = entry.split("=")
    site_of[f"docs/{name}.md"] = f"{path}.md"
source_of = {site: repo for repo, site in site_of.items()}

link = re.compile(r"(\]\()([^)\s]+)((?:\s+\"[^\"]*\")?\))")
fence = re.compile(r"^\s*(```|~~~)")
code_span = re.compile(r"(`+)(.+?)\1")
language_line = re.compile(
    r"^(?:\[简体中文\]\([^)]*\) · English|简体中文 · \[English\]\([^)]*\))\s*$"
)

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
    elif repo.startswith("docs/site/") and not repo.startswith(("docs/site/public/", "docs/site/README.md")):
        return target
    else:
        new = BLOB + repo
    return new + (sep + anchor if sep else "")

def rewrite(text, repo_dir, site_dir, drop_language_line):
    out, in_fence, dropped = [], False, not drop_language_line
    for line in text.splitlines(keepends=True):
        if fence.match(line):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue
        if not dropped and language_line.match(line):
            dropped = True
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
    # The language line is followed by a blank line; dropping both keeps one blank under the title.
    return re.sub(r"\A(# [^\n]*\n)\n\n+", r"\1\n", "".join(out))

changed = 0
for page in sorted(dest.rglob("*.md")):
    rel = page.relative_to(dest).as_posix()
    if rel.startswith(".vitepress/") or rel.startswith("public/"):
        continue
    reference = rel in source_of
    repo_path = source_of.get(rel, f"docs/site/{rel}")
    if not reference and not (kp_root / repo_path).exists():
        continue  # a generated placeholder: its links are site paths already
    text = page.read_text(encoding="utf-8")
    new = rewrite(text, posixpath.dirname(repo_path), posixpath.dirname(rel), reference)
    if new != text:
        page.write_text(new, encoding="utf-8")
        changed += 1
print(f"  {'links, language lines':<28} rewritten in {changed} pages")
PY

mkdir -p "$DEST/public"
for file in "${PUBLIC_FILES[@]}"; do
  cp "$SRC/public/$file" "$DEST/public/$file"
  printf '  %-28s ok\n' "public/$file"
done

# A stamp so a stale sync is visible on the site (the footer shows the commit).
# Recorded as data, not prose. A second run from the same commit keeps the old time,
# so re-running the workflow never produces a commit that changes only a timestamp.
COMMIT=$(git -C "$KP_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)
SHORT=$(git -C "$KP_ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo unknown)
if [ -n "$(git -C "$KP_ROOT" status --porcelain -- docs 2>/dev/null)" ]; then
  SHORT="$SHORT-dirty"
fi
STAMP="$DEST/.vitepress/synced.json"
synced_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -f "$STAMP" ] && grep -q "\"shortCommit\": \"$SHORT\"" "$STAMP" && grep -q "\"commit\": \"$COMMIT\"" "$STAMP"; then
  synced_at="$(sed -n 's/.*"syncedAt": "\([^"]*\)".*/\1/p' "$STAMP")"
fi
cat >"$STAMP" <<JSON
{
  "source": "https://github.com/sunerpy/kiro-provider",
  "commit": "$COMMIT",
  "shortCommit": "$SHORT",
  "syncedAt": "$synced_at"
}
JSON

echo "synced from kiro-provider@$SHORT"
