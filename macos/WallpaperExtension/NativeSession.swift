import AppKit
import IOSurface
import MetalKit

/// One system-owned wallpaper surface; all Metal mechanics stay here.
final class NativeSession {
    private enum Motion { case still, moving }
    private static let frameInterval: TimeInterval = 1 / 30
    private static let pixelBytes = 4
    private static let componentBits = 8
    private static let maxDelta: TimeInterval = 0.25
    private static let smoothing: Float = 0.06
    private static let motionThreshold: Float = 1e-4
    private static let reportEvery = 30
    private static var worlds: [String: WeakWorld] = [:]
    private static var generation = 0
    private let layer: CAMetalLayer
    private let context: NSObject
    private var world: World
    private var stage: SpotStage { world.stage }
    private let renderer: SpotRenderer
    private var scene: NativeScene
    private let display: UInt32
    private var mode: NativeMode
    private var pointer = SIMD2<Float>.zero
    private var timer: Timer?
    private var frames = 0

    init(scene: NativeScene, size: CGSize, scale: CGFloat, display: UInt32, mode: NativeMode) throws {
        guard let device = MetalContext.device else {
            throw CocoaError(.fileReadNoSuchFile)
        }
        self.scene = scene
        self.mode = mode
        self.display = display
        renderer = try SpotRenderer(device: device)
        world = try Self.world(for: scene, device: device)
        layer = CAMetalLayer()
        layer.device = device
        layer.pixelFormat = .bgra8Unorm
        layer.colorspace = CGColorSpace(name: CGColorSpace.sRGB)
        layer.frame = CGRect(origin: .zero, size: size)
        layer.contentsScale = scale
        layer.drawableSize = CGSize(width: size.width * scale, height: size.height * scale)
        layer.isOpaque = true
        guard let context = BDONContext(layer, scale, display) else { throw CocoaError(.featureUnsupported) }
        self.context = context
        timer = Timer(timeInterval: Self.frameInterval, repeats: true) { [weak self] _ in self?.draw() }
        RunLoop.main.add(timer!, forMode: .common)
        draw()
    }

    deinit { timer?.invalidate() }

    func remoteReply() -> NSObject? { BDONContextReply(context) }

    static func change(_ scene: NativeScene, sessions: @escaping () -> [NativeSession]) {
        guard let device = MetalContext.device else { return }
        generation += 1
        let request = generation
        guard sessions().contains(where: { $0.scene != scene }) else { return }
        if let cached = worlds[scene.spot]?.value {
            install(cached, scene: scene, sessions: sessions())
            return
        }
        // Decoding textures must not block the old scene's render loop.
        MetalContext.loadQueue.async {
            do {
                let world = try World(scene: scene, device: device)
                DispatchQueue.main.async {
                    guard generation == request else { return }
                    install(world, scene: scene, sessions: sessions())
                }
            } catch {
                EventLog.write("native scene load failed: \(error)")
            }
        }
    }

    private static func install(_ world: World, scene: NativeScene, sessions: [NativeSession]) {
        worlds = worlds.filter { $0.value.value != nil }
        worlds[scene.spot] = WeakWorld(world)
        world.configure(scene)
        for session in sessions {
            session.world = world
            session.scene = scene
            session.pointer = .zero
            session.frames = 0
            session.draw()
        }
    }

    func suspend(_ state: NativeActivity) {
        timer?.fireDate = state == .suspended ? .distantFuture : .distantPast
        if state == .active { world.resume() }
    }

    func resize(_ size: CGSize, scale: CGFloat, mode: NativeMode) {
        if mode != .unknown { self.mode = mode }
        guard size.width > 0, size.height > 0 else { return }
        layer.frame = CGRect(origin: .zero, size: size)
        layer.contentsScale = scale
        layer.drawableSize = CGSize(width: size.width * scale, height: size.height * scale)
    }

