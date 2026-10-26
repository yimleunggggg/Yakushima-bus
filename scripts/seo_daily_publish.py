#!/usr/bin/env python3
"""Publish only generated reports on the latest main, preserving source and local data."""
import json
import subprocess
import tempfile
import time
from datetime import datetime
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PATHS=["docs/seo/metrics", "docs/seo/reports/daily", "docs/seo/SEO-JOURNAL.md", "docs/seo/feishu-sheet.json"]


def git(root, *args, check=True):
    return subprocess.run(["git", "-C", str(root), *args], check=check, capture_output=True, text=True)


def timestamp(content):
    try:
        d=json.loads(content)
        return datetime.fromisoformat(d["fetched_at_iso"].replace("Z", "+00:00"))
    except (ValueError, KeyError, TypeError):return None


def publish(root=ROOT, retries=3):
    root=Path(root)
    if git(root, "diff", "--name-only", "--diff-filter=U").stdout.strip():
        raise RuntimeError("日报工作区存在未解决冲突；停止存档，保留采集结果")
    changed=set(git(root, "diff", "--name-only", "HEAD", "--", *PATHS).stdout.splitlines())
    changed.update(git(root, "ls-files", "--others", "--exclude-standard", "--", *PATHS).stdout.splitlines())
    if not changed:
        print("✓ 日报存档没有新变化", flush=True);return
    files={name:(root/name).read_bytes() for name in changed if (root/name).is_file()}
    latest="docs/seo/metrics/daily-latest.json"
    incoming=timestamp(files.get(latest, b"{}"))
    base={name:git(root, "show", "HEAD:"+name, check=False).stdout for name in files}
    with tempfile.TemporaryDirectory(prefix="yakubus-report-publish-") as folder:
        for attempt in range(retries):
            git(root, "fetch", "origin", "main")
            checkout=Path(folder)/str(attempt)
            git(root, "worktree", "add", "--detach", str(checkout), "origin/main")
            try:
                remote=timestamp((checkout/latest).read_bytes()) if (checkout/latest).exists() else None
                if incoming and remote and remote>incoming:
                    print("✓ 远端已有更新的日报，保留远端存档；本轮采集文件未改动", flush=True);return
                for name, content in files.items():
                    dest=checkout/name;dest.parent.mkdir(parents=True, exist_ok=True)
                    if name.endswith("SEO-JOURNAL.md") and dest.exists() and dest.read_text()!=base[name]:
                        ours=Path(folder)/"journal-ours"; ancestor=Path(folder)/"journal-base"; theirs=Path(folder)/"journal-remote"
                        ours.write_bytes(content);ancestor.write_text(base[name]);theirs.write_bytes(dest.read_bytes())
                        merged=subprocess.run(["git", "merge-file", "-p", str(ours), str(ancestor), str(theirs)], capture_output=True)
                        if merged.returncode:raise RuntimeError("SEO日志有并发修改，停止存档以保留双方内容")
                        content=merged.stdout
                    if name.endswith("feishu-sheet.json") and dest.exists():
                        meta=json.loads(dest.read_bytes());meta.update(json.loads(content));content=(json.dumps(meta, ensure_ascii=False, indent=2)+"\n").encode()
                    dest.write_bytes(content)
                git(checkout, "add", "--", *files)
                if git(checkout, "diff", "--cached", "--quiet", check=False).returncode==0:return
                git(checkout, "commit", "-m", "docs(seo): archive collected daily report")
                pushed=git(checkout, "push", "origin", "HEAD:refs/heads/main", check=False)
                if pushed.returncode==0:
                    print("✓ 日报已基于最新main存档，原采集文件保持不变", flush=True);return
                print("⚠ 日报存档期间main更新，重新整合后重试", flush=True)
            finally:
                git(root, "worktree", "remove", "--force", str(checkout))
            if attempt+1<retries:time.sleep(2)
    raise RuntimeError("日报存档重试失败；采集结果仍保留，未强制覆盖main")


if __name__=="__main__":publish()
