#!/usr/bin/env bash
#
# Check a built kiro-provider site before it is published inside firlab.app:
#   - both languages were emitted;
#   - every root-relative link and asset carries the /kiro-provider/ base (a component that
#     forgot `withBase` would point at firlab.app's own pages, which exist, so nothing else
#     notices);
#   - every such link resolves to a file the build emitted, the way GitHub Pages looks paths up
#     (`/x` → x.html or x/index.html), which also covers the links in the home frontmatter that
#     VitePress's dead-link check does not see;
#   - the sitemap lists pages under https://firlab.app/kiro-provider/ only.
#
# USAGE
#   scripts/check-dist.sh <dist-dir>
#
# Run by deploy.yml and kiro-provider-site-ci.yml here, and by kiro-provider's docs-site.yml.

set -euo pipefail

dist="${1:?usage: $0 <dist-dir>}"

# English is this site's root locale and Chinese sits under zh/.
test -f "$dist/index.html" || { echo "::error::the English home page is missing"; exit 1; }
test -f "$dist/zh/index.html" || { echo "::error::the Chinese home page is missing"; exit 1; }
en=$(find "$dist" -name '*.html' -not -path "$dist/zh/*" | wc -l | tr -d ' ')
zh=$(find "$dist/zh" -name '*.html' | wc -l | tr -d ' ')
echo "emitted ${en} English and ${zh} Chinese pages"
test "$zh" -ge 20 || { echo "::error::only ${zh} Chinese pages were emitted"; exit 1; }

outside=$(grep -rhoE '(href|src)="/[^"]*"' "$dist" --include='*.html' | grep -vE '^(href|src)="/kiro-provider/' | sort -u || true)
if [ -n "$outside" ]; then
  echo "::error::root-relative links outside /kiro-provider/:"
  echo "$outside"
  exit 1
fi

# Every in-site link and asset resolves. Query strings and fragments do not take part in the
# lookup; a directory path is its index.html; an extensionless page path is its .html file.
missing=$(
  grep -rhoE '(href|src)="/kiro-provider/[^"]*"' "$dist" --include='*.html' |
    sed -E 's/^(href|src)="\/kiro-provider\/([^"#?]*).*$/\2/' | sort -u |
    while IFS= read -r path; do
      if [ -z "$path" ] || [ "${path%/}" != "$path" ]; then
        [ -f "$dist/${path}index.html" ] || echo "/kiro-provider/$path"
      elif [ -f "$dist/$path" ] || [ -f "$dist/$path.html" ] || [ -f "$dist/$path/index.html" ]; then
        :
      else
        echo "/kiro-provider/$path"
      fi
    done
)
if [ -n "$missing" ]; then
  echo "::error::links and assets under /kiro-provider/ that the build did not emit:"
  echo "$missing"
  exit 1
fi

test -f "$dist/sitemap.xml" || { echo "::error::the sitemap is missing"; exit 1; }
foreign=$(grep -oE '<loc>[^<]*</loc>' "$dist/sitemap.xml" | grep -vE '^<loc>https://firlab\.app/kiro-provider/' || true)
if [ -n "$foreign" ]; then
  echo "::error::sitemap entries outside https://firlab.app/kiro-provider/:"
  echo "$foreign"
  exit 1
fi
echo "every link, asset and sitemap entry is under /kiro-provider/, and every in-site link resolves"