    func snapshot() -> NSObject? {
        let width = Int(layer.drawableSize.width), height = Int(layer.drawableSize.height)
        guard let image = renderStill(stage, renderer: renderer, width: width, height: height, characters: scene.characters),
              let surface = IOSurfaceCreate([
                kIOSurfaceWidth: width, kIOSurfaceHeight: height,
                kIOSurfaceBytesPerElement: Self.pixelBytes,
                kIOSurfaceBytesPerRow: IOSurfaceAlignProperty(kIOSurfaceBytesPerRow, width * Self.pixelBytes),
              ] as CFDictionary) else { return nil }
        IOSurfaceLock(surface, [], nil)
        defer { IOSurfaceUnlock(surface, [], nil) }
        let format = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue
        guard let context = CGContext(data: IOSurfaceGetBaseAddress(surface), width: width, height: height,
                                      bitsPerComponent: Self.componentBits, bytesPerRow: IOSurfaceGetBytesPerRow(surface),
                                      space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: format) else { return nil }
        context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
        return BDONSnapshotReply(surface)
    }

    private func draw() {
        let previous = pointer
        pointer += (targetPointer() - pointer) * Self.smoothing
        world.advance(simd_length(pointer - previous) > Self.motionThreshold ? .moving : .still)
        guard let drawable = layer.nextDrawable(), let buffer = renderer.queue.makeCommandBuffer() else { return }
        let size = layer.drawableSize
        let camera = spotCamera(for: stage, width: Float(size.width), height: Float(size.height), pointer: pointer)
        renderer.draw(stage: stage, view: camera.view, projection: camera.projection, sortViewProjection: camera.sort,
                      charactersVisible: scene.characters, into: drawable.texture, commandBuffer: buffer)
        buffer.present(drawable)
        buffer.commit()
        frames += 1
        if frames == 1 {
            buffer.waitUntilCompleted()
            if buffer.status == .completed { report() }
        } else if scene.diagnostics, frames.isMultiple(of: Self.reportEvery) { report() }
    }

    private func targetPointer() -> SIMD2<Float> {
        guard scene.parallax, mode == .desktop else { return .zero }
        let point = NSEvent.mouseLocation
        let screen = NSScreen.screens.first {
            ($0.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber)?.uint32Value == display
        }
        guard let frame = screen?.frame, frame.width > 0, frame.height > 0 else { return .zero }
        let x = Float((point.x - frame.midX) / (frame.width / 2))
        let y = Float((point.y - frame.midY) / (frame.height / 2))
        return SIMD2(min(max(x, -1), 1), min(max(y, -1), 1))
    }

    private func report() {
        let directory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
            .appendingPathComponent(NativeStatus.directory)
        let record = NativeStatus(scene: scene, frames: frames, mode: mode.rawValue, display: display,
                                  width: layer.drawableSize.width, height: layer.drawableSize.height,
                                  timeline: world.identifier, context: BDONContextID(context), updated: Date())
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        let name = mode.rawValue + "-\(display).json"
        try? JSONEncoder().encode(record).write(to: directory.appendingPathComponent(name), options: .atomic)
    }

    private static func world(for scene: NativeScene, device: MTLDevice) throws -> World {
        if let existing = worlds[scene.spot]?.value { existing.configure(scene); return existing }
        worlds = worlds.filter { $0.value.value != nil }
        let world = try World(scene: scene, device: device)
        worlds[scene.spot] = WeakWorld(world)
        return world
    }

    private final class WeakWorld {
        weak var value: World?
        init(_ value: World) { self.value = value }
    }

    // Desktop and idle surfaces draw the same stage, preserving choreography on transitions.
    private final class World {
        let stage: SpotStage
        let identifier = UUID()
        private var last: CFTimeInterval

        init(scene: NativeScene, device: MTLDevice) throws {
            guard let root = SpotCatalog.dataRoot?.appendingPathComponent("spots"),
                  let spot = SpotCatalog.spot(id: scene.spot) else { throw CocoaError(.fileReadNoSuchFile) }
            stage = try SpotStage(spotsDir: root, dir: spot.dir, device: device)
            stage.charactersVisible = scene.characters
            stage.hiddenMembers = Set(scene.hidden)
            last = CACurrentMediaTime()
        }

        func resume() { last = CACurrentMediaTime() }

        func configure(_ scene: NativeScene) {
            if stage.charactersVisible != scene.characters { stage.charactersVisible = scene.characters }
            if stage.hiddenMembers != Set(scene.hidden) { stage.hiddenMembers = Set(scene.hidden) }
            resume()
        }

        func advance(_ motion: Motion) {
            let now = CACurrentMediaTime()
            let delta = min(now - last, NativeSession.maxDelta)
            last = now
            _ = stage.advance(delta, cameraMoving: motion == .moving)
        }
    }
}

enum NativeActivity { case active, suspended }
