# 环线 trip 构建期拆分（2026-05-20）

## 做了什么
- 新增 `scripts/lib/trip_split.py`：`parse_pdf.py` 生成 `data.js` 后对全线 `routes` 拆分环线列。
- 策略：站序回退切列 → 大间隔（>75min）再切 → 宫之浦港孤站保留 → 宫之浦港↔安房腿配对合并。
- `parse_pdf.py` 结束跑 `validate_routes_monotonic`，非单调 trip 构建失败。

## 结果（示例）
- 宫之浦港→安房 工作日：约 **9 班** central west + matsubanda（对照 PDF 列）。
- 全线 trip 对象时刻沿站序单调，展开卡中间站有准确时刻则显示，无则 `—`。

## UI
- 「今日已结束」：隐藏顶部发车/到达时间，只留短提示（日种、起终点、「只看之后」）。
