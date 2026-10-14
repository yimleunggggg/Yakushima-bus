# Yaku Explore pilot

This is a small static, multilingual travel guide at `/explore/`. It uses the curated catalog in `catalog.js`, the shared transport status in `/transport-data.js`, and the shared commercial catalog in `/partner-data.js`. The search harness classifies intent and region, ranks candidates, excludes blocked routes and ineligible JR passes, and exposes source dates and review-due flags. It does **not** search the live web or check availability. UI copy must keep that limitation clear.

## Editing and review

- Add each claim once in `catalog.js` with its primary source, URL, `checkedAt`, and conditions. Do not duplicate affiliate URLs, ratings, or booking counts; reference `/partner-data.js` by `affiliateRef`.
- Recheck official status before editing `/transport-data.js`; it is generated from source files. Its open-ended closure remains active after `reviewAfter`. Changes to route access must follow the main transport build/validation workflow.
- A source older than 30 days is flagged in results. For time-sensitive status, `transport-data.js` has its own `reviewAfter`. This is a prompt to verify, never automatic evidence of reopening.
- Run `node --test tests/explore-harness.test.js` and the existing site checks after changes. Review JA, EN, and ZH mobile layouts and source links.

## Future AI service interface

`ai-adapter.js` exports `payload(query, harnessResult, lang)` and `validate(response, request)`. A server endpoint may receive the payload, perform web search on an allowlisted set of official domains, and return `{ recommendations: [{ id, explanation, citations: [url] }] }`. The browser accepts recommendations only for unblocked, eligible catalog IDs and citations among the supplied candidate sources. A richer implementation can return new source discoveries for editorial review, but may not silently overwrite the shared catalog or route status. The model/API key must remain server-side. Do not label a response "live" without an actual timestamped lookup and cited official source. No endpoint is configured in this pilot.
