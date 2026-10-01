// jni_bridge.cpp -- JNI entry points for BdonWallpaperService.Engine and the
// QA snapshot path. One native onp::Engine per Java engine, referenced by an
// opaque long handle. Snapshot renders one spot offscreen into a PBuffer and
// reads it back as premultiplied-straight RGBA for a PNG (QA only).

#include <jni.h>
#include <android/native_window_jni.h>
#include <android/log.h>
#include <EGL/egl.h>
#include <GLES3/gl3.h>

#include <string>
#include <vector>
#include <cstdlib>

#include "engine.h"
#include "gl_renderer.h"
#include "gl_stage.h"
#include "onp_spot.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

using onp::Engine;
using onp::EngineSettings;

static std::string jstr(JNIEnv* env, jstring s) {
    if (!s) return {};
    const char* c = env->GetStringUTFChars(s, nullptr);
    std::string out(c ? c : "");
    if (c) env->ReleaseStringUTFChars(s, c);
    return out;
}

static std::set<std::string> jstrSet(JNIEnv* env, jobjectArray arr) {
    std::set<std::string> out;
    if (!arr) return out;
    jsize n = env->GetArrayLength(arr);
    for (jsize i = 0; i < n; ++i) {
        auto s = (jstring)env->GetObjectArrayElement(arr, i);
        out.insert(jstr(env, s));
        env->DeleteLocalRef(s);
    }
    return out;
}

