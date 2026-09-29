import SwiftUI

/// Visual language borrowed from the Our Notes game UI: navy backdrop,
/// indigo tab slabs (teal arrow slab when selected), translucent option
/// pills with a thin rule, and lavender "menu" buttons with dotted corners.
enum Theme {
    static let navyTop = Color(red: 0.11, green: 0.13, blue: 0.33)
    static let navyBottom = Color(red: 0.15, green: 0.18, blue: 0.40)
    static let panel = Color(red: 0.09, green: 0.10, blue: 0.25)
    static let tabTop = Color(red: 0.36, green: 0.42, blue: 0.85)
    static let tabBottom = Color(red: 0.24, green: 0.29, blue: 0.69)
    static let tabEdge = Color(red: 0.62, green: 0.68, blue: 0.97)
    static let tealTop = Color(red: 0.50, green: 0.87, blue: 0.87)
    static let tealBottom = Color(red: 0.24, green: 0.64, blue: 0.72)
    static let teal = Color(red: 0.30, green: 0.72, blue: 0.78)
    static let pill = Color(red: 0.17, green: 0.20, blue: 0.45)
    static let pillEdge = Color(red: 0.47, green: 0.53, blue: 0.84)
    /// Opened option panel: its own lighter slate, translucent over the backdrop.
    static let pillOpen = Color(red: 0.46, green: 0.50, blue: 0.72).opacity(0.42)
    static let lavenderTop = Color(red: 0.94, green: 0.95, blue: 0.99)
    static let lavenderBottom = Color(red: 0.77, green: 0.79, blue: 0.90)
    static let ink = Color(red: 0.17, green: 0.19, blue: 0.38)
    static let magenta = Color(red: 0.84, green: 0.36, blue: 0.94)

    static func font(_ size: CGFloat, _ weight: Font.Weight = .bold) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }
}

/// Navy backdrop with an optional blurred scene behind it (game menus sit
/// over the blurred live view).
struct GameBackdrop: View {
    let image: NSImage?

    var body: some View {
        ZStack {
            LinearGradient(colors: [Theme.navyTop, Theme.navyBottom], startPoint: .top, endPoint: .bottom)
            if let image {
                // Overlay on a clear view so the picture never drives layout size.
                Color.clear.overlay(
                    Image(nsImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .blur(radius: 14)
                        .opacity(0.45)
                )
                LinearGradient(colors: [Theme.navyTop.opacity(0.55), Theme.navyBottom.opacity(0.75)],
                               startPoint: .top, endPoint: .bottom)
            }
        }
        .clipped()
        .accessibilityHidden(true)
    }
}

/// Selected sidebar slab: rectangle with an arrow point on the right.
struct ArrowSlab: Shape {
    func path(in rect: CGRect) -> Path {
        let tip = min(18, rect.height / 2)
        var p = Path()
        p.move(to: CGPoint(x: rect.minX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX - tip, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
        p.addLine(to: CGPoint(x: rect.maxX - tip, y: rect.maxY))
        p.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        p.closeSubpath()
        return p
    }
}

/// Left-column tab ("기본 / 상세 / 표시 1 ..." in the game). `badge` is the
/// magenta "적용 중" ribbon the game puts on an active mode.
struct GameTab: View {
    private static let selectedShift: CGFloat = 12

    let title: String
    let selected: Bool
    var badge: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack(alignment: .top) {
                label
                if let badge {
                    Text(badge)
                        .font(Theme.font(11))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 16)
                        .background(LinearGradient(colors: [Theme.magenta.opacity(0), Theme.magenta, Theme.magenta.opacity(0)],
                                                   startPoint: .leading, endPoint: .trailing))
                        .offset(y: -8)
                }
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? [.isSelected] : [])
    }

