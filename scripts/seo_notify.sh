#!/usr/bin/env bash
# 发送 SEO 报告通知（任一渠道配置即可，未配置则跳过）
# 环境变量：
#   SEO_NOTIFY_EMAIL     收件邮箱
#   RESEND_API_KEY       Resend.com API Key
#   RESEND_FROM          发件人，如 "YakuBus SEO <seo@yakushimabus.com>"
#   NTFY_TOPIC           ntfy.sh 主题名
#   NTFY_SERVER          默认 https://ntfy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPORT_FILE="${1:?usage: seo_notify.sh path/to/report.md}"
SUBJECT="${2:-Yakushima Bus SEO 报告}"
[[ -f "$REPORT_FILE" ]] || { echo "Report not found: $REPORT_FILE"; exit 1; }

NTFY_BODY="$(python3 "$ROOT/scripts/seo_notify_format.py" ntfy "$REPORT_FILE")"
sent=0

if [[ -n "${NTFY_TOPIC:-}" ]]; then
  SERVER="${NTFY_SERVER:-https://ntfy.sh}"
  if curl -fsS -d "$NTFY_BODY" \
    -H "Title: $SUBJECT" \
    -H "Tags: mag" \
    -H "Priority: default" \
    "${SERVER}/${NTFY_TOPIC}" >/dev/null; then
    echo "✓ ntfy → ${NTFY_TOPIC}"
    sent=1
  else
    echo "⚠ ntfy failed"
  fi
fi

if [[ -n "${SEO_NOTIFY_EMAIL:-}" && -n "${RESEND_API_KEY:-}" ]]; then
  export SUBJECT SEO_NOTIFY_EMAIL
  export RESEND_FROM="${RESEND_FROM:-YakuBus SEO <onboarding@resend.dev>}"
  HTML_BODY="$(python3 "$ROOT/scripts/seo_notify_format.py" html "$REPORT_FILE" 2>/dev/null)" || HTML_BODY=""
  if [[ -n "$HTML_BODY" ]]; then
    PAYLOAD="$(python3 -c "
import json, os, sys
print(json.dumps({
    'from': os.environ['RESEND_FROM'],
    'to': [os.environ['SEO_NOTIFY_EMAIL']],
    'subject': os.environ['SUBJECT'],
    'html': sys.stdin.read(),
}))
" <<< "$HTML_BODY")"
    if curl -fsS -X POST https://api.resend.com/emails \
      -H "Authorization: Bearer ${RESEND_API_KEY}" \
      -H "Content-Type: application/json" \
      -d "$PAYLOAD" >/dev/null; then
      echo "✓ email → ${SEO_NOTIFY_EMAIL}"
      sent=1
    else
      echo "⚠ Resend email failed"
    fi
  else
    echo "⚠ email HTML 生成失败，已跳过（ntfy 不受影响）"
  fi
fi

if [[ $sent -eq 0 ]]; then
  echo "ℹ 未配置通知（见 docs/seo/NOTIFICATIONS.md）— 报告在 docs/seo/reports/ 与 GitHub Issue"
fi
