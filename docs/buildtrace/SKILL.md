---
name: buildtrace
description: Capture and maintain project-node memory for AI-assisted development. Use this when a user ships, changes, reviews, backfills, or discusses meaningful project work, so the agent records human intent, project changes, technical implementation, evidence, and later outcomes without losing context across conversations.
---

# BuildTrace

BuildTrace is a project causal-memory system for AI-assisted development.

Use it to preserve the moments where human intent, project direction, implementation, evidence, and later outcome follow-up meet.

When a task involves scenario-specific node design, old-project backfill, bugfix logging, feature logging, growth/SEO, monetization, analytics, app/mobile, AI prompts, security/privacy, or title quality, read `references/scenarios.md` before writing or repairing nodes.

When a task involves GA4, GitHub, Vercel, PostHog, Stripe, metrics overlays, external data exports, or third-party timeline adapters, read `references/integrations.md` before designing or importing external events.

When a task involves restoring context, recording the current round, reviewing a date range, filling missing intent, designing hooks/rules/memory, or avoiding heavy manual forms, read `references/agent-workflow.md`.

When a task involves evidence, dates, screenshots, commit/push/deploy facts, source links, user corrections, hidden nodes, or claims that may be fabricated, read `references/evidence-policy.md` before writing or changing nodes.

When a task involves long-term usage, dashboard sync, user edits, hiding/deleting nodes, manual notes, or whether the viewer writes back to project files, read `references/lifecycle.md`.

When the user mentions project archive links, bookmarks, GitHub links, reference materials, original docs, analytics dashboards, deployment dashboards, payment/admin tools, or "a place to collect project-related things", maintain `project.resources` in `nodes.json` and the "Project archive / entry points" section in `PROJECT-PROFILE.md`.

The goal is not to write a beautiful diary. The goal is to help a future human or agent answer:

- What happened at this project node?
- Why did the human think it was worth doing?
- What exactly changed in the product?
- What changed technically?
- What evidence existed then?
- What should be checked later?
- What happened after follow-up?

## Product stance

BuildTrace must not become a heavy form that interrupts coding.

Use it in four moments:

1. Context restore: before meaningful work in an existing project, read the project profile and recent nodes.
2. Node capture: after a meaningful task, deployment, bugfix, experiment, decision, or user-stated intent, write one concise node.
3. Data review: when the user reviews traffic, events, revenue, errors, deploys, or product outcomes, overlay project nodes with imported external timelines and update outcomes.
4. Correction: when the user says a node is wrong, unnecessary, or incomplete, correct it, hide it, or add a note without destroying history by default.

During active project work, keep only a temporary mental intent buffer. Do not stop the user to fill a long template unless missing context is necessary for the current decision.

Manual user input is expected and valuable. BuildTrace can reconstruct facts from files, commits, deploys, events, and exports, but it cannot reconstruct the user's original motive when chats or notes are unavailable. Ask the user only for high-leverage missing intent, result judgment, or private data that cannot be safely accessed.

The default interaction is Agent-drafted, user-confirmed:

- Agent drafts the node from conversation signals, file changes, git, docs, screenshots, and external events.
- User confirms, corrects, or adds one short missing human judgment.
- Agent writes the structured node and regenerates the readable Markdown.

Do not ask the user to fill a long form unless the user explicitly wants manual entry.

Do not promise full automation. BuildTrace combines:

- automatic facts: files, git commits, deploys, events, screenshots, exported metrics
- human meaning: original words, judgment, hypothesis, tradeoff, result interpretation
- evidence confidence: what is confirmed, inferred, missing, or not accessible

Do not invent. Every factual claim should point to at least one human-checkable source in `sourceRefs`, `evidence`, `docRef`, or `externalEvents`. If the source is missing, mark the node as inferred, unknown, or needing user context instead of writing it as fact.

## Primary interaction modes

Use these as the main mental model for vibe coding users:

