# Trace / BuildTrace

Trace is the product-facing name for BuildTrace, a project causal-memory system for AI-assisted builders.

Use `buildtrace` for the skill/package name when clarity matters; use `Trace` in the viewer and user-facing UI.

It helps a human and an AI agent preserve the parts of work that usually disappear:

- why a change was considered worth doing
- what actually changed in the product
- what changed technically
- what evidence existed at that moment
- what external facts happened around the same time
- what should be reviewed later
- what the result looked like after time passed

BuildTrace is not a traditional changelog. A changelog tells people what changed between versions. BuildTrace records project nodes: the moments where human intent, product direction, implementation, external facts, and future review meet.

## When to use it

BuildTrace should not interrupt every coding step.

Use it through four Agent-first modes:

1. Restore context before meaningful work.
2. Record this round after meaningful work.
3. Review a date range when looking at data, traffic, revenue, errors, or deploys.
4. Fill missing intent only for important nodes.

Manual user input is part of the design. Files, commits, deploys, and analytics exports can tell BuildTrace what happened. They usually cannot tell it the user's original motive, tradeoff, worry, or later judgment.

## Language

BuildTrace should follow the user's working language. For a Chinese project or Chinese conversation, node titles, interpretations, change summaries, technical summaries, evidence descriptions, follow-up signals, Markdown exports, and agent reports should be Chinese-first.

English is still used for stable machine values such as schema enums, file paths, commands, commit hashes, package names, and URLs.

If a project already has mixed-language nodes, run a language repair pass: keep IDs, dates, enums, paths, URLs, commands, and original quotes stable; rewrite human-facing summaries into Chinese; then regenerate `PROJECT-NODES.md`.

## Scenario-Aware Nodes

BuildTrace v1.7 separates natural language from technical notes, evidence, user notes, and external facts:

- `title`: short timeline title
- `plainSummary`: what happened in normal language
- `technicalNote`: implementation details for developers and future agents
- `scenario`: primary work scenario
- `scenarioDetail`: scenario-specific fields
- `dateConfidence`: how reliable the node date is
- `externalEvents`: dated facts from GA4, GitHub, Vercel, PostHog, Stripe, or manual input

Supported scenarios include feature, bugfix, optimization, experiment, analytics/data, growth/SEO, monetization, architecture, content, ops/release, app/mobile, AI/prompt, and security/privacy.

For bug fixes, the node should capture the broken behavior, impact, root cause if known, fix used in this round, validation, and residual risk.

For backfills, never invent dates. If git only proves that a file existed on a date, do not claim that a feature launched on that date. Use `date-inferred` or `unknown` when evidence is weak.

## Who it is for

BuildTrace is designed first for operators, founders, creators, product people, and vibe coders who build with AI tools but do not always have a mature engineering process.

It is also useful for larger projects where context gets lost across tools, agents, branches, commits, dashboards, and compressed conversations.

## Why it exists

AI coding makes it easier for more people to build, but it also creates a new memory problem.

The code may survive in Git. The final UI may survive in production. But the human intent often disappears:

- "I wanted this because..."
- "I was worried that..."
- "This was inspired by..."
- "Do not do this yet because..."
- "If this works, we should see..."
- "This decision was temporary..."

Those sentences are often the most valuable part of the work. They explain why a project moved in a certain direction. They also help future agents avoid repeating old mistakes.

BuildTrace captures those signals before they sink into chat history.

## Viewer direction

The v1.7 viewer keeps the cold tech journal direction, but reduces visual noise and adds user control:

- cool white and graphite, not beige or generic SaaS grey
- notebook-like information organization, not scrapbook decoration
- compact workflow commands instead of a heavy manual form
- a top-level milestone timeline for major project moments
- a small project resource shelf for GitHub, docs, references, analytics, deploy, revenue, design, and admin links
- wider project time page for scanning
- fewer repeated chips and status labels
- simple wording such as "当时为什么做", "改了什么", and "之后看什么"
- scenario filters for feature, bugfix, optimization, experiment, analytics, SEO/growth, monetization, architecture, content, release, and AI work
- detail panel for the selected node only
- local edit, hide, note, and export controls

## Core files

```text
docs/buildtrace/
  nodes.json             # Structured source used by the dashboard
  PROJECT-NODES.md       # Main project node timeline
  PROJECT-PROFILE.md     # Project goals, surfaces, metrics, constraints, project entry points
  evidence/              # Screenshots, references, snapshots, data exports
  external-events.json   # Optional imported/manual external timeline facts
```

This v1 package includes:

