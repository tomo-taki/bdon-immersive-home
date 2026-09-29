import AppKit
import SpriteKit

/// A hand-assembled character: layered sprites, each rotating around its pivot.
///
/// Rig JSON (from tools/export_rig.py), canvas pixels with y pointing down:
///   { "canvas": [w, h], "layers": [{ "name", "file", "frame": [x0,y0,x1,y1], "pivot": [x,y] }] }
///
/// The node's origin is the bottom-centre of the drawn character.
final class CharacterNode: SKNode {
    private struct Rig: Decodable {
        struct Layer: Decodable {
            let name: String
            let file: String
            let frame: [CGFloat]
            let pivot: [CGFloat]
        }
        let canvas: [CGFloat]
        let layers: [Layer]
    }

    private(set) var contentHeight: CGFloat = 0
    private var parts: [String: SKSpriteNode] = [:]

    init?(rig name: String) {
        super.init()
        guard let rig = Self.load(name) else {
            return nil
        }
        build(rig)
        animate()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) is not supported")
    }

    // MARK: - Build

    private static func load(_ name: String) -> Rig? {
        guard let url = AssetStore.url(name, ext: "json"),
              let data = try? Data(contentsOf: url) else {
            NSLog("Missing rig: \(name)")
            return nil
        }
        return try? JSONDecoder().decode(Rig.self, from: data)
    }

    private func build(_ rig: Rig) {
        let canvasHeight = rig.canvas[1]
        let bottom = rig.layers.map { $0.frame[3] }.max() ?? canvasHeight
        let top = rig.layers.map { $0.frame[1] }.min() ?? 0
        contentHeight = bottom - top

        // Shift so (0, 0) is the character's bottom centre.
        let shift = CGPoint(x: -rig.canvas[0] / 2, y: -(canvasHeight - bottom))

        for (index, layer) in rig.layers.enumerated() {
            let (x0, y0, x1, y1) = (layer.frame[0], layer.frame[1], layer.frame[2], layer.frame[3])
            let (px, py) = (layer.pivot[0], layer.pivot[1])
            let width = x1 - x0
            let height = y1 - y0

            let sprite = SKSpriteNode(texture: AssetStore.texture(layer.file))
            sprite.size = CGSize(width: width, height: height)

            // Anchor at the pivot (SpriteKit anchors are bottom-left based).
            sprite.anchorPoint = CGPoint(x: (px - x0) / width, y: (y1 - py) / height)
            sprite.position = CGPoint(x: px + shift.x, y: canvasHeight - py + shift.y)
            sprite.zPosition = CGFloat(index)

            addChild(sprite)
            parts[layer.name] = sprite
        }
    }

    // MARK: - Motion

    private func animate() {
        sway("head", angle: 0.04, period: 4.5)
        sway("eyes", angle: 0.04, period: 4.5)
        sway("bangs", angle: 0.04, period: 4.5)
        sway("tail_l", angle: 0.05, period: 3.8)
        sway("tail_r", angle: -0.04, period: 4.4)
        sway("ribbon_l", angle: 0.03, period: 3.2)
        sway("ribbon_r", angle: -0.03, period: 3.6)
        sway("arm_l", angle: 0.04, period: 5)
        reach("arm_r")
        breathe("body")
        squeezeEyes()
        hover()

        // Mesh-like bending, the part of Spine that rotation alone cannot fake.
        bend("tail_l", amplitude: 0.05, period: 3.8)
        bend("tail_r", amplitude: 0.04, period: 4.4)
        bend("ribbon_l", amplitude: 0.06, period: 3.2)
        bend("ribbon_r", amplitude: 0.06, period: 3.6)
        bend("skirt", amplitude: 0.015, period: 3.2)
    }

    // MARK: - Bending

    private static let bendGrid = 8
    private static let bendFrames = 12

    /// Whip-like wave travelling from the layer's pivot to its tip.
    ///
    /// Each warp vertex moves perpendicular to the line from the pivot,
    /// scaled by its squared distance (the root stays pinned) and delayed
    /// with distance (the tip lags behind the root).
    private func bend(_ name: String, amplitude: Float, period: TimeInterval) {
        guard let node = parts[name] else { return }

        let n = Self.bendGrid
        let anchor = SIMD2<Float>(Float(node.anchorPoint.x), Float(node.anchorPoint.y))
        let rest = (0...n).flatMap { row in
            (0...n).map { col in SIMD2<Float>(Float(col) / Float(n), Float(row) / Float(n)) }
        }
        let reach = rest.map { simd_length($0 - anchor) }.max() ?? 1

        var warps: [SKWarpGeometryGrid] = []
        for frame in 0..<Self.bendFrames {
            let phase = Float(frame) / Float(Self.bendFrames) * 2 * .pi
            let bent = rest.map { point -> SIMD2<Float> in
                let arm = point - anchor
                let dist = simd_length(arm) / reach
                guard dist > 0.001 else { return point }
                let normal = SIMD2<Float>(-arm.y, arm.x) / simd_length(arm)
                let wave = sin(phase - dist * 2.4)
                return point + normal * (amplitude * dist * dist * wave)
            }
            warps.append(SKWarpGeometryGrid(columns: n, rows: n, sourcePositions: rest, destinationPositions: bent))
        }

        node.warpGeometry = warps[0]
        let step = period / Double(Self.bendFrames)
        let times = (1...Self.bendFrames).map { NSNumber(value: step * Double($0)) }
        guard let loop = SKAction.animate(withWarps: warps, times: times, restore: false) else { return }
        node.run(.repeatForever(loop))
    }

    private func sway(_ name: String, angle: CGFloat, period: TimeInterval) {
        guard let node = parts[name] else { return }
        let there = SKAction.rotate(toAngle: angle, duration: period / 2)
        there.timingMode = .easeInEaseOut
        let back = SKAction.rotate(toAngle: -angle, duration: period / 2)
        back.timingMode = .easeInEaseOut
        node.run(.repeatForever(.sequence([there, back])))
    }

    /// Outstretched hand grasping toward the cushion.
    private func reach(_ name: String) {
        guard let node = parts[name] else { return }
        let grab = SKAction.rotate(toAngle: 0.07, duration: 0.5)
        grab.timingMode = .easeInEaseOut
        let back = SKAction.rotate(toAngle: -0.02, duration: 0.6)
        back.timingMode = .easeInEaseOut
        node.run(.repeatForever(.sequence([
            .repeat(.sequence([grab, back]), count: 2),
            .rotate(toAngle: 0, duration: 0.4),
            .wait(forDuration: 3),
        ])))
    }

    private func breathe(_ name: String) {
        guard let node = parts[name] else { return }
        let inhale = SKAction.scaleY(to: 1.015, duration: 1.6)
        inhale.timingMode = .easeInEaseOut
        let exhale = SKAction.scaleY(to: 1, duration: 1.6)
        exhale.timingMode = .easeInEaseOut
        node.run(.repeatForever(.sequence([inhale, exhale])))
    }

    /// The >< eyes scrunch now and then.
    private func squeezeEyes() {
        guard let node = parts["eyes"] else { return }
        let squeeze = SKAction.scaleY(to: 0.8, duration: 0.08)
        let open = SKAction.scaleY(to: 1, duration: 0.12)
        node.run(.repeatForever(.sequence([
            .wait(forDuration: 3, withRange: 2),
            squeeze, open, squeeze, open,
        ])))
    }

    /// Mid-dive float: slow drift up and down with a slight tilt.
    private func hover() {
        let up = SKAction.moveBy(x: 6, y: 16, duration: 2.2)
        up.timingMode = .easeInEaseOut
        let tilt = SKAction.rotate(toAngle: 0.02, duration: 2.2)
        tilt.timingMode = .easeInEaseOut
        let untilt = SKAction.rotate(toAngle: -0.02, duration: 2.2)
        untilt.timingMode = .easeInEaseOut
        run(.repeatForever(.sequence([
            .group([up, tilt]),
            .group([up.reversed(), untilt]),
        ])))
    }
}
