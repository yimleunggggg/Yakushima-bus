"""合并 sources/overrides/*.json 局部补丁。"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def deep_merge(base: dict, patch: dict) -> dict:
    out = dict(base)
    for k, v in patch.items():
        if k in out and isinstance(out[k], dict) and isinstance(v, dict):
            out[k] = deep_merge(out[k], v)
        elif k in out and isinstance(out[k], list) and isinstance(v, list):
            out[k] = v
        else:
            out[k] = v
    return out


def apply_overrides(data: dict, overrides_dir: Path) -> dict:
    if not overrides_dir.is_dir():
        return data
    result = data
    for path in sorted(overrides_dir.glob("*.json")):
        if path.name.startswith("_"):
            continue
        patch = json.loads(path.read_text(encoding="utf-8"))
        result = deep_merge(result, patch)
    return result


def merge_fare_pairs(pairs: dict[str, int], overrides_dir: Path) -> dict[str, int]:
    path = overrides_dir / "fare.json"
    if not path.exists():
        return pairs
    patch = json.loads(path.read_text(encoding="utf-8"))
    out = dict(pairs)
    for k, v in patch.get("farePairs", {}).items():
        if v is None:
            out.pop(k, None)
        else:
            out[k] = v
            parts = k.split("|")
            if len(parts) == 2:
                out[f"{parts[1]}|{parts[0]}"] = v
    return out