```text
SKILL.md
templates/PROJECT-NODES.md
templates/PROJECT-PROFILE.md
templates/nodes.schema.json
data/nodes.json
adapters/cursor-rule.mdc
adapters/AGENTS.md
references/scenarios.md
references/integrations.md
references/agent-workflow.md
references/evidence-policy.md
references/lifecycle.md
scripts/nodes-json-to-md.mjs
viewer/index.html
release/announcement-en.md
release/announcement-zh.md
```

## Storage model

BuildTrace uses two layers:

1. `docs/buildtrace/nodes.json` is the structured source for the dashboard.
2. `docs/buildtrace/PROJECT-NODES.md` is the human-readable export.

The reason is practical: a dashboard needs stable structured data, while humans and agents still benefit from readable Markdown.

When backfilling an existing project, the agent should write or update `nodes.json` first. Then generate or update `PROJECT-NODES.md`.

The included viewer can import a `nodes.json` file, keep edits in browser local storage, and export an updated `nodes.json`.

Because a static browser page cannot safely write directly back to your project folder, exporting JSON is the handoff point. In an agent workflow, the agent can take the exported JSON and save it as `docs/buildtrace/nodes.json`.

For long-term use:

- Ask the Agent to "恢复上下文" before meaningful work.
- Ask the Agent to "记录本轮" after meaningful work.
- Ask the Agent to "复盘 2026-06-01 到 2026-06-30" when reviewing data.
- Use the viewer to edit, hide, add notes, or export JSON.
- Keep `PROJECT-NODES.md` as the readable detail ledger.
- Keep `nodes.json` as the source of truth for the dashboard.
- Keep project archive links in `project.resources` and `PROJECT-PROFILE.md`.

## Project resources

BuildTrace can also act as a small project archive shelf. This is for stable entry points the user often needs while reviewing a project:

- GitHub, issues, PRs, source repositories.
- Original docs, Feishu/Notion/Google Docs, README, product notes.
- Reference materials, competitors, inspiration.
- GA4, PostHog, Search Console, dashboards, exported reports.
- Vercel, Cloudflare, CI/CD, deploy dashboards.
- Stripe, affiliate dashboards, revenue tools.
- Figma, design files, assets.
- CMS, admin tools, support/error monitoring.

Store them in `project.resources`:

```json
{
  "category": "data",
  "title": "GA4",
  "url": "https://analytics.google.com/...",
  "note": "Traffic and key events"
}
```

Resources are not project nodes and not evidence by themselves. They become evidence only when a specific node cites them in `sourceRefs` or `evidence`.

Never store secrets, tokens, customer PII, payment details, or private credentials.

## External timelines

BuildTrace can overlay external facts, but it should not pretend that temporal proximity proves causality.

Supported input levels:

- Manual rows: the user or agent writes a few dated events.
- File imports: CSV/JSON exports converted into `externalEvents`.
- CLI/connectors: `gh`, Vercel, GitHub connector, analytics exports, or other available tools.
- Direct API: only when credentials and permission are explicitly available.

Typical sources:

- GA4/PostHog: traffic, events, funnels, experiments, feature flags.
- GitHub: commits, PRs, issues, releases, Actions.
- Vercel: deployments, previews, rollbacks, build failures.
- Stripe: payments, refunds, subscriptions, checkout or webhook events.
- Manual: observations from dashboards that cannot be connected.

External events are facts. Human intent and outcome judgment should still be captured separately.

Commit, push, PR, issue, CI, deploy, and analytics events should usually enter `externalEvents`, `sourceRefs`, or `evidence` first. Promote them into project nodes only when they represent a meaningful user-facing change, decision, rollback, experiment, data definition change, or reviewable release point.

## Evidence rules

Do not invent screenshots, commits, deploy URLs, analytics values, payment events, or launch dates.

Each factual node should include at least one of:

- `sourceRefs`: commit hash, file path, document path, screenshot path, URL, or exported data file.
- `evidence`: structured evidence with `kind`, `ref`, `note`, and optionally `supports`.
- `docRef`: where the detailed Markdown record lives.
- `externalEvents`: dated external facts.

If a claim has no source, mark it as inferred, unknown, or needing user context. A less complete but honest timeline is better than a polished false one.

## Important limits

BuildTrace can be installed after a project has already started. It can reconstruct history from files, docs, notes, git commits, screenshots, and exported chats that are available to the agent.

It cannot magically recover compressed chat context or unexported Cursor/Claude/ChatGPT side-panel histories. When old intent is missing, it should mark the node as inferred or needs-user-context instead of pretending to know.

For existing projects, ask for the depth explicitly:

- Quick backfill: recent docs and recent git history.
- Deep backfill: all available history from project start or a date such as 2026-05-20.

After a backfill, the agent should report the sources inspected, date range covered, earliest recovered node date, and what was not accessible.

## The node model

Each node separates human intent from project facts.

