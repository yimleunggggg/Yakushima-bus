#!/usr/bin/env bash
# Offline local / CI SEO and GEO gate; no GSC credentials needed.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
python3 scripts/check_seo.py
