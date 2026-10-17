import CryptoKit
import Foundation

/// LockScreenCache against entry names built the way the wallpaper agent
/// builds them (observed on macOS 26+), without touching the real cache.
@main
private enum LockScreenCacheTest {
    private static let folder = "/Users/me/Library/Application Support/BDONImmersiveHome/LockScreen"
    private static let oldFolder = "/Users/me/Library/Application Support/OurNotesWallpaper/LockScreen"

    /// `<sha256(path)>-<w>-<h>-0-<mtime as big-endian Double since 2001>.bmp`.
    private static func entryName(_ path: String, mtime: Double, size: String = "3840-2160") -> String {
        let hash = SHA256.hash(data: Data(path.utf8)).map { String(format: "%02x", $0) }.joined()
        return "\(hash)-\(size)-0-\(mtimeHex(mtime))"
    }

    private static func mtimeHex(_ mtime: Double) -> String {
        let hex = String((mtime - 978_307_200).bitPattern, radix: 16)
        return String(repeating: "0", count: 16 - hex.count) + hex + ".bmp"
    }

    static func main() throws {
        names()
        entries()
        ownership()
        keepSet()
        try sweep()
        print("PASS: still names, cache entries, keep set and sweep")
    }

    private static func names() {
        precondition(LockScreenCache.stillName(key: "3", stamp: 1792231182) == "3-1792231182.jpg")
        precondition(LockScreenCache.parseStill("3-1792231182.jpg")! == ("3", 1792231182))
        precondition(LockScreenCache.parseStill("12-30002-1790734122.jpg")! == ("12", 1790734122))
        for bad in ["x-1.jpg", "3-1.png", "3.jpg", "3-a-b-1.jpg", "3-30001-x.jpg", "-1.jpg"] {
            precondition(LockScreenCache.parseStill(bad) == nil, bad)
        }
        let now = Date(timeIntervalSince1970: 100.7)
        precondition(LockScreenCache.nextStamp(now: now, after: []) == 100)
        precondition(LockScreenCache.nextStamp(now: now, after: [99]) == 100)
        precondition(LockScreenCache.nextStamp(now: now, after: [100, 98]) == 101)
        precondition(LockScreenCache.nextStamp(now: Date(timeIntervalSince1970: 105.2), after: [100]) == 105)
    }

    private static func entries() {
        let zero = String(repeating: "0", count: 64)
        // Observed: a still stamped 1792231182 with that mtime got this suffix.
        precondition(mtimeHex(1792231182) == "41c841bf47000000.bmp")
        let whole = LockScreenCache.Entry("\(zero)-3840-2160-0-41c841bf47000000.bmp")!
        precondition(whole.mtime == 1792231182)
        // Observed: an earlier still named ...-1792229805.jpg, written 0.15 s later.
        let late = LockScreenCache.Entry("\(zero)-3840-2160-0-41c841bc96932bcd.bmp")!
        precondition(Int(late.mtime) == 1792229805 && late.mtime > 1792229805.14 && late.mtime < 1792229805.16)
        for bad in ["cacheVersion.db", "\(zero)-3840-2160-0-41c841bf47000000.jpg",
                    "abc-3840-2160-0-41c841bf47000000.bmp", "\(zero)-3840-2160-0-41c8.bmp",
                    "\(zero)-3840-2160-41c841bf47000000.bmp"] {
            precondition(LockScreenCache.Entry(bad) == nil, bad)
        }
    }

