#!/usr/bin/env bash
# 生成专业 SEO/GA4 日报 → docs/seo/reports/daily/YYYY-MM-DD.md
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
DATE="${1:-$(date +%Y-%m-%d)}"
OUT_DIR="$ROOT/docs/seo/reports/daily"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/${DATE}.md"
METRICS="$ROOT/docs/seo/metrics/daily-${DATE}.json"
[[ -f "$METRICS" ]] || METRICS="$ROOT/docs/seo/metrics/daily-latest.json"
[[ -f "$METRICS" ]] || METRICS="$ROOT/docs/seo/metrics/latest.json"
export SEO_DAILY_METRICS="$METRICS"

CHECK_LOG=""
[[ -f /tmp/seo-check.log ]] && CHECK_LOG="$(cat /tmp/seo-check.log)" || CHECK_LOG="$(bash "$ROOT/scripts/seo_check.sh" 2>&1)" || true

cat > "$OUT" << EOF
# 网站日报 · ${DATE}

| | |
|---|---|
| 站点 | https://yakushimabus.com |
| 类型 | SEO / GA4 / GSC 自动日报 |
| GSC 数据 | 滞后约 2–3 天，读 28 天窗口 |

---

## 1. 今日摘要

EOF

python3 << 'PY' >> "$OUT"
import json, os, pathlib, sys

def load():
    p = pathlib.Path(os.environ["SEO_DAILY_METRICS"])
    if not p.is_file():
        return None, None, p
    d = json.loads(p.read_text(encoding="utf-8"))
    g = d.get("ga4_daily") or {}
    gs = d.get("gsc_28d") or d.get("gsc") or {}
    legacy = False
    if not g and d.get("ga4"):
        legacy = True
        ga = d["ga4"]
        g = {
            "error": ga.get("error"),
            "last_7d": {
                "active_users": ga.get("users_28d", 0),
                "sessions": ga.get("sessions_28d", 0),
            },
            "yesterday": {},
            "day_before": {},
            "period": {"yesterday": "—（biweekly 数据）"},
        }
    return g, gs, p

g, gs, p = load()
if g is None:
    print("⚠ 无 metrics 文件，请先运行 seo_fetch_daily.py")
    sys.exit(0)

def delta(cur, prev):
    if not isinstance(cur, (int, float)) or not isinstance(prev, (int, float)):
        return ""
    if prev == 0:
        return "（前日 0，看绝对值）" if cur else ""
    pct = (cur - prev) / prev * 100
    return f"（较前一 day **{pct:+.0f}%**）"

if g.get("error"):
    print(f"- **GA4**：{g['error']}")
elif g.get("yesterday"):
    y, db = g.get("yesterday", {}), g.get("day_before", {})
    y_users = y.get("active_users", 0)
    db_users = db.get("active_users", 0)
    print(
        f"- **GA4 昨日**（{g.get('period', {}).get('yesterday', '?')}）："
        f"活跃用户 **{y_users}**{delta(y_users, db_users)} · "
        f"会话 **{y.get('sessions', 0)}** · "
        f"互动率 **{y.get('engagement_rate', 0)}%** · "
        f"均时 **{y.get('avg_session_sec', 0)}s**"
    )
    print(
        f"- **GA4 近 7 日**：用户 **{g.get('last_7d', {}).get('active_users', 0)}** · "
        f"会话 **{g.get('last_7d', {}).get('sessions', 0)}**"
    )
else:
    l7 = g.get("last_7d", {})
    print(
        f"- **GA4**（来自 `{p.name}` 28 日汇总）："
        f"用户 **{l7.get('active_users', 0)}** · 会话 **{l7.get('sessions', 0)}**"
    )

if gs.get("error"):
    err = str(gs["error"])
    print(f"- **GSC**（滞后 2–3 天）：{err[:120]}…")
else:
    period = gs.get("period", {})
    print(
        f"- **GSC 28 天**（{period.get('start', '?')}~{period.get('end', '?')}）："
        f"展示 **{gs.get('impressions', 0)}** · 点击 **{gs.get('clicks', 0)}** · "
        f"排名 **{gs.get('position', 0)}**"
    )
    if gs.get("impressions", 0) == 0:
        print("- *新站 0 展示仍正常；重点看 GA4 使用与索引 PASS*")
PY

cat >> "$OUT" << 'EOF'

---

## 2. GA4 专业解读

