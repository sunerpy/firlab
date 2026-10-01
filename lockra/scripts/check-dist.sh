#!/usr/bin/env bash
#
# Check a built Lockra site before it is published inside firlab.app: both languages were
# emitted, every root-relative link and asset carries the /lockra/ base (a component that
# forgot `withBase` would point at firlab.app's own pages, which exist, so nothing else
# notices), and the sitemap lists pages under https://firlab.app/lockra/ only.
#
# USAGE
#   scripts/check-dist.sh <dist-dir>
#
# Run by deploy.yml and lockra-site-ci.yml here, and by lockra's docs-site.yml.

set -euo pipefail

dist="${1:?usage: $0 <dist-dir>}"

test -f "$dist/index.html" || { echo "::error::the English home page is missing"; exit 1; }
test -f "$dist/zh/index.html" || { echo "::error::the Chinese home page is missing"; exit 1; }
en=$(find "$dist" -name '*.html' -not -path "$dist/zh/*" | wc -l | tr -d ' ')
zh=$(find "$dist/zh" -name '*.html' | wc -l | tr -d ' ')
echo "emitted ${en} English and ${zh} Chinese pages"
test "$zh" -ge 20 || { echo "::error::only ${zh} Chinese pages were emitted"; exit 1; }

outside=$(grep -rhoE '(href|src)="/[^"]*"' "$dist" --include='*.html' | grep -vE '^(href|src)="/lockra/' | sort -u || true)
if [ -n "$outside" ]; then
  echo "::error::root-relative links outside /lockra/:"
  echo "$outside"
  exit 1
fi

test -f "$dist/sitemap.xml" || { echo "::error::the sitemap is missing"; exit 1; }
foreign=$(grep -oE '<loc>[^<]*</loc>' "$dist/sitemap.xml" | grep -vE '^<loc>https://firlab\.app/lockra/' || true)
if [ -n "$foreign" ]; then
  echo "::error::sitemap entries outside https://firlab.app/lockra/:"
  echo "$foreign"
  exit 1
fi
echo "every link, asset and sitemap entry is under /lockra/"