- Restore context: read project profile, recent nodes, pending reviews, and missing intent before continuing work.
- Record this round: after meaningful work, automatically draft a node and ask for only high-value corrections.
- Review a date range: overlay project nodes with external facts and update outcomes.
- Fill missing intent: ask short questions only for important nodes where files cannot recover human motive.

The dashboard should support these modes visually, but the real product behavior lives in the Agent workflow.

## Core model

Each node must separate:

- human-readable summary: plain language for operators, founders, creators, product people, and non-programmers
- technical note: implementation detail for engineers and future agents
- scenario detail: fields that depend on whether this is a feature, bugfix, experiment, analytics change, monetization change, architecture change, and so on
- external timeline events: imported facts from tools such as GA4, GitHub, Vercel, PostHog, Stripe, crash/error tools, or user-provided CSV/JSON exports
- evidence and confidence: where the claim came from and how certain it is
- source refs and document refs: where to inspect the underlying record later
- user control: optional user notes, hidden state, correction history, and non-destructive edits
- project resources: stable project entry points such as GitHub, docs, references, data platforms, deploy dashboards, payment dashboards, design files, and admin tools

Do not mix all of these into one paragraph. The outer title and summary should be easy to scan. Put implementation details in the technical section.

Project resources are not nodes and not evidence by themselves. They are a small project archive / resource shelf that helps users jump back to important places while reviewing the project. Store only user-provided or workspace-obvious links and paths. Do not store secrets, tokens, private customer data, or credentials.

## Language policy

Default to the user's working language. If the user writes Chinese or the project is primarily Chinese, all human-facing output must be Chinese first.

Chinese-first means:

- write node titles in Chinese
- write `humanIntent.interpretation` in Chinese
- write project changes, technical summaries, evidence descriptions, follow-up signals, learnings, and backfill reports in Chinese
- write `PROJECT-NODES.md` headings and prose in Chinese
- answer the user in Chinese unless they ask otherwise

Keep stable machine values in English only where the schema requires them, such as `pending-review`, `confirmed-by-user`, `needs-user-context`, `feature`, `seo`, `worked`, and file paths or commands. Do not expose those raw enum values as the main user-facing wording when a Chinese label is available.

Keep original words in their original language. If the original words are English but the user works in Chinese, preserve the original under `original`, then add a Chinese interpretation.

Never produce mixed-language user-facing reports like "confirmed-by-user（2 条）" or "needs-user-context（5 条）" as the primary label. Write "用户已确认（2 条）" and include the raw enum only in parentheses if needed for debugging.

If an existing `nodes.json` is mixed-language and the user complains about it, run a language repair pass:

1. Keep stable fields unchanged: `id`, `date`, `status`, `types`, `reviewDue`, file paths, URLs, commit hashes, command names, and schema enum values.
2. Rewrite human-facing fields into the user's working language: `title`, `humanIntent.interpretation`, `changes.*`, `technical.schema`, `technical.architecture`, `technical.validation`, `evidence` descriptions, `review.watch`, and `review.learning`.
3. Preserve `humanIntent.original` exactly unless it is a generated placeholder like `Not captured.`, which may become `未捕捉。`.
4. Regenerate `PROJECT-NODES.md` after repairing `nodes.json`.
5. Report how many nodes were language-repaired.

## Capability boundaries

Be explicit about what BuildTrace can and cannot reconstruct.

BuildTrace can use:

- current workspace files
- git history available in the current repository
- local GitHub metadata already present in the repository, such as remotes, branches, pull request refs, issue references in commits, and copied issue notes
- existing docs, notes, changelogs, OPS journals, TODOs, issue notes, screenshots, and exported data files
- chat excerpts or exported chat histories that the user provides or that are present as files in the workspace
- external timeline exports supplied as files, such as GA4 metrics CSV/JSON, GitHub PR/release exports, Vercel deployment exports, PostHog event/funnel exports, Stripe event/payment exports, error logs, uptime logs, or manually created timeline rows

