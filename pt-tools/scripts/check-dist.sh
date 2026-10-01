#!/usr/bin/env bash
#
# Check a built pt-tools site before it is published inside firlab.app: both languages were
# emitted, every root-relative link and asset carries the /pt-tools/ base (a component that
# forgot `withBase` would point at firlab.app's own pages, which exist, so nothing else
# notices), and the sitemap lists pages under https://firlab.app/pt-tools/ only.
#
# USAGE
#   scripts/check-dist.sh <dist-dir>
#
# Run by deploy.yml and pt-tools-site-ci.yml here, and by pt-tools' docs-site.yml.

set -euo pipefail

dist="${1:?usage: $0 <dist-dir>}"

# Chinese is this site's root locale and English sits under en/.
test -f "$dist/index.html" || { echo "::error::the Chinese home page is missing"; exit 1; }
test -f "$dist/en/index.html" || { echo "::error::the English home page is missing"; exit 1; }
zh=$(find "$dist" -name '*.html' -not -path "$dist/en/*" | wc -l | tr -d ' ')
en=$(find "$dist/en" -name '*.html' | wc -l | tr -d ' ')
echo "emitted ${zh} Chinese and ${en} English pages"
test "$en" -ge 20 || { echo "::error::only ${en} English pages were emitted"; exit 1; }

outside=$(grep -rhoE '(href|src)="/[^"]*"' "$dist" --include='*.html' | grep -vE '^(href|src)="/pt-tools/' | sort -u || true)
if [ -n "$outside" ]; then
  echo "::error::root-relative links outside /pt-tools/:"
  echo "$outside"
  exit 1
fi

test -f "$dist/sitemap.xml" || { echo "::error::the sitemap is missing"; exit 1; }
foreign=$(grep -oE '<loc>[^<]*</loc>' "$dist/sitemap.xml" | grep -vE '^<loc>https://firlab\.app/pt-tools/' || true)
if [ -n "$foreign" ]; then
  echo "::error::sitemap entries outside https://firlab.app/pt-tools/:"
  echo "$foreign"
  exit 1
fi
echo "every link, asset and sitemap entry is under /pt-tools/"
