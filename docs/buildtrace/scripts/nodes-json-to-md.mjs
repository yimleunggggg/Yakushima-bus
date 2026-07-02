import fs from "node:fs/promises";

const input = process.argv[2] || "data/nodes.json";
const output = process.argv[3] || "templates/PROJECT-NODES.generated.md";

const raw = await fs.readFile(input, "utf8");
const data = JSON.parse(raw);
const nodes = data.nodes || [];
const externalEvents = data.externalEvents || [];
const project = data.project || {};
const resources = project.resources || [];

const lines = [
  "# 项目节点",
  "",
  "由 BuildTrace `nodes.json` 生成。",
  "",
  "按时间倒序排列，最新节点在最前。",
  "",
  "---",
  "",
  "## 项目入口",
  ""
];

if (resources.length) {
  for (const resource of resources) {
    const category = resourceCategoryLabel(resource.category);
    const title = resource.title || resource.name || "未命名入口";
    const url = resource.url || resource.path || "";
    const note = resource.note || resource.description || "";
    lines.push(`- ${category} - ${url ? `[${title}](${url})` : title}${note ? `：${note}` : ""}`);
  }
} else {
  lines.push("- 暂无。");
}

lines.push(
  "",
  "---",
  "",
  "## 待回看/待补结果",
  ""
);

const pending = nodes.filter(node => node.review?.result === "pending" || node.status === "pending-review");
if (pending.length) {
  for (const node of pending) {
    lines.push(`- ${node.reviewDue || node.review_due || "无日期"} - ${node.title}`);
  }
} else {
  lines.push("- 暂无。");
}

lines.push("", "---", "", "## 节点", "");

for (const node of nodes) {
  const humanIntent = node.humanIntent || {};
  const review = node.review || {};
  const changes = node.changes || {};
  const technical = node.technical || {};
  const detail = node.scenarioDetail || {};
  const scenario = node.scenario || (node.types || [])[0] || "";
  const nodeEvents = [...(node.externalEvents || []), ...externalEvents.filter(event => event.nodeId === node.id)];

  lines.push(
    `## ${node.date} - ${node.title}`,
    "",
    `**status**: ${statusLabel(node.status)} (${node.status || ""})`,
    `**scenario**: ${scenarioLabel(scenario)} (${scenario})`,
    `**type**: ${(node.types || []).map(type => `${typeLabel(type)} (${type})`).join(", ")}`,
    `**review_due**: ${node.reviewDue || node.review_due || "none"}（建议回看日，不是审核）`,
    `**date_confidence**: ${dateConfidenceLabel(node.dateConfidence)} (${node.dateConfidence || "unknown"})`,
    `**hidden**: ${node.hidden ? "true" : "false"}`,
    `**doc_ref**: ${node.docRef || node.doc_ref || "../PROJECT-NODES.md"}`,
    "",
    "### 当时为什么做",
    `- 原话: ${humanIntent.original || "未捕捉。"}`,
    `- 理解/提炼: ${humanIntent.interpretation || "需要补当时为什么做。"}`,
    `- 可信度: ${confidenceLabel(humanIntent.confidence)} (${humanIntent.confidence || "not-captured"})`,
    "",
    "### 人话摘要",
    `- 发生了什么: ${node.plainSummary || humanIntent.interpretation || ""}`,
    `- 为什么重要: ${detail.opportunity || detail.problem || review.watch || ""}`,
    "",
    "### 场景细节",
    `- 问题/机会: ${detail.problem || detail.opportunity || ""}`,
    `- 这一轮解决方案: ${detail.solution || ""}`,
    `- 成功信号: ${detail.successSignal || review.watch || ""}`,
    `- 风险/未解决: ${detail.risk || ""}`,
    "",
    "### 项目变化",
    `- 加了: ${list(changes.added)}`,
    `- 改了: ${list(changes.changed)}`,
    `- 减去了: ${list(changes.removed)}`,
    `- 优化了: ${list(changes.optimized)}`,
    "",
    "### 技术实现",
    `- 技术备注: ${node.technicalNote || ""}`,
    `- 相关文件: ${list(technical.files)}`,
    `- 数据或结构: ${technical.schema || ""}`,
    `- 架构/配置: ${technical.architecture || ""}`,
    `- 验证: ${technical.validation || ""}`,
    "",
    "### 依据/来源",
    `- sourceRefs: ${list(node.sourceRefs || node.source_refs)}`,
    `- evidence: ${evidenceList(node.evidence)}`,
    `- 日期依据: ${dateConfidenceLabel(node.dateConfidence)} (${node.dateConfidence || "unknown"})`,
    "",
    "### 用户备注",
    `- ${list(node.userNotes || node.user_notes)}`,
    "",
    "### 外部时间线",
    `- GA4/PostHog: ${externalEventList(nodeEvents, ["ga4", "posthog"])}`,
    `- GitHub/Vercel: ${externalEventList(nodeEvents, ["github", "vercel"])}`,
    `- Stripe/交易: ${externalEventList(nodeEvents, ["stripe"])}`,
    `- 手填/其他: ${externalEventList(nodeEvents, ["manual", "other"], true)}`,
    "",
    "### 结果回看",
    `- 回看时观察什么: ${review.watch || ""}`,
    `- 当前结果: ${resultLabel(review.result)} (${review.result || "pending"})`,
    `- 经验/结论: ${review.learning || ""}`,
    "",
    "---",
    ""
  );
}

