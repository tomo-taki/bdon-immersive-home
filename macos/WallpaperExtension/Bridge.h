#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>
#import <IOSurface/IOSurface.h>

NS_ASSUME_NONNULL_BEGIN
BOOL BDONPrepare(void);
NSObject * _Nullable BDONContext(CALayer *layer, CGFloat scale, uint32_t display);
NSObject * _Nullable BDONContextReply(NSObject *context);
uint32_t BDONContextID(NSObject *context);
NSObject * _Nullable BDONSnapshotReply(IOSurfaceRef surface);

@protocol BDONWallpaperProtocol <NSObject>
- (void)acquireWithId:(id _Nullable)identifier request:(id _Nullable)request reply:(void (^)(id _Nullable, NSError * _Nullable))reply;
- (void)updateWithId:(id _Nullable)identifier request:(id _Nullable)request reply:(void (^)(NSError * _Nullable))reply;
- (void)invalidateWithId:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)snapshotWithId:(id _Nullable)identifier reply:(void (^)(id _Nullable, NSError * _Nullable))reply;
- (void)provideSettingsViewModelsWithContentTypes:(id _Nullable)types reply:(void (^)(id _Nullable, NSError * _Nullable))reply;
- (void)addChoiceRequestWithChoiceRequest:(id _Nullable)request onBehalfOfProcess:(id _Nullable)process reply:(void (^)(id _Nullable, NSError * _Nullable))reply;
- (void)removeChoiceRequestWithChoiceRequest:(id _Nullable)request reply:(void (^)(NSError * _Nullable))reply;
- (void)selectedChoicesDidChangeFor:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)invokeContextMenuActionWithMenuItemID:(id _Nullable)item groupItemID:(id _Nullable)group reply:(void (^)(NSError * _Nullable))reply;
- (void)isChoiceDownloadedWith:(id _Nullable)identifier reply:(void (^)(BOOL, NSError * _Nullable))reply;
- (id _Nullable)downloadWithChoiceID:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)pauseDownloadFor:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)cancelDownloadFor:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)resumeDownloadFor:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)removeDownloadFor:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)migrateSelectedChoiceFor:(id _Nullable)identifier reply:(void (^)(id _Nullable, NSError * _Nullable))reply;
- (void)migrateFrom:(id _Nullable)from to:(id _Nullable)to reply:(void (^)(NSError * _Nullable))reply;
- (void)skipShuffledContentWithId:(id _Nullable)identifier reply:(void (^)(NSError * _Nullable))reply;
- (void)canSkipShuffledContentWithId:(id _Nullable)identifier reply:(void (^)(BOOL, NSError * _Nullable))reply;
- (void)handleDebugRequestFor:(id _Nullable)request reply:(void (^)(id _Nullable, NSError * _Nullable))reply;
- (void)handleNotificationWithNamed:(id _Nullable)name reply:(void (^)(NSError * _Nullable))reply;
@end
NS_ASSUME_NONNULL_END
