import AppKit

/// Mirrors the wallpaper onto the macOS desktop picture, which is what the lock
/// screen (and Mission Control, and the moment before the app draws) shows.
/// No app can draw on the lock screen itself, so each display gets a still of
/// its Spot once the scene has settled. The user's own picture is remembered
/// per display and put back when the option is turned off.
///
/// Each display keeps its current and previous still. Older ones are deleted
/// together with the copies macOS caches of them (LockScreenCache); where that
/// cache is closed to us, a display keeps the still it has (LockScreenAccess).
enum LockScreenWallpaper {
    private static let originalsKey = "lockScreenOriginals"
    private static let queue = DispatchQueue(label: "bdon.lockscreen", qos: .userInitiated)
    /// Last stamp handed out (main thread): two displays settle in the same second.
    private static var lastStamp = 0

    static let directory: URL = {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent("BDONImmersiveHome/LockScreen", isDirectory: true)
    }()

    /// Every folder stills were written to, this build's first.
    private static let directories = [directory, LegacyMigration.oldLockScreenDirectory]

    private static func displayKey(_ screen: NSScreen) -> String {
        let number = screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber
        return "\(number?.uint32Value ?? 0)"
    }

    /// Write `image` and make it this display's desktop picture.
    static func apply(_ image: CGImage, to screen: NSScreen, spotId: String) {
        // Without access to the cache, each new still would stay there for
        // good: a display keeps the one it shows (unless that file is gone).
        let hasStill = NSWorkspace.shared.desktopImageURL(for: screen).map {
            isStill($0) && FileManager.default.fileExists(atPath: $0.path)
        } ?? false
        guard LockScreenAccess.shared.refresh() || !hasStill else {
            EventLog.write("lock screen still skipped: no access to the wallpaper cache")
            LockScreenAccess.shared.stillSkipped()
            return
        }
        let key = displayKey(screen)
        rememberOriginal(for: screen, key: key)
        // A new name each time: the system keeps showing a reused path's old picture.
        let used = stills().compactMap { LockScreenCache.parseStill($0.lastPathComponent)?.stamp }
        let stamp = LockScreenCache.nextStamp(now: Date(), after: used + [lastStamp])
        lastStamp = stamp
        let url = directory.appendingPathComponent(LockScreenCache.stillName(key: key, stamp: stamp))
        queue.async {
            do {
                try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
                guard let destination = CGImageDestinationCreateWithURL(url as CFURL, "public.jpeg" as CFString, 1, nil) else { return }
                CGImageDestinationAddImage(destination, image, [kCGImageDestinationLossyCompressionQuality: 0.9] as CFDictionary)
                guard CGImageDestinationFinalize(destination) else { return }
                // The mtime is part of the name macOS gives its cached copy.
                try FileManager.default.setAttributes([.modificationDate: Date(timeIntervalSince1970: TimeInterval(stamp))],
                                                      ofItemAtPath: url.path)
            } catch {
                EventLog.write("lock screen image failed: \(error)")
                return
            }
            DispatchQueue.main.async {
                do {
                    try NSWorkspace.shared.setDesktopImageURL(url, for: screen, options: [
                        .imageScaling: NSImageScaling.scaleProportionallyUpOrDown.rawValue,
                        .allowClipping: true,
                    ])
                    EventLog.write("desktop picture of display \(key) -> \(url.lastPathComponent) (\(spotId))")
                } catch {
                    EventLog.write("setDesktopImageURL failed: \(error)")
                }
                tidy()
            }
        }
    }

    /// Keep each connected display's current and previous still (only what
    /// the displays show, with the option off) and delete the rest.
    static func tidy(optionOn: Bool = true) {
        let screens = NSScreen.screens
        let keys = optionOn ? Set(screens.map(displayKey)) : []
        let showing = Set(screens.compactMap { NSWorkspace.shared.desktopImageURL(for: $0)?.path })
        let spotIds = SpotCatalog.spots.map(\.id)
        queue.async {
            let paths = stills().map(\.path)
            // The first build's folder keeps only what a display shows.
            let recent = LockScreenCache.newestTwo(paths.filter { $0.hasPrefix(directory.path + "/") }, keys: keys)
            remove(paths, keeping: recent.union(showing.intersection(paths)), keys: keys, spotIds: spotIds)
        }
    }

    /// Put every display's own picture back and delete our stills.
    static func restore() {
        let originals = UserDefaults.standard.dictionary(forKey: originalsKey) as? [String: String] ?? [:]
        // A display back under a new number has no picture of its own here:
        // it keeps showing its still rather than an empty desktop.
        var showing = Set<String>()
        for screen in NSScreen.screens {
            if let path = originals[displayKey(screen)] {
                try? NSWorkspace.shared.setDesktopImageURL(URL(fileURLWithPath: path), for: screen, options: [:])
            } else if let shown = NSWorkspace.shared.desktopImageURL(for: screen) {
                showing.insert(shown.path)
            }
        }
        UserDefaults.standard.removeObject(forKey: originalsKey)
        let spotIds = SpotCatalog.spots.map(\.id)
        queue.async {
            let paths = stills().map(\.path)
            remove(paths, keeping: showing.intersection(paths), keys: [], spotIds: spotIds)
        }
        EventLog.write("desktop pictures restored")
    }

    /// Delete `paths` except `keep`: first their entries in macOS's cache
    /// (found by the paths' names), then the files.
    private static func remove(_ paths: [String], keeping keep: Set<String>, keys: Set<String>, spotIds: [String]) {
        // Connected displays first. A display gone since may have taken its
        // number away; Apple silicon numbers displays from 1.
        let seen = paths.compactMap { LockScreenCache.parseStill(($0 as NSString).lastPathComponent)?.key }
        var candidates: [String] = []
        for key in keys.sorted() + seen + (0...64).map(String.init) where !candidates.contains(key) {
            candidates.append(key)
        }
        let stills = LockScreenCache.Stills(directories: directories.map(\.path), keys: candidates, spotIds: spotIds)
        for cache in LockScreenCache.directories where LockScreenCache.access(cache) == .granted {
            let freed = LockScreenCache.sweep(cache, keeping: keep, stills: stills)
            if freed.files > 0 {
                EventLog.write("deleted \(freed.files) cached stills (\(freed.bytes / 1_000_000) MB) in \(cache.path)")
            }
        }
        for path in paths where !keep.contains(path) {
            try? FileManager.default.removeItem(atPath: path)
        }
        for folder in directories where (try? FileManager.default.contentsOfDirectory(atPath: folder.path))?.isEmpty == true {
            try? FileManager.default.removeItem(at: folder)
        }
    }

    private static func stills() -> [URL] {
        directories.flatMap { (try? FileManager.default.contentsOfDirectory(at: $0, includingPropertiesForKeys: nil)) ?? [] }
    }

    private static func isStill(_ url: URL) -> Bool {
        directories.contains { url.path.hasPrefix($0.path + "/") }
    }

    /// The first time we touch a display, keep what the user had (unless it is ours).
    private static func rememberOriginal(for screen: NSScreen, key: String) {
        var originals = UserDefaults.standard.dictionary(forKey: originalsKey) as? [String: String] ?? [:]
        guard originals[key] == nil, let current = NSWorkspace.shared.desktopImageURL(for: screen),
              !isStill(current) else { return }
        originals[key] = current.path
        UserDefaults.standard.set(originals, forKey: originalsKey)
    }
}