extern "C" {

JNIEXPORT jlong JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeCreate(JNIEnv* env, jclass, jstring spotsDir) {
    auto* e = new Engine(jstr(env, spotsDir));
    e->start();
    return reinterpret_cast<jlong>(e);
}

JNIEXPORT void JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeDestroy(JNIEnv*, jclass, jlong handle) {
    auto* e = reinterpret_cast<Engine*>(handle);
    if (e) { e->stop(); delete e; }
}

JNIEXPORT void JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeSetSurface(JNIEnv* env, jclass, jlong handle, jobject surface) {
    auto* e = reinterpret_cast<Engine*>(handle);
    if (!e) return;
    ANativeWindow* win = surface ? ANativeWindow_fromSurface(env, surface) : nullptr;
    e->setSurface(win);   // engine takes ownership of the reference
}

JNIEXPORT void JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeSetVisible(JNIEnv*, jclass, jlong handle, jboolean visible) {
    auto* e = reinterpret_cast<Engine*>(handle);
    if (e) e->setVisible(visible == JNI_TRUE);
}

JNIEXPORT void JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeSetOffset(JNIEnv*, jclass, jlong handle, jfloat xOffset) {
    auto* e = reinterpret_cast<Engine*>(handle);
    if (e) e->setOffset(xOffset);
}

JNIEXPORT void JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeSetSettings(JNIEnv* env, jclass, jlong handle,
        jstring spotDir, jboolean showCharacters, jboolean parallax, jobjectArray hiddenMembers) {
    auto* e = reinterpret_cast<Engine*>(handle);
    if (!e) return;
    EngineSettings s;
    s.spotDir = jstr(env, spotDir);
    s.showCharacters = showCharacters == JNI_TRUE;
    s.parallax = parallax == JNI_TRUE;
    s.hiddenMembers = jstrSet(env, hiddenMembers);
    e->setSettings(s);
}

// Screen-on shuffle: name the next scene so the engine pre-builds it while the
// current one is still showing (no load hitch at the swap).
JNIEXPORT void JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeSetNextSpot(JNIEnv* env, jclass, jlong handle, jstring dir) {
    auto* e = reinterpret_cast<Engine*>(handle);
    if (e) e->setNextSpot(jstr(env, dir));
}

// SCREEN_OFF: swap to the preloaded scene, reset to t=0, and draw its first frame
// into the (still-invisible) surface, so screen-on shows the new scene instantly.
JNIEXPORT void JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativePrepareForScreenOff(JNIEnv*, jclass, jlong handle) {
    auto* e = reinterpret_cast<Engine*>(handle);
    if (e) e->prepareForScreenOff();
}

// ---- QA snapshot: render one spot offscreen to a PNG on disk ----
// Returns true on success. Runs entirely on the calling thread with a private
// PBuffer EGL context, so it never touches a live engine.
JNIEXPORT jboolean JNICALL
Java_com_bdon_immersivehome_NativeWallpaper_nativeSnapshot(JNIEnv* env, jclass,
        jstring spotsDir, jstring spotDir, jint w, jint h, jboolean showCharacters, jstring outPath) {
    std::string spots = jstr(env, spotsDir), dir = jstr(env, spotDir), out = jstr(env, outPath);

    EGLDisplay dpy = eglGetDisplay(EGL_DEFAULT_DISPLAY);
    eglInitialize(dpy, nullptr, nullptr);
    const EGLint cfgAttribs[] = {
        EGL_RENDERABLE_TYPE, EGL_OPENGL_ES3_BIT, EGL_SURFACE_TYPE, EGL_PBUFFER_BIT,
        EGL_RED_SIZE, 8, EGL_GREEN_SIZE, 8, EGL_BLUE_SIZE, 8, EGL_ALPHA_SIZE, 8, EGL_NONE };
    EGLConfig cfg; EGLint num = 0;
    if (!eglChooseConfig(dpy, cfgAttribs, &cfg, 1, &num) || num < 1) return JNI_FALSE;
    const EGLint pbAttribs[] = { EGL_WIDTH, w, EGL_HEIGHT, h, EGL_NONE };
    EGLSurface surf = eglCreatePbufferSurface(dpy, cfg, pbAttribs);
    const EGLint ctxAttribs[] = { EGL_CONTEXT_CLIENT_VERSION, 3, EGL_NONE };
    EGLContext gl = eglCreateContext(dpy, cfg, EGL_NO_CONTEXT, ctxAttribs);
    if (surf == EGL_NO_SURFACE || gl == EGL_NO_CONTEXT) return JNI_FALSE;
    eglMakeCurrent(dpy, surf, surf, gl);

    jboolean okResult = JNI_FALSE;
    {
        onp::GLContext ctx; std::string err;
        if (ctx.init(err)) {
            onp::installSpineTextureBridge();
            try {
                onp::Stage stage(spots, dir);
                stage.setCharactersVisible(showCharacters == JNI_TRUE);
                // Match Mac Snapshot.render: advance BDON_WARMUP seconds (default
                // 4.5) at 30 fps with cameraMoving=true, so entrances finish and the
                // captured pose matches the Mac reference frame exactly (QA parity).
                double warmup = 4.5;
                if (const char* w = getenv("BDON_WARMUP")) { double v = atof(w); if (v > 0) warmup = v; }
                stage.advance(0.0, true);
                for (double t = 0.0; t < warmup; t += 1.0 / 30.0) {
                    stage.advance(1.0 / 30.0, true);
                }
                onp::GLTarget target; target.make(ctx, w, h);

                // Render into the resolve target, then read the default FBO (pbuffer).
                auto cam = onp::spotCamera(stage.data, (float)w, (float)h, 0, 0);
                onp::drawStage(ctx, target, stage, cam.view, cam.projection, cam.sortViewProjection,
                               showCharacters == JNI_TRUE, 0);
                glFinish();

                std::vector<unsigned char> pixels((size_t)w * h * 4);
                glReadPixels(0, 0, w, h, GL_RGBA, GL_UNSIGNED_BYTE, pixels.data());
                // Flip vertically (glReadPixels origin is bottom-left) for a PNG.
                std::vector<unsigned char> flipped((size_t)w * h * 4);
                for (int y = 0; y < h; ++y)
                    memcpy(&flipped[(size_t)(h - 1 - y) * w * 4], &pixels[(size_t)y * w * 4], (size_t)w * 4);
                if (stbi_write_png(out.c_str(), w, h, 4, flipped.data(), w * 4)) okResult = JNI_TRUE;

                target.release();
            } catch (const std::exception& e) {
                __android_log_print(ANDROID_LOG_ERROR, "BDONWallpaper", "snapshot: %s", e.what());
            }
            ctx.shutdown();
        }
    }
    eglMakeCurrent(dpy, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);
    eglDestroySurface(dpy, surf);
    eglDestroyContext(dpy, gl);
    eglTerminate(dpy);
    return okResult;
}

} // extern "C"
