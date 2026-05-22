#!/usr/bin/env bash
# 生成 SEO 报告（reminder = 定时提醒；round = Cursor 完成一轮后）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
MODE="${1:-reminder}"
DATE="${2:-$(date +%Y-%m-%d)}"
OUT_DIR="$ROOT/docs/seo/reports"
mkdir -p "$OUT_DIR"

CHECK_LOG=""
if [[ -f /tmp/seo-check.log ]]; then
  CHECK_LOG="$(cat /tmp/seo-check.log)"
else
  CHECK_LOG="$(bash "$ROOT/scripts/seo_check.sh" 2>&1)" || true
fi

ROUND_N=""
SUMMARY=""
if [[ "$MODE" == "round" ]]; then
  ROUND_N="${3:-?}"
  SUMMARY="${4:-（见 CHANGELOG）}"
  OUT="$OUT_DIR/${DATE}-round-${ROUND_N}.md"
else
  OUT="$OUT_DIR/${DATE}-reminder.md"
fi

last_changelog="$(grep -E '^## Round' "$ROOT/docs/seo/CHANGELOG.md" 2>/dev/null | head -1 || echo '（尚无）')"

cat > "$OUT" << EOF
# SEO 半月报 · ${DATE}

| | |
|---|---|
| 类型 | ${MODE}（每半月 1/15 日） |
| 站点 | https://yakushimabus.com |
| 上一轮 | ${last_changelog} |

---

## 1. 本期摘要

EOF

if [[ "$MODE" == "reminder" ]]; then
  cat >> "$OUT" << 'EOF'
定时任务已跑完 **静态自检**（sitemap、meta、robots 等）。  
**尚未**改网站代码——需要你（或在 Cursor 说「跑一轮 SEO 优化」）根据 GSC 数据决定是否微调 title/description。

**你现在要做的（约 10 分钟）**
1. 打开 [Google Search Console 效果](https://search.google.com/search-console/performance/search-analytics) → 选 28 天 → 记下展示、点击、平均排名
2. 填进 \`docs/seo/TRACKING.md\` 指标表
3. 在 Cursor 说：**跑一轮 SEO 优化**（我会读 GSC 数据并改 meta + 写 Round 报告）

EOF
else
  cat >> "$OUT" << EOF
**Round ${ROUND_N}** 已在仓库内完成技术向优化。

${SUMMARY}

详见 \`docs/seo/CHANGELOG.md\`。

EOF
fi

cat >> "$OUT" << EOF

---

## 2. GSC / GA4 数据（自动）

EOF

if [[ -f "$ROOT/docs/seo/metrics/latest.json" ]]; then
  python3 << 'PY' >> "$OUT"
import json, pathlib
d = json.loads(pathlib.Path("docs/seo/metrics/latest.json").read_text(encoding="utf-8"))
if d.get("error") and not d.get("gsc"):
    print(f"⚠ 未拉取：**{d['error']}**")
    print(f"\n请按 `{d.get('setup_hint', 'docs/seo/GOOGLE_SETUP.md')}` 配置一次 Google 授权。")
else:
    g = d.get("gsc") or {}
    a = d.get("ga4") or {}
    if g.get("error"):
        print(f"- GSC 错误：{g['error']}")
    elif g:
        p = g.get("period", {})
        print(f"- **GSC**（{p.get('start','?')} ~ {p.get('end','?')}）：展示 **{g.get('impressions',0)}** · 点击 **{g.get('clicks',0)}** · 平均排名 **{g.get('position','—')}**")
        if g.get("top_queries"):
            print("- Top 查询词：")
            for q in g["top_queries"][:5]:
                print(f"  - {q['query']}（展示 {q['impressions']}）")
        if g.get("index_status"):
            print("- 索引抽查：")
            for u, v in g["index_status"].items():
                mark = "✓" if v == "PASS" else "○"
                print(f"  - {mark} {u} → {v}")
    if a.get("error"):
        print(f"- GA4 错误：{a['error']}")
    elif a.get("users_28d") is not None:
        print(f"- **GA4** 28 天：用户 **{a['users_28d']}** · 自然搜索 **{a.get('organic_users_28d',0)}**")
PY
else
  cat >> "$OUT" << 'EOF'
尚未拉取。配置 `docs/seo/GOOGLE_SETUP.md` 后由定时任务或 `python3 scripts/seo_fetch_metrics.py` 自动写入。
EOF
fi

cat >> "$OUT" << EOF

---

## 3. 自动检查结果

\`\`\`
${CHECK_LOG}
\`\`\`

---

## 4. 为什么做这些事（学习）

| 动作 | 理由 |
|------|------|
| 提交 sitemap | 告诉 Google 有哪 4 个 URL，比等爬虫乱逛更快 |
| title / description | 搜索结果里显示的标题和摘要；含「屋久島 バス 時刻表」等词才容易被搜到 |
| 静态 \`page-lead\` 导语 | 爬虫不跑 JS 也能读到关键词，避免首页「空壳」 |
| JSON-LD 结构化数据 | 帮助 Google 理解这是「旅行类 Web 应用」，非普通博客 |
| 不堆旅游攻略 | 保持「公交工具」定位，避免和观光协会抢词、稀释点击率 |
| 指标表 TRACKING.md | 同一套词每 2–4 周对比，才知道改动有没有用 |

**新站正常节奏**：1–4 周展示≈0；4–8 周长尾词慢慢出现。看 **趋势** 不看单日。

---

## 5. 效果追踪

已配置 Google 授权时，**GSC/GA4 会自动写入** \`docs/seo/metrics/latest.json\` 与 \`TRACKING.md\` 指标表。

| 去哪看 | 看什么 |
|--------|--------|
| 本报告 §2 | 28 天展示/点击/排名、Top 词、索引、GA4 自然流量 |
| \`docs/seo/TRACKING.md\` | 历史对比表 |

**目标查询词（P0）**：屋久島 バス 時刻表 / 屋久岛 公交 时刻表 / Yakushima bus timetable

---

EOF

export SEO_DAILY_METRICS="$ROOT/docs/seo/metrics/latest.json"
python3 "$ROOT/scripts/seo_insight_blocks.py" daily >> "$OUT"

cat >> "$OUT" << 'EOF'

---

## 9. 存档

| 位置 | 说明 |
|------|------|
| Git | `docs/seo/reports/*-reminder.md`、`metrics/latest.json` |
| Issue | 标签 `seo-round`，可 Watch 收邮件 |

*半月报不改代码；复杂改版用 Cursor「跑一轮 SEO 优化」。*

EOF

echo "$OUT"
