#!/usr/bin/env bash
# 最多 2 轮日报；全失败则 exit 1（由 workflow 发紧急 ntfy）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for attempt in 1 2; do
  if bash scripts/seo_daily_ci.sh "$attempt"; then
    exit 0
  fi
  if [[ "$attempt" -eq 1 ]]; then
    echo "=== 第 1 轮失败，60 秒后第 2 轮 ==="
    sleep 60
  fi
done

bash scripts/seo_notify_failure.sh 2 || true
exit 1
