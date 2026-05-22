#!/usr/bin/env bash
# 每周优化方案（待确认后执行）→ docs/seo/proposals/YYYY-WW-proposal.md
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
# 每周 SEO/GEO 优化方案 — ${WW}

**生成日**：${DATE} · **站点**：https://yakushimabus.com  
**状态**：⏳ 待确认 — 在 GitHub Issue 回复 \`approve\` 后执行（或 Cursor 说「执行本周方案」）

---

## 1. 本周数据摘要（7 天）

EOF

python3 << PY >> "$OUT"
import json, os, pathlib
p = pathlib.Path(os.environ.get("SEO_WEEKLY_METRICS", "$METRICS"))
if p.is_file():
    d = json.loads(p.read_text())
    g = d.get("ga4_daily") or d.get("ga4") or {}
    gs = d.get("gsc_28d") or d.get("gsc") or {}
    if isinstance(g, dict) and g.get("last_7d"):
        l7 = g["last_7d"]
        print(f"- GA4 7 日：用户 **{l7.get('active_users', l7.get('users_28d','—'))}** · 会话 **{l7.get('sessions','—')}**")
    elif g.get("users_28d") is not None:
        print(f"- GA4 28 日：用户 **{g['users_28d']}** · 自然 **{g.get('organic_users_28d',0)}**")
    if gs and not gs.get("error"):
        print(f"- GSC 28 日：展示 **{gs.get('impressions',0)}** · 点击 **{gs.get('clicks',0)}**")
        for q in (gs.get("top_queries") or [])[:3]:
            print(f"  - 「{q['query']}」")
else:
    print("- （无 metrics，先跑 daily workflow）")
PY

cat >> "$OUT" << 'EOF'

---

## 2. 建议改动（批准后自动/半自动执行）

| 优先级 | 项 | 理由 | 执行方式 |
|--------|-----|------|----------|
| P1 | 若 `/access/` 有 GA4 着陆流量 | 强化 ferry/jetfoil title/description | 自动 PR |
| P1 | GSC 有 Top 词后 | 对齐 P0：屋久島 バス 時刻表 等 | 自动 PR |
| P2 | 索引 NEUTRAL 的页 | GSC URL 检查 + lastmod | **你手动**请求索引 |
| P2 | GA4 仍 0 Organic | 不加攻略；保持工具定位 | 观察 |

*本周若无 GSC 展示：方案以「索引 + GA4 使用」为主，不大改 meta。*

---

## 3. GEO（生成式搜索）

- 保持四页 **静态 `page-lead`** 与 JSON-LD
- `llms.txt` 声明：工具站、数据出处、四 URL
- 不加主观旅游攻略；FAQ 仅交通事实

---

## 4. 需你手动

- [ ] GSC **URL 检查** → 对 NEUTRAL 页请求编入索引
- [ ] 运营商 PDF 换版时通知 → 更新 `sources/` 并 rebuild
- [ ] 外链/社群推广（可选）

---

## 5. 外部洞察（2026-05 基线）

| 主题 | 说明 |
|------|------|
| 2026/3 巴士改点 | 标题已可强调改点期；等 GSC 有词再微调 |
| 鹿儿岛↔屋久岛 船票/高速船 | `/access/` + booking 卡片 |
| 离岛通用攻略 | **不做**；避免稀释工具定位 |

*下周从此表 + 新 GSC Top 词更新。*

EOF

export SEO_WEEKLY_METRICS="$METRICS"
python3 "$ROOT/scripts/seo_insight_blocks.py" weekly >> "$OUT"

cat >> "$OUT" << EOF

---

## 6. 批准后如何执行

1. GitHub Issue 评论 **\`approve\`**（推荐，不必开 Cursor）
2. 或 Cursor：**「执行本周 SEO 方案 ${WW}」**
3. 执行后生成 \`reports/${DATE}-round-N.md\` 并更新 CHANGELOG

---

## 7. 确认

- [ ] **approve** — 按 §2 P1 执行
- [ ] **defer** — 本周跳过
- [ ] 留言修改意见

EOF

echo "$OUT"
