import Foundation

enum WallpaperMode: String, CaseIterable {
    case desktop, integrated
}

/// Opaque wallpaper choice shared by the app and its extension.
struct NativeScene: Codable, Equatable, Hashable {
    let spot: String
    let characters: Bool
    let hidden: [String]
    var parallax = true
    var diagnostics = false
}

/// A completed GPU frame, used to reject extensions that launch but cannot draw.
struct NativeStatus: Codable {
    static let directory = "BDONWallpaper"
    let scene: NativeScene
    let frames: Int
    let mode: String
    let display: UInt32
    let width: Double
    let height: Double
    let timeline: UUID
    let context: UInt32
    let updated: Date
}
