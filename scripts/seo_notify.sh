#!/usr/bin/env bash
# 发送 SEO 报告通知（任一渠道配置即可，未配置则跳过）
# 环境变量：
#   SEO_NOTIFY_EMAIL     收件邮箱
#   RESEND_API_KEY       Resend.com API Key
#   RESEND_FROM          发件人，如 "YakuBus SEO <seo@yakushimabus.com>"
#   NTFY_TOPIC           ntfy.sh 主题名
#   NTFY_SERVER          默认 https://ntfy.sh
set -euo pipefail

REPORT_FILE="${1:?usage: seo_notify.sh path/to/report.md}"
SUBJECT="${2:-Yakushima Bus SEO 报告}"
[[ -f "$REPORT_FILE" ]] || { echo "Report not found: $REPORT_FILE"; exit 1; }

PREVIEW="$(head -n 25 "$REPORT_FILE" | sed 's/^#\+ //g' | head -c 900)"
sent=0

if [[ -n "${NTFY_TOPIC:-}" ]]; then
  SERVER="${NTFY_SERVER:-https://ntfy.sh}"
  if curl -fsS -d "$PREVIEW" \
    -H "Title: $SUBJECT" \
    -H "Tags: mag" \
    "${SERVER}/${NTFY_TOPIC}" >/dev/null; then
    echo "✓ ntfy → ${NTFY_TOPIC}"
    sent=1
  else
    echo "⚠ ntfy failed"
  fi
fi

if [[ -n "${SEO_NOTIFY_EMAIL:-}" && -n "${RESEND_API_KEY:-}" ]]; then
  export REPORT_FILE SUBJECT
  export RESEND_FROM="${RESEND_FROM:-YakuBus SEO <onboarding@resend.dev>}"
  PAYLOAD="$(python3 << 'PY'
import html, json, os, pathlib
body = pathlib.Path(os.environ["REPORT_FILE"]).read_text(encoding="utf-8")
html_body = (
    '<pre style="font-family:sans-serif;font-size:14px;line-height:1.5;'
    'white-space:pre-wrap">'
    + html.escape(body)
    + "</pre>"
)
print(json.dumps({
    "from": os.environ["RESEND_FROM"],
    "to": [os.environ["SEO_NOTIFY_EMAIL"]],
    "subject": os.environ["SUBJECT"],
    "html": html_body,
}))
PY
)"
  if curl -fsS -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer ${RESEND_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" >/dev/null; then
    echo "✓ email → ${SEO_NOTIFY_EMAIL}"
    sent=1
  else
    echo "⚠ Resend email failed"
  fi
fi

if [[ $sent -eq 0 ]]; then
  echo "ℹ 未配置通知（见 docs/seo/NOTIFICATIONS.md）— 报告在 docs/seo/reports/ 与 GitHub Issue"
fi