    @ViewBuilder private var label: some View {
        let text = Text(title).font(Theme.font(16)).foregroundStyle(.white)
            .shadow(color: .black.opacity(0.25), radius: 1, y: 1)
        if selected {
            HStack {
                Spacer()
                text
                Spacer()
                Image(systemName: "sparkle").font(.system(size: 10, weight: .bold)).foregroundStyle(.white)
                    .padding(.trailing, 20)
            }
            .frame(height: 46)
            .background(ArrowSlab().fill(LinearGradient(colors: [Theme.tealTop, Theme.tealBottom],
                                                        startPoint: .top, endPoint: .bottom)))
            .overlay(ArrowSlab().stroke(Color.white.opacity(0.75), lineWidth: 1.5))
            .shadow(color: Theme.teal.opacity(0.6), radius: 6)
            // Juts out to the right of the other slabs, into the middle column.
            .offset(x: Self.selectedShift)
        } else {
            text
                .frame(maxWidth: .infinity)
                .frame(height: 46)
                .background(LinearGradient(colors: [Theme.tabTop, Theme.tabBottom], startPoint: .top, endPoint: .bottom))
                .overlay(alignment: .top) { Rectangle().fill(Theme.tabEdge).frame(height: 1.5) }
                .overlay(Rectangle().stroke(Color.black.opacity(0.25), lineWidth: 1))
                .padding(.trailing, 18)
        }
    }
}

/// Middle-column row ("노트 설정 / 라이브 설정").
struct SubTabRow: View {
    let title: String
    var icon: NSImage? = nil
    let selected: Bool
    var badge: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon {
                    Image(nsImage: icon).resizable().interpolation(.high).frame(width: 22, height: 22)
                        .accessibilityHidden(true)
                }
                Text(title).font(Theme.font(14)).foregroundStyle(.white).lineLimit(1)
                if let badge {
                    Text(badge).font(Theme.font(10)).foregroundStyle(.white)
                        .padding(.horizontal, 8).padding(.vertical, 1)
                        .background(Capsule(style: .circular).fill(Theme.magenta))
                }
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 16)
            .frame(height: 44)
            .background(selected ? AnyShapeStyle(LinearGradient(colors: [Theme.teal.opacity(0.95), Theme.tealBottom.opacity(0.8)],
                                                                 startPoint: .top, endPoint: .bottom))
                                 : AnyShapeStyle(Color.clear))
            .overlay(alignment: .bottom) { Rectangle().fill(Color.white.opacity(0.28)).frame(height: 1) }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? [.isSelected] : [])
    }
}

/// Right-column option: translucent capsule header (title, thin rule, value,
/// ▲). A tap opens it (▼) into a panel holding the choices, as in the game;
/// it never changes the value by itself.
struct OptionPill<Detail: View>: View {
    private static var headerHeight: CGFloat { 64 }
    private static var radius: CGFloat { headerHeight / 2 }


    let title: String
    let value: String
    let enabled: Bool
    let badge: String?
    let expanded: Bool
    let expandable: Bool
    let action: () -> Void
    let detail: () -> Detail

    init(title: String, value: String, enabled: Bool = true, badge: String? = nil,
         expanded: Bool = false, expandable: Bool = true,
         action: @escaping () -> Void, @ViewBuilder detail: @escaping () -> Detail) {
        self.title = title
        self.value = value
        self.enabled = enabled
        self.badge = badge
        self.expanded = expanded
        self.expandable = expandable
        self.action = action
        self.detail = detail
    }

    private var capsule: RoundedRectangle { RoundedRectangle(cornerRadius: Self.radius, style: .circular) }

    /// Header capsule keeps its own fill whether open or not. Opening drops a
    /// separately coloured panel whose top edge is the capsule's lower
    /// contour itself: flush against the capsule, never over it, and the
    /// capsule border is dropped so no line separates them.
    var body: some View {
        VStack(spacing: 0) {
            Button(action: action) {
                header
                    .frame(height: Self.headerHeight)
                    .background(capsule.fill(Theme.pill.opacity(0.55)))
                    .overlay(capsule.stroke(Theme.pillEdge.opacity(expanded ? 0 : 0.8), lineWidth: 1))
            }
            .buttonStyle(.plain)
            .accessibilityLabel("\(title), \(value)")
            .accessibilityValue(expanded ? "열림" : "닫힘")

            if expanded {
                detail()
                    .padding(.horizontal, 22)
                    .padding(.top, 14)
                    .padding(.bottom, 18)
            }
        }
        .background {
            if expanded {
                DropPanel(headerHeight: Self.headerHeight, radius: Self.radius)
                    .fill(Theme.pillOpen)
            }
        }
        .opacity(enabled ? 1 : 0.45)
        .disabled(!enabled)
    }

