# PDF 列对齐修复（2026-06-27）

## 根因
官方 PDF 各站行列数不一致（如宫之浦港 20 站 14 列、空港 49 站 15 列首格为空），`parse_side` 按列 index 硬对齐导致同列混进不同车次（如 8:00 配 6:14）。

## 修复
- `scripts/lib/pdf_align.py`：PyMuPDF x 坐标聚类对齐；西向参考站 21、东向 20；松葉首列日种后移。
- `findTrips`：仅 `fi < ti`（与线路方向一致），杜绝东向错列反向区间。
- 宫之浦港→机场 工作日：中央线 10 班（首班 5:50→6:14）+ 松葉 04:00 各 1 班；土日另 4 班。

## 验证
```bash
python3 scripts/build_all.py --validate --timetable
python3 scripts/audit_presets.py
node scripts/check_route.js miyanoura_port airport weekday
```

## 常用区间（PDF x 对齐，2026-03-01）
| 区间 | 平日 | 土 | 日祝 | 全周 |
|------|------|----|------|------|
| 宫之浦港→机场 | 10 | 2 | 2 | 14 |
| 宫之浦港→安房港 | 8 | 1 | 2 | 11 |
| 宫之浦港→安房 | 9 | 2 | 2 | 13 |

土/日祝少于平日为 PDF 列日种分区正常结果（10+2+2）。`audit_presets.py` 已接入 `build_all --validate`。

## 耗时上下限（2026-06-27）
- PDF 西向统计：`scripts/build_segment_stats.py` → `sources/segment-stats.json`
- 全局上限 **120 分钟**（PDF 全程最长约 102 分、单站间最长 50 分）
- `audit_segment_bounds.py`：findTrips 无超过 120 分的班次
- 站点簇模糊搜索：`sources/stop-search-clusters.json`（宫之浦港/入口/镇上合并）
- 班次卡标签改为实际站名（非「上车/到达」）
