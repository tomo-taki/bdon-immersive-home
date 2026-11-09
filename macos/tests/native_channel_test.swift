import Foundation

@main
private enum ChannelTest {
    private static let timeout: TimeInterval = 2

    static func main() throws {
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: directory) }
        let provider = "test.bdon." + UUID().uuidString
        let sender = NativeSceneChannel(provider: provider, directory: directory)
        let receiver = NativeSceneChannel(provider: provider, directory: directory)
        let wanted = NativeScene(spot: "20010", characters: false, hidden: ["anon"], parallax: false)
        var received: NativeScene?
        let observer = receiver.observe { received = $0 }
        defer { DistributedNotificationCenter.default().removeObserver(observer) }
        try sender.send(wanted)
        let deadline = Date().addingTimeInterval(timeout)
        while received == nil, Date() < deadline {
            RunLoop.main.run(until: Date().addingTimeInterval(0.01))
        }
        precondition(received == wanted, "scene notification was not delivered")
        precondition(receiver.latest() == wanted, "scene does not survive a new receiver")
        try sender.clear()
        precondition(receiver.latest() == nil)
        print("PASS: scene channel delivers and persists complete settings without an agent restart")
    }
}
