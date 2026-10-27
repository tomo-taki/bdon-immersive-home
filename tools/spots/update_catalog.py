#!/usr/bin/env python3
"""Tell when the Home Spots of the local catalog change.

The Ournotes watcher keeps the asset service's catalog on the region's current release (local_spots.py). This lists
what local_spots.py lists and posts a notification for what calls for work and was not there at the last run
(data/local_spots.json): a new situation, a preview the master data now lists, a Spot id that is not the master
data's.

--install runs it at login and every 6 hours (a LaunchAgent with the Python that installs it, which needs nnnotes:
data/venv; --uninstall removes it), logging to data/update_catalog.log.

Usage: data/venv/bin/python tools/spots/update_catalog.py [--service URL] [--watcher URL] [--install | --uninstall]
"""
from __future__ import annotations

import argparse
import json
import os
import plistlib
import subprocess
import sys
from datetime import datetime
from pathlib import Path

from local_spots import ROOT, SERVICE, WATCHER, describe, findings, game_state, situation_keys, snapshot

STATE = ROOT / "data/local_spots.json"
LOG = ROOT / "data/update_catalog.log"
LABEL = "com.togawa.bdon-immersive-home.update-catalog"
AGENT = Path.home() / "Library/LaunchAgents" / f"{LABEL}.plist"
EVERY = 6 * 60 * 60


def log(message: str) -> None:
    print(f"{datetime.now():%Y-%m-%d %H:%M} {message}", flush=True)


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


def install() -> None:
    """Run this at login and every EVERY seconds as a LaunchAgent, once now."""
    agent = {
        "Label": LABEL,
        "ProgramArguments": [sys.executable, str(Path(__file__).resolve())],
        "RunAtLoad": True,
        "StartInterval": EVERY,
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
    ap.add_argument("--service", default=SERVICE, help=f"Ournotes asset service (default {SERVICE})")
    ap.add_argument("--watcher", default=WATCHER, help=f"Ournotes watcher (default {WATCHER})")
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--install", action="store_true", help="run at login and every 6 hours")
    mode.add_argument("--uninstall", action="store_true", help="stop running it")
    args = ap.parse_args()
    if args.install or args.uninstall:
        install() if args.install else uninstall()
        return

    state = game_state(args.watcher)
    snap = snapshot(args.service, state["region"])
    keys = situation_keys(args.service, snap)
    found = findings(snap, keys, state)
    for f in found:
        log(describe(f, snap["region"]))
    seen = json.loads(STATE.read_text()) if STATE.exists() else []
    news = [message(f) for f in found if actionable(f) and f not in seen]
    STATE.write_text(json.dumps(found, ensure_ascii=False, indent=1))
    if news:
        notify(news)
    log(f"snapshot {snap['snapshot'][:12]}, master data {state['master_version'][:12]}: {len(keys)} situations, "
        f"{len(found)} findings, {len(news)} notified")


if __name__ == "__main__":
    main()
