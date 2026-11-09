import Foundation

@main
private enum LockScreenLinkTest {
    private static let directory = URL(fileURLWithPath: "/Users/me/LockScreen")
    private static let current = directory.appendingPathComponent("3-200.jpg")
    private static let previous = directory.appendingPathComponent("3-100.jpg")

    static func main() throws {
        let desktop = try image(current), old = try image(previous)
        let saver: [String: Any] = ["Content": ["Choices": [["Provider": "default", "Configuration": Data()]]]]
        let node: [String: Any] = ["Type": "individual", "Desktop": desktop, "Idle": saver, "unrelated": 42]
        let foreign: [String: Any] = ["Type": "individual", "Desktop": try image(URL(fileURLWithPath: "/Users/me/cat.jpg")), "Idle": saver]
        let original: [String: Any] = ["SystemDefault": node, "AllSpacesAndDisplays": ["Type": "idle", "Idle": saver],
                                      "Displays": ["ours": node, "other": foreign],
                                      "Spaces": ["": ["Default": node, "Displays": ["ours": node]]]]
        var state = LockScreenState(original)
        precondition(!state.hasLink(current), "a pending desktop write is not a completed link")
        precondition(state.link(current) == 4)
        precondition(state.hasLink(current))
        let linked = state.propertyList
        let system = linked["SystemDefault"] as! [String: Any]
        precondition(system["Type"] as? String == "linked")
        precondition(equal(system["Linked"], desktop))
        precondition(system["Desktop"] == nil && system["Idle"] == nil)
        precondition(system["unrelated"] as? Int == 42)
        precondition(linked["AllSpacesAndDisplays"] as? String == "$null")
        precondition(equal((linked["Displays"] as! [String: Any])["other"], foreign))
        precondition(state.link(current) == 0, "already linked")
        precondition(state.hasLink(current), "an unchanged link is already complete")
        precondition(state.restore(original, directories: [directory]) == 4)
        precondition(equal(state.propertyList, original), "restore only changes our links")

        // A new desktop image must replace the retired idle image, not retain it.
        var changed = node
        changed["Idle"] = old
        var update = LockScreenState(["SystemDefault": changed])
        precondition(update.link(current) == 1)
        precondition(equal((update.propertyList["SystemDefault"] as! [String: Any])["Linked"], desktop))

        // Restore the original linked mode while retaining the restored desktop.
        let linkedOriginal: [String: Any] = ["SystemDefault": ["Type": "linked", "Linked": old]]
        precondition(update.restore(linkedOriginal, directories: [directory]) == 1)
        precondition((update.propertyList["SystemDefault"] as! [String: Any])["Type"] as? String == "linked")
        print("PASS: idle follows new stills, original modes restore, foreign entries survive")
    }

    private static func image(_ url: URL) throws -> [String: Any] {
        let config = try PropertyListSerialization.data(fromPropertyList: ["type": "imageFile", "url": ["relative": url.absoluteString]],
                                                        format: .binary, options: 0)
        return ["Content": ["Choices": [["Provider": "com.apple.wallpaper.choice.image", "Configuration": config]]]]
    }

    private static func equal(_ lhs: Any?, _ rhs: Any?) -> Bool {
        guard let lhs, let rhs else { return lhs == nil && rhs == nil }
        return NSDictionary(dictionary: ["v": lhs]).isEqual(to: ["v": rhs])
    }
}
