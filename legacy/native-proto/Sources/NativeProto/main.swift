import AppKit
import Metal
import MetalKit
import simd

// Native Metal prototype: one desktop-level window per display, drawing a
// Home Spot with no WebKit in the process.
//
//   native-proto                               wallpaper (menu bar: spot list, characters, quit)
//   native-proto --spot 10001                  start on a Spot
//   native-proto --snapshot out.png W H ID [s] offscreen frame after s seconds (default 4.5)

let spotsDir = URL(fileURLWithPath: ProcessInfo.processInfo.environment["SPOTS_DIR"]
    ?? "/Users/seungheonhan/workspace/yumemita-wallpaper/Resources/web/spots")
let spotIndex: [SpotIndexEntry] = (try? JSONDecoder().decode([SpotIndexEntry].self,
    from: Data(contentsOf: spotsDir.appendingPathComponent("index.json")))) ?? []

func camera(for stage: SpotStage, width: Float, height: Float, pointer: SIMD2<Float>) -> (Mat4, Mat4) {
    let s = stage.data.situation
    let base = defaultPose(s, fov: fitFov(s, width: width, height: height))
    let pose = shiftedPose(base, px: pointer.x, py: pointer.y, s, aspect: width / max(height, 1))
    let eye = rightHanded(pose.position)
    let target = rightHanded(pose.position + lookDirection(pose))
    let view = lookAt(eye: eye, target: target)
    let projection = perspective(fovY: pose.fov, aspect: width / max(height, 1),
                                 near: stage.data.camera.near, far: stage.data.camera.far)
    return (view, projection)
}

func footprintMB() -> Int {
    var info = rusage_info_v4()
    let rc = withUnsafeMutablePointer(to: &info) {
        $0.withMemoryRebound(to: rusage_info_t?.self, capacity: 1) { proc_pid_rusage(getpid(), RUSAGE_INFO_V4, $0) }
    }
    return rc == 0 ? Int(info.ri_phys_footprint / 1_048_576) : -1
}

// MARK: - Snapshot

func snapshot(out: String, width: Int, height: Int, id: String, seconds: Double) -> Int32 {
    guard let device = MTLCreateSystemDefaultDevice(), let entry = spotIndex.first(where: { $0.id == id }) else {
        print("no device or unknown spot \(id)")
        return 1
    }
    TextureBridge.install(device: device)
    do {
        let started = Date()
        let renderer = try SpotRenderer(device: device)
        let stage = try SpotStage(spotsDir: spotsDir, dir: entry.dir, device: device)
        let loadTime = Date().timeIntervalSince(started)

        // Same moment as the WebKit QA shots: step the clip at 30 fps.
        var t = 0.0
        _ = stage.advance(0, cameraMoving: true)
        while t < seconds {
            _ = stage.advance(1.0 / 30, cameraMoving: true)
            t += 1.0 / 30
        }

        let d = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: .bgra8Unorm, width: width, height: height, mipmapped: false)
        d.usage = [.renderTarget, .shaderRead]
        d.storageMode = .managed
        let target = device.makeTexture(descriptor: d)!
        // QA: NP_POINTER="x,y" (-1...1) renders with the cursor-parallax offset.
        let p = (ProcessInfo.processInfo.environment["NP_POINTER"] ?? "0,0").split(separator: ",").compactMap { Float($0) }
        let (view, projection) = camera(for: stage, width: Float(width), height: Float(height),
                                        pointer: p.count == 2 ? SIMD2(p[0], p[1]) : .zero)

        let buffer = renderer.queue.makeCommandBuffer()!
        renderer.draw(stage: stage, view: view, projection: projection, charactersVisible: true, into: target, commandBuffer: buffer)
        let blit = buffer.makeBlitCommandEncoder()!
        blit.synchronize(resource: target)
        blit.endEncoding()
        buffer.commit()
        buffer.waitUntilCompleted()

        var pixels = [UInt8](repeating: 0, count: width * height * 4)
        target.getBytes(&pixels, bytesPerRow: width * 4, from: MTLRegionMake2D(0, 0, width, height), mipmapLevel: 0)
        let space = CGColorSpace(name: CGColorSpace.sRGB)!
        let info = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.noneSkipFirst.rawValue
        let image = pixels.withUnsafeMutableBytes {
            CGContext(data: $0.baseAddress, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4,
                      space: space, bitmapInfo: info)!.makeImage()!
        }
        let rep = NSBitmapImageRep(cgImage: image)
        try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out))
        print(String(format: "ok load=%.2fs footprint=%dMB residents=%d", loadTime, footprintMB(), stage.residents.count))
        return 0
    } catch {
        print("error: \(error)")
        return 1
    }
}

