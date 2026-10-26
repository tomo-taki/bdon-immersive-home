#!/usr/bin/env python3
"""Keep the local catalog on the region's current release, and tell when its Home Spots change.

The local moenotes-assets service (local_spots.py) keeps the catalog it was last refreshed with. It takes the
catalog of a release (catalog_<resource version>) only through its version tracking, and a release then also
converts every asset, so version_poll_secs stays 0. Instead this asks the service to check the metadata service now
(POST /versions/check, with MOENOTES_API_KEY of the local MoeNotes folder's .env). When that queues a release of the
region, it waits for the release's catalog refresh and cancels the rest of the batch, the export. The refreshed
snapshot is the newest of the configured scope, which the viewer and local_spots.py read; the service scans its new
bundles in the background without converting any. The release stays recorded as cancelled, so the next check
queues one only for a newer resource version.

Then it lists what local_spots.py lists and posts a notification for what calls for work and was not there at the
last run (data/local_spots.json): a new situation, a preview the master data now lists, a Spot id that is not the
master data's.

--install runs it at login and every 6 hours (a LaunchAgent; --uninstall removes it), logging to
data/update_catalog.log.

Usage: update_catalog.py [--service URL] [--region kr] [--moenotes DIR] [--install | --uninstall]
"""
from __future__ import annotations

import argparse
import json
import os
import plistlib
import shutil
import subprocess
import sys
import time
import urllib.request
from datetime import datetime
from pathlib import Path

from local_spots import ROOT, SERVICE, describe, findings, moenotes_dir, situation_keys, snapshot

STATE = ROOT / "data/local_spots.json"
LOG = ROOT / "data/update_catalog.log"
LABEL = "com.togawa.bdon-immersive-home.update-catalog"
AGENT = Path.home() / "Library/LaunchAgents" / f"{LABEL}.plist"
EVERY = 6 * 60 * 60


def log(message: str) -> None:
    print(f"{datetime.now():%Y-%m-%d %H:%M} {message}", flush=True)


def api_key(folder: Path) -> str:
    for line in (folder / ".env").read_text().splitlines():
        name, _, value = line.partition("=")
        if name.strip() == "MOENOTES_API_KEY" and value.strip():
            return value.strip().strip("\"'")
    raise SystemExit(f"{folder}/.env: no MOENOTES_API_KEY")


def admin(service: str, method: str, path: str, key: str) -> dict:
    request = urllib.request.Request(service.rstrip("/") + path, data=b"" if method == "POST" else None,
                                     method=method, headers={"Authorization": f"Bearer {key}"})
    with urllib.request.urlopen(request) as response:
        return json.loads(response.read())


def update(service: str, region: str, key: str) -> str | None:
    """POST /versions/check. When the region has a release queued (or still pending from an earlier run), wait for
    its catalog refresh, then cancel its batch before the export. -> its resource version; None: nothing new."""
    entry = next((r for r in admin(service, "POST", "/versions/check", key)["regions"] if r["region"] == region), None)
    if entry is None or entry["action"] not in ("queued", "pending"):
        if entry and entry["action"] in ("missing", "invalid", "error"):
            log(f"version check of {region}: {entry['action']} {entry.get('error') or ''}")
        return None
    deadline = time.monotonic() + 600
    while True:
        batch = admin(service, "GET", f"/tasks/batches/{entry['batch']}", key)
        refresh = [s for s in batch["steps"] if s["phase"] == "refresh"]
        if all(s["state"] not in ("queued", "running") for s in refresh) or time.monotonic() > deadline:
            break
        time.sleep(0.5)
    admin(service, "POST", f"/tasks/batches/{entry['batch']}/cancel", key)
    failed = [s for s in refresh if s["state"] != "succeeded"]
    if failed:
        raise SystemExit(f"release {entry['resource_version']}: catalog refresh {failed[0]['state']} "
                         f"{failed[0].get('error') or ''}")
    return entry["resource_version"]


