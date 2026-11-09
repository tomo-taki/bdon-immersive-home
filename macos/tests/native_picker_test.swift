import Darwin
import Foundation

@main
private enum PickerTest {
    private static let framework = "/System/Library/PrivateFrameworks/WallpaperExtensionKit.framework/WallpaperExtensionKit"
    private static let provider = "com.togawa.bdon-immersive-home.dev.wallpaper"

    static func main() throws {
        guard #available(macOS 26, *) else {
            print("SKIP: wallpaper picker requires macOS 26")
            return
        }
        guard let handle = dlopen(framework, RTLD_NOW) else { fatalError("WallpaperExtensionKit unavailable") }
        defer { dlclose(handle) }
        guard let spot = SpotCatalog.spots.first else { fatalError("Spot fixture unavailable") }
        NativePicker.remember(NativeScene(spot: spot.id, characters: false, hidden: []))
        guard let models = NativePicker.make(provider: provider) else { fatalError("Wallpaper picker ABI changed") }
        precondition(NSStringFromClass(type(of: models)) == "WallpaperSettingsViewModelsXPC")
        let archive = try NSKeyedArchiver.archivedData(withRootObject: models, requiringSecureCoding: false)
        precondition(!archive.isEmpty)
        print("PASS: system framework decodes BDON wallpaper and screensaver choices")
    }
}