// MARK: - Wallpaper

final class WallpaperView: MTKView, MTKViewDelegate {
    private let renderer: SpotRenderer
    private(set) var stage: SpotStage?
    private var last = CACurrentMediaTime()
    private var pointer = SIMD2<Float>.zero
    private var smooth = SIMD2<Float>.zero
    var charactersVisible = true {
        didSet { stage?.charactersVisible = charactersVisible }
    }
    var frames = 0

    init(frame: CGRect, renderer: SpotRenderer) {
        self.renderer = renderer
        super.init(frame: frame, device: renderer.device)
        colorPixelFormat = .bgra8Unorm
        preferredFramesPerSecond = 30
        delegate = self
    }

    required init(coder: NSCoder) { fatalError() }

    override func hitTest(_ point: NSPoint) -> NSView? { nil }

    func show(_ entry: SpotIndexEntry) {
        do {
            let started = Date()
            let next = try SpotStage(spotsDir: spotsDir, dir: entry.dir, device: renderer.device)
            next.charactersVisible = charactersVisible
            stage = next
            print(String(format: "spot %@ loaded in %.2fs, footprint %dMB", entry.id, Date().timeIntervalSince(started), footprintMB()))
        } catch {
            print("spot \(entry.id) failed: \(error)")
        }
    }

    func setPointer(_ p: SIMD2<Float>) { pointer = p }

    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {}

    func draw(in view: MTKView) {
        let now = CACurrentMediaTime()
        let delta = min(0.25, now - last)
        last = now
        guard let stage else { return }

        let previous = smooth
        smooth += (pointer - smooth) * 0.06
        let moving = simd_length(smooth - previous) > 1e-4
        // Idle: nothing animates and the camera is still -> keep the last frame.
        guard stage.advance(delta, cameraMoving: moving) || moving else { return }

        guard let drawable = currentDrawable, let buffer = renderer.queue.makeCommandBuffer() else { return }
        let size = drawableSize
        let (viewMatrix, projection) = camera(for: stage, width: Float(size.width), height: Float(size.height), pointer: smooth)
        renderer.draw(stage: stage, view: viewMatrix, projection: projection, charactersVisible: charactersVisible,
                      into: drawable.texture, commandBuffer: buffer)
        buffer.present(drawable)
        buffer.commit()
        frames += 1
    }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var window: NSWindow?
    private var view: WallpaperView?
    private var status: NSStatusItem?
    private var current: SpotIndexEntry?
    private var timers: [Timer] = []

