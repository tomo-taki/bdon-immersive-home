import Foundation

@main
private enum ModeTest {
    static func main() {
        guard NativeMode(rawValue: "default") == .desktop else {
            FileHandle.standardError.write(Data("FAIL: the system desktop mode must enable cursor parallax\n".utf8))
            exit(EXIT_FAILURE)
        }
        precondition(NativeMode(rawValue: "idle") == .idle)
        precondition(NativeMode(rawValue: "locked") == .locked)
        precondition(NativeMode(rawValue: "future-mode") == nil)
        print("PASS: system desktop, idle and locked modes map to distinct rendering policies")
    }
}
