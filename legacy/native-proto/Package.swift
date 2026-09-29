// swift-tools-version:5.9
// Native Metal prototype of the Our Notes Wallpaper renderer:
// spine-c 4.2 (animation) + a hand-written Metal renderer for the Spot room
// (glb) and the residents. No WebKit.
import PackageDescription

let package = Package(
    name: "native-proto",
    platforms: [.macOS(.v14)],
    targets: [
        // Official spine-c 4.2 runtime (vendor/spine-runtimes, branch 4.2).
        .target(
            name: "SpineC",
            path: "vendor/spine-runtimes/spine-c/spine-c",
            sources: ["src"],
            publicHeadersPath: "include",
            cSettings: [.unsafeFlags(["-w"])]
        ),
        // C glue: loading, per-frame update, and triangle output for Metal.
        .target(name: "SpineBridge", dependencies: ["SpineC"]),
        .executableTarget(
            name: "NativeProto",
            dependencies: ["SpineBridge"],
            linkerSettings: [.linkedFramework("Metal"), .linkedFramework("MetalKit"), .linkedFramework("MetalFX"),
                             .linkedFramework("AppKit")]
        ),
    ]
)
