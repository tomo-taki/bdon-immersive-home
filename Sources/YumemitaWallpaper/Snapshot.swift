import AppKit
import Metal

/// QA renders without a window.
///   `--snapshot <out.png> [width height] [spotId] [chars 0|1]`: one frame after
///     the clip has run `YUMEMITA_WARMUP` seconds (default 4.5, stepped at 30 fps).
///   `--bench <spotId> <width> <height> [frames]`: GPU time per frame with a
///     moving camera and animating residents.
enum Snapshot {
    private static var warmUp: Double {
        Double(ProcessInfo.processInfo.environment["YUMEMITA_WARMUP"] ?? "") ?? 4.5
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

            let image = renderStill(stage, renderer: renderer, width: Int(size.width), height: Int(size.height))
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
                renderer.draw(stage: stage, view: camera.view, projection: camera.projection, charactersVisible: true,
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
