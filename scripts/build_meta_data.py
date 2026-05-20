#!/usr/bin/env python3
"""生成 meta-data.js — 节假日、日种规则、数据集有效期与构建警告"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOLIDAYS = ROOT / "sources" / "holidays.json"
MANIFEST = ROOT / "sources" / "manifest.json"
ACCESS_MANIFEST = ROOT / "sources" / "access-manifest.json"
ACCESS_DIR = ROOT / "sources" / "access"
OUT = ROOT / "meta-data.js"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def flat_holidays(holidays_cfg: dict) -> list[str]:
    out: list[str] = []
    for dates in holidays_cfg.get("holidays", {}).values():
        out.extend(dates)
    return sorted(set(out))


def pick_access_season(jetfoil: dict, ref: date) -> dict | None:
    seasons = jetfoil.get("seasons", [])
    for s in seasons:
        if date.fromisoformat(s["validFrom"]) <= ref <= date.fromisoformat(s["validTo"]):
            return s
    return None


def collect_warnings(ref: date, warn_days: int) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    manifest = load_json(MANIFEST)
    vf = date.fromisoformat(manifest["validFrom"])
    vt = date.fromisoformat(manifest["validTo"])
    if vt < ref:
        errors.append(f"公交时刻表已过期：validTo={manifest['validTo']}")
    elif (vt - ref).days <= warn_days:
        warnings.append(f"公交时刻表将于 {manifest['validTo']} 到期（剩 {(vt - ref).days} 天）")

    if vf > ref:
        warnings.append(f"公交时刻表 validFrom={manifest['validFrom']} 尚未生效")

    jetfoil = load_json(ACCESS_DIR / "jetfoil.json")
    season = pick_access_season(jetfoil, ref)
    if not season:
        errors.append("上岛高速船：今日无匹配季节 schedule")
    else:
        st = date.fromisoformat(season["validTo"])
        if st < ref:
            errors.append(f"上岛季节 {season['id']} 已过期")
        elif (st - ref).days <= warn_days:
            warnings.append(
                f"上岛季节 {season['id']} 将于 {season['validTo']} 结束（剩 {(st - ref).days} 天）"
            )

    return errors, warnings


def build_meta(ref: date | None = None) -> dict:
    ref = ref or date.today()
    holidays_cfg = load_json(HOLIDAYS)
    manifest = load_json(MANIFEST)
    access_manifest = load_json(ACCESS_MANIFEST)
    jetfoil = load_json(ACCESS_DIR / "jetfoil.json")
    season = pick_access_season(jetfoil, ref)
    warn_days = int(holidays_cfg.get("expiryWarnDays", 14))
    errors, warnings = collect_warnings(ref, warn_days)

    return {
        "revision": holidays_cfg.get("revision"),
        "updatedAt": holidays_cfg.get("updatedAt"),
        "builtAt": ref.isoformat(),
        "holidays": flat_holidays(holidays_cfg),
        "dayTypes": holidays_cfg.get("dayTypes", {}),
        "expiryWarnDays": warn_days,
        "datasets": {
            "timetable": {
                "revision": manifest.get("revision"),
                "validFrom": manifest.get("validFrom"),
                "validTo": manifest.get("validTo"),
                "updatedAt": manifest.get("updatedAt"),
            },
            "access": {
                "revision": access_manifest.get("revision"),
                "updatedAt": access_manifest.get("updatedAt"),
                "activeSeason": season["id"] if season else None,
                "seasonFrom": season["validFrom"] if season else None,
                "seasonTo": season["validTo"] if season else None,
            },
        },
        "warnings": warnings,
        "errors": errors,
    }


def emit_js(data: dict, out: Path) -> None:
    body = json.dumps(data, ensure_ascii=False, indent=2)
    out.write_text(
        "/** 元数据 — scripts/build_meta_data.py 生成 */\n"
        f"const META_DATA = {body};\n",
        encoding="utf-8",
    )


def validate(ref: date | None = None) -> None:
    data = build_meta(ref)
    if data["errors"]:
        print("META VALIDATION FAILED:")
        for e in data["errors"]:
            print(" ", e)
        raise SystemExit(1)
    for w in data["warnings"]:
        print("WARN:", w)


if __name__ == "__main__":
    data = build_meta()
    emit_js(data, OUT)
    print(f"→ {OUT.name} ({len(data['holidays'])} holidays, {len(data['warnings'])} warnings)")
    if data["errors"]:
        validate()
