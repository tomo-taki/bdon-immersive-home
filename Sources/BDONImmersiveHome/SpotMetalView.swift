import AppKit
import MetalKit

/// Metal objects shared by every wallpaper view, and the queue Spots load on.
enum MetalContext {
    static let device: MTLDevice? = {
        let device = MTLCreateSystemDefaultDevice()
        if let device {
            TextureBridge.install(device: device)
        }
        return device
    }()

    /// Spots decode (glb, PNG, skeleton JSON) off the main thread, one at a time.
    static let loadQueue = DispatchQueue(label: "bdon.spot-load", qos: .userInitiated)

    static var spotsRoot: URL? { SpotCatalog.webRoot?.appendingPathComponent("spots") }
}

/// The Spot camera for a view of this size, `pointer` in -1...1 (cursor parallax).
/// `sort` is the view-projection of the same camera with no parallax: the
/// renderer orders transparent layers by it, so turning the camera with the
/// cursor never reorders them.
func spotCamera(for stage: SpotStage, width: Float, height: Float, pointer: SIMD2<Float>) -> (view: Mat4, projection: Mat4, sort: Mat4) {
    let s = stage.data.situation
    let aspect = width / max(height, 1)
    let base = defaultPose(s, fov: fitFov(s, width: width, height: height))
    let projection = perspective(fovY: base.fov, aspect: aspect, near: stage.data.camera.near, far: stage.data.camera.far)
    func view(_ pose: SpotPose) -> Mat4 {
        let eye = rightHanded(pose.position)
        let target = rightHanded(pose.position + lookDirection(pose))
        return lookAt(eye: eye, target: target)
    }
    let pose = shiftedPose(base, px: pointer.x, py: pointer.y, s, aspect: aspect)
    let still = shiftedPose(base, px: 0, py: 0, s, aspect: aspect)
    return (view(pose),
            perspective(fovY: pose.fov, aspect: aspect, near: stage.data.camera.near, far: stage.data.camera.far),
            projection * view(still))
}

/// Render one frame of `stage` offscreen and read it back as an sRGB image.
func renderStill(_ stage: SpotStage, renderer: SpotRenderer, width: Int, height: Int,
                 pointer: SIMD2<Float> = .zero) -> CGImage? {
    let d = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: .bgra8Unorm, width: max(width, 1), height: max(height, 1), mipmapped: false)
    d.usage = [.renderTarget, .shaderRead]
    d.storageMode = .managed
    guard width > 0, height > 0, let target = renderer.device.makeTexture(descriptor: d),
          let buffer = renderer.queue.makeCommandBuffer() else { return nil }
    let camera = spotCamera(for: stage, width: Float(width), height: Float(height), pointer: pointer)
    renderer.draw(stage: stage, view: camera.view, projection: camera.projection, sortViewProjection: camera.sort, charactersVisible: true,
                  into: target, commandBuffer: buffer)
    guard let blit = buffer.makeBlitCommandEncoder() else { return nil }
    blit.synchronize(resource: target)
    blit.endEncoding()
    buffer.commit()
    buffer.waitUntilCompleted()

    var pixels = [UInt8](repeating: 0, count: width * height * 4)
    target.getBytes(&pixels, bytesPerRow: width * 4, from: MTLRegionMake2D(0, 0, width, height), mipmapLevel: 0)
    let info = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.noneSkipFirst.rawValue
    return pixels.withUnsafeMutableBytes {
        CGContext(data: $0.baseAddress, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4,
                  space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: info)?.makeImage()
    }
}

/// phys_footprint of this process in MB (what Activity Monitor calls Memory).
func footprintMB() -> Int {
    var info = rusage_info_v4()
    let rc = withUnsafeMutablePointer(to: &info) {
        $0.withMemoryRebound(to: rusage_info_t?.self, capacity: 1) { proc_pid_rusage(getpid(), RUSAGE_INFO_V4, $0) }
    }
    return rc == 0 ? Int(info.ri_phys_footprint / 1_048_576) : -1
}

