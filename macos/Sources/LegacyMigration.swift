import AppKit

/// The app used to ship as bundle id `moe.local.yumemita-wallpaper` with its
/// files under "OurNotesWallpaper". On the first launch under the new id,
/// carry the settings over and stop a still-running old build, so the user
/// keeps their Spot, options and lock-screen originals.
enum LegacyMigration {
    static let oldBundleId = "moe.local.yumemita-wallpaper"
    /// Where the old build wrote its lock-screen stills.
    static let oldLockScreenDirectory: URL = {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent("OurNotesWallpaper/LockScreen", isDirectory: true)
    }()
    private static let doneKey = "migratedFromYumemitaWallpaper"

    static func run() {
        for old in NSRunningApplication.runningApplications(withBundleIdentifier: oldBundleId) {
            old.terminate()
        }
        let defaults = UserDefaults.standard
        guard !defaults.bool(forKey: doneKey) else { return }
        defaults.set(true, forKey: doneKey)
        guard let old = UserDefaults.standard.persistentDomain(forName: oldBundleId), !old.isEmpty else { return }
        for (key, value) in old where defaults.object(forKey: key) == nil {
            defaults.set(value, forKey: key)
        }
        EventLog.write("migrated \(old.count) settings from \(oldBundleId)")
    }
}
