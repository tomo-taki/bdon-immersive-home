import AppKit
import SpriteKit

/// Procedural textures (gradient backdrop, soft glow dot).
enum Textures {
    private static let glowSide = 128

    static let glow: SKTexture = {
        let side = CGFloat(glowSide)
        let image = NSImage(size: NSSize(width: side, height: side), flipped: false) { rect in
            guard let ctx = NSGraphicsContext.current?.cgContext else { return false }
            let colors = [NSColor.white.cgColor, NSColor.white.withAlphaComponent(0).cgColor] as CFArray
            let space = CGColorSpaceCreateDeviceRGB()
            guard let gradient = CGGradient(colorsSpace: space, colors: colors, locations: [0, 1]) else {
                return false
            }
            let centre = CGPoint(x: rect.midX, y: rect.midY)
            ctx.drawRadialGradient(
                gradient,
                startCenter: centre, startRadius: 0,
                endCenter: centre, endRadius: side / 2,
                options: []
            )
            return true
        }
        return SKTexture(image: image)
    }()

    static func verticalGradient(top: NSColor, bottom: NSColor) -> SKTexture {
        let image = NSImage(size: NSSize(width: 4, height: 256), flipped: false) { rect in
            NSGradient(starting: bottom, ending: top)?.draw(in: rect, angle: 90)
            return true
        }
        return SKTexture(image: image)
    }
}
