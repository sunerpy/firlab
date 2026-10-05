#!/usr/bin/env bash
#
# Check a built winer site before it is published inside firlab.app: both languages were
# emitted, every root-relative link and asset carries the /winer/ base and resolves to a file
# the build emitted (a component that forgot `withBase` would point at firlab.app's own pages,
# which exist, so nothing else notices), and the sitemap lists pages under
# https://firlab.app/winer/ only.
#
# USAGE
#   scripts/check-dist.sh <dist-dir>
#
# Run by deploy.yml and winer-site-ci.yml here, and by winer's docs-site.yml.

set -euo pipefail

dist="${1:?usage: $0 <dist-dir>}"

# Chinese is this site's root locale and English sits under en/.
test -f "$dist/index.html" || { echo "::error::the Chinese home page is missing"; exit 1; }
test -f "$dist/en/index.html" || { echo "::error::the English home page is missing"; exit 1; }
zh=$(find "$dist" -name '*.html' -not -path "$dist/en/*" -not -name 404.html | wc -l | tr -d ' ')
en=$(find "$dist/en" -name '*.html' | wc -l | tr -d ' ')
echo "emitted ${zh} Chinese and ${en} English pages"
test "$en" -ge 12 || { echo "::error::only ${en} English pages were emitted"; exit 1; }
test "$zh" -ge 12 || { echo "::error::only ${zh} Chinese pages were emitted"; exit 1; }

refs=$(grep -rhoE '(href|src)="/[^"]*"' "$dist" --include='*.html' | sed -E 's/^(href|src)="//; s/"$//' | sort -u)
outside=$(grep -vE '^/winer/' <<<"$refs" || true)
if [ -n "$outside" ]; then
  echo "::error::root-relative links outside /winer/:"
  echo "$outside"
  exit 1
fi

# Every root-relative link and asset resolves to an emitted file, the way GitHub Pages looks
# one up: the path itself, then path.html, then path/index.html.
missing=""
while IFS= read -r ref; do
  [ -n "$ref" ] || continue
  path="${ref%%[#?]*}"
  path="${path#/winer/}"
  file="$dist/$path"
  if [ -f "$file" ] || [ -f "$file.html" ] || [ -f "${file%/}/index.html" ]; then
    continue
  fi
  missing+="$ref"$'\n'
done <<<"$refs"
if [ -n "$missing" ]; then
  echo "::error::links and assets that resolve to nothing:"
  printf '%s' "$missing"
  exit 1
fi

test -f "$dist/sitemap.xml" || { echo "::error::the sitemap is missing"; exit 1; }
foreign=$(grep -oE '<loc>[^<]*</loc>' "$dist/sitemap.xml" | grep -vE '^<loc>https://firlab\.app/winer/' || true)
if [ -n "$foreign" ]; then
  echo "::error::sitemap entries outside https://firlab.app/winer/:"
  echo "$foreign"
  exit 1
fi
echo "every link, asset and sitemap entry is under /winer/ and resolves"
