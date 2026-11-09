import ExtensionFoundation
import Foundation
import os

final class BDONWallpaper: NSObject, AppExtension {
    required override init() {
        super.init()
        guard BDONPrepare() else { fatalError("WallpaperExtensionKit is unavailable") }
    }

    var configuration: some AppExtensionConfiguration { NativeConfig() }
}

@main
private enum NativeEntry {
    static func main() throws {
        let log = Logger(subsystem: "com.togawa.bdon-immersive-home", category: "extension")
        log.info("bundle: \(Bundle.main.bundleIdentifier ?? "missing", privacy: .public)")
        try BDONWallpaper.main()
    }
}

private struct NativeConfig: AppExtensionConfiguration {
    private enum Direction { case argument, reply }

    func accept(connection: NSXPCConnection) -> Bool {
        let interface = NSXPCInterface(with: BDONWallpaperProtocol.self)
        let names = ["WallpaperIDXPC", "WallpaperCreationRequestXPC", "WallpaperUpdateRequestXPC",
                     "WallpaperRemoteContextXPC", "WallpaperSnapshotXPC", "WallpaperContentTypeSetXPC",
                     "WallpaperChoiceIDXPC", "WallpaperChoiceIDsXPC", "WallpaperExtensionChoiceRequestXPC",
                     "WallpaperChoiceRequestAdditionResultXPC", "WallpaperDebugRequestXPC",
                     "WallpaperDebugResponseXPC", "WallpaperMigrationVersionXPC",
                     "WallpaperSettingsViewModelsXPC", "AuditTokenXPC"]
        let all = NSMutableSet(array: [NSString.self, NSNumber.self, NSData.self, NSArray.self,
                                      NSDictionary.self, NSURL.self, NSError.self])
        for name in names {
            if let type = NSClassFromString(name) { all.add(type) }
        }
        let classes = Set(all.compactMap { $0 as? AnyHashable })
        let arguments: [(Selector, Int, Direction)] = [
            (#selector(NativeHandler.acquire(withId:request:reply:)), 0, .argument),
            (#selector(NativeHandler.acquire(withId:request:reply:)), 1, .argument),
            (#selector(NativeHandler.acquire(withId:request:reply:)), 0, .reply),
            (#selector(NativeHandler.update(withId:request:reply:)), 0, .argument),
            (#selector(NativeHandler.update(withId:request:reply:)), 1, .argument),
            (#selector(NativeHandler.invalidate(withId:reply:)), 0, .argument),
            (#selector(NativeHandler.snapshot(withId:reply:)), 0, .argument),
            (#selector(NativeHandler.snapshot(withId:reply:)), 0, .reply),
            (#selector(NativeHandler.provideSettingsViewModels(withContentTypes:reply:)), 0, .argument),
            (#selector(NativeHandler.provideSettingsViewModels(withContentTypes:reply:)), 0, .reply),
            (#selector(NativeHandler.selectedChoicesDidChange(for:reply:)), 0, .argument),
            (#selector(NativeHandler.addChoiceRequest(withChoiceRequest:onBehalfOfProcess:reply:)), 0, .argument),
            (#selector(NativeHandler.addChoiceRequest(withChoiceRequest:onBehalfOfProcess:reply:)), 1, .argument),
            (#selector(NativeHandler.addChoiceRequest(withChoiceRequest:onBehalfOfProcess:reply:)), 0, .reply),
            (#selector(NativeHandler.removeChoiceRequest(withChoiceRequest:reply:)), 0, .argument),
            (#selector(NativeHandler.handleDebugRequest(for:reply:)), 0, .argument),
            (#selector(NativeHandler.handleDebugRequest(for:reply:)), 0, .reply),
        ]
        for (selector, index, direction) in arguments {
            interface.setClasses(classes, for: selector, argumentIndex: index, ofReply: direction == .reply)
        }
        connection.exportedInterface = interface
        connection.exportedObject = NativeHandler()
        connection.resume()
        return true
    }
}

private struct NativeRequest {
    private static let depthLimit = 12
    let size: CGSize
    let scale: CGFloat
    let display: UInt32
    let scene: NativeScene?
    let mode: NativeMode
    let activity: NativeActivity

    init(_ request: Any?) {
        let value: Any = request ?? ""
        let destination = Self.find("destination", in: value) ?? value
        size = Self.find("size", in: destination) as? CGSize ?? .zero
        scale = Self.find("scaleFactor", in: destination) as? CGFloat ?? 1
        display = Self.find("directDisplayID", in: destination) as? UInt32 ?? 0
        let data = Self.find("configuration", in: value) as? Data
        scene = data.flatMap { try? JSONDecoder().decode(NativeScene.self, from: $0) }
        let mode = Self.find("presentationMode", in: value).map { String(describing: $0) } ?? ""
        self.mode = NativeMode(rawValue: mode) ?? .unknown
        let state = Self.find("activityState", in: value).map { String(describing: $0) } ?? ""
        activity = state.contains("suspended") ? .suspended : .active
    }

    private static func find(_ label: String, in value: Any, depth: Int = 0) -> Any? {
        guard depth < depthLimit else { return nil }
        let children = Mirror(reflecting: value).children
        if let found = children.first(where: { $0.label == label }) { return found.value }
        for child in children {
            if let found = find(label, in: child.value, depth: depth + 1) { return found }
        }
        return nil
    }
}

private final class NativeHandler: NSObject, BDONWallpaperProtocol {
    // WallpaperAgent reconnects without discarding its contexts.
    private static var sessions: [String: NativeSession] = [:]
    private static let uuidPattern = "[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}"
    private static let channel = NativeSceneChannel(provider: Bundle.main.bundleIdentifier ?? "")
    private static let observer = channel.observe { scene in
        NativeSession.change(scene) { Array(NativeHandler.sessions.values) }
        NativePicker.remember(scene)
    }

    override init() {
        super.init()
        _ = Self.observer
    }

    private static func key(_ identifier: Any?) -> String? {
        guard let identifier else { return nil }
        let value = Mirror(reflecting: identifier).children.first?.value ?? identifier
        let text = String(describing: value)
        guard let range = text.range(of: uuidPattern, options: .regularExpression) else { return nil }
        return String(text[range]).lowercased()
    }

    func acquire(withId identifier: Any?, request: Any?, reply: @escaping (Any?, Error?) -> Void) {
        let parsed = NativeRequest(request)
        let key = Self.key(identifier)
        DispatchQueue.main.async {
            do {
                guard let key, let scene = Self.channel.latest() ?? parsed.scene,
                      parsed.size.width > 0, parsed.size.height > 0 else {
                    throw CocoaError(.coderInvalidValue)
                }
                let session = try NativeSession(scene: scene, size: parsed.size, scale: parsed.scale,
                                                display: parsed.display, mode: parsed.mode)
                guard let remote = session.remoteReply() else { throw CocoaError(.featureUnsupported) }
                Self.sessions[key] = session
                NativePicker.remember(scene)
                session.suspend(parsed.activity)
                reply(remote, nil)
            } catch {
                Logger(subsystem: "com.togawa.bdon-immersive-home", category: "extension")
                    .error("acquire failed: \(String(describing: error), privacy: .public)")
                reply(nil, error)
            }
        }
    }

    func update(withId identifier: Any?, request: Any?, reply: @escaping (Error?) -> Void) {
        let parsed = NativeRequest(request)
        let key = Self.key(identifier)
        DispatchQueue.main.async {
            if let key, let session = Self.sessions[key] {
                session.resize(parsed.size, scale: parsed.scale, mode: parsed.mode)
                session.suspend(parsed.activity)
            }
            reply(nil)
        }
    }

    func invalidate(withId identifier: Any?, reply: @escaping (Error?) -> Void) {
        let key = Self.key(identifier)
        DispatchQueue.main.async {
            if let key { Self.sessions.removeValue(forKey: key) }
            reply(nil)
        }
    }

    func snapshot(withId identifier: Any?, reply: @escaping (Any?, Error?) -> Void) {
        let key = Self.key(identifier)
        DispatchQueue.main.async {
            let snapshot = key.flatMap { Self.sessions[$0]?.snapshot() }
            reply(snapshot, snapshot == nil ? CocoaError(.coderInvalidValue) : nil)
        }
    }

    func provideSettingsViewModels(withContentTypes types: Any?, reply: @escaping (Any?, Error?) -> Void) {
        DispatchQueue.main.async {
            let models = NativePicker.make(provider: Bundle.main.bundleIdentifier ?? "")
            reply(models, models == nil ? CocoaError(.coderInvalidValue) : nil)
        }
    }
    func addChoiceRequest(withChoiceRequest request: Any?, onBehalfOfProcess process: Any?, reply: @escaping (Any?, Error?) -> Void) { reply(nil, nil) }
    func removeChoiceRequest(withChoiceRequest request: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func selectedChoicesDidChange(for identifier: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func invokeContextMenuAction(withMenuItemID item: Any?, groupItemID group: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func isChoiceDownloaded(with identifier: Any?, reply: @escaping (Bool, Error?) -> Void) { reply(true, nil) }
    func download(withChoiceID identifier: Any?, reply: (Error?) -> Void) -> Any? { reply(nil); return nil }
    func pauseDownload(for identifier: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func cancelDownload(for identifier: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func resumeDownload(for identifier: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func removeDownload(for identifier: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func migrateSelectedChoice(for identifier: Any?, reply: @escaping (Any?, Error?) -> Void) { reply(nil, nil) }
    func migrate(from source: Any?, to destination: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func skipShuffledContent(withId identifier: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
    func canSkipShuffledContent(withId identifier: Any?, reply: @escaping (Bool, Error?) -> Void) { reply(false, nil) }
    func handleDebugRequest(for request: Any?, reply: @escaping (Any?, Error?) -> Void) { reply(nil, nil) }
    func handleNotification(withNamed name: Any?, reply: @escaping (Error?) -> Void) { reply(nil) }
}
