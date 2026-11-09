import Foundation

/// The desktop API separates Desktop from Idle on each change. Match the
/// linked document System Settings writes for its Automatic screen saver.
struct LockScreenState {
    private enum Key {
        static let type = "Type", linked = "Linked", desktop = "Desktop", idle = "Idle"
        static let global = "AllSpacesAndDisplays", system = "SystemDefault"
        static let displays = "Displays", spaces = "Spaces", defaultSpace = "Default"
        static let content = "Content", choices = "Choices", provider = "Provider"
        static let configuration = "Configuration", url = "url", relative = "relative"
        static let imageProvider = "com.apple.wallpaper.choice.image"
        static let linkedType = "linked", individualType = "individual", null = "$null"
    }

    private var document: [String: Any]

    init(_ document: [String: Any]) { self.document = document }

    var propertyList: [String: Any] { document }

    func hasLink(_ image: URL) -> Bool {
        var snapshot = self
        var found = false
        snapshot.visit { node, _ in
            guard let linked = node[Key.linked] as? [String: Any], Self.image(linked) == image else { return }
            found = true
        }
        return found
    }

    mutating func link(_ image: URL) -> Int {
        var changed = 0
        visit { node, _ in
            guard let desktop = node[Key.desktop] as? [String: Any], Self.image(desktop) == image else { return }
            node[Key.type] = Key.linkedType
            node[Key.linked] = desktop
            node.removeValue(forKey: Key.desktop)
            node.removeValue(forKey: Key.idle)
            changed += 1
        }
        if changed > 0 { document[Key.global] = Key.null }
        return changed
    }

    mutating func restore(_ original: [String: Any], directories: [URL]) -> Int {
        var changed = 0
        visit { node, path in
            let current = node[Key.linked] as? [String: Any] ?? node[Key.idle] as? [String: Any]
            guard let current, let url = Self.image(current),
                  directories.contains(where: { url.path.hasPrefix($0.path + "/") }) else { return }
            let saved = Self.node(original, at: path) ?? original[Key.system] as? [String: Any] ?? [:]
            let desktop = node[Key.desktop] ?? node[Key.linked]
            node.removeValue(forKey: Key.linked)
            if saved[Key.type] as? String == Key.linkedType {
                node[Key.type] = Key.linkedType
                node[Key.linked] = desktop
                node.removeValue(forKey: Key.desktop)
                node.removeValue(forKey: Key.idle)
            } else {
                node[Key.type] = Key.individualType
                node[Key.desktop] = desktop
                node[Key.idle] = saved[Key.idle]
            }
            changed += 1
        }
        if changed > 0 { document[Key.global] = original[Key.global] }
        return changed
    }

    private static func image(_ node: [String: Any]) -> URL? {
        guard let content = node[Key.content] as? [String: Any],
              let choices = content[Key.choices] as? [[String: Any]], choices.count == 1,
              choices[0][Key.provider] as? String == Key.imageProvider,
              let data = choices[0][Key.configuration] as? Data,
              let config = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any],
              let url = config[Key.url] as? [String: Any], let relative = url[Key.relative] as? String else { return nil }
        return URL(string: relative)
    }

    private static func node(_ root: [String: Any], at path: [String]) -> [String: Any]? {
        var node = root
        for key in path {
            guard let next = node[key] as? [String: Any] else { return nil }
            node = next
        }
        return node
    }

    private mutating func visit(_ change: (inout [String: Any], [String]) -> Void) {
        if var system = document[Key.system] as? [String: Any] {
            change(&system, [Key.system])
            document[Key.system] = system
        }
        if var displays = document[Key.displays] as? [String: [String: Any]] {
            for key in Array(displays.keys) {
                change(&displays[key]!, [Key.displays, key])
            }
            document[Key.displays] = displays
        }
        guard var spaces = document[Key.spaces] as? [String: [String: Any]] else { return }
        for key in Array(spaces.keys) {
            if var node = spaces[key]?[Key.defaultSpace] as? [String: Any] {
                change(&node, [Key.spaces, key, Key.defaultSpace])
                spaces[key]?[Key.defaultSpace] = node
            }
            guard var displays = spaces[key]?[Key.displays] as? [String: [String: Any]] else { continue }
            for display in Array(displays.keys) {
                change(&displays[display]!, [Key.spaces, key, Key.displays, display])
            }
            spaces[key]?[Key.displays] = displays
        }
        document[Key.spaces] = spaces
    }
}

/// Serial-queue driver. Suspend the agent during the atomic edit so its
/// cached document cannot overwrite it; relaunch it to load the new link.
enum LockScreenLink {
    private static let backupKey = "lockScreenStoreOriginal"
    private static let waitLimit: TimeInterval = 5
    private static let pollInterval: TimeInterval = 0.1
    private static let store = FileManager.default.homeDirectoryForCurrentUser
        .appendingPathComponent("Library/Application Support/com.apple.wallpaper/Store/Index.plist")

    private enum LinkError: Error { case imagePending }

    private enum Signal: String {
        case stop = "-STOP", resume = "-CONT", terminate = "-TERM"
    }

    static func remember() throws {
        guard UserDefaults.standard.data(forKey: backupKey) == nil,
              FileManager.default.fileExists(atPath: store.path) else { return }
        UserDefaults.standard.set(try Data(contentsOf: store), forKey: backupKey)
    }

    static func apply(_ image: URL) throws {
        // NSWorkspace returns before WallpaperAgent persists the new desktop.
        let deadline = ProcessInfo.processInfo.systemUptime + waitLimit
        while true {
            do {
                try edit { state in
                    let count = state.link(image)
                    guard count > 0 || state.hasLink(image) else { throw LinkError.imagePending }
                    return count
                }
                return
            } catch LinkError.imagePending {
                guard ProcessInfo.processInfo.systemUptime < deadline else { throw LinkError.imagePending }
                Thread.sleep(forTimeInterval: pollInterval)
            }
        }
    }

    static func restore(directories: [URL]) throws {
        guard let data = UserDefaults.standard.data(forKey: backupKey),
              let original = try PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any] else { return }
        try edit { state in state.restore(original, directories: directories) }
        UserDefaults.standard.removeObject(forKey: backupKey)
    }

    private static func edit(_ change: (inout LockScreenState) throws -> Int) throws {
        guard FileManager.default.fileExists(atPath: store.path) else { return }
        let stopped = try signal(.stop) == 0
        do {
            let data = try Data(contentsOf: store)
            guard let document = try PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any] else {
                throw CocoaError(.propertyListReadCorrupt)
            }
            var state = LockScreenState(document)
            let count = try change(&state)
            if count > 0 {
                let output = try PropertyListSerialization.data(fromPropertyList: state.propertyList, format: .binary, options: 0)
                let permissions = try FileManager.default.attributesOfItem(atPath: store.path)[.posixPermissions]
                try output.write(to: store, options: .atomic)
                if let permissions { try FileManager.default.setAttributes([.posixPermissions: permissions], ofItemAtPath: store.path) }
                EventLog.write("linked lock-screen entries: \(count)")
            }
            if stopped {
                _ = try signal(.resume)
                if count > 0 { _ = try signal(.terminate) }
            }
        } catch {
            if stopped { _ = try? signal(.resume) }
            throw error
        }
    }

    private static func signal(_ signal: Signal) throws -> Int32 {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/killall")
        process.arguments = [signal.rawValue, "-u", NSUserName(), "WallpaperAgent"]
        process.standardOutput = FileHandle.nullDevice
        process.standardError = FileHandle.nullDevice
        try process.run()
        process.waitUntilExit()
        return process.terminationStatus
    }
}
