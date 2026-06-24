# 飞书集成配置（日报 · 追踪 · 周报表）

YakuBus SEO 自动化会往飞书写 **三类内容**，用途不同：

| 产物 | 飞书形态 | 更新方式 | 脚本 / Workflow |
|------|----------|----------|-----------------|
| **日报** | 云文档，**每天新建一篇** | 追加当日 Markdown | `seo_feishu_doc.py` · `seo-daily.yml` |
| **优化追踪** | 云文档，**固定一篇**长期滚动 | 日报成功后顶部追加快照 | `seo_feishu_journal.py` · `seo-daily.yml` |
| **周报数据** | 电子表格，**固定一张**永久复用 | 每周更新/覆盖当周行 | `seo_feishu_weekly_sheet.py` · `seo-weekly.yml` |

未配置飞书 Secrets 时：数据仍写入 Git（`docs/seo/reports/daily/`、`docs/seo/metrics/`），仅跳过飞书同步。

---

## 1. 一次性：飞书开放平台

1. 打开 [飞书开放平台](https://open.feishu.cn/app) → **创建企业自建应用**（或复用已有）
2. **权限** → 一次性开通全部：
   - `docx:document` — 日报、追踪文档
   - `sheets:spreadsheet` — 周报表格
   - `drive:drive` — 访问云空间文件夹
3. **凭证** → 复制 **App ID**、**App Secret**
4. **版本管理与发布** → 发布应用（企业内可用即可）

---

## 2. 一次性：云空间文件夹

1. 飞书 **云文档** 建文件夹，建议名 **`YakuBus SEO`**
2. 浏览器打开该文件夹，从 URL 取 token（`folder/` 后或 `fldcn...` 那段）
3. 把应用 **添加为文件夹协作者**（可编辑）

---

## 3. GitHub Secrets（飞书相关）

| Secret | 必填 | 用途 |
|--------|------|------|
| `FEISHU_APP_ID` | 是 | 应用 App ID |
| `FEISHU_APP_SECRET` | 是 | 应用 App Secret |
| `FEISHU_FOLDER_TOKEN` | 是 | 云空间文件夹 token |
| `FEISHU_SHEET_TOKEN` | **周报必填** | 固定周报表 token；`sync` 只更新这一张，**不会新建** |
| `FEISHU_JOURNAL_DOC_ID` | 可选 | 已有追踪文档时填 docx ID，跳过自动创建 |

GA4/GSC 拉数另需：`GOOGLE_SERVICE_ACCOUNT_JSON`、`GOOGLE_OAUTH_CLIENT_JSON`、`GOOGLE_OAUTH_REFRESH_TOKEN`、`GA4_PROPERTY_ID`、`GSC_SITE_URL`（见 [GOOGLE_SETUP.md](GOOGLE_SETUP.md)）。

---

## 4. 推荐配置顺序（照着做）

### 4.1 日报 + 追踪（可选，已有可跳过）

```bash
export FEISHU_APP_ID=...
export FEISHU_APP_SECRET=...
export FEISHU_FOLDER_TOKEN=...

# 追踪长文档（只做一次）
python3 scripts/seo_feishu_journal.py init
# → docs/seo/feishu-journal.json
```

日报由 Actions 每日自动 `seo_feishu_doc.py`，无需手动。链接索引：`docs/seo/feishu-links.json`。

### 4.2 周报表格（长期趋势，重点）

**目标**：一张表、每周一行，看 GA4/GSC 提升与波动。

#### A. 创建表格（只做一次，二选一）

**方式 1 — 脚本创建（推荐）**

```bash
export FEISHU_APP_ID=...
export FEISHU_APP_SECRET=...
export FEISHU_FOLDER_TOKEN=...
export GA4_PROPERTY_ID=538426834

python3 scripts/seo_fetch_weekly.py --backfill 12   # 可选：先拉 12 周 JSON
python3 scripts/seo_feishu_weekly_sheet.py init     # 创建「YakuBus SEO 周报」
```

**方式 2 — 手动建表**

飞书新建电子表格「YakuBus SEO 周报」→ URL 里 `shtcn...` 即为 token。

#### B. 绑定 token（必做）

1. 把表格 token 写入 GitHub Secret **`FEISHU_SHEET_TOKEN`**
2. `init` 会生成 `docs/seo/feishu-sheet.json`，**commit 进仓库**（Actions 靠它 + Secret 认表）

#### C. 首次灌数据

GitHub → **Actions → SEO weekly report → Run workflow**

- `backfill_weeks` 填 **12**（回填历史）
- 成功后打开飞书表格，「周报汇总」应有数据行

#### D. 之后

- **每周一 17:30 北京时间** 自动 `sync`，更新**同一张表**
- 手动补跑：再点 Run workflow（`backfill_weeks` 留空 = 只拉上一完整周）
- `sync` **绝不会**新建表格；缺 `FEISHU_SHEET_TOKEN` 会跳过并打日志

本地手动更新同一张表：

```bash
export FEISHU_SHEET_TOKEN=你的表格token
python3 scripts/seo_fetch_weekly.py          # 或 --backfill N
python3 scripts/seo_feishu_weekly_sheet.py sync
```

---

## 5. 周报表格结构

| Sheet | 内容 |
|-------|------|
| 周报汇总 | 每周一行：GA4 全量 + 可分析用户 + GSC + WoW 环比 |
| 渠道 / 国家 / 国家×渠道 / 来源媒介 / 着陆页 / 设备 | 明细（周次 × 维度） |
| GSC查询词 / GSC页面 | 每周 Top 词与页面 |

Git 存档：`docs/seo/metrics/weekly-YYYY-Www.json`  
表格索引：`docs/seo/feishu-sheet.json`

---

## 6. 日报 · 追踪 · 索引文件

### 日报（每天一篇 doc）

- Workflow：`seo-daily.yml`（每日 09:00 UTC）
- 成功链接：`docs/seo/feishu-links.json`

本地试跑：

```bash
bash scripts/seo_report_daily.sh
python3 scripts/seo_feishu_doc.py docs/seo/reports/daily/YYYY-MM-DD.md
```

### 优化追踪（一篇 doc 滚动）

- 对应 Git：`docs/seo/SEO-JOURNAL.md`
- 索引：`docs/seo/feishu-journal.json`
- 日报成功后自动在文档**顶部**追加当日快照
- 大改追踪内容后：`python3 scripts/seo_feishu_journal.py sync-full`

### 云空间建议布局

```
YakuBus SEO/
├── YakuBus SEO 优化追踪.docx    ← 固定一篇
├── YakuBus SEO 周报.sheet       ← 固定一张
└── Yakushima Bus 日报 YYYY-MM-DD.docx  ← 每天新建
```

---

## 7. 排错

| 现象 | 处理 |
|------|------|
| 周报飞书没更新 | 查 `FEISHU_SHEET_TOKEN`；应用是否对文件夹/表格可编辑 |
| 每周多一张新表 | 不应发生；确认 Actions 跑的是 `sync` 不是重复 `init`；Secret 必须固定 |
| 表格有旧行残留 | 已自动清多余行；仍异常可手动删行后重跑 `sync` |
| 权限 99991672 / 403 | 开放平台补权限并**重新发布**应用 |
| 本地 GA4 503 | 正常，用 GitHub Actions 跑 weekly workflow |

---

## 8. 相关文件

| 文件 | 说明 |
|------|------|
| `scripts/seo_feishu_doc.py` | 日报 → 飞书 doc |
| `scripts/seo_feishu_journal.py` | 追踪 doc |
| `scripts/seo_fetch_weekly.py` | 拉 GA4/GSC 日历周 |
| `scripts/seo_feishu_weekly_sheet.py` | 周报 → 飞书表格（`init` 一次 / `sync` 每周） |
| `.github/workflows/seo-daily.yml` | 日报 |
| `.github/workflows/seo-weekly.yml` | 周报 |
