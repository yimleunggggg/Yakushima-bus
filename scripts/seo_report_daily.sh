#!/usr/bin/env bash
# 生成 SEO/GA4 日报 → docs/seo/reports/daily/YYYY-MM-DD.md
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
DATE="${1:-$(date +%Y-%m-%d)}"

CHECK_LOG=""
if [[ -f /tmp/seo-check.log ]]; then
  CHECK_LOG="$(cat /tmp/seo-check.log)"
else
  CHECK_LOG="$(bash "$ROOT/scripts/seo_check.sh" 2>&1)" || true
fi
export SEO_CHECK_LOG="$CHECK_LOG"

python3 "$ROOT/scripts/seo_daily_report.py" "$DATE"