def actionable(f: dict) -> bool:
    return f["kind"] in ("new", "id") or (f["kind"] == "preview" and f["row"] is not None)


def message(f: dict) -> str:
    """A finding in the notification's words."""
    row = f["row"] and f"{f['row']['id']} {f['row']['name']}"
    if f["kind"] == "new":
        return f"새 스팟 {row}" if row else f"새 스팟 에셋 {f['situation']} (게임 미공개)"
    if f["kind"] == "preview":
        return f"미리보기 스팟({f['app']})이 정식 등록됨: {row}. export_spot.py로 다시 export하세요"
    return f"{f['situation']}: 앱은 {f['app']}, 마스터 데이터는 {row}"


def notify(lines: list[str]) -> None:
    """A macOS notification (best effort: osascript posts it)."""
    text = "\n".join(lines).replace("\\", "\\\\").replace('"', '\\"')
    script = f'display notification "{text}" with title "BDON Immersive Home" subtitle "로컬 카탈로그"'
    subprocess.run(["osascript", "-e", script], check=False, capture_output=True)


def install(moenotes: str | None) -> None:
    """Run this at login and every EVERY seconds as a LaunchAgent, once now."""
    docker = shutil.which("docker")   # launchd's PATH lacks it
    path = [*([str(Path(docker).parent)] if docker else []), "/usr/local/bin", "/opt/homebrew/bin",
            "/usr/bin", "/bin", "/usr/sbin", "/sbin"]
    command = [sys.executable, str(Path(__file__).resolve()), *(["--moenotes", moenotes] if moenotes else [])]
    agent = {
        "Label": LABEL,
        "ProgramArguments": command,
        "RunAtLoad": True,
        "StartInterval": EVERY,
        "EnvironmentVariables": {"PATH": ":".join(dict.fromkeys(path))},
        "StandardOutPath": str(LOG),
        "StandardErrorPath": str(LOG),
    }
    AGENT.parent.mkdir(parents=True, exist_ok=True)
    AGENT.write_bytes(plistlib.dumps(agent))
    domain = f"gui/{os.getuid()}"
    subprocess.run(["launchctl", "bootout", f"{domain}/{LABEL}"], capture_output=True)
    subprocess.run(["launchctl", "bootstrap", domain, str(AGENT)], check=True)
    print(f"installed {AGENT}: at login and every {EVERY // 3600} hours, log {LOG}")


def uninstall() -> None:
    subprocess.run(["launchctl", "bootout", f"gui/{os.getuid()}/{LABEL}"], capture_output=True)
    AGENT.unlink(missing_ok=True)
    print(f"removed {AGENT}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--service", default=SERVICE, help=f"moenotes-assets service (default {SERVICE})")
    ap.add_argument("--region", help="region of the service (default: its first)")
    ap.add_argument("--moenotes", help="local MoeNotes folder (default: the running container's)")
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--install", action="store_true", help="run at login and every 6 hours")
    mode.add_argument("--uninstall", action="store_true", help="stop running it")
    args = ap.parse_args()
    if args.install or args.uninstall:
        install(args.moenotes) if args.install else uninstall()
        return

    snap = snapshot(args.service, args.region)
    news = []
    version = update(args.service, snap["region"], api_key(moenotes_dir(args.moenotes)))
    if version:
        log(f"catalog of release {version}")
        news.append(f"카탈로그를 {version}(으)로 갱신했습니다")
        snap = snapshot(args.service, args.region)

    keys = situation_keys(args.service, snap)
    found = findings(snap, keys)
    for f in found:
        log(describe(f, snap["region"]))
    seen = json.loads(STATE.read_text()) if STATE.exists() else []
    news += [message(f) for f in found if actionable(f) and f not in seen]
    STATE.write_text(json.dumps(found, ensure_ascii=False, indent=1))
    if news:
        notify(news)
    log(f"snapshot {snap['snapshot'][:12]}: {len(keys)} situations, {len(found)} findings, {len(news)} notified")


if __name__ == "__main__":
    main()
