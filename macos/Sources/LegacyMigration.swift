import AppKit

/// Earlier builds ran under other bundle ids (AppIdentity.previousIds; the
/// first one wrote its files under "OurNotesWallpaper"). On the first launch
/// under the current id, carry the settings over and stop a still-running old
/// build, so the user keeps their Spot, options and lock-screen originals.
enum LegacyMigration {
    /// Where the oldest build wrote its lock-screen stills.
    static let oldLockScreenDirectory: URL = {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent("OurNotesWallpaper/LockScreen", isDirectory: true)
    }()
    private static let doneKey = "migratedLegacySettings"

    static func run() {
        // An old build still running would draw a second set of windows.
        for id in AppIdentity.previousIds {
            for old in NSRunningApplication.runningApplications(withBundleIdentifier: id) {
                old.terminate()
            }
        }
        let defaults = UserDefaults.standard
        guard !defaults.bool(forKey: doneKey) else { return }
        defaults.set(true, forKey: doneKey)

        // Newest id first: a setting comes from the latest build that had it.
        for id in AppIdentity.previousIds {
            guard let old = defaults.persistentDomain(forName: id), !old.isEmpty else { continue }
            for (key, value) in old where defaults.object(forKey: key) == nil {
                defaults.set(value, forKey: key)
            }
            EventLog.write("migrated \(old.count) settings from \(id)")
        }
    }
}
