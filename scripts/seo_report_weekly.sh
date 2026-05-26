#!/usr/bin/env bash
# 每周 SEO 摘要 → docs/seo/proposals/YYYY-WW-proposal.md（只读参考，无需 approve）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
DATE="${1:-$(date +%Y-%m-%d)}"
WW="$(date -j -f "%Y-%m-%d" "$DATE" "+%G-W%V" 2>/dev/null || date -d "$DATE" "+%G-W%V")"
OUT_DIR="$ROOT/docs/seo/proposals"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/${WW}-proposal.md"
METRICS="$ROOT/docs/seo/metrics/daily-latest.json"
[[ -f "$METRICS" ]] || METRICS="$ROOT/docs/seo/metrics/latest.json"
export SEO_WEEKLY_METRICS="$METRICS"

cat > "$OUT" << EOF
# YakuBus 周报 · ${WW}

**${DATE}** · https://yakushimabus.com · **仅供参考，无需回复本邮件**

---

## 1. 本周数据摘要（7 天）

EOF

python3 << PY >> "$OUT"
import json, os, pathlib
p = pathlib.Path(os.environ.get("SEO_WEEKLY_METRICS", "$METRICS"))
if not p.is_file():
    print("- （无 metrics，先跑 daily workflow）")
    raise SystemExit
d = json.loads(p.read_text())
g = d.get("ga4_daily") or d.get("ga4") or {}
gs = d.get("gsc_28d") or d.get("gsc") or {}
if isinstance(g, dict) and g.get("last_7d"):
    l7 = g["last_7d"]
    print(f"- GA4 7 日：用户 **{l7.get('active_users', '—')}** · 会话 **{l7.get('sessions', '—')}**")
elif g.get("users_28d") is not None:
    print(f"- GA4 28 日：用户 **{g['users_28d']}** · 自然 **{g.get('organic_users_28d', 0)}**")
if gs and not gs.get("error"):
    print(f"- GSC 28 日：展示 **{gs.get('impressions', 0)}** · 点击 **{gs.get('clicks', 0)}**")
    for q in (gs.get("top_queries") or [])[:5]:
        print(f"  - 「{q.get('query', '?')}」展示 {q.get('impressions', 0)}")
    st = gs.get("index_status") or {}
    if st:
        print("- 索引：", end=" ")
        print(" · ".join(
            f"{'✓' if v == 'PASS' else '○'} {u.replace('https://yakushimabus.com', '') or '/'}"
            for u, v in st.items()
        ))
PY

python3 << PY >> "$OUT"
import json, os, pathlib, sys
sys.path.insert(0, "$ROOT/scripts")
from seo_priorities import compute_priorities
p = pathlib.Path(os.environ.get("SEO_WEEKLY_METRICS", "$METRICS"))
if not p.is_file():
    raise SystemExit
d = json.loads(p.read_text())
pr = compute_priorities(d)
items = [it for it in (pr.get("items") or []) if it["priority"] in ("P0", "P1")][:4]
if not items:
    print("\n## 2. 本周建议\n\n- 数据平稳，**无需改代码**；继续 GSC 手动索引（若仍为 NEUTRAL）。\n")
else:
    print("\n## 2. 本周建议（来自 GA4/GSC）\n")
    for it in items:
        print(f"- **[{it['priority']}]** {it['area']}：{it['action'][:120]}")
    print("")
PY

cat >> "$OUT" << 'EOF'

---

## 3. 你要做什么

- **日常**：看日报邮件摘要即可；有 P0「索引」→ GSC URL 检查（约 5 分钟）。
- **要改 meta/内链**：在 Cursor 说「按周报建议改 SEO」，不必 GitHub Issue、不必回复 `approve`。
- **完整数据表**：仓库 `docs/seo/reports/daily/`。

EOF

echo "$OUT"
