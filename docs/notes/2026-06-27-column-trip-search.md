# 环线区间搜索修复（2026-06-27）

## 问题
中央线 PDF 为环线列；`trip_split.py` 拆成 2–3 站的小段后，`findTrips` 只认单段对象，导致如「宫之浦港入口→宫浦小前」工作日仅 1 班，而 PDF 有十余班。

## 修复
- `parse_pdf.py`：拆分前保留 `direction.columnTrips`（整列时刻）
- `app-core.js`：`resolveColumnSegment`（同列起终点 arr>dep 且 ≤240min）+ `findTrips` 优先搜 `columnTrips`
- 展开经停：`segmentStops` 对列模式列出 dep–arr 窗口内各站时刻

## 验证（入口→宫浦小前）
- 工作日：1 班 → **11 班**
- 周六：1 班 → **3 班**（仍少于 PDF 全列数时，多为日种列分配或松叶早班单独路线）

缓存：`data-column-v2` / `core-v10`
