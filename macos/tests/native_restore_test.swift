import Foundation
import PaperSaverKit

@main
private enum RestoreTest {
    private static let provider = "test.bdon.wallpaper"

    private static func slot(_ name: String) -> SlotConfiguration {
        SlotConfiguration(choice: WallpaperChoice(provider: ChoiceProvider(rawValue: name)))
    }

    static func main() throws {
        let original = WallpaperStore(allSpacesAndDisplays: StoreSection(type: .linked, linked: slot("original")))
        var current = WallpaperStore(allSpacesAndDisplays: StoreSection(type: .individual,
                                                                       desktop: slot(provider), idle: slot(provider)))
        let restored = NativeRestore.merge(current, original: original, provider: provider)
        precondition(restored == original, "integration did not restore the linked wallpaper")

        current.allSpacesAndDisplays?.desktop = slot("user.selection")
        let partial = NativeRestore.merge(current, original: original, provider: provider)
        precondition(partial.allSpacesAndDisplays?.desktop?.provider?.rawValue == "user.selection")
        precondition(partial.allSpacesAndDisplays?.idle?.provider?.rawValue == "original")

        current.allSpacesAndDisplays?.idle = slot("user.screensaver")
        let untouched = NativeRestore.merge(current, original: original, provider: provider)
        precondition(untouched == current, "restore overwrote the user's later selection")
        print("PASS: restore preserves later system choices and restores only BDON slots")
    }
}
