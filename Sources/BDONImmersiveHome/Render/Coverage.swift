import Foundation
import Metal

/// Per-Spot zoom that keeps the sky from showing at the frame edge.
///
/// Rooms are modelled for a 19.5:9 phone. On other screens, with the cursor
/// turning the camera, a frame corner can run past the room's backdrop (the
/// empty lavender corner on a 4:3 iPad). The zoom scales tan(fov / 2) down
/// just enough that no pointer position shows that outside sky.
///
///   cover.json (next to spot.json, written by `--coverage`):
///   { "aspects": [0.5625, ...], "zoom": [0.91, ...] }   zoom <= 1
struct CoverTable: Codable {
    let aspects: [Float]
    let zoom: [Float]

    /// Zoom for `aspect`: the smaller of the two bracketing samples, so an
    /// aspect between samples is never zoomed less than either neighbour.
    func zoom(for aspect: Float) -> Float {
        guard let first = aspects.first, let last = aspects.last, aspects.count == zoom.count else { return 1 }
        if aspect <= first { return zoom[0] }
        if aspect >= last { return zoom[zoom.count - 1] }
        let upper = aspects.firstIndex { $0 >= aspect } ?? aspects.count - 1
        return min(zoom[upper - 1], zoom[upper])
    }

    static func load(spotDir: URL) -> CoverTable? {
        guard let data = try? Data(contentsOf: spotDir.appendingPathComponent(Coverage.fileName)) else { return nil }
        return try? JSONDecoder().decode(CoverTable.self, from: data)
    }
}

/// How it measures (one pointer position):
///
///   +----------------------------+   unzoomed frame, rendered twice over
///   |            ####  <- outside|   two flat backdrops; pixels that change
///   |   +----------------+  sky  |   are sky. Sky regions touching the frame
///   |   |   zoomed crop  |       |   border are "outside"; enclosed ones are
///   |   |      [hole]    |       |   holes in the room (left alone).
///   |   +----------------+       |
///   +----------------------------+
///
/// Zooming only narrows the lens, so the zoomed view is a centered crop of
/// this frame: the zoom is the largest crop that holds no outside pixel.
enum Coverage {
    static let fileName = "cover.json"

    /// Portrait phone .. 32:9 super-ultrawide.
    static let aspects: [Float] = [0.5625, 0.75, 1.0, 1.25, 1.3333, 1.5, 1.6, 1.7778, 2.0, 2.1667, 2.3333, 2.6667, 3.5556]

    /// Cursor extremes and edge midpoints; parallax moves between them.
    private static let pointers: [SIMD2<Float>] = [
        SIMD2(0, 0), SIMD2(-1, -1), SIMD2(1, -1), SIMD2(-1, 1), SIMD2(1, 1),
        SIMD2(-1, 0), SIMD2(1, 0), SIMD2(0, -1), SIMD2(0, 1),
    ]

    private static let probeSize = 960
    /// Never zoom past this; a Spot that needs more is reported, not fixed.
    static let minZoom: Float = 0.7
    /// Headroom past the measured edge (probe resolution, float noise).
    private static let margin: Float = 0.99
    /// A pixel is sky when switching the backdrop moves it this much (0-255).
    private static let skyDelta = 96
    /// Outside regions smaller than this are anti-aliasing specks.
    private static let minRegion = 4

    struct Result {
        let table: CoverTable
        /// Aspects whose needed zoom was clamped at minZoom.
        let clamped: [Float]
    }

    /// Measure `stage` at every sample aspect.
    static func measure(_ stage: SpotStage, renderer: SpotRenderer) -> Result {
        var clamped: [Float] = []
        let zoom = aspects.map { aspect -> Float in
            let (w, h) = probeDimensions(aspect)
            let needed = pointers.map { neededZoom(stage, renderer, w, h, pointer: $0) }.min() ?? 1
            if needed >= 1 { return 1 }
            let z = needed * margin
            if z < minZoom { clamped.append(aspect) }
            return max(minZoom, z)
        }
        return Result(table: CoverTable(aspects: aspects, zoom: zoom), clamped: clamped)
    }

    private static func probeDimensions(_ aspect: Float) -> (Int, Int) {
        if aspect >= 1 { return (probeSize, max(1, Int((Float(probeSize) / aspect).rounded()))) }
        return (max(1, Int((Float(probeSize) * aspect).rounded())), probeSize)
    }

    /// Largest centered crop (as a fraction of the frame) with no outside sky.
    private static func neededZoom(_ stage: SpotStage, _ renderer: SpotRenderer, _ w: Int, _ h: Int,
                                   pointer: SIMD2<Float>) -> Float {
        let sky = skyMask(stage, renderer, w, h, pointer: pointer)
        guard sky.count == w * h else { return 1 }
        let cx = Float(w) / 2, cy = Float(h) / 2
        var zoom: Float = 1

        // Flood each border-touching sky region; every pixel in it must stay
        // outside the crop, whose half-size is zoom * (w/2, h/2).
        var seen = [Bool](repeating: false, count: w * h)
        var seeds: [Int] = []
        for x in 0 ..< w { seeds.append(x); seeds.append((h - 1) * w + x) }
        for y in 0 ..< h { seeds.append(y * w); seeds.append(y * w + w - 1) }
        for seed in seeds where sky[seed] && !seen[seed] {
            var stack = [seed], region: [Int] = []
            seen[seed] = true
            while let i = stack.popLast() {
                region.append(i)
                let x = i % w, y = i / w
                for n in [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]
                where n >= 0 && sky[n] && !seen[n] {
                    seen[n] = true
                    stack.append(n)
                }
            }
            if region.count < minRegion { continue }
            for i in region {
                // Pixel centre, as the crop fraction whose edge passes through it.
                let dx = abs(Float(i % w) + 0.5 - cx) / cx
                let dy = abs(Float(i / w) + 0.5 - cy) / cy
                zoom = min(zoom, max(dx, dy))
            }
        }
        return zoom
    }

    /// Render twice over different flat backdrops: a pixel that changes is
    /// not covered by the room.
    private static func skyMask(_ stage: SpotStage, _ renderer: SpotRenderer, _ w: Int, _ h: Int,
                                pointer: SIMD2<Float>) -> [Bool] {
        let magenta = MTLClearColor(red: 1, green: 0, blue: 1, alpha: 1)
        let green = MTLClearColor(red: 0, green: 1, blue: 0, alpha: 1)
        guard let a = pixels(stage, renderer, w, h, pointer, magenta),
              let b = pixels(stage, renderer, w, h, pointer, green) else { return [] }
        var sky = [Bool](repeating: false, count: w * h)
        for i in 0 ..< w * h {
            let d = (0 ..< 3).map { abs(Int(a[i * 4 + $0]) - Int(b[i * 4 + $0])) }.max() ?? 0
            sky[i] = d > skyDelta
        }
        return sky
    }

    private static func pixels(_ stage: SpotStage, _ renderer: SpotRenderer, _ w: Int, _ h: Int,
                               _ pointer: SIMD2<Float>, _ backdrop: MTLClearColor) -> Data? {
        let image = renderStill(stage, renderer: renderer, width: w, height: h, pointer: pointer,
                                zoom: 1, backdrop: .flat(backdrop))
        return image?.dataProvider?.data as Data?
    }
}
