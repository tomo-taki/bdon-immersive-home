import Foundation
import PaperSaverKit

private let trialProvider = "com.togawa.bdon.integration.wallpaper"
private let originalProvider = "org.example.original.wallpaper"
private let trialToken = Data("spot:30002".utf8)
private let firstDisplay = "display-a"
private let secondDisplay = "display-b"
private let trialSpace = "space-a"
private let unknownKey = "FutureAppleField"

/// The real agent is never restarted; only this temporary store can be written.
private final class StoreFixture {
    let saver: PaperSaver
    let file: StoreFile
    private let directory: URL

    init() throws {
        directory = FileManager.default.temporaryDirectory.appendingPathComponent("BDONPaperSaver-\(UUID())")
        let url = directory.appendingPathComponent("Index.plist")
        file = StoreFile(url: url)
        let choice = SlotConfiguration(choice: WallpaperChoice(provider: ChoiceProvider(rawValue: originalProvider)),
                                       optionValues: .values(.image()))
        let section = StoreSection(type: .individual, desktop: choice, idle: choice,
                                   extra: [unknownKey: .string("section")])
        try file.write(WallpaperStore(allSpacesAndDisplays: section, systemDefault: section,
                                     spaces: [trialSpace: SpaceEntry(default: section,
                                                                    displays: [firstDisplay: section, secondDisplay: section])],
                                     displays: [firstDisplay: section, secondDisplay: section],
                                     extra: [unknownKey: .string("root")]))

        var configuration = PaperSaverConfiguration()
        configuration.storeURL = url
        configuration.writeOptions = .noRestart
        configuration.log = .silent
        // This provider is synthetic; renderer availability is a separate host check.
        configuration.validatesWallpaperExtensions = false
        saver = PaperSaver(configuration: configuration)
    }

    deinit {
        try? FileManager.default.removeItem(at: directory)
    }
}

private func mirrorKeepsBothSlots() async throws {
    let fixture = try StoreFixture()
    let outcome = try await fixture.saver.setWallpaperExtension(
        bundleID: trialProvider, configuration: trialToken, slot: .desktop, otherSlot: .mirror)
    try expect(outcome == .writtenWithoutRestart)

    for section in try fixture.saver.readStore().allSections {
        try expect(section.desktop?.provider?.rawValue == trialProvider)
        try expect(section.idle?.provider?.rawValue == trialProvider)
        try expect(section.desktop?.choices.first?.configuration == trialToken)
        try expect(section.idle?.choices.first?.configuration == trialToken)
        try expect(section.desktop?.optionValues.values?.backgroundColor != nil)
        try expect(section.desktop?.optionValues.values?.placement == .crop)
    }
}

private func singleSlotClearsMirror() async throws {
    let fixture = try StoreFixture()
    try await fixture.saver.setWallpaperExtension(bundleID: trialProvider, slot: .desktop, otherSlot: .mirror)
    try await fixture.saver.setWallpaperExtension(bundleID: trialProvider, slot: .screensaver)
    try expect(fixture.saver.getCurrentScreensaverExtension() == trialProvider)
    try expect(fixture.saver.getCurrentWallpaperExtension() == nil)
}

private func keepLeavesDesktopAlone() async throws {
    let fixture = try StoreFixture()
    try await fixture.saver.setWallpaperExtension(bundleID: trialProvider, slot: .screensaver, otherSlot: .keep)
    try expect(fixture.saver.getCurrentWallpaperExtension() == originalProvider)
    try expect(fixture.saver.getCurrentScreensaverExtension() == trialProvider)
}

private func backupRestoresBytes() async throws {
    let fixture = try StoreFixture()
    let original = try fixture.file.readRaw()
    try await fixture.saver.setWallpaperExtension(bundleID: trialProvider, slot: .desktop, otherSlot: .mirror)
    try expect(try fixture.file.readRaw() != original)
    try expect(fixture.saver.backupInfo() != nil)

    try await fixture.saver.restoreFromBackup(restartAgent: false)
    try expect(try fixture.file.readRaw() == original)
}

