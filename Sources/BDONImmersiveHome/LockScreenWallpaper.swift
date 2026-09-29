import AppKit

/// Mirrors the wallpaper onto the macOS desktop picture, which is what the lock
/// screen (and Mission Control, and the moment before the app draws) shows.
/// No app can draw on the lock screen itself, so each display gets a still of
/// its Spot once the scene has settled. The user's own picture is remembered
/// per display and put back when the option is turned off.
enum LockScreenWallpaper {
    private static let originalsKey = "lockScreenOriginals"
    private static let queue = DispatchQueue(label: "bdon.lockscreen", qos: .utility)

    static let directory: URL = {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent("BDONImmersiveHome/LockScreen", isDirectory: true)
    }()

    private static func displayKey(_ screen: NSScreen) -> String {
        let number = screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber
        return "\(number?.uint32Value ?? 0)"
    }

    /// Write `image` and make it this display's desktop picture.
    static func apply(_ image: CGImage, to screen: NSScreen, spotId: String) {
        let key = displayKey(screen)
        rememberOriginal(for: screen, key: key)
        // A new file name each time: the system caches desktop pictures by URL.
        let url = directory.appendingPathComponent("\(key)-\(spotId)-\(Int(Date().timeIntervalSince1970)).jpg")
        queue.async {
            do {
                try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
                guard let destination = CGImageDestinationCreateWithURL(url as CFURL, "public.jpeg" as CFString, 1, nil) else { return }
                CGImageDestinationAddImage(destination, image, [kCGImageDestinationLossyCompressionQuality: 0.9] as CFDictionary)
                guard CGImageDestinationFinalize(destination) else { return }
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
                    EventLog.write("desktop picture of display \(key) -> \(url.lastPathComponent)")
                } catch {
                    EventLog.write("setDesktopImageURL failed: \(error)")
                }
                removeOld(key: key, keeping: url)
            }
        }
    }

    /// Put every display's own picture back and delete our stills.
    static func restore() {
        let originals = UserDefaults.standard.dictionary(forKey: originalsKey) as? [String: String] ?? [:]
        for screen in NSScreen.screens {
            guard let path = originals[displayKey(screen)] else { continue }
            try? NSWorkspace.shared.setDesktopImageURL(URL(fileURLWithPath: path), for: screen, options: [:])
        }
        UserDefaults.standard.removeObject(forKey: originalsKey)
        try? FileManager.default.removeItem(at: directory)
        try? FileManager.default.removeItem(at: LegacyMigration.oldLockScreenDirectory)
        EventLog.write("desktop pictures restored")
    }

    /// The first time we touch a display, keep what the user had (unless it is ours).
    private static func rememberOriginal(for screen: NSScreen, key: String) {
        var originals = UserDefaults.standard.dictionary(forKey: originalsKey) as? [String: String] ?? [:]
        guard originals[key] == nil, let current = NSWorkspace.shared.desktopImageURL(for: screen),
              !current.path.hasPrefix(directory.path),
              !current.path.hasPrefix(LegacyMigration.oldLockScreenDirectory.path) else { return }
        originals[key] = current.path
        UserDefaults.standard.set(originals, forKey: originalsKey)
    }

    private static func removeOld(key: String, keeping: URL) {
        let files = (try? FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)) ?? []
        for file in files where file.lastPathComponent.hasPrefix("\(key)-") && file != keeping {
            try? FileManager.default.removeItem(at: file)
        }
    }
}
