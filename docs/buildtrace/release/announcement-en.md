# Trace / BuildTrace announcement draft

I have been building with AI more and more, and I kept running into a strange problem.

The product changes quickly, but the reason behind the change disappears.

Git can tell me what files changed. A changelog can tell me what shipped. Analytics can tell me that something moved. But when I look back two weeks later, I often cannot reconstruct the human part:

- Why did I decide to do this?
- What was I worried about?
- What did I expect to improve?
- What did the page look like before?
- What was the technical approach?
- Did it actually work?

That missing layer matters even more in AI-assisted development, because so much intent lives inside conversations. Once the chat gets compressed, archived, or split across tools, the project loses part of its memory.

So I am working on Trace.

The user-facing dashboard is called Trace. The skill/package name is `buildtrace`.

Trace / BuildTrace is a project-node memory system for AI-assisted builders.

It records important nodes in a project:

- human intent
- project changes
- technical implementation
- evidence and snapshots
- external facts such as GA4/PostHog events, GitHub work, Vercel deployments, Stripe payments, or manual data observations
- review signals
- later outcomes

It is not a traditional changelog. It is not a full project management system. It is a lightweight memory layer for the moments where a human decision becomes a product change.

It should not turn building into constant form filling. The agent should draft first, and the human should only confirm, correct, or add the judgment that cannot be inferred from files:

- before meaningful work: restore context from recent nodes and open questions
- after meaningful work: record this round as one or more project nodes
- during data review: overlay external facts from GA4, GitHub, Vercel, PostHog, Stripe, or manual observations
- when old history is incomplete: create an intent inbox and ask only for important missing motives

The first version includes:

- a skill/instruction file for AI agents
- a project node template
- a project profile template
- a backfill workflow for existing projects
- a local dashboard prototype for browsing nodes, evidence, gaps, and pending outcomes
- an external timeline format for importing or manually adding dated facts from GA4, GitHub, Vercel, PostHog, Stripe, and other tools

The people I am designing for first are operators, creators, founders, and vibe coders who can now build software with AI, but do not necessarily have the habits or infrastructure of a mature engineering team.

The visual direction is a cold tech journal: structured and precise like a serious product tool, but with enough notebook-like texture to preserve the human layer.

The larger idea is simple:

AI can help more people build. But the human intent behind the building should not disappear.
