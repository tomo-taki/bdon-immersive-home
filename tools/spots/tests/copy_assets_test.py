"""Run the real asset-copy commands against externally linked data."""
import os
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CASES = [
    ('mac', 'macos/build.sh', ['data/spots data/thumbs assets/bands'], 'app/Contents/Resources/data'),
    ('android', 'android/build.sh', ['"$DATA" "$STAGE/assets/spots"'], 'stage/assets'),
    ('windows', 'windows/package.sh', ['"$DATA/spots" "$root/data/spots"', '"$DATA/thumbs" "$root/data/thumbs"'], 'package/data'),
]
failed = []
for name, script, matches, output in CASES:
    with tempfile.TemporaryDirectory() as temporary:
        base = Path(temporary)
        (base / 'data').mkdir()
        (base / 'assets/bands').mkdir(parents=True)
        for directory in ['spots', 'thumbs']:
            physical = base / 'external' / directory
            physical.mkdir(parents=True)
            (physical / 'payload').write_text(directory)
            (base / 'data' / directory).symlink_to(physical, target_is_directory=True)
        (base / output).mkdir(parents=True)
        env = os.environ.copy()
        env.update(APP=str(base / 'app'), STAGE=str(base / 'stage'), root=str(base / 'package'),
                   DATA=str(base / 'data/spots' if name == 'android' else base / 'data'))
        lines = (ROOT / script).read_text().splitlines()
        for match in matches:
            command = next(line.strip() for line in lines if line.strip().startswith('cp ') and match in line)
            subprocess.run(['/bin/bash', '-c', command], cwd=base, env=env, check=True)
        folders = ['spots'] if name == 'android' else ['spots', 'thumbs']
        for directory in folders:
            target = base / output / directory
            if target.is_symlink() or not (target / 'payload').is_file():
                failed.append(name + '/' + directory)
assert not failed, 'External links in package: ' + ', '.join(failed)
print('PASS: all platforms copy the linked data into standalone packages')
