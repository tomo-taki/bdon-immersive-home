import AppKit
import SwiftUI

// `--snapshot <out.png> [width height] [spotId] [chars 0|1]` renders one frame and exits (QA).
let args = CommandLine.arguments
if let flag = args.firstIndex(of: "--snapshot"), flag + 1 < args.count {
    let out = URL(fileURLWithPath: args[flag + 1])
    let rest = Array(args.dropFirst(flag + 2))
    let width = rest.count > 1 ? Double(rest[0]) ?? 1920 : 1920
    let height = rest.count > 1 ? Double(rest[1]) ?? 1080 : 1080
    let spot = (rest.count > 2 ? SpotCatalog.spot(id: rest[2]) : nil) ?? SpotCatalog.spots.first
    let characters = rest.count > 3 ? rest[3] != "0" : true
    guard let spot else {
        FileHandle.standardError.write(Data("no Spot data\n".utf8))
        exit(1)
    }
    let ok = Snapshot.render(to: out, size: CGSize(width: width, height: height), spot: spot, characters: characters,
                             hidden: (ProcessInfo.processInfo.environment["BDON_HIDE"] ?? "").split(separator: ",").map(String.init))
    exit(ok ? 0 : 1)
}

// `--bench <spotId> <width> <height> [frames]` prints GPU time per frame (QA).
if let flag = args.firstIndex(of: "--bench"), flag + 3 < args.count, let spot = SpotCatalog.spot(id: args[flag + 1]),
   let width = Int(args[flag + 2]), let height = Int(args[flag + 3]) {
    let frames = flag + 4 < args.count ? Int(args[flag + 4]) ?? 150 : 150
    exit(Snapshot.bench(spot: spot, width: width, height: height, frames: frames) ? 0 : 1)
}

// `--settings-snapshot <out.png>` renders the settings window offscreen and exits (QA).
// SETTINGS_TAB=배경|상세|정보, SETTINGS_SECTION=표시|셔플 picks the tab, SETTINGS_OPEN=characters|interval|...
// opens that option pill. `--about-snapshot <out.png>` is the 정보 tab.
let settingsShot = args.firstIndex(of: "--settings-snapshot"), aboutShot = args.firstIndex(of: "--about-snapshot")
if let flag = settingsShot ?? aboutShot, flag + 1 < args.count {
    _ = NSApplication.shared
    let env = ProcessInfo.processInfo.environment
    let nav = SettingsNav(settings: WallpaperSettings.shared)
    if let tab = env["SETTINGS_TAB"].flatMap(SettingsNav.Tab.init(rawValue:)) { nav.tab = tab }
    if aboutShot != nil { nav.tab = .about }
    if let section = env["SETTINGS_SECTION"].flatMap(SettingsNav.Section.init(rawValue:)) { nav.section = section }
    switch env["SETTINGS_OPEN"] {
    case "characters": nav.expanded = .characters
    case "parallax": nav.expanded = .parallax
    case "lockScreen": nav.expanded = .lockScreen
    case "shuffle": nav.expanded = .shuffle
    case "interval": nav.expanded = .interval
    default: break
    }
    let view: NSView = NSHostingView(rootView: SettingsView(settings: WallpaperSettings.shared, nav: nav))
    view.frame = CGRect(x: 0, y: 0, width: 980, height: 700)
    let window = NSWindow(contentRect: view.frame, styleMask: [.titled], backing: .buffered, defer: false)
    window.contentView = view
    view.layoutSubtreeIfNeeded()
    RunLoop.main.run(until: Date().addingTimeInterval(1.5))   // let lazy grids load thumbnails

    guard let rep = view.bitmapImageRepForCachingDisplay(in: view.bounds) else { exit(1) }
    view.cacheDisplay(in: view.bounds, to: rep)
    let ok = (try? rep.representation(using: .png, properties: [:])?.write(to: URL(fileURLWithPath: args[flag + 1]))) != nil
    exit(ok ? 0 : 1)
}

// Menu-bar-only app: no Dock icon, wallpaper windows on every display.
let app = NSApplication.shared

// One instance only: a second copy (login item + manual launch, or the old
// "BDON Immersive Home.app" build sharing this bundle id) would stack a
// second set of desktop windows and double the memory.
let myPid = ProcessInfo.processInfo.processIdentifier
let others = NSRunningApplication.runningApplications(withBundleIdentifier: Bundle.main.bundleIdentifier ?? "")
    .filter { $0.processIdentifier != myPid }
if !others.isEmpty {
    EventLog.write("another instance is running (pid \(others.map(\.processIdentifier))); exiting")
    EventLog.flush()
    exit(0)
}

LegacyMigration.run()
EventLog.removeOldLogs()

let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
