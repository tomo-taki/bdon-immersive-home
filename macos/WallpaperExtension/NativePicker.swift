import Foundation

/// The system picker exposes the scene selected in BDON.
/// Codable wire layout follows Aerial; see Aerial-LICENSE.txt.
enum NativePicker {
    private static let choiceID = "bdon"
    private static let modelClass = "WallpaperSettingsViewModelsXPC"
    private static var selected: NativeScene?

    static func remember(_ scene: NativeScene) { selected = scene }

    static func make(provider: String) -> NSObject? {
        guard !provider.isEmpty, let fallback = SpotCatalog.spots.first, let root = SpotCatalog.dataRoot else { return nil }
        let scene = selected ?? NativeScene(spot: fallback.id, characters: true, hidden: [],
                                           parallax: SpotCatalog.cursorSupport(for: fallback) == .available)
        guard let configuration = try? JSONEncoder().encode(scene) else { return nil }
        let suffix = scene.characters ? ".jpg" : "_bg.jpg"
        let thumbnail = Thumbnail.image(url: root.appendingPathComponent("thumbs/\(scene.spot)\(suffix)"))
        let id = ChoiceID(id: choiceID, descriptor: Descriptor(provider: provider, identifier: choiceID,
                                                              files: [], configuration: configuration))
        let choice = Choice(id: id, provider: provider, identifier: choiceID, name: "BDON Immersive Home",
                            localizedDescription: "BDON에서 선택한 장면", thumbnail: thumbnail,
                            isDownloaded: true, options: [])
        let item = Item(id: id, localizedName: choice.name, thumbnail: thumbnail, choice: choice)
        let group = Group(id: ID(id: choiceID), items: [item], localizedName: choice.name,
                          sortID: ID(id: provider))
        let model = Model(groups: [group])
        let wrapper = PickerArchive(value: Models(desktop: model, screenSaver: model))
        guard let data = try? NSKeyedArchiver.archivedData(withRootObject: wrapper, requiringSecureCoding: false),
              let type = NSClassFromString(modelClass),
              let decoder = try? NSKeyedUnarchiver(forReadingFrom: data) else { return nil }
        decoder.requiresSecureCoding = false
        decoder.decodingFailurePolicy = .setErrorAndReturn
        decoder.setClass(type, forClassName: PickerArchive.archiveName)
        let result = decoder.decodeObject(forKey: NSKeyedArchiveRootObjectKey) as? NSObject
        decoder.finishDecoding()
        return decoder.error == nil ? result : nil
    }

    private struct Models: Encodable {
        let desktop: Model
        let screenSaver: Model
    }

    private struct Model: Encodable {
        let groups: [Group]
        private let refreshPolicy = Flag.default
        private let isModificationDisabled = false
    }

    private struct Group: Encodable {
        let id: ID
        let items: [Item]
        let localizedName: String
        let sortID: ID
        private let disposability = Flag.none
        private let sortOrder = 0
        private let shouldHideItemLabels = false
    }

    private struct ID: Encodable { let id: String }
    private struct ChoiceID: Encodable { let id: String; let descriptor: Descriptor }
    private struct Descriptor: Encodable {
        let provider: String
        let identifier: String
        let files: [URL]
        let configuration: Data
    }

    private struct Choice: Encodable {
        let id: ChoiceID
        let provider: String
        let identifier: String
        let name: String
        let localizedDescription: String
        let thumbnail: Thumbnail
        let isDownloaded: Bool
        let options: [String]
    }

    private struct Item: Encodable {
        let id: ChoiceID
        let localizedName: String
        let thumbnail: Thumbnail
        let choice: Choice
        private let contentBadge = Flag.none
        private let showInTopLevel = true
        private let sortOrder = 0
        private let disposability = Flag.none
    }

    private enum Thumbnail: Encodable { case image(url: URL) }
    private enum Flag: Encodable { case none, `default` }

    @objc(BDONModelsArchive)
    private final class PickerArchive: NSObject, NSSecureCoding {
        static let archiveName = "BDONModelsArchive"
        static let supportsSecureCoding = true
        private static let payloadKey = "WallpaperSettingsViewModels"
        private let value: Models

        init(value: Models) { self.value = value }
        required init?(coder: NSCoder) { return nil }

        func encode(with coder: NSCoder) {
            guard let archiver = coder as? NSKeyedArchiver else { return }
            try? archiver.encodeEncodable(value, forKey: Self.payloadKey)
        }
    }
}
