import AppKit
import SpriteKit

/// The vrfloor_03 "live stage meeting" room, rebuilt in 2.5D from atlas parts.
///
///   ┌──────────── sky wall (arch cut-out) ─────────────┐   depth 0.3
///   │  planet      ☆ stars behind the arch ☆    saturn │   depth 0.5
///   │ cloud                                     cloud  │   depth 0.4
///   │           sign  ·  bubble  ·  platform           │   depth 0.8
///   └──────────────── cyan grid floor ─────────────────┘   depth 0.7
///
/// Sizes are authored for a 1080-pt-tall screen and scaled by `unit`.
final class StageScene: SKScene {
    private static let referenceHeight: CGFloat = 1080
    private static let maxParallax: CGFloat = 28
    private static let parallaxEase: CGFloat = 0.06
    private static let characterHeight: CGFloat = 620

    private var unit: CGFloat = 1
    private var layers: [(node: SKNode, depth: CGFloat)] = []
    private var parallaxTarget = CGPoint.zero
    private var parallaxNow = CGPoint.zero

    override init(size: CGSize) {
        super.init(size: size)
        scaleMode = .resizeFill
        backgroundColor = NSColor(calibratedRed: 0.20, green: 0.10, blue: 0.32, alpha: 1)
        unit = size.height / Self.referenceHeight
        build()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) is not supported")
    }

    func setParallax(_ point: CGPoint) {
        parallaxTarget = point
    }

    override func update(_ currentTime: TimeInterval) {
        // Ease toward the cursor so movement stays soft.
        parallaxNow.x += (parallaxTarget.x - parallaxNow.x) * Self.parallaxEase
        parallaxNow.y += (parallaxTarget.y - parallaxNow.y) * Self.parallaxEase

        for layer in layers {
            layer.node.position = CGPoint(
                x: -parallaxNow.x * layer.depth * Self.maxParallax * unit,
                y: -parallaxNow.y * layer.depth * Self.maxParallax * unit * 0.5
            )
        }
    }

    // MARK: - Build

    private func build() {
        addBackdrop()
        addStars()
        addSkyWall()
        addClouds()
        addPlanets()
        addFloor()
        addStage()
        addSparkles()
    }

    private func layer(depth: CGFloat, z: CGFloat) -> SKNode {
        let node = SKNode()
        node.zPosition = z
        addChild(node)
        layers.append((node, depth))
        return node
    }

    /// Sprite scaled to a height in reference points, placed in relative coords.
    private func sprite(_ name: String, height: CGFloat, at rel: CGPoint, in parent: SKNode) -> SKSpriteNode {
        let node = SKSpriteNode(texture: AssetStore.texture(name))
        let scale = height * unit / max(node.size.height, 1)
        node.setScale(scale)
        node.position = CGPoint(x: rel.x * size.width, y: rel.y * size.height)
        parent.addChild(node)
        return node
    }

    /// Sprite scaled to a fraction of the screen width.
    private func sprite(_ name: String, widthFraction: CGFloat, in parent: SKNode) -> SKSpriteNode {
        let node = SKSpriteNode(texture: AssetStore.texture(name))
        node.setScale(size.width * widthFraction / max(node.size.width, 1))
        parent.addChild(node)
        return node
    }

    // MARK: - Layers

    /// Violet-to-pink gradient seen through the arch.
    private func addBackdrop() {
        let top = NSColor(calibratedRed: 0.45, green: 0.30, blue: 0.78, alpha: 1)
        let bottom = NSColor(calibratedRed: 1.0, green: 0.86, blue: 0.95, alpha: 1)
        let node = SKSpriteNode(texture: Textures.verticalGradient(top: top, bottom: bottom))
        node.size = size
        node.position = CGPoint(x: size.width / 2, y: size.height / 2)
        layer(depth: 0.1, z: 0).addChild(node)
    }

    private func addStars() {
        let parent = layer(depth: 0.15, z: 1)
        let glow = Textures.glow
        let count = 90

        for _ in 0..<count {
            let star = SKSpriteNode(texture: glow)
            star.setScale(CGFloat.random(in: 0.04...0.14) * unit)
            star.position = CGPoint(
                x: CGFloat.random(in: 0...size.width),
                y: CGFloat.random(in: size.height * 0.3...size.height)
            )
            star.blendMode = .add
            star.alpha = 0

            let rise = SKAction.fadeAlpha(to: CGFloat.random(in: 0.5...1), duration: .random(in: 0.8...2.4))
            let fall = SKAction.fadeAlpha(to: 0.1, duration: .random(in: 0.8...2.4))
            let wait = SKAction.wait(forDuration: .random(in: 0...3))
            star.run(.sequence([wait, .repeatForever(.sequence([rise, fall]))]))
            parent.addChild(star)
        }
    }

    /// Pink galaxy wall; its transparent arch reveals backdrop and stars.
    private func addSkyWall() {
        let parent = layer(depth: 0.3, z: 2)
        let wall = sprite("sky", widthFraction: 1.08, in: parent)
        wall.anchorPoint = CGPoint(x: 0.5, y: 1)
        wall.position = CGPoint(x: size.width / 2, y: size.height + 20 * unit)
    }

    private func addClouds() {
        let parent = layer(depth: 0.4, z: 3)

        let left = sprite("cloud_tall_a", height: 820, at: CGPoint(x: 0.06, y: 0.55), in: parent)
        bob(left, dy: 14, period: 7)

        let right = sprite("cloud_tall_b", height: 520, at: CGPoint(x: 0.95, y: 0.60), in: parent)
        bob(right, dy: 12, period: 6)

        // Long wisps drift across and wrap around.
        let wisp = sprite("cloud_long", height: 190, at: CGPoint(x: 0.3, y: 0.66), in: parent)
        wisp.alpha = 0.85
        drift(wisp, duration: 90)

        let puff = sprite("cloud_puff", height: 160, at: CGPoint(x: 0.75, y: 0.50), in: parent)
        puff.alpha = 0.8
        drift(puff, duration: 120)
    }

    private func addPlanets() {
        let parent = layer(depth: 0.5, z: 4)

        let blue = sprite("planet_blue", height: 250, at: CGPoint(x: 0.24, y: 0.73), in: parent)
        bob(blue, dy: 18, period: 9)
        blue.run(.repeatForever(.rotate(byAngle: .pi * 2, duration: 240)))

        let saturn = sprite("saturn", height: 250, at: CGPoint(x: 0.78, y: 0.76), in: parent)
        bob(saturn, dy: 22, period: 11)
        sway(saturn, angle: 0.05, period: 13)
    }

    private func addFloor() {
        let parent = layer(depth: 0.7, z: 5)

        // Solid base so the elliptical floor never shows gaps at the bottom edge.
        let base = SKSpriteNode(
            color: NSColor(calibratedRed: 0.40, green: 0.88, blue: 0.95, alpha: 1),
            size: CGSize(width: size.width * 1.2, height: size.height * 0.07)
        )
        base.anchorPoint = CGPoint(x: 0.5, y: 0)
        base.position = CGPoint(x: size.width / 2, y: -40 * unit)
        parent.addChild(base)

        // Wider on screens narrower than 16:9 so the ellipse reaches both corners.
        let wideAspect: CGFloat = 16.0 / 9.0
        let widen = max(1, wideAspect / (size.width / size.height))
        let floor = sprite("floor", widthFraction: 1.04 * widen, in: parent)
        floor.anchorPoint = CGPoint(x: 0.5, y: 1)
        floor.position = CGPoint(x: size.width / 2, y: size.height * 0.34)

        // Neon glow breathing over the grid.
        let glow = SKSpriteNode(texture: Textures.glow)
        glow.size = CGSize(width: size.width * 1.1, height: size.height * 0.45)
        glow.position = CGPoint(x: size.width / 2, y: size.height * 0.2)
        glow.color = NSColor(calibratedRed: 0.4, green: 0.95, blue: 1, alpha: 1)
        glow.colorBlendFactor = 1
        glow.blendMode = .add
        glow.alpha = 0.10
        glow.run(.repeatForever(.sequence([
            .fadeAlpha(to: 0.22, duration: 3),
            .fadeAlpha(to: 0.08, duration: 3),
        ])))
        parent.addChild(glow)
    }

    private func addStage() {
        let parent = layer(depth: 0.8, z: 6)

        let disc = sprite("disc", height: 150, at: CGPoint(x: 0.30, y: 0.15), in: parent)
        disc.alpha = 0.95

        // Arare, fitted part-by-part to the in-game pose, diving toward the cushion.
        if let arare = CharacterNode(rig: "arare") {
            arare.setScale(Self.characterHeight * unit / max(arare.contentHeight, 1))
            arare.position = CGPoint(x: disc.position.x - 30 * unit, y: disc.position.y + 30 * unit)
            parent.addChild(arare)
        }

        _ = sprite("platform", height: 190, at: CGPoint(x: 0.66, y: 0.16), in: parent)

        let sign = sprite("sign", height: 190, at: CGPoint(x: 0.66, y: 0.33), in: parent)
        bob(sign, dy: 10, period: 4)
        pulse(sign, amount: 0.03, period: 4)

        let bubble = sprite("bubble", height: 80, at: CGPoint(x: 0.82, y: 0.43), in: parent)
        popLoop(bubble)
    }

    /// Soft pastel motes rising from the floor.
    private func addSparkles() {
        let emitter = SKEmitterNode()
        emitter.particleTexture = Textures.glow
        emitter.particleBirthRate = 5
        emitter.particleLifetime = 10
        emitter.particleLifetimeRange = 4
        emitter.particlePositionRange = CGVector(dx: size.width, dy: 0)
        emitter.position = CGPoint(x: size.width / 2, y: -10)
        emitter.emissionAngle = .pi / 2
        emitter.emissionAngleRange = 0.4
        emitter.particleSpeed = 45 * unit
        emitter.particleSpeedRange = 25 * unit
        emitter.particleScale = 0.08 * unit
        emitter.particleScaleRange = 0.06 * unit
        emitter.particleAlpha = 0.8
        emitter.particleAlphaSpeed = -0.08
        emitter.particleBlendMode = .add
        emitter.particleColorSequence = SKKeyframeSequence(
            keyframeValues: [
                NSColor(calibratedRed: 1, green: 0.7, blue: 0.9, alpha: 1),
                NSColor(calibratedRed: 0.7, green: 0.9, blue: 1, alpha: 1),
                NSColor(calibratedRed: 1, green: 0.95, blue: 0.7, alpha: 1),
            ],
            times: [0, 0.5, 1]
        )
        emitter.advanceSimulationTime(10)
        layer(depth: 1.0, z: 7).addChild(emitter)
    }

    // MARK: - Motion helpers

    private func bob(_ node: SKNode, dy: CGFloat, period: TimeInterval) {
        let up = SKAction.moveBy(x: 0, y: dy * unit, duration: period / 2)
        up.timingMode = .easeInEaseOut
        let wait = SKAction.wait(forDuration: .random(in: 0...period))
        node.run(.sequence([wait, .repeatForever(.sequence([up, up.reversed()]))]))
    }

    private func sway(_ node: SKNode, angle: CGFloat, period: TimeInterval) {
        let tilt = SKAction.rotate(byAngle: angle, duration: period / 2)
        tilt.timingMode = .easeInEaseOut
        node.run(.repeatForever(.sequence([tilt, tilt.reversed()])))
    }

    private func pulse(_ node: SKNode, amount: CGFloat, period: TimeInterval) {
        let base = node.xScale
        let grow = SKAction.scale(to: base * (1 + amount), duration: period / 2)
        grow.timingMode = .easeInEaseOut
        let shrink = SKAction.scale(to: base, duration: period / 2)
        shrink.timingMode = .easeInEaseOut
        node.run(.repeatForever(.sequence([grow, shrink])))
    }

    /// Move right across the screen, wrap to the left edge, repeat.
    private func drift(_ node: SKSpriteNode, duration: TimeInterval) {
        let span = size.width + node.frame.width
        let startX = -node.frame.width / 2
        let endX = size.width + node.frame.width / 2
        let firstLeg = duration * Double((endX - node.position.x) / span)

        let loop = SKAction.sequence([
            .moveTo(x: startX, duration: 0),
            .moveTo(x: endX, duration: duration),
        ])
        node.run(.sequence([.moveTo(x: endX, duration: firstLeg), .repeatForever(loop)]))
    }

    /// Speech bubble pops in, holds, and fades out every few seconds.
    private func popLoop(_ node: SKSpriteNode) {
        let base = node.xScale
        node.setScale(0)

        let pop = SKAction.scale(to: base * 1.15, duration: 0.18)
        let settle = SKAction.scale(to: base, duration: 0.12)
        let hide = SKAction.group([.fadeOut(withDuration: 0.4), .scale(to: base * 0.8, duration: 0.4)])
        let reset = SKAction.run { node.alpha = 1; node.setScale(0) }

        node.run(.repeatForever(.sequence([
            .wait(forDuration: 3),
            pop, settle,
            .wait(forDuration: 3.5),
            hide, reset,
        ])))
    }
}
