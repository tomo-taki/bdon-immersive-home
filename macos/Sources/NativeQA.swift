import AppKit
import PaperSaverKit

/// Exercise the shipped service without opening the wallpaper windows.
enum NativeQA {
    enum Action: String { case apply, restore, fail, transition }
    private static let timeout: TimeInterval = 45
    private static let poll: TimeInterval = 0.05

    @MainActor
    static func run(action: Action, output: URL) -> Int32 {
        _ = NSApplication.shared
        let settings = WallpaperSettings.shared
        if action == .fail { settings.spotId = "missing-scene-fixture" }
        settings.wallpaperMode = action == .restore ? .desktop : .integrated
        NativeWallpaper.shared.start(settings: settings)
        let deadline = Date().addingTimeInterval(timeout)
        while NativeWallpaper.shared.state == .applying, Date() < deadline {
            RunLoop.main.run(until: Date().addingTimeInterval(poll))
        }
        let state = NativeWallpaper.shared.state
        if action == .transition, state == .active { return transition(settings, output: output) }
        let success = action == .restore ? state == .desktop : state == .active
        let data: [String: Any] = ["success": success, "state": String(describing: state),
                                   "spot": settings.spotId, "bundle": AppIdentity.bundleId]
        try? JSONSerialization.data(withJSONObject: data, options: [.prettyPrinted, .sortedKeys]).write(to: output)
        return success ? EXIT_SUCCESS : EXIT_FAILURE
    }

    @MainActor
    private static func transition(_ settings: WallpaperSettings, output: URL) -> Int32 {
        let source = settings.spotId
        let beforeAgent = WallpaperAgent.runningProcessIdentifiers()
        let before = statuses(spot: source)
        let wanted = ProcessInfo.processInfo.environment["BDON_NATIVE_TARGET"].flatMap { SpotCatalog.spot(id: $0) }
        guard let target = wanted ?? SpotCatalog.spots.first(where: { $0.id != source }), target.id != source else {
            return EXIT_FAILURE
        }
        let started = Date()
        settings.spotId = target.id
        var after: [NativeStatus] = []
        let deadline = started.addingTimeInterval(timeout)
        while Date() < deadline {
            after = statuses(spot: target.id).filter { $0.updated >= started }
            if !after.isEmpty { break }
            if case .failed = NativeWallpaper.shared.state { break }
            RunLoop.main.run(until: Date().addingTimeInterval(poll))
        }
        let afterAgent = WallpaperAgent.runningProcessIdentifiers()
        let shared = before.compactMap { old -> Bool? in
            guard let new = after.first(where: { $0.mode == old.mode && $0.display == old.display }) else { return nil }
            return old.context == new.context
        }
        let stableAgent = beforeAgent == afterAgent
        let stableContext = !shared.isEmpty && shared.allSatisfy { $0 }
        let success = !after.isEmpty && stableAgent && stableContext
        let report: [String: Any] = ["success": success, "from": source, "to": target.id,
                                     "seconds": Date().timeIntervalSince(started),
                                     "agentUnchanged": stableAgent, "contextsUnchanged": stableContext,
                                     "beforeAgent": beforeAgent.sorted(), "afterAgent": afterAgent.sorted()]
        try? JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]).write(to: output)
        return success ? EXIT_SUCCESS : EXIT_FAILURE
    }

    private static func statuses(spot: String) -> [NativeStatus] {
        let cache = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/Containers/\(AppIdentity.bundleId).wallpaper/Data/Library/Caches/\(NativeStatus.directory)")
        let files = (try? FileManager.default.contentsOfDirectory(at: cache, includingPropertiesForKeys: nil)) ?? []
        return files.compactMap { file in
            guard let data = try? Data(contentsOf: file),
                  let status = try? JSONDecoder().decode(NativeStatus.self, from: data), status.scene.spot == spot else { return nil }
            return status
        }
    }
}