| 看什么 | 说明 |
|--------|------|
| 活跃用户 / 会话 | 工具是否被真实打开 |
| 较昨日变化 | ±50% 需查是否部署/外链/爬虫 |
| 互动率 / 均时 | 低=只点进来即走；高=在用查路线/PDF |
| 渠道 7 日 | Organic 涨=SEO 起量；Direct 多=书签/直达 |
| 着陆页 | 哪条 URL 是入口，决定优化优先级 |
| 国家 / 设备 | 对齐日中英文案与移动 PDF 体验 |

### 2.1 渠道（近 7 日）

EOF

python3 << 'PY' >> "$OUT"
import json, os, pathlib

p = pathlib.Path(os.environ["SEO_DAILY_METRICS"])
if not p.is_file():
    raise SystemExit
d = json.loads(p.read_text(encoding="utf-8"))
g = d.get("ga4_daily") or {}
if not g and d.get("ga4"):
    print("（biweekly 数据无渠道维度；等 daily fetch 后更新）")
    raise SystemExit
if g.get("error"):
    print("(无数据)")
    raise SystemExit
rows = g.get("channels_7d") or []
print("| 渠道 | 用户 | 会话 | 互动率 |")
print("|------|------|------|--------|")
if not rows:
    print("| — | 0 | 0 | — |")
else:
    for r in rows:
        print(
            f"| {r.get('dimension', '?')} | {r.get('active_users', 0)} | "
            f"{r.get('sessions', 0)} | {r.get('engagement_rate', 0)}% |"
        )
PY

cat >> "$OUT" << 'EOF'

### 2.2 着陆页 Top（近 7 日）

EOF

python3 << 'PY' >> "$OUT"
import json, os, pathlib

p = pathlib.Path(os.environ["SEO_DAILY_METRICS"])
if not p.is_file():
    raise SystemExit
d = json.loads(p.read_text(encoding="utf-8"))
g = d.get("ga4_daily") or {}
if not g and d.get("ga4"):
    print("（biweekly 数据无着陆页维度）")
    raise SystemExit
rows = g.get("landing_pages_7d") or []
if not rows:
    print("(暂无)")
else:
    for r in rows[:6]:
        path = (r.get("dimension") or "?").replace("https://yakushimabus.com", "") or "/"
        print(f"- `{path}` — 用户 {r.get('active_users', 0)} · 会话 {r.get('sessions', 0)}")
PY

cat >> "$OUT" << 'EOF'

### 2.3 国家 / 设备（近 7 日）

EOF

python3 << 'PY' >> "$OUT"
import json, os, pathlib

p = pathlib.Path(os.environ["SEO_DAILY_METRICS"])
if not p.is_file():
    raise SystemExit
d = json.loads(p.read_text(encoding="utf-8"))
g = d.get("ga4_daily") or {}
if not g and d.get("ga4"):
    print("（biweekly 数据无国家/设备维度）")
    raise SystemExit
for label, key in [("国家", "countries_7d"), ("设备", "devices_7d")]:
    rows = g.get(key) or []
    if rows:
        print(
            f"**{label}**："
            + " · ".join(
                f"{r.get('dimension', '?')} {r.get('active_users', 0)}" for r in rows[:4]
            )
        )
PY

cat >> "$OUT" << 'EOF'

---

## 3. GSC（搜索表现，滞后 2–3 天）

EOF

python3 << 'PY' >> "$OUT"
import json, os, pathlib

p = pathlib.Path(os.environ["SEO_DAILY_METRICS"])
if not p.is_file():
    raise SystemExit
d = json.loads(p.read_text(encoding="utf-8"))
gs = d.get("gsc_28d") or d.get("gsc") or {}
if gs.get("error"):
    print(gs["error"])
else:
    for q in (gs.get("top_queries") or [])[:5]:
        print(f"- 「{q['query']}」展示 {q['impressions']} 点击 {q['clicks']}")
    if not gs.get("top_queries"):
        print("- Top 词：暂无（等待收录）")
    st = gs.get("index_status") or {}
    if st:
        print("\n**索引抽查：**")
        for u, v in st.items():
            mark = "✓" if v == "PASS" else "○"
            print(f"- {mark} {u.replace('https://yakushimabus.com', '') or '/'} → {v}")
PY

cat >> "$OUT" << EOF

---

## 4. 站点自检

\`\`\`
${CHECK_LOG}
\`\`\`

EOF

python3 "$ROOT/scripts/seo_insight_blocks.py" daily >> "$OUT"

cat >> "$OUT" << 'EOF'

---

## 8. 存档

| 位置 | 文件 |
|------|------|
| Git | `docs/seo/reports/daily/`、`docs/seo/metrics/daily-*.json` |
| 飞书 | 见 Actions 日志 `Feishu doc` 链接（已配置时） |

*日报只读数，不改网站。每周一另出优化方案。*

EOF

echo "$OUT"