BuildTrace cannot reliably use:

- compressed chat context that no longer exists in the current conversation
- Cursor, Claude, or ChatGPT side-panel histories unless the tool/session exposes them as readable files or the user exports/provides them
- private analytics, admin dashboards, production data, or screenshots unless the user grants access or supplies exports
- remote GitHub issues, pull requests, Actions logs, releases, or discussions unless the agent has an installed GitHub connector, `gh` access, or explicit permission to query the network
- GA4, PostHog, Stripe, Vercel, GitHub, or other private SaaS data unless the user grants connector/API access or provides exports

When reporting a backfill, always state:

- source files inspected
- git date range inspected
- earliest recovered node date
- number of user-confirmed, inferred-from-evidence, and missing-intent nodes
- important missing sources
- number of nodes with `commit-exact`, `doc-exact`, `user-confirmed`, `date-inferred`, and `unknown` date confidence
- imported external timeline sources, date ranges, and whether they were API-connected, CLI-connected, or user-provided exports

Do not say "all history restored" unless all available history sources for the requested range were inspected.

If a date is not directly supported by evidence, do not write it as fact. Mark `dateConfidence` as `date-inferred` or `unknown`, cite the source, and ask the user when the date matters. Never convert "the repo started on 2026-05-20" into "this feature launched on 2026-05-20" without evidence.

If the user works in Chinese, use these report labels:

- `confirmed-by-user` -> `用户已确认`
- `inferred` -> `根据证据推断`
- `not-captured` -> `未捕捉原话`
- `needs-user-context` -> `待补原因`
- `pending-review` -> `待回看/待补结果`
- `reviewed` -> `已回看`
- `backfilled` -> `已补录`
- `reviewDue` -> `建议回看日`
- `worked` -> `有效`
- `did-not-work` -> `无效/有害`
- `unclear` -> `不确定`
- `not-needed` -> `无需回看`

## When to use

Use BuildTrace when the user:

- finishes or deploys a meaningful feature, page, flow, integration, prompt, data, SEO, analytics, monetization, onboarding, reliability, or architecture change
- asks to record progress, write a project log, summarize a node, preserve intent, remember why something was done, restore context, review outcomes, or backfill old work
- expresses a decision reason, concern, hypothesis, reference, constraint, exclusion, future direction, or review signal that may matter later
- looks at data and asks what changed around a date or version
- starts work in an existing AI-built project where history is scattered across commits, docs, chats, and screenshots
- imports or asks to overlay GA4, GitHub, Vercel, PostHog, Stripe, revenue, product analytics, deploy, issue, or event timelines

Do not use it for tiny typo fixes, purely internal cleanup, or casual conversation unless the user explicitly asks to preserve it.

## Files

Default project location:

```text
docs/buildtrace/
  nodes.json
  PROJECT-NODES.md
  PROJECT-PROFILE.md
  evidence/
  external-events.json
```

If there is no `docs/` directory, create `buildtrace/` at the project root.

## Core behavior

### 1. Capture human signals while the user speaks

When the conversation is about a concrete project, change, review, data question, or decision, quietly watch for signal phrases:

- "I want..."
- "I am doing this because..."
- "I worry..."
- "I referenced..."
- "Do not do..."
- "This phase should..."
- "If it works, we should see..."
- "Users might..."
- "I am not sure, but..."
- "Later we may..."

These are not filler. They can encode motivation, risk, reference material, constraints, staged plans, hypotheses, metrics, and future directions.

Keep a temporary mental intent buffer during the task. Do not create a separate buffer file. At the end of the task, compress useful signals into the node.

Use this filter:

> If this sentence may help someone understand the project state or data change later, capture it.

Avoid over-capturing general taste comments, unrelated life reflection, or vague ideas that are not connected to the project node.