/// One display's wallpaper: an MTKView drawing a SpotStage. Same control
/// surface the WebKit page had (setSpot / setCharacters / setHidden /
/// setPointer / setPaused), so WallpaperController drives either the same way.
final class SpotMetalView: MTKView, MTKViewDelegate {
    private static let framesPerSecond = 30
    /// Low Power Mode or a hot machine: animate at half rate.
    private static let reducedFramesPerSecond = 15
    /// Rate while something moves.
    static var activeFramesPerSecond: Int {
        let info = ProcessInfo.processInfo
        let constrained = info.isLowPowerModeEnabled || info.thermalState == .serious || info.thermalState == .critical
        return constrained ? reducedFramesPerSecond : framesPerSecond
    }

    /// Power or thermal state changed: take the new active rate unless idle.
    func powerStateChanged() {
        if idleFrames < Self.idleFramesBeforeSlowing {
            preferredFramesPerSecond = Self.activeFramesPerSecond
        }
    }
    /// Nothing animating and the camera still for this many frames: tick at
    /// `idleFramesPerSecond` (the clock still runs, so a replay wakes it).
    private static let idleFramesPerSecond = 5
    private static let idleFramesBeforeSlowing = 30

    /// The first Spot is on screen (or failed to load); once per view.
    var onReady: ((String) -> Void)?
    /// A Spot failed to load; the previous one (if any) stays on screen.
    var onLoadError: ((_ dir: String, _ message: String) -> Void)?
    /// The scene went still after a Spot load or a visibility change: a good
    /// moment for a still (LockScreenWallpaper). Once per change.
    var onSettled: ((SpotMetalView) -> Void)?
    private var settleReported = true

    /// The Spot on screen, drawn once more from the default camera.
    func captureStill() -> CGImage? {
        guard let stage else { return nil }
        let size = drawableSize
        return renderStill(stage, renderer: renderer, width: Int(size.width), height: Int(size.height))
    }

    var spotId: String? { stageDir.flatMap { dir in SpotCatalog.spots.first { $0.dir == dir }?.id } }

    /// Ask for another onSettled (e.g. the lock-screen option was turned on).
    func requestSettle() {
        settleReported = false
        wake()
    }

    private let renderer: SpotRenderer
    private var stage: SpotStage?
    private var stageDir: String?
    private var wanted: Spot
    private var generation = 0
    private var characters: Bool
    private var hiddenMembers: Set<String>
    private var pointer = SIMD2<Float>.zero
    private var smooth = SIMD2<Float>.zero
    private var last = CACurrentMediaTime()
    private var needsFrame = true
    private var idleFrames = 0
    private var readySent = false
    private(set) var loadedAt = Date()
    /// Frames drawn since the last read (MemoryProbe).
    var framesDrawn = 0

    init?(frame: CGRect, spot: Spot, characters: Bool, hidden: [String] = []) {
        guard let device = MetalContext.device, let renderer = try? SpotRenderer(device: device) else {
            EventLog.write("Metal unavailable")
            return nil
        }
        self.renderer = renderer
        wanted = spot
        self.characters = characters
        self.hiddenMembers = Set(hidden)
        super.init(frame: frame, device: device)
        colorPixelFormat = .bgra8Unorm
        // Frames are sRGB, like the WebKit page: let the compositor colour-manage them.
        colorspace = CGColorSpace(name: CGColorSpace.sRGB)
        preferredFramesPerSecond = Self.activeFramesPerSecond
        delegate = self
        load(spot)
    }

    required init(coder: NSCoder) {
        fatalError("init(coder:) is not supported")
    }

    /// Wallpaper windows ignore the mouse.
    override func hitTest(_ point: NSPoint) -> NSView? { nil }

    // MARK: - Control

    func setSpot(_ spot: Spot) {
        wanted = spot
        guard spot.dir != stageDir else { return }
        load(spot)
    }

    func setCharacters(_ visible: Bool) {
        characters = visible
        stage?.charactersVisible = visible
        settleReported = false
        wake()
    }

    /// Easter-egg members to leave out (see EasterEgg.hiddenMembers).
    func setHidden(_ members: [String]) {
        guard Set(members) != hiddenMembers else { return }
        hiddenMembers = Set(members)
        stage?.hiddenMembers = hiddenMembers
        settleReported = false
        wake()
    }

    func setPointer(x: CGFloat, y: CGFloat) {
        pointer = SIMD2(Float(x), Float(y))
        wake()
    }

