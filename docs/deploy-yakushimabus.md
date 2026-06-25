# 部署：yakushimabus.com（GitHub Pages）

纯静态站，无构建步骤；推送 `main` 分支根目录即可。

## 阶段 A：实名审核期间（现在就能做）

域名在腾讯云实名审核时，**先用 GitHub 默认地址上线**，不耽误开发。

1. **推送最新代码**
   ```bash
   cd "/Users/yimleung/手搓程序/Yakushima-bus"
   git add -A && git commit -m "design v3 + deploy notes"   # 有改动时
   git push origin main
   ```

2. **开启 Pages**  
   仓库 `yimleunggggg/Yakushima-bus` → **Settings → Pages**  
   - Source：`Deploy from a branch`  
   - Branch：`main` / **/** (root)  
   - Custom domain：**先可留空**（填了 `yakushimabus.com` 会报 DNS 错，正常，等阶段 B）

3. **预览地址**（约 1～2 分钟生效）  
   **https://yimleunggggg.github.io/Yakushima-bus/**

4. Custom domain 报 `InvalidDNSError` → **忽略**，等域名实名通过后再配 DNS。

---

## 阶段 B：腾讯云实名通过 + 域名生效后

### 1. 完成购买

腾讯云 → 域名注册 → 确认 `yakushimabus.com` 状态为 **已注册**。

### 2. DNSPod 解析（腾讯云控制台 → 域名 → 解析）

| 记录类型 | 主机记录 | 记录值 | TTL |
|----------|----------|--------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |

可选 www：

| CNAME | www | yimleunggggg.github.io | 600 |

### 3. GitHub 绑定域名

Settings → Pages → Custom domain 填 **`yakushimabus.com`** → **Save** → 等 10～30 分钟 **Check again** 变绿 → 勾选 **Enforce HTTPS**。

仓库根目录已有 `CNAME`（内容为 `yakushimabus.com`），与 Pages 设置一致即可。

---

## 1. 首次推送到 GitHub（已完成可跳过）

```bash
cd "/Users/yimleung/手搓程序/Yakushima-bus"

# 若尚未 init（已 init 可跳过）
git init
git add .
git commit -m "Initial deploy: Yakushima bus timetable tool"

# 在 GitHub 新建空仓库，例如 Yakushima-bus（不要勾选 README）
git branch -M main
git remote add origin https://github.com/你的用户名/Yakushima-bus.git
git push -u origin main
```

## 2. 开启 GitHub Pages

仓库 → **Settings** → **Pages**

| 项 | 值 |
|----|-----|
| Source | Deploy from a branch |
| Branch | `main` / **/** (root) |
| Custom domain | `yakushimabus.com` |

保存后勾选 **Enforce HTTPS**（DNS 生效后才会出现，稍后再开也行）。

仓库根目录已有 `CNAME`（内容为 `yakushimabus.com`），Pages 会自动识别。

## 3. 域名 DNS（在域名注册商处配置）

### 根域名 `yakushimabus.com`（必选）

添加 **4 条 A 记录**，均指向 GitHub Pages：

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### 可选：`www.yakushimabus.com`

| 类型 | 主机 | 值 |
|------|------|-----|
| CNAME | www | `你的用户名.github.io` |

在 GitHub Pages 自定义域名里也可填 `www.yakushimabus.com`；若只用根域名，可在注册商把 www 301 跳到根域名。

DNS 传播通常 **10 分钟～48 小时**。GitHub 仓库 **Settings → Pages** 会显示 DNS 检查状态。

## 4. 验证

```bash
dig yakushimabus.com +short
# 应看到上述四个 IP 之一

curl -I https://yakushimabus.com
# 200，且证书有效
```

浏览器访问：

- https://yakushimabus.com/index.html
- https://yakushimabus.com/map.html

## 5. 日后更新

```bash
python3 scripts/build_all.py   # 改数据后
git add -A
git commit -m "update timetable data"
git push
```

Pages 约 1～2 分钟自动更新。

## 6. 常见问题

| 问题 | 处理 |
|------|------|
| 404 | 见下方 **§6.1 全站 404 排查** |
| 域名未生效 | 等 DNS；不要用 Cloudflare「仅 DNS」以外的错误代理模式（可先 DNS only） |
| HTTPS 灰掉 | 等 DNS 全生效后再开 Enforce HTTPS |
| PDF 本地 assets | `.gitignore` 已忽略 `*.pdf`；线上 PDF 走官方 URL，正常 |

### 6.1 全站 404 排查（给 Agent / 日后自用）

**典型现象**：`yakushimabus.com` 四页均 404；浏览器标题 **「Site not found · GitHub Pages」**；GSC「测试实际网址」Live 404；Deployments 仍显示几天前成功（历史记录，不代表当前可访问）。

**诊断命令**（任意 Agent 可跑）：

```bash
curl -sI https://yakushimabus.com/ | head -3
curl -sI "https://raw.githubusercontent.com/yimleunggggg/Yakushima-bus/main/index.html" | head -3
python3 scripts/seo_site_uptime.py
```

| 结果组合 | 含义 |
|----------|------|
| 自定义域 404 + raw **200** | 代码在 GitHub，**Pages 未发布**（常见：仓库曾改 Private） |
| 自定义域 404 + raw **404** | 仓库仍 Private，或分支/路径不对 |
| 均 200 | 正常 |

**根因（2026-05 实际案例）**：免费版 GitHub **Private 仓库不能托管 Pages**。改 Public 后 **不会自动恢复**，须手动重新启用。

**修复步骤**：

1. 仓库 → **Settings → General → Danger Zone** → 确认 **Public**
2. **Settings → Pages** → Source：`Deploy from a branch` → Branch：**main** / **/ (root)** → **Save**
3. Custom domain 填 **`yakushimabus.com`** → Save（根目录 `CNAME` 已存在）
4. 等 2～5 分钟，顶部出现绿色 **Your site is live at…**
5. 再跑 `python3 scripts/seo_site_uptime.py`，四页应 **200**
6. GSC → URL 检查 →「测试实际网址」确认 Live 200；必要时重新请求编入索引

**监控**：SEO 日报 Actions 第一步会跑 `seo_site_uptime.py`，非 200 发 ntfy **urgent**。见教程 [06-日报与优化追踪](https://github.com/yimleunggggg/vibe-coding-static-site-guide/blob/main/seo/tutorial/06-日报与优化追踪.md)。

**DNS 说明**：腾讯云仅 2 条 A 记录（`185.199.108/109.153`）通常够用，**不是**本次 404 主因。

## 7. 备选（不用 GitHub Pages 时）

- **Cloudflare Pages**：连同一 GitHub 仓库，Build command 留空，Output `/`
- **Vercel**：Import 项目，Framework Preset = Other，Root = `./`

自定义域名同样在面板里填 `yakushimabus.com`，DNS 按平台提示即可。