### 2. Separate fact from belief

Do not rewrite beliefs as facts.

Good:

```text
The user believed Baidu-origin visitors may have Chinese intent, so an English-first page could add friction.
```

Bad:

```text
Baidu users are Chinese users and English pages reduce conversion.
```

Use these labels:

- Confirmed fact: code, config, UI, data structure, deployment, file, or evidence that actually changed.
- Human belief: the user's stated or inferred reason, concern, preference, hypothesis, or tradeoff.
- Inferred: a likely explanation reconstructed from files, commits, or surrounding context.
- Missing: important context was not captured.

Never invent missing intent. Write `Not captured` or `Needs user context`.

Never invent screenshots, before/after snapshots, commit hashes, deployment URLs, analytics numbers, payment events, or launch dates. If a screenshot or data export would be useful but is not present, ask or leave a `sourceRefs` entry such as `缺来源：需要用户补截图`.

### 3. Record project facts

For each meaningful node, capture concrete project changes:

- added features, pages, flows, APIs, prompts, events, data fields, or configs
- changed behavior, layout, copy, routing, analytics, search behavior, state handling, payment flow, onboarding, or architecture
- removed or deprecated features, URLs, scripts, dependencies, prompts, fields, or flows
- optimized UX, performance, conversion, reliability, maintainability, accessibility, or observability
- technical implementation: key files, data structures, dependencies, scripts, migrations, tests, deployment, and validation

### 4. Write or update nodes.json first

`docs/buildtrace/nodes.json` is the structured source used by the dashboard.

When creating, backfilling, or reviewing nodes, update `nodes.json` first. Then update or regenerate `PROJECT-NODES.md` as a human-readable export.

Use this JSON shape:

```json
{
  "schema_version": "buildtrace.nodes.v1",
  "project": {
    "name": "Project name",
    "purpose": "Short project purpose",
    "updated_at": "YYYY-MM-DD"
  },
  "nodes": [
    {
      "id": "YYYY-MM-DD-short-slug",
      "date": "YYYY-MM-DD",
      "title": "Short node title",
      "plainSummary": "One sentence in natural language.",
      "technicalNote": "Short implementation note for engineers and future agents.",
      "status": "pending-review",
      "types": ["feature", "decision"],
      "scenario": "feature",
      "reviewDue": "YYYY-MM-DD or none",
      "dateConfidence": "commit-exact",
      "humanIntent": {
        "original": "User's original words or Not captured.",
        "interpretation": "Careful interpretation without overclaiming.",
        "confidence": "confirmed-by-user"
      },
      "scenarioDetail": {
        "problem": "",
        "solution": "",
        "successSignal": "",
        "risk": ""
      },
      "changes": {
        "added": [],
        "changed": [],
        "removed": [],
        "optimized": []
      },
      "technical": {
        "files": [],
        "schema": "",
        "architecture": "",
        "validation": ""
      },
      "evidence": [
        {
          "kind": "commit",
          "ref": "hash or path",
          "note": "what this evidence supports"
        }
      ],
      "externalEvents": [
        {
          "source": "github",
          "date": "YYYY-MM-DD",
          "kind": "deployment|commit|metric|event|payment|issue|manual",
          "title": "Short factual event title",
          "value": "",
          "url": "",
          "note": "Why this event is relevant to this node"
        }
      ],
      "review": {
        "watch": "",
        "result": "pending",
        "learning": ""
      }
    }
  ]
}
```

Use `templates/nodes.schema.json` if available.

`pending-review` means "waiting for outcome follow-up / result fill-in". It is not a code review, approval review, or audit. In user-facing Chinese, call it `待回看` or `待补结果`.

`reviewDue` means "suggested follow-up date". It is a future reminder date, not a future event that already happened. In user-facing Chinese, call it `建议回看日`.

### 5. Update PROJECT-NODES.md for humans

Use this exact structure for each node:

