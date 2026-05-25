#!/usr/bin/env bash
# 日报 Automation 两次均失败 → 紧急 ntfy 提醒人工介入
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ATTEMPT="${1:-2}"
RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-unknown}"

if [[ -z "${NTFY_TOPIC:-}" ]]; then
  echo "ℹ 未配置 NTFY_TOPIC，跳过失败告警"
  exit 0
fi

SERVER="${NTFY_SERVER:-https://ntfy.sh}"
BODY="$(cat <<EOF
日报 Automation 第 ${ATTEMPT} 次仍失败，需你手动检查。

可能原因：GA4/GSC 连不上、git push 冲突、Secrets 过期。

Actions: ${RUN_URL}
EOF
)"

curl -fsS -d "$BODY" \
  -H "Title: [YakuBus] 日报失败 · 请人工处理" \
  -H "Tags: warning,skull" \
  -H "Priority: high" \
  "${SERVER}/${NTFY_TOPIC}"
echo "✓ failure alert → ${NTFY_TOPIC}"
