import Foundation

/// Bundle ids. Releases are `com.togawa.bdon-immersive-home`. macos/build.sh
/// puts a dev build (`<id>.dev`) in dist/ and macos/make_dmg.sh restores the
/// release id: a build left in the repo must never stand in for the installed
/// app, since LaunchServices launches the highest version among apps sharing
/// an id (the login item kept starting dist/, so the installed copy never ran
/// and never updated).
enum AppIdentity {
    static let bundleId = Bundle.main.bundleIdentifier ?? ""
    static let isDevBuild = bundleId.hasSuffix(devSuffix)

    /// The release id and its dev twin: one running copy across both.
    static var family: [String] {
        let release = isDevBuild ? String(bundleId.dropLast(devSuffix.count)) : bundleId
        return [release, release + devSuffix]
    }

    /// Ids of earlier builds, newest first (LegacyMigration).
    static let previousIds = ["moe.local.bdon-immersive-home", "moe.local.yumemita-wallpaper"]

    private static let devSuffix = ".dev"
}
