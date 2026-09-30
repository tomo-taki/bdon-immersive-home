import AppKit
import Metal

/// QA renders without a window.
///   `--snapshot <out.png> [width height] [spotId] [chars 0|1]`: one frame after
///     the clip has run `BDON_WARMUP` seconds (default 4.5, stepped at 30 fps).
///   `--bench <spotId> <width> <height> [frames]`: GPU time per frame with a
///     moving camera and animating residents.
enum Snapshot {
    /// `--sync-test <spotId>...`: a follower stage fast-forwarded to a
    /// leader's moment (mid-entrance, settled, after a long loop) and after a
    /// shared replay must render the same pixels. Prints one line per case.
    static func syncTest(spots: [Spot]) -> Bool {
        var ok = true
        for spot in spots {
            do {
                let (_, renderer, leader) = try prepare(spot)
                leader.follows = true   // no random replays mid-test
                let step = 1.0 / 30
                for target in [2.5, 12.0, 95.0] {
                    while leader.playTime + step <= target { _ = leader.advance(step, cameraMoving: false) }
                    let (_, _, follower) = try prepare(spot)
                    follower.follows = true
                    follower.fastForward(to: leader.playTime)
                    ok = compare(leader, follower, renderer, "\(spot.id) at \(target)s") && ok
                }
                let (_, _, follower) = try prepare(spot)
                follower.follows = true
                follower.fastForward(to: leader.playTime)
                leader.replayNow()
                follower.replayNow()
                for _ in 0 ..< 45 {
                    _ = leader.advance(step, cameraMoving: false)
                    _ = follower.advance(step, cameraMoving: false)
                }
                ok = compare(leader, follower, renderer, "\(spot.id) 1.5s after replay") && ok
            } catch {
                print("\(spot.id): \(error)")
                ok = false
            }
        }
        return ok
    }

    private static func compare(_ a: SpotStage, _ b: SpotStage, _ renderer: SpotRenderer, _ label: String) -> Bool {
        let w = 480, h = 270
        guard let ia = renderStill(a, renderer: renderer, width: w, height: h),
              let ib = renderStill(b, renderer: renderer, width: w, height: h),
              let da = ia.dataProvider?.data as Data?, let db = ib.dataProvider?.data as Data? else {
            print("\(label): render failed")
            return false
        }
        // Tolerate a few edge pixels of float noise; a pose mismatch moves thousands.
        var differing = 0
        for i in stride(from: 0, to: min(da.count, db.count), by: 4) {
            let d = (0 ..< 3).map { abs(Int(da[i + $0]) - Int(db[i + $0])) }.max() ?? 0
            if d > 8 { differing += 1 }
        }
        let pass = differing <= 20
        print(String(format: "%@: leader %.2fs follower %.2fs, %d px differ %@",
                     label, a.playTime, b.playTime, differing, pass ? "PASS" : "FAIL"))
        return pass
    }
    /// `--coverage <spotId>...`: measure each Spot's edge zoom, write
    /// cover.json next to its spot.json and re-check at a finer size.
    static func coverage(spots: [Spot]) -> Bool {
        guard let root = MetalContext.spotsRoot else { return false }
        var ok = true
        for spot in spots {
            do {
                let (_, renderer, stage) = try prepare(spot)
                // Some furniture (sliding doors) is a Spine resident: hide the
                // people, keep the props, at the settled moment the wallpaper shows.
                stage.charactersVisible = false
                var t = 0.0
                while t < warmUp {
                    _ = stage.advance(1.0 / 30, cameraMoving: true)
                    t += 1.0 / 30
                }
                let result = Coverage.measure(stage, renderer: renderer)
                let url = root.appendingPathComponent(spot.dir).appendingPathComponent(Coverage.fileName)
                try JSONEncoder().encode(result.table).write(to: url)

                var line = spot.id
                for (aspect, zoom) in zip(result.table.aspects, result.table.zoom) {
                    line += String(format: " %.2f:%.3f", aspect, zoom)
                }
                if !result.clamped.isEmpty {
                    line += " CLAMPED at \(result.clamped)"
                }
                print(line)
            } catch {
                print("\(spot.id): \(error)")
                ok = false
            }
        }
        return ok
    }

