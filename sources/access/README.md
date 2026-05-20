# 上岛交通数据（access-data.js）

编辑 `sources/access/` 下的 JSON，然后运行：

```bash
python3 scripts/build_access_data.py
```

## 文件

| 文件 | 内容 |
|------|------|
| `jetfoil.json` | 高速船季节时刻 + 运价（按 `validFrom`/`validTo` 自动选当前季节） |
| `ferry.json` | 渡轮时刻 + 平季运价 |
| `pass.json` | 悠享乘车券价格 |

## 季节切换

`jetfoil.json` 的 `seasons` 数组按日期范围匹配；构建脚本取「今天落在范围内」的季节，否则取最近已开始的季节。

新增季节（如 2026 秋ダイヤ）：在 `seasons` 加一条，从 [tykousoku.jp/fare_time/](https://www.tykousoku.jp/fare_time/) 抄时刻即可。

## 局部覆盖

仍可用 `sources/overrides/access.json` 打补丁（见 `sources/overrides/README.md`）。

## 运价核对（2026-05-11 起，官网）

- 鹿儿岛↔**屋久岛**：单程 ¥14,000 / 往返 ¥25,900（成人）
- 鹿儿岛↔**种子岛**：单程 ¥12,000 / 往返 ¥22,200（成人，作参考行展示）
