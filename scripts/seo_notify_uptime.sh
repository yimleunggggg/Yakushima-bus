#!/usr/bin/env bash
# 站点 HTTP 非 200 → 立即 ntfy（不等日报写完）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JSON="${1:-$ROOT/docs/seo/metrics/uptime-latest.json}"

if [[ -z "${NTFY_TOPIC:-}" ]]; then
  echo "ℹ 未配置 NTFY_TOPIC，跳过站点告警"
  exit 0
fi
[[ -f "$JSON" ]] || exit 0

BODY="$(python3 << PY
import json, pathlib
d = json.loads(pathlib.Path("$JSON").read_text(encoding="utf-8"))
lines = [f"探测时间 UTC: {d.get('checked_at', '?')}", ""]
for u in d.get("urls") or []:
    st = u.get("status", 0)
    mark = "OK" if st == 200 else "异常"
    lines.append(f"{u.get('path', '?')} → HTTP {st} ({mark})")
lines += [
    "",
    "GSC「测试实际网址」也会红。先修 GitHub Pages / DNS，再请求编入索引。",
    "GitHub → 仓库 Settings → Pages → 看 Custom domain 与最近 deployment。",
]
print("\\n".join(lines))
PY
)"

SERVER="${NTFY_SERVER:-https://ntfy.sh}"
curl -fsS -d "$BODY" \
  -H "Title: [YakuBus] 站点不可用 · HTTP 异常" \
  -H "Tags: warning,rotating_light" \
  -H "Priority: urgent" \
  "${SERVER}/${NTFY_TOPIC}"
echo "✓ uptime alert → ${NTFY_TOPIC}"
