# EN UI overflow fix (2026-06-26)

## Problem

English trip cards on miyanoura→anbo (matsubanda winter) showed a long inline `.tag` from `trip.note` that crowded out adjacent payment tags (`No day pass`, etc.). Flex items defaulted to `min-width: auto`, preventing wrap.

## Changes

### `index.html`
- Removed `trip.note` from `tripTags()` inline tags.
- Added `tripNoteHtml()` — renders note as `.trip-note` block below `.trip-tags`.
- When `trip.note` is set, skip `OperatorUI.paymentTags` (winter matsubanda note already states payment limits).

### `styles.css` (layout-v123)
- `.trip`, `.trip-tags`, `.tag` — flex wrap + `min-width: 0`, `overflow-wrap: anywhere`.
- New `.trip-note` warn-styled block for long per-trip notes.
- `.op-legend-item` / `.op-legend-note`, `.modal-pay-tags .tag` — same wrap rules.
- Audit: `.badge` ellipsis cap, `.trip-leg-label`, `.aux-summary`, `.seo-faq-item summary`, `.page-lead`, `.affiliate-card-title` — `overflow-wrap` where missing.

### `scripts/parse_matsubanda.py`
- Shortened EN `season_note` for future regenerations (`data.js` unchanged; UI fix is primary).

## Verify

- Query miyanoura→anbo in EN: winter trips show season tag + `.trip-note` block; no duplicate payment tags.
- Other short tags wrap cleanly on narrow viewports.