```markdown
## YYYY-MM-DD - Short node title

**status**: 待回看 (pending-review) | 已回看 (reviewed) | 已补录 (backfilled) | 待补原因 (needs-user-context)
**scenario**: 功能新增 (feature) | Bug 修复 (bugfix) | 优化 (optimization) | 实验 (experiment) | 数据/埋点 (analytics-data) | SEO/增长 (growth-seo) | 变现/交易 (monetization) | 架构/重构 (architecture) | 内容/文案 (content) | 运维/发布 (ops-release) | App (app-mobile) | AI/提示词 (ai-prompt) | 安全/隐私 (security-privacy)
**type**: 功能 (feature), 实验 (experiment), 优化 (optimization), 修复 (bugfix), 数据 (data), 架构 (architecture), 内容 (content), SEO (seo), 变现 (monetization), 运维 (ops), 决策 (decision), 快照 (snapshot)
**review_due**: YYYY-MM-DD or none（建议回看日，不是审核）
**date_confidence**: commit-exact | doc-exact | date-inferred | unknown

### 当时为什么做
- 原话:
- 理解/提炼:
- 可信度: 用户已确认 (confirmed-by-user) | 根据证据推断 (inferred) | 未捕捉原话 (not-captured)

### 人话摘要
- 发生了什么:
- 为什么重要:

### 场景细节
- 问题/机会:
- 这一轮解决方案:
- 成功信号:
- 风险/未解决:

### 项目变化
- 加了:
- 改了:
- 减去了:
- 优化了:

### 技术实现
- 技术备注:
- 相关文件:
- 数据或结构:
- 架构/配置:
- 验证:

### 证据
- 之前:
- 之后:
- 链接:
- Commit:
- 日期依据:

### 外部时间线
- GA4/PostHog:
- GitHub/Vercel:
- Stripe/交易:
- 手填事件:

### 结果回看
- 回看时观察什么:
- 当前结果: 待回填 (pending) | 有效 (worked) | 无效/有害 (did-not-work) | 不确定 (unclear) | 无需回看 (not-needed)
- 经验/结论:
```

Keep the main entry concise. If details are long, link to a separate note or evidence folder.

If `scripts/nodes-json-to-md.mjs` is available, use it to regenerate the Markdown export from `nodes.json`.

### 6. Backfill existing projects

When the user asks to restore history, migrate an old project, or "pull previous project information", run a backfill pass:

1. Locate existing history sources: README, docs, OPS-JOURNAL, CHANGELOG, notes, TODOs, screenshots, data exports, and existing project rules.
2. Inspect git history if available.
3. Inspect GitHub-linked local context if available: remote URL, branch names, PR references in commit messages, issue IDs, release notes, and local `.github/` files.
4. Inspect available external timeline exports or connected tools if the user asked for them.
5. Inspect app structure enough to identify major surfaces and features.
6. Create a source inventory before writing nodes.
7. Create a draft timeline of nodes.
8. For every node, cite at least one evidence item and set `dateConfidence`.
9. Write reconstructed nodes to `docs/buildtrace/nodes.json`.
10. Mark each node as `confirmed-by-user`, `inferred`, or `not-captured`.
11. Ask the user only for missing intent behind important nodes.
12. Generate or update `PROJECT-NODES.md` from the JSON.

Do not pretend old intent is known. Backfill should make uncertainty visible.

Use depth levels:

- Quick backfill: latest visible docs and recent git history. Use only when the user asks for a first pass or quick scan.
- Deep backfill: full available history from a requested start date or from the first meaningful commit. Use when the user asks for "all previous information", "from project start", "from 5/20", "complete timeline", or similar.

For deep backfill, inspect `git log --since=<date>` or the full git log if no start date is known. Group commits and file changes into human-meaningful project nodes instead of one node per commit.

If the project start date is known from the user, profile, README, first commit, or docs, use it as the backfill start. If uncertain, report the inferred start date and why.

