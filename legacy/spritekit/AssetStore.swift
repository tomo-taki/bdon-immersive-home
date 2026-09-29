import AppKit
import SpriteKit

/// Loads the sprites cut by tools/prepare_assets.py.
/// Looks in the app bundle first, then next to the executable's repo (dev runs).
enum AssetStore {
    private static let folder = "scene"
    private static var cache: [String: SKTexture] = [:]

    static func texture(_ name: String) -> SKTexture {
        if let hit = cache[name] {
            return hit
        }

        guard let url = url(name, ext: "png"), let image = NSImage(contentsOf: url) else {
            NSLog("Missing sprite: \(name)")
            return SKTexture()
        }

        let texture = SKTexture(image: image)
        texture.filteringMode = .linear
        cache[name] = texture
        return texture
    }

    static func url(_ name: String, ext: String) -> URL? {
        let file = "\(name).\(ext)"
        var roots: [URL] = []

        if let resources = Bundle.main.resourceURL {
            roots.append(resources.appendingPathComponent(folder))
        }
        if let dev = ProcessInfo.processInfo.environment["YUMEMITA_ASSETS"] {
            roots.append(URL(fileURLWithPath: dev))
        }
        roots.append(URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
            .appendingPathComponent("Resources/\(folder)"))

        return roots
            .map { $0.appendingPathComponent(file) }
            .first { FileManager.default.fileExists(atPath: $0.path) }
    }
}
