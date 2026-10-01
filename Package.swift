// swift-tools-version:5.9
// BDON Immersive Home: menu-bar app drawing game Home Spots on the desktop
// with a native Metal renderer (spine-c 4.2 for the residents, a glb reader
// for the room).
import PackageDescription

let package = Package(
    name: "BDONImmersiveHome",
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
        .target(name: "SpineBridge", dependencies: ["SpineC"], path: "shared/spine-bridge"),
        .executableTarget(
            name: "BDONImmersiveHome",
            dependencies: ["SpineBridge"],
            path: "macos/Sources",
            linkerSettings: [.linkedFramework("Metal"), .linkedFramework("MetalKit"), .linkedFramework("MetalFX")]
        ),
    ]
)