Before writing a deep backfill, produce a source inventory:

- readable local files and folders
- git range and commit count
- docs/notes/changelog ranges
- screenshot or snapshot folders
- local GitHub clues
- remote sources that were unavailable

Then write nodes. If the source inventory is thin, create fewer high-confidence nodes instead of many speculative nodes.

If the user asks whether GitHub history or global files can be used, explain and act precisely:

- Local git history can usually be inspected immediately.
- Local project files can be inspected within the current workspace.
- Other local folders are only available if the runtime has read permission or the user provides the path.
- Remote GitHub data requires an available GitHub connector, `gh` authentication, or explicit network permission.
- Chat histories in Cursor/Claude/ChatGPT are not the same as GitHub history. Use exported chats only when available.

### 7. Overlay external timelines

External timelines are facts, not intent.

Commit, push, PR, issue, CI, deploy, and analytics events usually start as external facts. Promote them into project nodes only when they represent a meaningful user-facing change, decision, rollback, experiment, data definition change, or reviewable release point. Do not create one project node per commit.

Use them when the user asks why metrics moved, what changed around a date, whether a launch affected behavior, or how project nodes line up with deploys, events, revenue, traffic, feedback, or errors.

Supported input tiers:

1. Manual rows: user or agent writes a few dated events into `externalEvents`.
2. File imports: CSV/JSON exports from GA4, GitHub, Vercel, PostHog, Stripe, error tools, support tools, or app stores.
3. Local CLI/connector: `gh`, Vercel CLI/API, GitHub connector, analytics exports, or other installed tools.
4. Direct API: only when credentials and permission are explicitly available.

Never require these integrations for normal use. A good BuildTrace node with no external integration is still valid.

When overlaying external data:

- Keep raw source names: `ga4`, `github`, `vercel`, `posthog`, `stripe`, `manual`, or another lowercase source id.
- Store only dated facts, links, counts, labels, and short notes.
- Do not store secrets, tokens, customer PII, or full payment details.
- Do not infer causality from temporal proximity. Write "happened around the same time" unless evidence supports a stronger claim.
- If a metric changed before a node date, say so clearly.
- If external data is missing, report the missing source instead of filling invented numbers.

### 8. Resume context

When starting a new task or when the user says "restore context", "continue last time", "review the nodes", "look at BuildTrace", or similar:

1. Read `PROJECT-PROFILE.md`.
2. Read the latest 3-5 nodes in `nodes.json` or `PROJECT-NODES.md`.
3. Read pending reviews related to the current task.
4. Read older nodes only when the current task needs them.

Avoid loading the entire project memory unless the user is doing a historical review.

### 9. Follow up on outcomes

If a node has `Result: pending` and the suggested follow-up date has passed, or the user is looking at relevant data, remind the user naturally:

```text
This node expected route clicks and key events to move after the Chinese-first Baidu landing change. Do you have enough data to update the result?
```

When updating the result, preserve uncertainty:

- `worked`: directionally or clearly helped
- `did-not-work`: did not help or caused harm
- `unclear`: signal is too small, noisy, delayed, or confounded
- `not-needed`: purely technical or no outcome review required

Add one short learning sentence. Do not overclaim causality.

## Safety and privacy

Do not read secrets, API keys, private analytics accounts, or production data unless the user explicitly authorizes it.

Screenshots, user feedback, analytics exports, and commercial data may be sensitive. Store paths and summaries by default. Do not upload evidence anywhere.

## Trigger examples

- "We changed the landing page today. Please record what happened and why."
- "I am not a developer, but I want to remember why we did this SEO change."
- "Can you look at this old Cursor project and reconstruct what changed?"
- "I saw traffic move around June 12. What did we change around then?"
- "Before we continue, restore context from the project nodes."
- "This is important: I chose not to add checkout yet because I want to validate demand first."
