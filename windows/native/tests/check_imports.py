#!/usr/bin/env python3
"""Parse a PE file's import directory and print the imported DLL names.

Pure stdlib (struct only) -- no pefile dependency. Handles PE32 and PE32+.
Verifies (SPEC "imports must be system DLLs only") that BDONImmersiveHome.exe
depends on nothing but Windows-shipped DLLs.
"""
import struct
import sys

# DLLs that ship with Windows (allow-list). Anything else is a red flag: it
# would mean a non-system runtime got dynamically linked instead of static.
SYSTEM_DLLS = {
    "kernel32.dll", "user32.dll", "gdi32.dll", "shell32.dll", "shlwapi.dll",
    "ole32.dll", "oleaut32.dll", "advapi32.dll", "d3d11.dll", "dxgi.dll",
    "d3dcompiler_47.dll", "gdiplus.dll", "wtsapi32.dll", "psapi.dll",
    "msvcrt.dll", "api-ms-win-crt-",  # UCRT forwarders (prefix match)
    "ntdll.dll", "rpcrt4.dll", "combase.dll", "sechost.dll", "bcrypt.dll",
    "version.dll", "winmm.dll", "imm32.dll", "powrprof.dll", "dwmapi.dll",
}


def is_system(name: str) -> bool:
    low = name.lower()
    if low in SYSTEM_DLLS:
        return True
    return any(low.startswith(p) for p in SYSTEM_DLLS if p.endswith("-"))


def rva_to_off(rva, sections):
    for va, vsz, raw, rsz in sections:
        if va <= rva < va + max(vsz, rsz):
            return raw + (rva - va)
    return None


def imports(path):
    with open(path, "rb") as f:
        data = f.read()
    if data[:2] != b"MZ":
        raise ValueError("not MZ")
    pe = struct.unpack_from("<I", data, 0x3C)[0]
    if data[pe:pe + 4] != b"PE\0\0":
        raise ValueError("not PE")
    coff = pe + 4
    machine, nsec = struct.unpack_from("<HH", data, coff)
    opt = coff + 20
    magic = struct.unpack_from("<H", data, opt)[0]
    if magic == 0x20B:      # PE32+
        dd = opt + 112
    elif magic == 0x10B:    # PE32
        dd = opt + 96
    else:
        raise ValueError("bad optional magic %#x" % magic)
    import_rva, import_sz = struct.unpack_from("<II", data, dd + 8)  # dir[1] = import
    sec_off = opt + struct.unpack_from("<H", data, coff + 16)[0]
    sections = []
    for i in range(nsec):
        base = sec_off + i * 40
        vsz, va, rsz, raw = struct.unpack_from("<IIII", data, base + 8)
        sections.append((va, vsz, raw, rsz))

    names = []
    off = rva_to_off(import_rva, sections)
    if off is None:
        return machine, names
    while True:
        oft, tstamp, fwd, name_rva, first = struct.unpack_from("<IIIII", data, off)
        if name_rva == 0 and first == 0 and oft == 0:
            break
        noff = rva_to_off(name_rva, sections)
        if noff is None:
            break
        end = data.index(b"\0", noff)
        names.append(data[noff:end].decode("ascii", "replace"))
        off += 20
    return machine, names


def main():
    ok = True
    for path in sys.argv[1:]:
        machine, dlls = imports(path)
        arch = {0x8664: "x64", 0xAA64: "arm64", 0x14C: "x86"}.get(machine, hex(machine))
        print(f"\n{path}  [{arch}]")
        for d in sorted(dlls, key=str.lower):
            flag = "OK " if is_system(d) else "NON-SYSTEM!"
            if not is_system(d):
                ok = False
            print(f"  {flag} {d}")
    print("\n" + ("ALL IMPORTS ARE SYSTEM DLLs" if ok else "FOUND NON-SYSTEM IMPORTS"))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
