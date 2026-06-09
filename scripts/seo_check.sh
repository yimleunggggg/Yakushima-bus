#!/usr/bin/env bash
# 本地 / CI 用：静态 SEO 文件自检（不调用 GSC API）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
fail=0

ok() { echo "  ✓ $1"; }
warn() { echo "  ⚠ $1"; fail=1; }
die() { echo "  ✗ $1"; fail=1; }

echo "SEO check — yakushimabus.com"
echo

# robots + sitemap
[[ -f robots.txt ]] && ok robots.txt || die "missing robots.txt"
grep -q 'Sitemap: https://yakushimabus.com/sitemap.xml' robots.txt && ok robots.txt sitemap line || die "robots.txt sitemap URL"
[[ -f sitemap.xml ]] && ok sitemap.xml || die "missing sitemap.xml"
grep -c '<loc>' sitemap.xml | grep -qE '^[0-9]+$' && ok "sitemap.xml ($(grep -c '<loc>' sitemap.xml) URLs)" || die "sitemap.xml parse error"
for path in "/" "/map/" "/access/" "/about/"; do
  grep -q "<loc>https://yakushimabus.com${path}</loc>" sitemap.xml \
    && ok "sitemap ${path}" || warn "sitemap missing ${path}"
done

# verification
[[ -f googlef464172b97bd6d41.html ]] && ok GSC verification file || warn "missing google verification html"

# pages
PAGES=(index.html map/index.html access/index.html intro/index.html about/index.html)
for p in "${PAGES[@]}"; do
  [[ -f "$p" ]] || { die "missing $p"; continue; }
  grep -q '<title>' "$p" && grep -q 'name="description"' "$p" && grep -q 'rel="canonical"' "$p" \
    && ok "$p meta" || warn "$p missing title/description/canonical"
done

# llms.txt
[[ -f llms.txt ]] && ok llms.txt || warn "missing llms.txt"

echo
if [[ $fail -eq 0 ]]; then
  echo "All checks passed."
else
  echo "Some checks failed — see above."
  exit 1
fi