    func applicationDidFinishLaunching(_ notification: Notification) {
        guard let device = MTLCreateSystemDefaultDevice(), let screen = NSScreen.main,
              let renderer = try? SpotRenderer(device: device) else {
            print("Metal unavailable")
            NSApp.terminate(nil)
            return
        }
        TextureBridge.install(device: device)

        let window = NSWindow(contentRect: screen.frame, styleMask: .borderless, backing: .buffered, defer: false, screen: screen)
        window.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopWindow)))
        window.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle]
        window.ignoresMouseEvents = true
        window.hasShadow = false
        window.backgroundColor = .black
        let view = WallpaperView(frame: CGRect(origin: .zero, size: screen.frame.size), renderer: renderer)
        view.autoresizingMask = [.width, .height]
        window.contentView = view
        window.setFrame(screen.frame, display: true)
        window.orderBack(nil)
        self.window = window
        self.view = view

        let args = CommandLine.arguments
        let startId = args.firstIndex(of: "--spot").flatMap { $0 + 1 < args.count ? args[$0 + 1] : nil } ?? "30001"
        show(spotIndex.first { $0.id == startId } ?? spotIndex[0])
        buildMenu()

        // Cursor -> camera, like the WebKit build (20 Hz poll).
        timers.append(Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
            guard let self, let window = self.window else { return }
            let mouse = NSEvent.mouseLocation, f = window.frame
            let x = Float(((mouse.x - f.midX) / (f.width / 2)).clamped(-1, 1))
            let y = Float(((mouse.y - f.midY) / (f.height / 2)).clamped(-1, 1))
            self.view?.setPointer(SIMD2(x, y))
        })
        // Memory + frame count once a minute.
        timers.append(Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            print("footprint \(footprintMB())MB frames/min \(self?.view?.frames ?? 0)")
            self?.view?.frames = 0
        })
    }

    private func show(_ entry: SpotIndexEntry) {
        current = entry
        view?.show(entry)
        refreshMenu()
    }

    private func buildMenu() {
        let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        item.button?.title = "Metal"
        status = item
        refreshMenu()
    }

    private func refreshMenu() {
        guard let status else { return }
        let menu = NSMenu()
        menu.addItem(withTitle: "Metal 시제품 · \(current.map { "\($0.band) · \($0.name)" } ?? "-")", action: nil, keyEquivalent: "")
        menu.addItem(.separator())

        var bands: [String: NSMenu] = [:]
        var order: [String] = []
        for entry in spotIndex {
            if bands[entry.band] == nil {
                bands[entry.band] = NSMenu()
                order.append(entry.band)
            }
            let spot = NSMenuItem(title: "\(entry.id) \(entry.name)", action: #selector(pick(_:)), keyEquivalent: "")
            spot.target = self
            spot.representedObject = entry.id
            spot.state = entry.id == current?.id ? .on : .off
            bands[entry.band]?.addItem(spot)
        }
        for band in order {
            let parent = NSMenuItem(title: band, action: nil, keyEquivalent: "")
            parent.submenu = bands[band]
            menu.addItem(parent)
        }
        menu.addItem(.separator())
        let characters = NSMenuItem(title: "캐릭터 표시", action: #selector(toggleCharacters), keyEquivalent: "")
        characters.target = self
        characters.state = view?.charactersVisible == false ? .off : .on
        menu.addItem(characters)
        menu.addItem(withTitle: "종료", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        status.menu = menu
    }

    @objc private func pick(_ sender: NSMenuItem) {
        guard let id = sender.representedObject as? String, let entry = spotIndex.first(where: { $0.id == id }) else { return }
        show(entry)
    }

    @objc private func toggleCharacters() {
        view?.charactersVisible.toggle()
        refreshMenu()
    }
}

private extension CGFloat {
    func clamped(_ low: CGFloat, _ high: CGFloat) -> CGFloat { Swift.min(Swift.max(self, low), high) }
}

// MARK: - Entry

let args = CommandLine.arguments

// `--bench ID W H [frames]`: GPU time per frame (moving camera, animating
// residents) at the renderer's renderScale (NP_SCALE).
if let flag = args.firstIndex(of: "--bench"), flag + 3 < args.count,
   let entry = spotIndex.first(where: { $0.id == args[flag + 1] }),
   let width = Int(args[flag + 2]), let height = Int(args[flag + 3]),
   let device = MTLCreateSystemDefaultDevice(), let renderer = try? SpotRenderer(device: device) {
    let frames = flag + 4 < args.count ? Int(args[flag + 4]) ?? 120 : 120
    TextureBridge.install(device: device)
    let d = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: .bgra8Unorm, width: width, height: height, mipmapped: false)
    d.usage = [.renderTarget]
    d.storageMode = .private
    let target = device.makeTexture(descriptor: d)!
    let stage = autoreleasepool { try! SpotStage(spotsDir: spotsDir, dir: entry.dir, device: device) }
    var gpu: [Double] = []
    var cpu: [Double] = []
    for i in 0 ..< frames { autoreleasepool {
        let started = CACurrentMediaTime()
        _ = stage.advance(1.0 / 30, cameraMoving: true)
        let angle = Float(i) / Float(frames) * 2 * .pi
        let (view, projection) = camera(for: stage, width: Float(width), height: Float(height),
                                        pointer: SIMD2(cos(angle), sin(angle)) * 0.5)
        let buffer = renderer.queue.makeCommandBuffer()!
        renderer.draw(stage: stage, view: view, projection: projection, charactersVisible: true, into: target, commandBuffer: buffer)
        buffer.commit()
        cpu.append((CACurrentMediaTime() - started) * 1000)
        buffer.waitUntilCompleted()
        if i >= 10 { gpu.append((buffer.gpuEndTime - buffer.gpuStartTime) * 1000) }
    } }
    gpu.sort()
    cpu.sort()
    let mb = { (bytes: Int) in bytes / 1_048_576 }
    print("GPU allocated \(mb(device.currentAllocatedSize))MB: room textures \(stage.room.textures.map { mb($0.allocatedSize) })MB, "
          + "room vertices \(mb(stage.roomVertices.allocatedSize + stage.roomIndices.allocatedSize))MB, "
          + "atlas pages \(TextureBridge.allocatedMB())MB")
    print(String(format: "bench %@ %dx%d scale %.2f: GPU median %.2f ms p95 %.2f ms, CPU encode median %.2f ms, footprint %dMB",
                 entry.id, width, height, renderer.renderScale, gpu[gpu.count / 2], gpu[gpu.count * 95 / 100],
                 cpu[cpu.count / 2], footprintMB()))
    if let hold = ProcessInfo.processInfo.environment["NP_HOLD"].flatMap(Double.init) { Thread.sleep(forTimeInterval: hold) }
    exit(0)
}

// `--soak N`: load N Spots in turn offscreen (render one frame each) and
// print the footprint, to check that switching frees everything.
if let flag = args.firstIndex(of: "--soak"), flag + 1 < args.count, let count = Int(args[flag + 1]),
   let device = MTLCreateSystemDefaultDevice(), let renderer = try? SpotRenderer(device: device) {
    TextureBridge.install(device: device)
    let d = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: .bgra8Unorm, width: 1920, height: 1080, mipmapped: false)
    d.usage = [.renderTarget]
    d.storageMode = .private
    let target = device.makeTexture(descriptor: d)!
    var stage: SpotStage?
    print("base footprint \(footprintMB())MB (device + renderer, no Spot)")
    for i in 0 ..< count {
        let entry = spotIndex[i % spotIndex.count]
        autoreleasepool {
            stage = nil
            stage = try? SpotStage(spotsDir: spotsDir, dir: entry.dir, device: device)
            if let stage {
                _ = stage.advance(1.0 / 30, cameraMoving: true)
                let (view, projection) = camera(for: stage, width: 1920, height: 1080, pointer: .zero)
                let buffer = renderer.queue.makeCommandBuffer()!
                renderer.draw(stage: stage, view: view, projection: projection, charactersVisible: true, into: target, commandBuffer: buffer)
                buffer.commit()
                buffer.waitUntilCompleted()
            }
        }
        if i % 10 == 0 || i == count - 1 {
            print("switch \(i) \(entry.id) footprint \(footprintMB())MB")
        }
    }
    exit(0)
}
if let flag = args.firstIndex(of: "--snapshot"), flag + 4 < args.count {
    let seconds = flag + 5 < args.count ? Double(args[flag + 5]) ?? 4.5 : 4.5
    exit(snapshot(out: args[flag + 1], width: Int(args[flag + 2]) ?? 1600, height: Int(args[flag + 3]) ?? 900,
                  id: args[flag + 4], seconds: seconds))
}

setvbuf(stdout, nil, _IOLBF, 0)
let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
