#!/usr/bin/env python3
"""Keep one signing identity; embed only its public key in app bundles."""
import json
import os
import plistlib
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "macos/sparkle-public-key.txt"
SEED = Path(os.environ.get("BDON_SPARKLE_KEY", ROOT / "data/secrets/sparkle-ed25519.key"))


def ensure_keys():
    if PUBLIC.exists():
        return PUBLIC.read_text().strip()
    if SEED.exists():
        raise SystemExit("Restore sparkle-public-key.txt before building")
    source = '''import CryptoKit
import Foundation
let key = Curve25519.Signing.PrivateKey()
let value = ["seed": key.rawRepresentation.base64EncodedString(),
             "public": key.publicKey.rawRepresentation.base64EncodedString()]
FileHandle.standardOutput.write(try JSONEncoder().encode(value))
'''
    result = subprocess.run(["xcrun", "swift", "-e", source], check=True, capture_output=True, text=True)
    key = json.loads(result.stdout)
    SEED.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(SEED, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "w") as stream:
        stream.write(key["seed"])
    PUBLIC.write_text(key["public"] + "\n")
    return key["public"]


def configure(app):
    path = app / "Contents/Info.plist"
    info = plistlib.loads(path.read_bytes())
    info.update({"SUPublicEDKey": ensure_keys(), "SUEnableAutomaticChecks": False,
                 "SUAllowsAutomaticUpdates": False, "SUAutomaticallyUpdate": False,
                 "SUVerifyUpdateBeforeExtraction": True, "SURequireSignedFeed": True,
                 "SUSignedFeedFailureExpirationInterval": 0})
    if info["CFBundleIdentifier"].endswith(".dev"):
        info["NSAppTransportSecurity"] = {"NSAllowsLocalNetworking": True}
    else:
        info.pop("NSAppTransportSecurity", None)
    path.write_bytes(plistlib.dumps(info))


if __name__ == "__main__":
    configure(Path(sys.argv[1]))
