"""Restore a test app domain, including keys introduced by the test."""
import plistlib
import subprocess
import tempfile
from pathlib import Path


def snapshot_defaults(identifier):
    result = subprocess.run(['defaults', 'export', identifier, '-'], capture_output=True)
    return result.stdout if result.returncode == 0 else None


def restore_defaults(identifier, original):
    current = snapshot_defaults(identifier)
    if original is None:
        if current is not None:
            subprocess.run(['defaults', 'delete', identifier], check=True, capture_output=True)
        return
    saved = plistlib.loads(original)
    extra = set(plistlib.loads(current)) - set(saved) if current else set()
    with tempfile.TemporaryDirectory(prefix='bdon-defaults-') as name:
        path = Path(name) / 'original.plist'
        path.write_bytes(original)
        subprocess.run(['defaults', 'import', identifier, str(path)], check=True, capture_output=True)
    # `defaults import` merges domains; it does not remove test-created keys.
    for key in extra:
        subprocess.run(['defaults', 'delete', identifier, key], check=True, capture_output=True)
    assert plistlib.loads(snapshot_defaults(identifier)) == saved, 'test preferences did not restore'
