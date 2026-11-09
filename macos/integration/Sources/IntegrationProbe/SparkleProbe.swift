import AppKit
import Sparkle

struct SparkleReport: Encodable {
    enum Status: String, Encodable {
        case available, noUpdate, failed
    }

    let status: Status
    let version: String?
    let notes: String?
    let feedValidation: Int?
    let errorCode: Int?
    let errorCodes: [Int]
    let error: String?
}

/// Test bundles only: inspect a feed or replace the disposable trial app.
@MainActor
final class SparkleProbe: NSObject, SPUUpdaterDelegate {
    enum Mode {
        case information, install
    }

    private static let timeout: TimeInterval = 20
    private static let installTimeout: TimeInterval = 40
    private let feed: URL
    private let mode: Mode
    private let completion: (SparkleReport) -> Void
    private var updater: SPUUpdater?
    private var item: SUAppcastItem?
    private var validation: Int?
    private var noUpdate = false
    private var finished = false

    private enum ProbeError: Error {
        case requiresTestBundle, requiresLoopback
    }

    init(feed: String, mode: Mode, completion: @escaping (SparkleReport) -> Void) throws {
        guard TrialBundle.isTrial else { throw ProbeError.requiresTestBundle }
        guard let url = URL(string: feed), url.scheme == "http", url.host == "127.0.0.1" else {
            throw ProbeError.requiresLoopback
        }

        self.feed = url
        self.mode = mode
        self.completion = completion
        super.init()
    }

    func start() throws {
        let bundle = Bundle.main
        let driver = SPUStandardUserDriver(hostBundle: bundle, delegate: nil)
        let updater = SPUUpdater(hostBundle: bundle, applicationBundle: bundle, userDriver: driver, delegate: self)
        self.updater = updater
        try updater.start()
        switch mode {
        case .information: updater.checkForUpdateInformation()
        case .install: updater.checkForUpdatesInBackground()
        }

        let timeout = mode == .install ? Self.installTimeout : Self.timeout
        DispatchQueue.main.asyncAfter(deadline: .now() + timeout) { [weak self] in
            self?.finish(error: NSError(domain: NSURLErrorDomain, code: NSURLErrorTimedOut))
        }
    }

    func feedURLString(for updater: SPUUpdater) -> String? {
        feed.absoluteString
    }

    func updater(_ updater: SPUUpdater, didFinishLoading appcast: SUAppcast) {
        validation = appcast.signingValidationStatus.rawValue
    }

    func updater(_ updater: SPUUpdater, didFindValidUpdate item: SUAppcastItem) {
        self.item = item
    }

    func updaterDidNotFindUpdate(_ updater: SPUUpdater, error: Error) {
        noUpdate = true
    }

    func updater(_ updater: SPUUpdater, didFinishUpdateCycleFor updateCheck: SPUUpdateCheck, error: Error?) {
        if mode == .install, error == nil { return }
        finish(error: error)
    }

    func updater(_ updater: SPUUpdater, willInstallUpdateOnQuit item: SUAppcastItem,
                 immediateInstallationBlock install: @escaping () -> Void) -> Bool {
        guard mode == .install else { return false }
        DispatchQueue.main.async { install() }
        return true
    }

    private func finish(error: Error?) {
        guard !finished else { return }
        finished = true

        let failure = error as NSError?
        let status: SparkleReport.Status = noUpdate ? .noUpdate : (failure == nil && item != nil ? .available : .failed)
        let report = SparkleReport(status: status, version: item?.versionString, notes: item?.itemDescription,
                                  feedValidation: validation, errorCode: failure?.code,
                                  errorCodes: failure.map(Self.codes) ?? [], error: failure?.description)
        // Return from Sparkle's callback before terminating the trial app.
        DispatchQueue.main.async { self.completion(report) }
    }

    private static func codes(_ error: NSError) -> [Int] {
        var nested = error.userInfo[NSMultipleUnderlyingErrorsKey] as? [NSError] ?? []
        if let underlying = error.userInfo[NSUnderlyingErrorKey] as? NSError { nested.append(underlying) }
        return Set([error.code] + nested.flatMap(codes)).sorted()
    }
}
