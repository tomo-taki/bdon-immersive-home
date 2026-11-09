import AppKit
import Sparkle

/// Installs one signed release after the app's Install action.
@MainActor
final class SparkleDriver: NSObject, SPUUpdaterDelegate {
    enum Event {
        case downloading(Double), installing, failed(Error)
    }

    private static let retryLimit = 3
    private static let retryDelay: TimeInterval = 1
    private let feed: URL
    private let build: Int
    private let notify: (Event) -> Void
    private var updater: SPUUpdater?
    private var retries = 0

    init(feed: URL, build: Int, notify: @escaping (Event) -> Void) {
        self.feed = feed
        self.build = build
        self.notify = notify
        super.init()
    }

    func install() throws {
        let bundle = Bundle.main
        let userDriver = InlineDriver(notify: notify)
        let updater = SPUUpdater(hostBundle: bundle, applicationBundle: bundle, userDriver: userDriver, delegate: self)
        self.updater = updater
        try updater.start()
        updater.checkForUpdates()
    }

    func feedURLString(for updater: SPUUpdater) -> String? { feed.absoluteString }

    func updater(_ updater: SPUUpdater, shouldProceedWithUpdate item: SUAppcastItem,
                 updateCheck: SPUUpdateCheck) throws {
        guard item.versionString == String(build), !item.isInformationOnlyUpdate else {
            throw CocoaError(.validationMissingMandatoryProperty)
        }
    }

    func updater(_ updater: SPUUpdater, didFinishUpdateCycleFor updateCheck: SPUUpdateCheck, error: Error?) {
        guard let error else { return }
        let failure = error as NSError
        if failure.domain == SUSparkleErrorDomain, failure.code == SUError.resumeAppcastError.rawValue,
           retries < Self.retryLimit {
            retries += 1
            DispatchQueue.main.asyncAfter(deadline: .now() + Self.retryDelay) { updater.checkForUpdates() }
            return
        }
        notify(.failed(error))
    }
}

/// The existing About pane is the user interface; Sparkle owns verification and installation.
@MainActor
private final class InlineDriver: NSObject, SPUUserDriver {
    private let notify: (SparkleDriver.Event) -> Void
    private var expected: UInt64 = 0
    private var received: UInt64 = 0

    init(notify: @escaping (SparkleDriver.Event) -> Void) { self.notify = notify }

    func show(_ request: SPUUpdatePermissionRequest, reply: @escaping (SUUpdatePermissionResponse) -> Void) {
        reply(SUUpdatePermissionResponse(automaticUpdateChecks: false, sendSystemProfile: false))
    }

    func showUserInitiatedUpdateCheck(cancellation: @escaping () -> Void) { notify(.downloading(0)) }

    func showUpdateFound(with appcastItem: SUAppcastItem, state: SPUUserUpdateState,
                         reply: @escaping (SPUUserUpdateChoice) -> Void) { reply(.install) }

    func showUpdateReleaseNotes(with downloadData: SPUDownloadData) {}
    func showUpdateReleaseNotesFailedToDownloadWithError(_ error: Error) {}
    func showUpdateNotFoundWithError(_ error: Error, acknowledgement: @escaping () -> Void) { acknowledgement() }
    func showUpdaterError(_ error: Error, acknowledgement: @escaping () -> Void) { acknowledgement() }
    func showDownloadInitiated(cancellation: @escaping () -> Void) { notify(.downloading(0)) }

    func showDownloadDidReceiveExpectedContentLength(_ length: UInt64) { expected = length }

    func showDownloadDidReceiveData(ofLength length: UInt64) {
        received += length
        let fraction = expected == 0 ? 0 : min(Double(received) / Double(expected), 1)
        notify(.downloading(fraction))
    }

    func showDownloadDidStartExtractingUpdate() { notify(.installing) }
    func showExtractionReceivedProgress(_ progress: Double) {}
    func showReady(toInstallAndRelaunch reply: @escaping (SPUUserUpdateChoice) -> Void) { reply(.install) }
    func showInstallingUpdate(withApplicationTerminated terminated: Bool, retryTerminatingApplication: @escaping () -> Void) {
        notify(.installing)
    }
    func showUpdateInstalledAndRelaunched(_ relaunched: Bool, acknowledgement: @escaping () -> Void) { acknowledgement() }
    func dismissUpdateInstallation() {}
}