```json
{
  "id": "2026-06-30-baidu-landing",
  "date": "2026-06-30",
  "title": "Chinese-first Baidu landing behavior",
  "plainSummary": "Chinese search visitors now get a Chinese-first landing experience.",
  "technicalNote": "Frontend language boot logic and Chinese SEO metadata were updated.",
  "status": "pending-review",
  "types": ["seo", "ux", "acquisition"],
  "scenario": "growth-seo",
  "reviewDue": "2026-07-14",
  "dateConfidence": "user-confirmed",
  "humanIntent": {
    "original": "Baidu users may have Chinese intent. An English landing page may make them leave.",
    "interpretation": "The user believed language mismatch could reduce engagement.",
    "confidence": "confirmed-by-user"
  },
  "scenarioDetail": {
    "problem": "Chinese search visitors may leave when the first page is English.",
    "solution": "Add Chinese SEO metadata and adjust first-visit language boot behavior.",
    "successSignal": "Baidu visits, Chinese page views, route clicks, and key events improve directionally.",
    "risk": "Traffic may be too low for strong attribution."
  },
  "changes": {
    "added": ["Chinese metadata and Open Graph content"],
    "changed": ["First-visit language boot logic for Baidu-origin traffic"],
    "removed": ["Nothing"],
    "optimized": ["Chinese visitor landing experience"]
  },
  "technical": {
    "files": ["seo-head-zh.js", "lang-boot.js"],
    "schema": "none",
    "architecture": "frontend language routing",
    "validation": "local URL checks and production smoke test"
  },
  "evidence": ["before screenshot", "after screenshot", "Search Console baseline"],
  "externalEvents": [
    {
      "source": "ga4",
      "date": "2026-07-14",
      "kind": "metric",
      "title": "Baidu organic and Chinese page behavior",
      "value": "pending export",
      "url": "",
      "note": "Use aggregate GA4/GSC data during follow-up"
    }
  ],
  "review": {
    "watch": "Baidu organic visits, Chinese page views, route clicks, key events.",
    "result": "pending",
    "learning": ""
  }
}
```

`pending-review` means waiting for outcome follow-up / result fill-in. It is not code review or approval review.

`reviewDue` means suggested follow-up date. In Chinese, this should be shown as `建议回看日`, not `审核日期`.

## Capture rules

BuildTrace captures two kinds of information.

### Human signals

Capture these only when the conversation is about a concrete project, change, review, data question, or decision:

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

The agent should preserve the original words when they carry meaning, then add a careful interpretation.

### Project facts

Capture concrete project changes:

- new features
- changed pages, flows, states, APIs, prompts, data models, or events
- removed or deprecated behavior
- UX, performance, SEO, onboarding, monetization, analytics, reliability, or architecture changes
- deployment and configuration changes that affect users or data

Do not invent missing intent. If the reason was not captured, write `Not captured`.

## Backfill old projects

For projects that already exist, BuildTrace should run a backfill pass:

1. Read README, existing docs, changelog, OPS journal, notes, and visible app structure.
2. Read recent git history if available.
3. Identify major project nodes.
4. Mark each node as confirmed, inferred, or needs-user-context.
5. Ask the user only for the missing intent behind important nodes.

Backfill is not archaeology for its own sake. Its job is to create a useful starting timeline.

## Viewer

Open `viewer/index.html` in a browser to see an interactive dashboard:

- project summary
- milestone overview timeline
- project-node list
- external timeline facts
- filters by scenario and review state
- detail panel with why/change/evidence/facts/outcome
- local edit, hide, note, and export controls

To use it with real data:

1. Open `viewer/index.html`.
2. Click `Import JSON`.
3. Select your project's `docs/buildtrace/nodes.json`.
4. Browse, filter, and review nodes.
5. Edit, hide, add notes, or create a draft if needed.
6. Click `Export JSON` after edits.
7. Ask the Agent to save the exported file back as `docs/buildtrace/nodes.json` and regenerate `PROJECT-NODES.md`.

If you serve this folder from a local web server, the viewer will also try to load `data/nodes.json` automatically.

## Markdown export

Run this from the package root to generate a readable Markdown view:

```bash
node scripts/nodes-json-to-md.mjs data/nodes.json templates/PROJECT-NODES.generated.md
```

In a real project:

```bash
node scripts/nodes-json-to-md.mjs docs/buildtrace/nodes.json docs/buildtrace/PROJECT-NODES.md
```

## Design principles

- Human intent is first-class, but it is not the whole system.
- Separate facts from beliefs.
- Keep nodes short enough to maintain.
- Capture original words when nuance matters.
- Mark uncertainty instead of pretending to know.
- Keep the dashboard useful even when the record is incomplete.
- Prefer a small durable memory over a huge transcript dump.
