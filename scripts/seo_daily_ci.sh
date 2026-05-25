#!/usr/bin/env bash
# 日报 CI：最多 2 轮；GA4/GSC fetch 与 git push 各最多 3 次
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ATTEMPT="${1:-1}"
echo "=== SEO daily job · attempt ${ATTEMPT}/2 ==="

bash scripts/seo_check.sh 2>&1 | tee /tmp/seo-check.log

fetch_ok=0
for i in 1 2 3; do
  if python3 scripts/seo_fetch_daily.py; then
    fetch_ok=1
    break
  fi
  echo "⚠ GA4/GSC fetch failed ($i/3), retry in 30s…"
  sleep 30
done
if [[ $fetch_ok -eq 0 ]]; then
  echo "⚠ GA4/GSC 三次均失败，继续用已有 metrics 写报告"
fi

REPORT="$(bash scripts/seo_report_daily.sh)"
echo "report_path=$REPORT"

python3 scripts/seo_feishu_doc.py "$REPORT" || true

SUBJ="[YakuBus] 日报 $(date +%Y-%m-%d) GA4/GSC"
if [[ "$ATTEMPT" -gt 1 ]]; then
  SUBJ="[YakuBus] 日报 $(date +%Y-%m-%d) GA4/GSC（重试成功）"
fi
bash scripts/seo_notify.sh "$REPORT" "$SUBJ"

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git add docs/seo/reports/daily/ docs/seo/metrics/
[[ -f docs/seo/feishu-links.json ]] && git add docs/seo/feishu-links.json
git diff --staged --quiet || git commit -m "docs(seo): daily report and metrics $(date +%Y-%m-%d)"

push_ok=0
for i in 1 2 3; do
  if git push; then
    push_ok=1
    break
  fi
  echo "⚠ git push failed ($i/3), pull --rebase and retry…"
  git pull --rebase origin main || true
  sleep 10
done
if [[ $push_ok -eq 0 ]]; then
  echo "✗ git push 三次均失败"
  exit 1
fi

echo "✓ SEO daily job complete (attempt ${ATTEMPT})"