    /// `--still-test <spotId>...`: the lock-screen still taken `SpotMetalView.stillDelay`
    /// after the clips stop must match one taken after the full settle.
    static func stillTest(spots: [Spot]) -> Bool {
        var ok = true
        for spot in spots {
            guard let (_, renderer, stage) = try? prepare(spot) else { continue }
            let step = 1.0 / 30
            _ = stage.advance(0, cameraMoving: false)
            while stage.quietFor < SpotMetalView.stillDelay || stage.clock < 0.5 {
                _ = stage.advance(step, cameraMoving: false)
            }
            let early = stage.clock
            let a = renderStill(stage, renderer: renderer, width: 480, height: 270)
            while stage.quietFor < 3 + 1 {   // old trigger: settle (3 s) + 30 idle frames
                _ = stage.advance(step, cameraMoving: false)
            }
            let late = stage.clock
            let b = renderStill(stage, renderer: renderer, width: 480, height: 270)
            guard let da = a?.dataProvider?.data as Data?, let db = b?.dataProvider?.data as Data? else { continue }
            var differing = 0
            for i in stride(from: 0, to: min(da.count, db.count), by: 4) {
                let d = (0 ..< 3).map { abs(Int(da[i + $0]) - Int(db[i + $0])) }.max() ?? 0
                if d > 8 { differing += 1 }
            }
            let pass = differing <= 20
            ok = ok && pass
            print(String(format: "%@: still at %.1fs (was %.1fs), %d px differ %@",
                         spot.id, early, late, differing, pass ? "PASS" : "FAIL"))
        }
        return ok
    }

    private static var warmUp: Double {
        Double(ProcessInfo.processInfo.environment["BDON_WARMUP"] ?? "") ?? 4.5
    }

    private static func prepare(_ spot: Spot) throws -> (MTLDevice, SpotRenderer, SpotStage) {
        guard let device = MetalContext.device, let root = MetalContext.spotsRoot else {
            throw GLBError.format("no Metal device or Spot data")
        }
        let renderer = try SpotRenderer(device: device)
        let stage = try autoreleasepool { try SpotStage(spotsDir: root, dir: spot.dir, device: device) }
        return (device, renderer, stage)
    }

    static func render(to url: URL, size: CGSize, spot: Spot, characters: Bool, hidden: [String] = []) -> Bool {
        do {
            let started = Date()
            let (device, renderer, stage) = try prepare(spot)
            stage.charactersVisible = characters
            stage.hiddenMembers = Set(hidden)
            let loadTime = Date().timeIntervalSince(started)

            var t = 0.0
            _ = stage.advance(0, cameraMoving: true)
            while t < warmUp {
                _ = stage.advance(1.0 / 30, cameraMoving: true)
                t += 1.0 / 30
            }

            // QA: BDON_POINTER="x,y" (each -1...1) renders with that cursor parallax.
            let p = (ProcessInfo.processInfo.environment["BDON_POINTER"] ?? "").split(separator: ",").compactMap { Float($0) }
            let pointer = p.count == 2 ? SIMD2<Float>(p[0], p[1]) : .zero
            // QA: BDON_FLAT=1 draws magenta where no room surface is (what Coverage counts).
            let flat = ProcessInfo.processInfo.environment["BDON_FLAT"] == "1"
            let backdrop: SpotRenderer.Backdrop = flat ? .flat(MTLClearColor(red: 1, green: 0, blue: 1, alpha: 1)) : .sky
            let image = renderStill(stage, renderer: renderer, width: Int(size.width), height: Int(size.height), pointer: pointer,
                                    backdrop: backdrop)
            guard let image, let png = NSBitmapImageRep(cgImage: image).representation(using: .png, properties: [:]) else {
                return false
            }
            try png.write(to: url)
            print(String(format: "ok load=%.2fs footprint=%dMB residents=%d", loadTime, footprintMB(), stage.residents.count))
            return true
        } catch {
            FileHandle.standardError.write(Data("snapshot failed: \(error)\n".utf8))
            return false
        }
    }

    static func bench(spot: Spot, width: Int, height: Int, frames: Int) -> Bool {
        guard let (device, renderer, stage) = try? prepare(spot) else { return false }
        let d = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: .bgra8Unorm, width: width, height: height, mipmapped: false)
        d.usage = [.renderTarget]
        d.storageMode = .private
        guard let target = device.makeTexture(descriptor: d) else { return false }
        var gpu: [Double] = []
        for i in 0 ..< max(frames, 20) {
            autoreleasepool {
                _ = stage.advance(1.0 / 30, cameraMoving: true)
                let angle = Float(i) / Float(frames) * 2 * .pi
                let camera = spotCamera(for: stage, width: Float(width), height: Float(height),
                                        pointer: SIMD2(cos(angle), sin(angle)) * 0.5)
                let buffer = renderer.queue.makeCommandBuffer()!
                renderer.draw(stage: stage, view: camera.view, projection: camera.projection, sortViewProjection: camera.sort, charactersVisible: true,
                              into: target, commandBuffer: buffer)
                buffer.commit()
                buffer.waitUntilCompleted()
                if i >= 10 { gpu.append((buffer.gpuEndTime - buffer.gpuStartTime) * 1000) }
            }
        }
        gpu.sort()
        print(String(format: "bench %@ %dx%d: GPU median %.2f ms p95 %.2f ms, GPU allocated %dMB, footprint %dMB",
                     spot.id, width, height, gpu[gpu.count / 2], gpu[gpu.count * 95 / 100],
                     device.currentAllocatedSize / 1_048_576, footprintMB()))
        return true
    }
}
