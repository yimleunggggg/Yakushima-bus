# 飞书集成配置

**一张表看全部趋势**：飞书电子表格 **「YakuBus SEO 数据」** 固定复用，日报每天一行、周报每周一行，同文件不同 Sheet。

| Sheet 组 | 粒度 | 更新 |
|----------|------|------|
| **日报汇总** / 日报-* | 每天一行（昨日 GA4 + 近7日 + GSC28d） | `seo-daily.yml` 每天 |
| **周报汇总** / 渠道… | 每周一行（日历周 GA4 + GSC） | `seo-weekly.yml` 每周一 |

（可选）**优化追踪** 仍是一篇云文档滚动快照，见 §5。  
不再每天新建日报 doc。

未配置 `FEISHU_SHEET_TOKEN` 时：数据仍写入 Git，仅跳过飞书表格。

---

## 1. 飞书开放平台（一次性）

1. [飞书开放平台](https://open.feishu.cn/app) → 自建应用（如 **Cursor**）
2. **权限**：`sheets:spreadsheet`、`sheets:spreadsheet:create`、`drive:drive`
3. 复制 **App ID**、**App Secret** → **发布**应用

---

## 2. 创建表格（个人版必做，推荐）

**飞书个人版**：应用无法直接往你的个人文件夹建表（会 HTTP 400），请**手动建表**：

1. 在 **YakuBus SEO** 文件夹 → **新建 → 电子表格** → 命名 **YakuBus SEO 数据**
2. 打开表格 → 右上角 **…** → **添加文档应用** → 选 **Cursor**（可编辑）
3. 从 URL 复制 token：`https://my.feishu.cn/sheets/shtcnXXXX` → **`shtcnXXXX`**
4. GitHub Secret **`FEISHU_SHEET_TOKEN`** = 上面的 token

（可选）`FEISHU_FOLDER_TOKEN` = 文件夹 URL 里 `folder/` 后那段。

---

## 3. GitHub Secrets

| Secret | 必填 | 用途 |
|--------|------|------|
| `FEISHU_APP_ID` | 是 | App ID |
| `FEISHU_APP_SECRET` | 是 | App Secret |
| `FEISHU_SHEET_TOKEN` | **是（个人版）** | 手动建的表格 token |
| `FEISHU_FOLDER_TOKEN` | 可选 | 文件夹 token（企业版自动建表用） |
| `FEISHU_JOURNAL_DOC_ID` | 可选 | 追踪 doc |

GA4/GSC：`GOOGLE_SERVICE_ACCOUNT_JSON`、`GOOGLE_OAUTH_*`、`GA4_PROPERTY_ID`、`GSC_SITE_URL`

---

## 4. 配置步骤（照着做）

### 4.1 绑定表格 token（个人版）

按 §2 手动建表 → 填 **`FEISHU_SHEET_TOKEN`** → 重跑 workflow。

企业版可尝试 Actions 自动建表（需 `FEISHU_FOLDER_TOKEN` + 应用已加入文件夹）。

### 4.3 灌历史数据

| 动作 | Actions | 参数 |
|------|---------|------|
| 周报回填 | **SEO weekly report** | `backfill_weeks` = **12** |
| 日报 | **SEO daily report** | 直接 Run（会把 Git 里已有 daily JSON 全同步进表） |

### 4.4 之后自动

| 任务 | 时间（北京） | 做什么 |
|------|-------------|--------|
| 日报 | 每天 17:00 | 拉昨日 GA4 → **日报汇总** 追加/更新一行 |
| 周报 | 每周一 17:30 | 拉上一完整周 → **周报汇总** 追加/更新一行 |

`sync` **不会**新建表格。

---

## 5. 表格结构

列名规则：**`[数据源·统计窗口]` + 指标名**，例如 `[GA4·单日] 活跃用户`、`[GSC·滚动28日] 展示`。  
API 拉数失败或该窗口无数据 → **留空**，不填 0、不估算。

### 日报 Sheet

| Sheet | 内容 |
|-------|------|
| 日报汇总 | 单日 GA4 + 滚动7日 + GSC(28d/7d) + 渠道 + 质量 + 错误列 |
| 日报-维度明细 | 单日/滚动7日 × 渠道/国家/来源/着陆页/页面/设备 |
| 日报-国家×渠道 | 单日 + 滚动7日 |
| 日报-GSC查询词 / 页面 | GSC 滚动28日 + 滚动7日 Top 词/页 |

### 周报 Sheet

| Sheet | 内容 |
|-------|------|
| 周报汇总 | 自然周 GA4 + 渠道 + 质量 + GSC + WoW% + 错误列 |
| 周报-维度明细 | 渠道/国家/来源/着陆页/页面/设备 |
| 周报-国家×渠道 | 国家 × 渠道交叉 |
| 周报-GSC查询词 / 页面 / 国家 / 设备 | GSC 自然周多维 Top |

Git：`docs/seo/metrics/daily-*.json`、`weekly-*.json`  
索引：`docs/seo/feishu-sheet.json`

---

## 6. 优化追踪 doc（可选）

```bash
python3 scripts/seo_feishu_journal.py init
```

日报成功后仍可在追踪 doc 顶部追加快照；与表格无关。

---

## 7. 排错

| 现象 | 处理 |
|------|------|
| 表没更新 | 查 `FEISHU_SHEET_TOKEN` + 应用权限已发布 |
| 又多一张表 | 勿重复 `init`；Secret 必须固定 |
| 日报 Sheet 空 | 先跑 SEO daily 生成 `daily-*.json`，或手动 `python3 scripts/seo_feishu_daily_sheet.py sync` |

---

## 8. 脚本

| 脚本 | 作用 |
|------|------|
| `seo_feishu_daily_sheet.py` | 日报 → 表格 |
| `seo_feishu_weekly_sheet.py` | 周报 → 同一张表格 |
| `seo-daily.yml` / `seo-weekly.yml` | 自动跑 |
