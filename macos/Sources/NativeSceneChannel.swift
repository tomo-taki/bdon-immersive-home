import Foundation

/// The host writes its extension's scene; notifications carry no userInfo.
final class NativeSceneChannel {
    private static let requestName = "scene-request.json"
    private let directory: URL
    private let notification: Notification.Name

    init(provider: String, directory: URL? = nil) {
        notification = Notification.Name(provider + ".sceneChanged")
        if let directory { self.directory = directory; return }
        if Bundle.main.bundleIdentifier == provider {
            self.directory = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
                .appendingPathComponent(NativeStatus.directory)
            return
        }
        self.directory = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/Containers/\(provider)/Data/Library/Application Support/\(NativeStatus.directory)")
    }

    func send(_ scene: NativeScene) throws {
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        try JSONEncoder().encode(scene).write(to: directory.appendingPathComponent(Self.requestName), options: .atomic)
        DistributedNotificationCenter.default().postNotificationName(notification, object: nil, userInfo: nil,
                                                                     deliverImmediately: true)
    }

    func latest() -> NativeScene? {
        guard let data = try? Data(contentsOf: directory.appendingPathComponent(Self.requestName)) else { return nil }
        return try? JSONDecoder().decode(NativeScene.self, from: data)
    }

    func observe(_ receive: @escaping (NativeScene) -> Void) -> NSObjectProtocol {
        DistributedNotificationCenter.default().addObserver(forName: notification, object: nil, queue: .main) {
            [weak self] _ in
            guard let scene = self?.latest() else { return }
            receive(scene)
        }
    }

    func clear() throws {
        let file = directory.appendingPathComponent(Self.requestName)
        if FileManager.default.fileExists(atPath: file.path) { try FileManager.default.removeItem(at: file) }
    }
}
