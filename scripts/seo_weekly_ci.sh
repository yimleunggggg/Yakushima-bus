#!/usr/bin/env bash
# 周报 CI：拉 GA4/GSC 日历周 → Git 存档 → 飞书表格
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BACKFILL="${SEO_WEEKLY_BACKFILL:-}"
echo "=== SEO weekly job ==="

fetch_ok=0
FETCH_CMD=(python3 scripts/seo_fetch_weekly.py)
if [[ -n "$BACKFILL" ]]; then
  FETCH_CMD+=(--backfill "$BACKFILL")
fi
for i in 1 2 3; do
  if "${FETCH_CMD[@]}"; then
    fetch_ok=1
    break
  fi
  echo "⚠ weekly fetch failed ($i/3), retry in 30s…"
  sleep 30
done
if [[ $fetch_ok -eq 0 ]]; then
  echo "⚠ GA4/GSC 三次均失败"
  exit 1
fi

python3 scripts/seo_feishu_weekly_sheet.py sync || echo "⚠ 飞书表格同步失败，见上方日志"

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git add docs/seo/metrics/weekly-*.json docs/seo/feishu-sheet.json 2>/dev/null || true
git diff --staged --quiet || git commit -m "docs(seo): weekly metrics $(date +%G-W%V)"

for i in 1 2 3; do
  if git push; then
    echo "✓ SEO weekly job complete"
    exit 0
  fi
  echo "⚠ git push failed ($i/3), pull --rebase and retry…"
  git pull --rebase origin main || true
  sleep 10
done
echo "✗ git push 三次均失败"
exit 1
