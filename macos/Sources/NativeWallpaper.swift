import AppKit
import Combine
import PaperSaverKit

/// App-facing integration state; PaperSaver owns all system-store writes.
@MainActor
final class NativeWallpaper: ObservableObject {
    enum State: Equatable {
        case desktop, applying, active, failed(String)
    }

    static let shared = NativeWallpaper()
    @Published private(set) var state = State.desktop
    private let driver = NativeStoreDriver()
    private var subscription: AnyCancellable?
    private var applied: NativeScene?
    private var task: Task<Void, Never>?
    private var pending = false
    private var initialized = false
    private weak var settings: WallpaperSettings?

    static var supported: Bool {
        if #available(macOS 26, *), let plugins = Bundle.main.builtInPlugInsURL {
            return FileManager.default.fileExists(atPath: plugins.appendingPathComponent("BDONWallpaper.appex").path)
        }
        return false
    }

    func start(settings: WallpaperSettings) {
        self.settings = settings
        subscription = settings.objectWillChange.debounce(for: .milliseconds(150), scheduler: RunLoop.main)
            .sink { [weak self] _ in self?.refresh() }
        refresh()
    }

    func refresh() {
        guard task == nil else { pending = true; return }
        guard let settings else { return }
        let mode = settings.wallpaperMode
        let scene = NativeScene(spot: settings.spotId, characters: settings.showCharacters,
                                hidden: settings.spot.map { settings.easterEgg.hiddenMembers(in: $0) } ?? [],
                                parallax: settings.cursorEnabled,
                                diagnostics: ProcessInfo.processInfo.environment["BDON_NATIVE_TEST"] == "1")
        if mode == .integrated, scene == applied, state == .active { return }
        if mode == .desktop, state == .desktop, initialized { return }
        let operation: NativeStoreDriver.Operation = applied != nil && state == .active ? .update : .activate
        if operation == .activate || mode == .desktop { state = .applying }
        task = Task {
            do {
                if mode == .integrated {
                    guard Self.supported else { throw CocoaError(.featureUnsupported) }
                    try await driver.apply(scene, operation: operation)
                    applied = scene
                    state = .active
                } else {
                    try await driver.restore()
                    applied = nil
                    state = .desktop
                }
            } catch {
                state = .failed(error.localizedDescription)
                EventLog.write("native wallpaper failed: \(error)")
            }
            task = nil
            initialized = true
            if pending { pending = false; refresh() }
        }
    }
}

private actor NativeStoreDriver {
    enum Operation { case activate, update }
    private static let healthTimeout: TimeInterval = 20
    private static let healthPoll: Duration = .milliseconds(200)
    private static let agentTimeout: TimeInterval = 5
    private let saver = PaperSaver()
    private let channel = NativeSceneChannel(provider: AppIdentity.bundleId + ".wallpaper")
    private let original = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("BDONImmersiveHome/NativeWallpaper.plist")

    func apply(_ scene: NativeScene, operation: Operation) async throws {
        let app = Bundle.main
        guard let identifier = app.bundleIdentifier, let directory = app.builtInPlugInsURL else {
            throw CocoaError(.fileReadNoSuchFile)
        }
        let bundle = directory.appendingPathComponent("BDONWallpaper.appex")
        if operation == .activate {
            let catalog = PluginkitCatalog(extensionPoint: PluginkitCatalog.wallpaperExtensionPoint)
            try await catalog.register(at: bundle)
        }
        if !FileManager.default.fileExists(atPath: original.path) {
            let data = try StoreFile().readRaw()
            try FileManager.default.createDirectory(at: original.deletingLastPathComponent(), withIntermediateDirectories: true)
            try data.write(to: original, options: .atomic)
        }
        let started = Date()
        do {
            // Keep the existing system surface alive while its scene loads.
            if operation == .update {
                try channel.send(scene)
                _ = try await saver.setWallpaperExtension(bundleID: identifier + ".wallpaper",
                                                          configuration: JSONEncoder().encode(scene), slot: .desktop,
                                                          otherSlot: .mirror, options: .noRestart)
                try await waitForFrame(scene, since: started, provider: identifier + ".wallpaper")
                return
            }
            try channel.clear()
            let outcome = try await saver.setWallpaperExtension(bundleID: identifier + ".wallpaper",
                                                                configuration: JSONEncoder().encode(scene),
                                                                slot: .desktop, otherSlot: .mirror)
            guard outcome == .applied else { throw CocoaError(.featureUnsupported) }
            try await waitForFrame(scene, since: started, provider: identifier + ".wallpaper")
            try channel.send(scene)
        } catch {
            // A running process can still fail to acquire its Metal surface.
            try await restore()
            throw error
        }
    }

    private func waitForFrame(_ scene: NativeScene, since started: Date, provider: String) async throws {
        let cache = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/Containers/\(provider)/Data/Library/Caches/\(NativeStatus.directory)")
        let deadline = Date().addingTimeInterval(Self.healthTimeout)
        while Date() < deadline {
            let files = (try? FileManager.default.contentsOfDirectory(at: cache, includingPropertiesForKeys: nil)) ?? []
            for file in files where file.pathExtension == "json" {
                guard let data = try? Data(contentsOf: file),
                      let status = try? JSONDecoder().decode(NativeStatus.self, from: data),
                      status.updated >= started, status.scene == scene, status.frames > 0 else { continue }
                return
            }
            try await Task.sleep(for: Self.healthPoll)
        }
        throw CocoaError(.executableLoad)
    }

    func restore() async throws {
        try channel.clear()
        guard FileManager.default.fileExists(atPath: original.path) else { return }
        let data = try Data(contentsOf: original)
        // Keep a separate original: PaperSaver refreshes its own backup on every scene change.
        let store = StoreFile()
        guard let provider = Bundle.main.bundleIdentifier.map({ $0 + ".wallpaper" }) else {
            throw CocoaError(.propertyListReadCorrupt)
        }
        let backup = StoreFile(url: original)
        let current = try store.read()
        let restored = NativeRestore.merge(current, original: try backup.read(), provider: provider)
        if restored == current {
            try FileManager.default.removeItem(at: original)
            return
        }
        // Keep exact bytes when nobody changed the system selection during integration.
        let summary = StoreSummary(current)
        let owned = summary.sections.flatMap { [$0.desktop, $0.idle, $0.linked].compactMap { $0 } }
            .allSatisfy { $0.provider == provider }
        if owned { _ = try store.writeRaw(data) }
        else { _ = try store.write(restored) }
        let agent = WallpaperAgent()
        let before = WallpaperAgent.runningProcessIdentifiers()
        try await agent.restart()
        let deadline = Date().addingTimeInterval(Self.agentTimeout)
        while true {
            let current = WallpaperAgent.runningProcessIdentifiers()
            if !current.isEmpty, current.isDisjoint(with: before) { break }
            guard Date() < deadline else { throw CocoaError(.executableLoad) }
            try await Task.sleep(for: Self.healthPoll)
        }
        try FileManager.default.removeItem(at: original)
    }
}