if (externalEvents.length) {
  lines.push("", "---", "", "## 独立外部时间线", "");
  for (const event of externalEvents.slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))) {
    lines.push(`- ${event.date || "unknown"} [${event.source || "manual"}] ${event.title || ""}${event.value ? ` - ${event.value}` : ""}${event.note ? `（${event.note}）` : ""}`);
  }
}

await fs.writeFile(output, lines.join("\n"), "utf8");
console.log(`Wrote ${output}`);

function list(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.length ? value.join("; ") : "";
  return String(value);
}

function evidenceList(value) {
  if (!value) return "";
  const items = Array.isArray(value) ? value : [value];
  return items.map(item => {
    if (!item) return "";
    if (typeof item === "string") return item;
    const parts = [item.kind, item.ref, item.note || item.supports].filter(Boolean);
    return parts.join(": ");
  }).filter(Boolean).join("; ");
}

function externalEventList(events, sources, includeOthers = false) {
  const sourceSet = new Set(sources);
  const list = events.filter(event => {
    const source = String(event.source || "manual").toLowerCase();
    if (includeOthers) return !["ga4", "posthog", "github", "vercel", "stripe"].includes(source) || sourceSet.has(source);
    return sourceSet.has(source);
  });
  if (!list.length) return "暂无";
  return list.map(event => {
    const parts = [
      event.date,
      event.title,
      event.value,
      event.url,
      event.note
    ].filter(Boolean);
    return parts.join(" - ");
  }).join("; ");
}

function statusLabel(value) {
  return {
    "pending-review": "待回看",
    reviewed: "已回看",
    backfilled: "已补录",
    "needs-user-context": "待补原因"
  }[value] || value || "";
}

function confidenceLabel(value) {
  return {
    "confirmed-by-user": "用户已确认",
    inferred: "根据证据推断",
    "not-captured": "未捕捉原话"
  }[value] || value || "未捕捉原话";
}

function resultLabel(value) {
  return {
    pending: "待回填",
    worked: "有效",
    "did-not-work": "无效/有害",
    unclear: "不确定",
    "not-needed": "无需回看"
  }[value] || value || "待回填";
}

function typeLabel(value) {
  return {
    feature: "功能",
    experiment: "实验",
    optimization: "优化",
    bugfix: "修复",
    data: "数据",
    architecture: "架构",
    content: "内容",
    seo: "SEO",
    monetization: "变现",
    ops: "运维",
    decision: "决策",
    snapshot: "快照",
    ux: "体验",
    analytics: "分析",
    acquisition: "获客"
  }[value] || value;
}

function scenarioLabel(value) {
  return {
    feature: "功能新增",
    bugfix: "Bug 修复",
    optimization: "优化",
    experiment: "实验",
    "analytics-data": "数据/埋点",
    "growth-seo": "SEO/增长",
    monetization: "变现/交易",
    architecture: "架构/重构",
    content: "内容/文案",
    "ops-release": "运维/发布",
    "app-mobile": "App",
    "ai-prompt": "AI/提示词",
    "security-privacy": "安全/隐私",
    decision: "决策",
    snapshot: "快照"
  }[value] || value || "";
}

function dateConfidenceLabel(value) {
  return {
    "commit-exact": "commit 日期明确支持",
    "doc-exact": "文档日期明确支持",
    "user-confirmed": "用户确认",
    "date-inferred": "根据证据推断日期",
    unknown: "日期不确定"
  }[value] || "日期不确定";
}

function resourceCategoryLabel(value) {
  return {
    code: "代码",
    docs: "文档",
    reference: "参考",
    data: "数据",
    deploy: "部署",
    finance: "交易",
    admin: "后台",
    design: "设计",
    other: "其他"
  }[value] || "其他";
}