    func setPaused(_ paused: Bool) {
        setRunning(!paused)
    }

    func setRunning(_ running: Bool) {
        isPaused = !running
        if running {
            last = CACurrentMediaTime()
            wake()
        }
    }

    /// Load the current Spot from scratch (QA hook; the WebKit page reload).
    func restart() {
        stageDir = nil
        load(wanted)
    }

    private func wake() {
        needsFrame = true
        idleFrames = 0
        if preferredFramesPerSecond != Self.activeFramesPerSecond {
            preferredFramesPerSecond = Self.activeFramesPerSecond
        }
    }

    // MARK: - Loading

    private func load(_ spot: Spot) {
        guard let device, let root = MetalContext.spotsRoot else { return }
        generation += 1
        let ticket = generation
        let started = Date()
        MetalContext.loadQueue.async { [weak self] in
            let result = autoreleasepool { Result { try SpotStage(spotsDir: root, dir: spot.dir, device: device) } }
            DispatchQueue.main.async {
                guard let self, ticket == self.generation else { return }
                switch result {
                case .success(let next):
                    next.charactersVisible = self.characters
                    next.hiddenMembers = self.hiddenMembers
                    self.stage = next
                    self.stageDir = spot.dir
                    self.loadedAt = Date()
                    self.settleReported = false
                    EventLog.write(String(format: "spot %@ loaded in %.2fs, footprint %dMB",
                                          spot.id, Date().timeIntervalSince(started), footprintMB()))
                    self.wake()
                case .failure(let error):
                    EventLog.write("spot \(spot.dir) failed: \(error)")
                    self.onLoadError?(spot.dir, "\(error)")
                    if !self.readySent {
                        self.readySent = true
                        self.onReady?("error: \(error)")
                    }
                }
            }
        }
    }

    // MARK: - MTKViewDelegate

    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
        needsFrame = true
        // New resolution: the lock-screen still should be re-taken at it.
        settleReported = false
    }

    func draw(in view: MTKView) {
        let now = CACurrentMediaTime()
        let delta = min(0.25, now - last)
        last = now
        guard let stage else { return }

        let previous = smooth
        smooth += (pointer - smooth) * 0.06
        let moving = simd_length(smooth - previous) > 1e-4
        let changed = stage.advance(delta, cameraMoving: moving)
        guard changed || moving || needsFrame else {
            idleFrames += 1
            if idleFrames == Self.idleFramesBeforeSlowing {
                preferredFramesPerSecond = Self.idleFramesPerSecond
                if !settleReported {
                    settleReported = true
                    onSettled?(self)
                }
            }
            return
        }
        idleFrames = 0
        if preferredFramesPerSecond != Self.activeFramesPerSecond {
            preferredFramesPerSecond = Self.activeFramesPerSecond
        }

        guard let drawable = currentDrawable, let buffer = renderer.queue.makeCommandBuffer() else { return }
        needsFrame = false
        let size = drawableSize
        let camera = spotCamera(for: stage, width: Float(size.width), height: Float(size.height), pointer: smooth)
        renderer.draw(stage: stage, view: camera.view, projection: camera.projection, sortViewProjection: camera.sort, charactersVisible: true,
                      into: drawable.texture, commandBuffer: buffer)
        buffer.present(drawable)
        buffer.commit()
        framesDrawn += 1

        if !readySent {
            readySent = true
            onReady?("ok")
        }
    }
}

/// Periodic memory reading into EventLog (lets a long run show a leak without ps/top).
enum MemoryProbe {
    private static let interval: TimeInterval = 300
    private static var timer: Timer?

    static func start(views: @escaping () -> [SpotMetalView]) {
        timer?.invalidate()
        let timer = Timer(timeInterval: interval, repeats: true) { _ in log(views()) }
        RunLoop.main.add(timer, forMode: .common)
        self.timer = timer
    }

    static func log(_ views: [SpotMetalView]) {
        let frames = views.map { view -> Int in
            defer { view.framesDrawn = 0 }
            return view.framesDrawn
        }
        EventLog.write("mem app=\(footprintMB())MB gpu=\((MetalContext.device?.currentAllocatedSize ?? 0) / 1_048_576)MB frames=\(frames)")
    }
}
