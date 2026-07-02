# BuildTrace Agent Instructions

This repository uses BuildTrace project-node memory.

Before starting meaningful project work, read:

- `docs/buildtrace/PROJECT-PROFILE.md`
- latest 3-5 entries in `docs/buildtrace/nodes.json` or `docs/buildtrace/PROJECT-NODES.md`
- pending reviews related to the current task

After meaningful project work, update `docs/buildtrace/nodes.json` first, then update or regenerate `docs/buildtrace/PROJECT-NODES.md`.

Keep project archive links in `project.resources` and `docs/buildtrace/PROJECT-PROFILE.md`. These can include GitHub, docs, references, analytics dashboards, deploy dashboards, payment/revenue tools, design files, CMS/admin tools, and other stable project entry points. They are not project nodes and not evidence unless a node cites them. Do not store secrets or private customer/payment details.

Do not stop normal implementation work to fill a long form. Capture important intent signals mentally during the task, then write one concise node when the meaningful node is done.

Use four interaction modes:

- Restore context before meaningful work.
- Record this round after meaningful work.
- Review a date range when the user is looking at data.
- Fill missing reasons only for important nodes.

For "record this round", draft first and ask the user only for corrections, missing reasons, or optional personal notes.

Capture both:

- human intent: reasons, worries, references, constraints, hypotheses, review signals
- project facts: added, changed, removed, optimized, technical implementation, validation, evidence
- external facts: GA4/PostHog metrics, GitHub work, Vercel deployments, Stripe events, support/error/app-store events, or manual dated observations
- source refs: commit hashes, file paths, docs, screenshot paths, URLs, or data exports that support the node

Separate confirmed facts from beliefs or inferred context. Do not invent missing reasons, screenshots, commits, deploys, analytics values, payment events, or launch dates.

For old projects, run a backfill pass from README, docs, changelog, notes, git history, screenshots, and user-provided chats. Mark reconstructed nodes as confirmed, inferred, or needs-user-context.

When external timelines are requested, support manual rows or CSV/JSON exports before assuming API access. Use connectors, CLIs, or direct APIs only when they are available and authorized. Store facts and links, not secrets, personal data, or unsupported causal claims.

Commit, push, PR, CI, deploy, and analytics events are facts first. Promote them into project nodes only when they represent a meaningful user-facing change, decision, rollback, experiment, data definition change, or reviewable release point.

If the user says a node is wrong, unnecessary, or only personally useful, correct it, hide it with `hidden: true`, or add `userNotes`. Do not delete by default.
