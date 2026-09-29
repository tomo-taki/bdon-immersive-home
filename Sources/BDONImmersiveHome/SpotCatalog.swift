import AppKit

/// One Home Spot situation from Resources/web/spots/index.json (tools/build_spot.py).
struct Spot: Decodable, Identifiable, Hashable {
    let id: String          // Spot id, e.g. "30001"
    let name: String        // Korean title
    let band: String
    let room: String        // background prefab, shared by several situations
    let dir: String         // "<room>/<id>", relative to spots/
    let characters: [String]
}

/// Bundled Spot list plus their settings thumbnails.
enum SpotCatalog {
    static let spots: [Spot] = {
        guard let url = webRoot?.appendingPathComponent("spots/index.json"),
              let data = try? Data(contentsOf: url),
              let list = try? JSONDecoder().decode([Spot].self, from: data) else {
            EventLog.write("Spot index missing")
            return []
        }
        return list
    }()

    /// Spots grouped by band, in index order.
    static var byBand: [(band: String, spots: [Spot])] {
        var order: [String] = []
        var groups: [String: [Spot]] = [:]
        for spot in spots {
            if groups[spot.band] == nil {
                order.append(spot.band)
            }
            groups[spot.band, default: []].append(spot)
        }
        return order.map { ($0, groups[$0] ?? []) }
    }

    static func spot(id: String) -> Spot? {
        spots.first { $0.id == id }
    }

    /// Thumbnail with or without characters (`<id>.jpg` / `<id>_bg.jpg`).
    /// Cached: the settings grid asks for all 39 on every redraw.
    static func thumbnail(for spot: Spot, characters: Bool) -> NSImage? {
        let key = "\(spot.id)-\(characters)" as NSString
        if let cached = thumbnails.object(forKey: key) {
            return cached
        }
        guard let dir = webRoot?.appendingPathComponent("thumbs") else { return nil }
        let preferred = dir.appendingPathComponent(characters ? "\(spot.id).jpg" : "\(spot.id)_bg.jpg")
        let fallback = dir.appendingPathComponent("\(spot.id).jpg")
        guard let image = NSImage(contentsOf: preferred) ?? NSImage(contentsOf: fallback) else { return nil }
        thumbnails.setObject(image, forKey: key)
        return image
    }

    private static let thumbnails = NSCache<NSString, NSImage>()

    /// Band logo files in web/bands (copied from icon/bands).
    private static let bandIcons = [
        "MyGO!!!!!": "mygo",
        "Ave Mujica": "avemujica",
        "夢限大みゅーたいぷ": "yumemita",
        "millsage": "millsage",
        "一家Dumb Rock!": "ikka",
    ]

    static func bandIcon(_ band: String) -> NSImage? {
        guard let name = bandIcons[band],
              let url = webRoot?.appendingPathComponent("bands/\(name).png") else { return nil }
        return NSImage(contentsOf: url)
    }

    /// Contents/Resources/web, or Resources/web when run from the repo.
    static let webRoot: URL? = {
        if let bundled = Bundle.main.resourceURL?.appendingPathComponent("web"),
           FileManager.default.fileExists(atPath: bundled.path) {
            return bundled
        }
        let dev = URL(fileURLWithPath: FileManager.default.currentDirectoryPath).appendingPathComponent("Resources/web")
        return FileManager.default.fileExists(atPath: dev.path) ? dev : nil
    }()
}