    private static func ownership() {
        let spots = (0..<39).map { String(10001 + $0) }
        let stills = LockScreenCache.Stills(directories: [folder, oldFolder], keys: (0...64).map(String.init), spotIds: spots)
        let entry = { (path: String, mtime: Double) in LockScreenCache.Entry(entryName(path, mtime: mtime))! }

        precondition(stills.owns(entry("\(folder)/3-1792231182.jpg", 1792231182)))
        precondition(stills.owns(entry("\(folder)/12-1792231182.jpg", 1792231182)), "other display")
        precondition(stills.owns(entry("\(folder)/3-10009-1792229805.jpg", 1792229805.15)), "earlier name")
        precondition(stills.owns(entry("\(folder)/3-10009-1792229805.jpg", 1792229809.9)), "written late")
        precondition(stills.owns(entry("\(oldFolder)/1-10001-1790000000.jpg", 1790000000.5)), "first build's folder")
        precondition(!stills.owns(entry("\(folder)/3-1792231182.jpg", 1792231182.5)), "mtime is not the stamp")
        precondition(!stills.owns(entry("\(folder)/99-1792231182.jpg", 1792231182)), "unknown display")
        precondition(!stills.owns(entry("/System/Library/CoreServices/DefaultDesktop.heic", 1700000000)))

        let foreign = entry("/Users/me/Pictures/cat.jpg", 1792229805.15)
        let started = Date()
        precondition(!stills.owns(foreign))
        print(String(format: "a foreign entry takes %.0f ms to rule out", Date().timeIntervalSince(started) * 1000))
    }

    private static func keepSet() {
        let paths = ["3-100.jpg", "3-102.jpg", "3-101.jpg", "3-30001-99.jpg", "5-200.jpg", "7-150.jpg", ".DS_Store"]
            .map { "\(folder)/\($0)" }
        let kept = LockScreenCache.newestTwo(paths, keys: ["3", "7"])
        precondition(kept == Set(["3-102.jpg", "3-101.jpg", "7-150.jpg"].map { "\(folder)/\($0)" }), "\(kept)")
        // Right after an update the current still still has the earlier name.
        let mixed = LockScreenCache.newestTwo(["\(folder)/3-30001-1000.jpg", "\(folder)/3-900.jpg", "\(folder)/3-1001.jpg"],
                                              keys: ["3"])
        precondition(mixed == ["\(folder)/3-1001.jpg", "\(folder)/3-30001-1000.jpg"])
        precondition(LockScreenCache.newestTwo(paths, keys: []).isEmpty)
    }

    private static func sweep() throws {
        let cache = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: cache, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: cache) }

        let current = "\(folder)/3-1792231182.jpg", previous = "\(folder)/3-10009-1792229805.jpg"
        let files = [
            "current": entryName(current, mtime: 1792231182),
            "previous": entryName(previous, mtime: 1792229805.15),
            "retired": entryName("\(folder)/3-1792230000.jpg", mtime: 1792230000),
            "retiredOld": entryName("\(folder)/3-10003-1792220000.jpg", mtime: 1792220001.2, size: "1920-1080"),
            "foreign": entryName("/Users/me/Pictures/cat.jpg", mtime: 1792229805.15),
            "version": "cacheVersion.db",
        ]
        for (index, name) in files.values.enumerated() {
            try Data(count: 100 + index).write(to: cache.appendingPathComponent(name))
        }
        let stills = LockScreenCache.Stills(directories: [folder], keys: ["3"], spotIds: ["10003", "10009"])
        let freed = LockScreenCache.sweep(cache, keeping: [current, previous], stills: stills)
        let left = Set(try FileManager.default.contentsOfDirectory(atPath: cache.path))
        precondition(left == Set(["current", "previous", "foreign", "version"].map { files[$0]! }), "\(left)")
        precondition(freed.files == 2 && freed.bytes >= 200, "\(freed)")

        // Nothing kept (the option was turned off): every still of ours goes.
        let again = LockScreenCache.sweep(cache, keeping: [], stills: stills)
        let rest = Set(try FileManager.default.contentsOfDirectory(atPath: cache.path))
        precondition(again.files == 2 && rest == [files["foreign"]!, files["version"]!], "\(rest)")
        precondition(LockScreenCache.access(cache) == .granted)
        precondition(LockScreenCache.access(cache.appendingPathComponent("missing")) == .absent)
    }
}
