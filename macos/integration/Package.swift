// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "BDONIntegration",
    platforms: [.macOS(.v14)],
    dependencies: [
        .package(url: "https://github.com/AerialScreensaver/PaperSaver.git", exact: "0.4.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle.git", exact: "2.10.1"),
    ],
    targets: [
        .executableTarget(
            name: "IntegrationProbe",
            dependencies: [
                .product(name: "PaperSaverKit", package: "PaperSaver"),
                .product(name: "Sparkle", package: "Sparkle"),
            ]
        ),
        .executableTarget(
            name: "PaperSaverTests",
            dependencies: [.product(name: "PaperSaverKit", package: "PaperSaver")],
            path: "Tests/PaperSaverTests"
        ),
    ]
)
