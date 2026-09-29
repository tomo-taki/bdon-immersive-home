// swift-tools-version:5.9
// Our Notes Wallpaper: menu-bar app drawing game Home Spots on the desktop
// with a native Metal renderer (spine-c 4.2 for the residents, a glb reader
// for the room). The WebKit renderer it replaced lives in legacy/webkit.
import PackageDescription

let package = Package(
    name: "YumemitaWallpaper",
    platforms: [.macOS(.v14)],
    targets: [
        // Official spine-c 4.2 runtime (sparse clone of spine-runtimes, branch 4.2).
        .target(
            name: "SpineC",
            path: "vendor/spine-runtimes/spine-c/spine-c",
            sources: ["src"],
            publicHeadersPath: "include",
            cSettings: [.unsafeFlags(["-w"])]
        ),
        // C glue: loading, per-frame update, and triangle output for Metal.
        .target(name: "SpineBridge", dependencies: ["SpineC"], path: "Sources/SpineBridge"),
        .executableTarget(
            name: "YumemitaWallpaper",
            dependencies: ["SpineBridge"],
            path: "Sources/YumemitaWallpaper",
            linkerSettings: [.linkedFramework("Metal"), .linkedFramework("MetalKit"), .linkedFramework("MetalFX")]
        ),
    ]
)