private func snapshotRestoresBothSlots() throws {
    let fixture = try StoreFixture()
    let original = try fixture.file.readRaw()
    let snapshot = try fixture.file.write(WallpaperStore())
    try expect(try fixture.file.readRaw() != original)

    try fixture.file.restore(snapshot)
    try expect(try fixture.file.readRaw() == original)
}

private func keepsUnknownStoreFields() async throws {
    let fixture = try StoreFixture()
    try await fixture.saver.setWallpaperExtension(bundleID: trialProvider, slot: .desktop, otherSlot: .mirror)
    let store = try fixture.saver.readStore()
    try expect(store.extra[unknownKey] == .string("root"))
    try expect(store.allSections.allSatisfy { $0.extra[unknownKey] == .string("section") })
}

private func targetsOneDisplaySpace() async throws {
    let fixture = try StoreFixture()
    let target = StoreTarget.spaceOnDisplay(spaceUUID: trialSpace, displayUUID: firstDisplay)
    try await fixture.saver.setWallpaperExtension(bundleID: trialProvider, slot: .desktop,
                                                 otherSlot: .mirror, target: target)
    let store = try fixture.saver.readStore()
    try expect(store.spaces[trialSpace]?.displays[firstDisplay]?.desktop?.provider?.rawValue == trialProvider)
    try expect(store.spaces[trialSpace]?.displays[firstDisplay]?.idle?.provider?.rawValue == trialProvider)
    try expect(store.spaces[trialSpace]?.displays[secondDisplay]?.desktop?.provider?.rawValue == originalProvider)
    try expect(store.systemDefault?.desktop?.provider?.rawValue == originalProvider)
}

private func requiresRegisteredExtension() throws {
    let missing = PaperSaver.wallpaperExtensionError(bundleID: trialProvider,
                                                     wallpaperExtensions: [], screensaverExtensions: [])
    try expect(missing != nil)

    let registered = PluginkitExtension(bundleIdentifier: trialProvider, version: "1", uuid: "fixture",
                                        path: URL(fileURLWithPath: "/fixture/Wallpaper.appex"))
    try expect(PaperSaver.wallpaperExtensionError(bundleID: trialProvider,
                                              wallpaperExtensions: [registered], screensaverExtensions: []) == nil)
}

private func linkedImageIsStillAnImage() throws {
    let image = URL(fileURLWithPath: "/fixture/spot.jpg")
    let choice = SlotConfiguration(choice: try WallpaperChoice(provider: .image, configuration: .imageFile(image)),
                                   optionValues: .values(.image()))
    let store = WallpaperStore(systemDefault: StoreSection(type: .linked, linked: choice))
    try expect(store.slot(.desktop)?.provider == .image)
    try expect(store.slot(.screensaver)?.provider == .image)
    try expect(store.slot(.screensaver)?.configuration == .imageFile(image))
}

private struct CheckFailure: Error {
    let file: String
    let line: Int
}

private func expect(_ condition: @autoclosure () throws -> Bool,
                    file: String = #filePath, line: Int = #line) throws {
    guard try condition() else { throw CheckFailure(file: file, line: line) }
}

@main
private enum PaperSaverTests {
    static func main() async throws {
        let tests: [(String, () async throws -> Void)] = [
            ("mirror keeps both slots", mirrorKeepsBothSlots),
            ("single slot clears mirror", singleSlotClearsMirror),
            ("keep preserves desktop", keepLeavesDesktopAlone),
            ("backup restores bytes", backupRestoresBytes),
            ("snapshot restores slots", snapshotRestoresBothSlots),
            ("unknown fields survive", keepsUnknownStoreFields),
            ("per-display Space target", targetsOneDisplaySpace),
            ("extension registration required", requiresRegisteredExtension),
            ("linked image stays static", linkedImageIsStillAnImage),
        ]
        for (name, test) in tests {
            try await test()
            print("PASS: PaperSaver \(name)")
        }
    }
}