    private var header: some View {
        HStack(spacing: 14) {
            VStack(alignment: .leading, spacing: 5) {
                HStack(spacing: 8) {
                    Text(title).font(Theme.font(13))
                    if let badge {
                        Text(badge).font(Theme.font(10)).padding(.horizontal, 8).padding(.vertical, 1)
                            .background(Capsule(style: .circular).fill(Theme.magenta))
                    }
                }
                Rectangle().fill(Color.white.opacity(0.85)).frame(height: 1)
                Text(value).font(Theme.font(16, .semibold))
            }
            Image(systemName: expandable && expanded ? "arrowtriangle.down.fill" : "arrowtriangle.up.fill")
                .font(.system(size: 17))
                .frame(width: 22)
                .accessibilityHidden(true)
        }
        .foregroundStyle(.white)
        .padding(.leading, 34)
        .padding(.trailing, 28)
        .contentShape(Rectangle())
    }
}

/// Opened-pill panel: from the header's vertical middle down, square on top
/// and rounded with the pill radius at the bottom, minus the header capsule.
/// What is left starts exactly on the capsule's lower contour and fills the
/// corners beside it up to the capsule's widest point.
///
///   ╭──────── header capsule ────────╮
///  ▕╰────────────────────────────────╯▏  <- panel top = capsule contour
///  ▕        OFF        ON             ▏
///   ╰─────────────────────────────────╯
private struct DropPanel: Shape {
    let headerHeight: CGFloat
    let radius: CGFloat

    func path(in rect: CGRect) -> Path {
        let top = headerHeight / 2
        let body = UnevenRoundedRectangle(bottomLeadingRadius: radius, bottomTrailingRadius: radius, style: .circular)
            .path(in: CGRect(x: rect.minX, y: rect.minY + top, width: rect.width, height: rect.height - top))
        let header = Path(roundedRect: CGRect(x: rect.minX, y: rect.minY, width: rect.width, height: headerHeight),
                          cornerRadius: radius, style: .circular)
        return body.subtracting(header)
    }
}

extension OptionPill where Detail == EmptyView {
    /// A pill without a choice panel (it navigates instead).
    init(title: String, value: String, enabled: Bool = true, expandable: Bool = false,
         action: @escaping () -> Void) {
        self.init(title: title, value: value, enabled: enabled, expandable: expandable,
                  action: action, detail: { EmptyView() })
    }
}

/// OFF / ON choice inside an opened pill, sized like the game (about 40% of
/// the pill width): capsule with a radio at its left end. Selected: teal
/// capsule, white-ringed radio with a small white ring inside. Otherwise:
/// dark translucent capsule, navy radio with an indigo ring.
struct RadioChoice: View {
    static let width: CGFloat = 164

    let title: String
    let selected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                ZStack {
                    Circle().fill(selected ? Theme.tealBottom : Theme.panel)
                    Circle().strokeBorder(selected ? Color.white : Theme.pillEdge, lineWidth: 2.5)
                    if selected {
                        Circle().strokeBorder(Color.white, lineWidth: 2.5).frame(width: 13, height: 13)
                    }
                }
                .frame(width: 30, height: 30)
                Text(title).font(Theme.font(14))
                Spacer(minLength: 0)
            }
            .foregroundStyle(.white)
            .padding(.leading, 6)
            .frame(width: Self.width, height: 42)
            .background(Capsule(style: .circular).fill(selected
                ? AnyShapeStyle(LinearGradient(colors: [Theme.teal, Theme.tealBottom.opacity(0.85)], startPoint: .top, endPoint: .bottom))
                : AnyShapeStyle(Theme.panel.opacity(0.45))))
            .contentShape(Capsule(style: .circular))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? [.isSelected] : [])
    }
}

/// [∨] value [∧] stepper inside an opened pill (the game's number detail,
/// without its slider).
struct StepperField: View {
    let value: String
    let canDown: Bool
    let canUp: Bool
    let down: () -> Void
    let up: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            StepButton(systemImage: "chevron.down", label: "줄이기", enabled: canDown, action: down)
            Text(value)
                .font(Theme.font(18, .heavy))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 46)
                .background(RoundedRectangle(cornerRadius: 6).fill(Theme.panel.opacity(0.75)))
                .accessibilityHidden(true)
            StepButton(systemImage: "chevron.up", label: "늘리기", enabled: canUp, action: up)
        }
        .padding(.top, 4)
        .accessibilityElement(children: .contain)
        .accessibilityValue(value)
    }
}

