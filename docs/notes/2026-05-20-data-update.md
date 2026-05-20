# 数据更新机制（2026-05-20）

## Codex 反馈结论

| 优先级 | 项 | 状态 |
|--------|-----|------|
| P0 | 上岛交通过期（Toppy 夏季 + 运价） | ✅ 已外置 `sources/access/*.json` 并重建 |
| P1 | `parse_pdf.py` 白谷/荒川/纪元杉硬编码 | 仍靠 `day_columns.py` + 段内手工列表；PDF 改订时核对 |
| P2 | UX：班次展开 affordance、轻反馈、ARIA | 待做 |
| P2 | 视觉：下一班主角、品牌 tagline | 待做 |

## 更新流程

### 公交时刻表（data.js）
1. 官方 PDF → `assets/`，改 `sources/manifest.json`
2. `python3 scripts/build_all.py --timetable`
3. 局部：`sources/overrides/timetable.json`

### 上岛交通（access-data.js）
1. 改 `sources/access/jetfoil.json`（季节/运价）或 `ferry.json`
2. `python3 scripts/build_access_data.py`

### 运价/地图（map-data.js）
1. `sources/manifest.json` 运价 PDF + `scripts/lib/fare_table.py`
2. `python3 scripts/build_all.py --map`

## 高速船运价说明

2026-05-11 起官网价（[tykousoku.jp](https://www.tykousoku.jp/fare_time/)）：
- **鹿儿岛↔屋久岛**：¥14,000 单程 / ¥25,900 往返（非 ¥12,000；后者为种子岛线）
