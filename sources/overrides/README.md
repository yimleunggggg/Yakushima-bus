# 局部覆盖说明

在 `sources/overrides/` 放置 JSON 即可覆盖生成结果，**无需改 Python**。

## fare.json — 运价微调

```json
{
  "farePairs": {
    "miyanoura_port|anbo_port": 870
  }
}
```

设为 `null` 可删除某对：`"a|b": null`

## timetable.json — 时刻表局部补丁

结构与 `data.js` 内 `BUS_DATA` 相同层级，深度合并。

## access.json — 上岛交通

结构与 `access-data.js` 内 `ACCESS_DATA` 相同，可改 `sections[].rows` 等。

```json
{
  "sections": [
    {
      "id": "jetfoil_out",
      "rows": [{ "no": "111", "dep": "07:30", "arr": "10:20" }]
    }
  ]
}
```

## 工作流

1. 官方更新 PDF → 放入 `assets/` 并改 `sources/manifest.json`
2. `python3 scripts/build_all.py` 全量重建
3. 或只改 overrides + `python3 scripts/build_all.py --map`
