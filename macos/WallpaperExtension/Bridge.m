#import "Bridge.h"
#import <dlfcn.h>
#import <objc/message.h>
#import <objc/runtime.h>

static IMP originalEncode;

// Isolate the undocumented ABI and reject layouts that no longer match.
static void *payload(id object, const char *name, size_t size) {
    Class cls = object_getClass(object);
    Ivar ivar = class_getInstanceVariable(cls, name);
    if (!ivar) { return NULL; }
    ptrdiff_t offset = ivar_getOffset(ivar);
    if (offset < 0 || offset + size > class_getInstanceSize(cls)) { return NULL; }
    return (__bridge void *)object + offset;
}

static void encodeSnapshot(id object, SEL selector, NSCoder *coder) {
    void **slot = payload(object, "rawValue", sizeof(void *));
    SEL encode = NSSelectorFromString(@"encodeXPCObject:forKey:");
    if (!slot || !*slot || ![coder respondsToSelector:encode]) {
        ((void (*)(id, SEL, id))originalEncode)(object, selector, coder);
        return;
    }
    xpc_object_t surface = IOSurfaceCreateXPCObject((IOSurfaceRef)*slot);
    ((void (*)(id, SEL, xpc_object_t, id))objc_msgSend)(coder, encode, surface, @"surface");
}

BOOL BDONPrepare(void) {
    static void *framework;
    framework = dlopen("/System/Library/PrivateFrameworks/WallpaperExtensionKit.framework/WallpaperExtensionKit", RTLD_NOW);
    if (!framework) { return NO; }
    Class cls = NSClassFromString(@"WallpaperSnapshotXPC");
    Method method = class_getInstanceMethod(cls, @selector(encodeWithCoder:));
    if (!method) { return NO; }
    originalEncode = method_setImplementation(method, (IMP)encodeSnapshot);
    return YES;
}

NSObject *BDONContext(CALayer *layer, CGFloat scale, uint32_t display) {
    @try {
        Class cls = NSClassFromString(@"CAContext");
        SEL create = NSSelectorFromString(@"remoteContextWithOptions:");
        if (![cls respondsToSelector:create]) { return nil; }
        NSDictionary *options = @{@"contentsScale": @(scale), @"displayId": @(display)};
        NSObject *context = ((id (*)(id, SEL, id))objc_msgSend)(cls, create, options);
        [context setValue:layer forKey:@"layer"];
        return context;
    } @catch (NSException *exception) {
        NSLog(@"BDON wallpaper context: %@", exception.reason);
        return nil;
    }
}

uint32_t BDONContextID(NSObject *context) {
    @try {
        return [[context valueForKey:@"contextId"] unsignedIntValue];
    } @catch (NSException *exception) {
        return 0;
    }
}

NSObject *BDONContextReply(NSObject *context) {
    @try {
        uint32_t identifier = BDONContextID(context);
        if (!identifier) { return nil; }
        id reply = class_createInstance(NSClassFromString(@"WallpaperRemoteContextXPC"), 0);
        uint32_t *slot = payload(reply, "box", sizeof(uint32_t));
        if (!slot) { return nil; }
        *slot = identifier;
        return reply;
    } @catch (NSException *exception) {
        return nil;
    }
}

NSObject *BDONSnapshotReply(IOSurfaceRef surface) {
    id reply = class_createInstance(NSClassFromString(@"WallpaperSnapshotXPC"), 0);
    void **slot = payload(reply, "rawValue", sizeof(void *));
    if (!slot) { return nil; }
    *slot = (void *)CFRetain(surface);
    return reply;
}
