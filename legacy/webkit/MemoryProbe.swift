import Darwin
import WebKit

/// Periodic memory reading into EventLog: this process and each page's
/// WebKit content process (phys_footprint, what Activity Monitor calls Memory).
/// Lets a long run show a leak without ps/top.
enum MemoryProbe {
    private static let interval: TimeInterval = 300
    private static var timer: Timer?

    static func start(views: @escaping () -> [WKWebView]) {
        timer?.invalidate()
        let timer = Timer(timeInterval: interval, repeats: true) { _ in
            log(views())
        }
        RunLoop.main.add(timer, forMode: .common)
        self.timer = timer
    }

    static func log(_ views: [WKWebView]) {
        var parts = ["app=\(footprintMB(getpid()))MB"]
        for view in views {
            // SPI, read defensively: 0 when WebKit does not expose it.
            let pid = (view.value(forKey: "_webProcessIdentifier") as? NSNumber)?.int32Value ?? 0
            if pid > 0 {
                parts.append("web[\(pid)]=\(footprintMB(pid))MB")
            }
        }
        EventLog.write("mem " + parts.joined(separator: " "))
    }

    private static func footprintMB(_ pid: pid_t) -> Int {
        var info = rusage_info_v4()
        let result = withUnsafeMutablePointer(to: &info) { pointer in
            pointer.withMemoryRebound(to: rusage_info_t?.self, capacity: 1) {
                proc_pid_rusage(pid, RUSAGE_INFO_V4, $0)
            }
        }
        return result == 0 ? Int(info.ri_phys_footprint / 1_048_576) : -1
    }
}
