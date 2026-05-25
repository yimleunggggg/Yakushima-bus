# 飞书文档自动归档（日报）

每日 Actions 在生成 Markdown 后，可自动在飞书云空间 **新建一篇文档**。

## 1. 飞书开放平台

1. 打开 [飞书开放平台](https://open.feishu.cn/app) → **创建企业自建应用**
2. **权限** → 开通：
   - `docx:document`（创建、编辑文档）
   - `drive:drive`（访问云空间文件夹）
3. **凭证** → 复制 **App ID**、**App Secret**
4. **版本管理与发布** → 发布应用（企业内可用即可）

## 2. 文件夹 token

1. 飞书 **云文档** 建文件夹，如 `Yakushima SEO 日报`
2. 浏览器打开该文件夹，URL 含 `folder/` 后的 token，或右键分享链接中的 `fldcn...`
3. 把应用 **添加为文件夹协作者**（可编辑）

## 3. GitHub Secrets

| Secret | 值 |
|--------|-----|
| `FEISHU_APP_ID` | 应用 App ID |
| `FEISHU_APP_SECRET` | 应用 App Secret |
| `FEISHU_FOLDER_TOKEN` | 文件夹 token |

未配置时：日报仍写入 Git `docs/seo/reports/daily/`，仅跳过飞书。

## 4. 链接索引

成功发布后写入 `docs/seo/feishu-links.json`：

```json
{
  "2026-05-22": {
    "url": "https://feishu.cn/docx/xxxx",
    "title": "Yakushima Bus 日报 2026-05-22"
  }
}
```

## 5. 本地测试

```bash
bash scripts/seo_report_daily.sh 2026-05-22
export FEISHU_APP_ID=...
export FEISHU_APP_SECRET=...
export FEISHU_FOLDER_TOKEN=...
python3 scripts/seo_feishu_doc.py docs/seo/reports/daily/2026-05-22.md
```

---

## 6. SEO 优化追踪（长文档，推荐）

与「每天一篇日报」分开，**一篇飞书文档长期滚动**，对应 Git：`docs/seo/SEO-JOURNAL.md`

| 内容 | 说明 |
|------|------|
| GSC 查询词 / 索引状态 | 怎么读、其他页面怎么请求编入索引 |
| 优化过程时间线 | Round 1/2 做了什么 |
| 效果快照表 | 每日 Actions 自动追加一行 |

### 首次创建飞书文档

```bash
export FEISHU_APP_ID=...
export FEISHU_APP_SECRET=...
export FEISHU_FOLDER_TOKEN=...   # 建议文件夹：YakuBus SEO
python3 scripts/seo_feishu_journal.py init
```

成功后写入 `docs/seo/feishu-journal.json`（含文档 URL）。  
若你**已在飞书建好文档**，只填 Secret **`FEISHU_JOURNAL_DOC_ID`**（URL 里 docx 后面那段），再跑 `init` 只会往该 doc 追加内容。

### 日常行为

- 每日日报成功后 → 自动在追踪文档 **顶部** 追加「YYYY-MM-DD 快照」
- 大改追踪文档后 → `python3 scripts/seo_feishu_journal.py sync-full` 把 Git 全文 prepend 到飞书

### 文档放哪

飞书云空间 → 文件夹 **`YakuBus SEO`** → 文档 **`YakuBus SEO 优化追踪`**（与日报同文件夹即可，**两个 doc**：日报每天新建，追踪只这一篇）