private struct StepButton: View {
    let systemImage: String
    let label: String
    let enabled: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: systemImage)
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 46, height: 46)
                .background(RoundedRectangle(cornerRadius: 5)
                    .fill(LinearGradient(colors: [Theme.tabTop, Theme.tabBottom], startPoint: .top, endPoint: .bottom)))
                .overlay(RoundedRectangle(cornerRadius: 5).stroke(Color.white.opacity(0.85), lineWidth: 1.5))
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .opacity(enabled ? 1 : 0.4)
        .disabled(!enabled)
        .accessibilityLabel(label)
    }
}

/// Small navy capsule ("기본값으로 되돌리기").
struct CapsuleButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title).font(Theme.font(14)).foregroundStyle(.white)
                .padding(.horizontal, 20).frame(height: 38)
                .background(Capsule(style: .circular).fill(LinearGradient(colors: [Theme.tabTop, Theme.tabBottom], startPoint: .top, endPoint: .bottom)))
                .overlay(Capsule(style: .circular).strokeBorder(Theme.tabEdge, lineWidth: 1.5))
                .contentShape(Capsule(style: .circular))
        }
        .buttonStyle(.plain)
    }
}

/// Faded dot grid in a menu button corner.
private struct DotCorner: View {
    var body: some View {
        Canvas { ctx, size in
            for row in 0..<3 {
                for col in 0..<(5 - row) {
                    let alpha = 0.5 - Double(col) * 0.09
                    let rect = CGRect(x: 4 + Double(col) * 6, y: 4 + Double(row) * 6, width: 3.4, height: 3.4)
                    ctx.fill(Path(ellipseIn: rect), with: .color(.white.opacity(max(alpha, 0.08))))
                }
            }
        }
        .frame(width: 36, height: 22)
        .allowsHitTesting(false)
    }
}

/// Lavender menu button ("교환소 / 공지사항 / 닫기").
struct LavenderButton: View {
    let title: String
    var systemImage: String? = nil
    var height: CGFloat = 46
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                if let systemImage {
                    Image(systemName: systemImage).font(.system(size: 20, weight: .semibold))
                        .accessibilityHidden(true)
                }
                Text(title).font(Theme.font(15))
            }
            .foregroundStyle(Theme.ink)
            .frame(maxWidth: .infinity)
            .frame(height: height)
            .background(RoundedRectangle(cornerRadius: 4).fill(LinearGradient(colors: [Theme.lavenderTop, Theme.lavenderBottom],
                                                                              startPoint: .top, endPoint: .bottom)))
            .overlay(alignment: .topLeading) { DotCorner() }
            .overlay(alignment: .bottomTrailing) { DotCorner().rotationEffect(.degrees(180)) }
            .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.white.opacity(0.9), lineWidth: 1))
            .shadow(color: .black.opacity(0.35), radius: 2, y: 2)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

/// Framed dialog panel with the striped title bar ("메뉴").
struct MenuPanel<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                VStack(spacing: 5) {
                    ForEach(0..<6, id: \.self) { _ in
                        Rectangle().fill(Color.white.opacity(0.14)).frame(height: 1)
                    }
                }
                LinearGradient(colors: [.clear, .clear, Color(red: 0.75, green: 0.55, blue: 0.85).opacity(0.55)],
                               startPoint: .leading, endPoint: .trailing)
                Text(title).font(Theme.font(22, .heavy)).foregroundStyle(.white)
                    .accessibilityAddTraits(.isHeader)
            }
            .frame(height: 46)
            .padding(.horizontal, 8)
            .padding(.top, 8)

            content
                .padding(22)
                .frame(maxWidth: .infinity)
                .overlay(Rectangle().stroke(Color.white.opacity(0.45), lineWidth: 1))
                .padding(5)
                .overlay(Rectangle().stroke(Color.white.opacity(0.3), lineWidth: 1))
                .padding(18)
        }
        .background(Theme.panel.opacity(0.9))
        .overlay(Rectangle().stroke(Theme.pillEdge.opacity(0.5), lineWidth: 1))
    }
}
