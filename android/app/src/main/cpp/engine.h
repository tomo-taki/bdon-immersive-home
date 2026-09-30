// engine.h -- one live-wallpaper engine instance: an EGL context on its own
// render thread, driving GLContext/GLTarget/Stage. Reproduces the desktop
// builds' behaviour: 30 fps while the camera or an animation is moving, 5 fps
// after 30 idle frames, paused when the surface is gone or the engine is
// invisible. Parallax comes from onOffsetsChanged (home-screen swipe) instead
// of the cursor, smoothed with the same 0.06 factor.
//
// All GL/EGL work happens on the render thread. The JNI layer posts state
// changes (surface, visibility, offset, settings, spot) under a mutex; the loop
// reads them each tick.

#pragma once

#include <android/log.h>
#include <android/native_window.h>
#include <EGL/egl.h>
#include <GLES3/gl3.h>

#include <atomic>
#include <cmath>
#include <condition_variable>
#include <memory>
#include <mutex>
#include <set>
#include <string>
#include <thread>
#include <vector>

#include "gl_renderer.h"
#include "gl_stage.h"
#include "onp_spot.h"

#define LOG_TAG "BDONWallpaper"
// Logging is compiled out unless BDON_DEBUG is defined (SPEC: no logging unless debug).
#ifdef BDON_DEBUG
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)
#else
#define LOGI(...) ((void)0)
#define LOGE(...) ((void)0)
#endif

namespace onp {

// Settings snapshot shared JNI thread -> render thread (WallpaperSettings.swift).
struct EngineSettings {
    std::string spotDir = "home_003_yumemita_01_vrfloor_03/30001";  // spot 30001 default
    bool showCharacters = true;
    bool parallax = true;
    std::set<std::string> hiddenMembers;
};

class Engine {
public:
    Engine(const std::string& spotsDir) : spotsDir_(spotsDir) {}

    void start() {
        running_ = true;
        thread_ = std::thread([this] { renderLoop(); });
    }

    void stop() {
        running_ = false;
        cv_.notify_all();
        if (thread_.joinable()) thread_.join();
    }

    void setSurface(ANativeWindow* win) {
        std::lock_guard<std::mutex> lk(mtx_);
        if (pendingWindow_) ANativeWindow_release(pendingWindow_);
        pendingWindow_ = win;
        surfaceDirty_ = true;
        cv_.notify_all();
    }

    void setVisible(bool v) {
        std::lock_guard<std::mutex> lk(mtx_);
        visible_ = v;
        cv_.notify_all();
    }

    // xOffset 0..1 from onOffsetsChanged -> target parallax -1..1 on X.
    void setOffset(float xOffset) {
        std::lock_guard<std::mutex> lk(mtx_);
        targetParallaxX_ = xOffset * 2.0f - 1.0f;
        wake_ = true;
        cv_.notify_all();
    }

    void setSettings(const EngineSettings& s) {
        std::lock_guard<std::mutex> lk(mtx_);
        settings_ = s;
        settingsDirty_ = true;
        wake_ = true;
        cv_.notify_all();
    }

    // Screen-on shuffle pre-load: while the current scene is playing (screen ON),
    // the render thread builds this scene's Stage during idle ticks so the swap at
    // SCREEN_OFF has zero load hitch. Called with the SINGLE shared pick.
    void setNextSpot(const std::string& dir) {
        std::lock_guard<std::mutex> lk(mtx_);
        wantNextDir_ = dir;
        wake_ = true;
        cv_.notify_all();
    }

    // SCREEN_OFF: swap to the pre-loaded Stage now (reset to t=0) and draw its
    // first frame into the surface while still invisible, so the very first pixels
    // shown on screen-on are already the new scene. Blocks until the render thread
    // has performed the swap+draw (bounded), so Java can rely on it before the
    // screen actually turns off.
    void prepareForScreenOff() {
        std::unique_lock<std::mutex> lk(mtx_);
        screenOffSwap_ = true;
        wake_ = true;
        cv_.notify_all();
        // Wait (bounded) for the render thread to acknowledge the swap+draw.
        swapDone_.wait_for(lk, std::chrono::milliseconds(400), [this] { return !screenOffSwap_ || !running_; });
    }

private:
    void renderLoop() {
        int idleFrames = 0;
        double clockPrev = nowSeconds();

        while (running_) {
            // Snapshot shared state.
            ANativeWindow* newWindow = nullptr;
            bool surfaceDirty, visible, settingsDirty;
            EngineSettings settings;
            float targetX;
            std::string wantNext;
            bool doSwap;
            {
                std::unique_lock<std::mutex> lk(mtx_);
                // When invisible with no pending work, sleep until woken. A pending
                // preload build or a screen-off swap counts as work, so the render
                // thread stays alive to prepare/flip the next scene while hidden.
                if (!visible_ && !surfaceDirty_ && !screenOffSwap_ && wantNextDir_.empty() && running_) {
                    cv_.wait(lk, [this] {
                        return !running_ || surfaceDirty_ || visible_ || screenOffSwap_ || !wantNextDir_.empty();
                    });
                }
                if (!running_) break;
                surfaceDirty = surfaceDirty_;
                if (surfaceDirty_) { newWindow = pendingWindow_; pendingWindow_ = nullptr; surfaceDirty_ = false; }
                visible = visible_;
                settingsDirty = settingsDirty_; settingsDirty_ = false;
                settings = settings_;
                targetX = targetParallaxX_;
                wantNext = wantNextDir_;
                doSwap = screenOffSwap_;
                wake_ = false;
            }

            if (surfaceDirty) applySurface(newWindow);
            if (!egl_.ready()) { if (doSwap) finishSwap(); continue; }
            if (settingsDirty) { applySettings(settings); settingsApplied_ = true; }

            // Screen-off swap: flip to the pre-built next scene (t=0) and draw its
            // first frame into the surface NOW, while invisible, so screen-on shows
            // the new scene from its very first pixel with no load hitch.
            if (doSwap) { performScreenOffSwap(settings); finishSwap(); continue; }

            if (!visible) {
                // Invisible but asked to preload: build the next Stage off the hot
                // path (GL upload on this render thread, which is idle now).
                if (!wantNext.empty()) buildNextStage(wantNext);
                continue;
            }

            // Never present a scene until the host has pushed real settings at least
            // once. A freshly created / recreated engine (wake, fold, preview) would
            // otherwise draw the constructor-default spot (30001) or a stale scene for
            // one frame before the correct current scene applied -- that is the
            // reported "old scene flashes by" on screen-on. Waiting one tick for the
            // settings snapshot guarantees the first pixels are always the current scene.
            if (!settingsApplied_) { sleepMs(16); continue; }

            if (!stage_) { loadSpot(settings.spotDir); if (!stage_) { sleepMs(200); continue; } }

            // Smooth parallax toward target (same 0.06 factor & 1e-8 step test).
            float dx = (targetX - parallaxX_) * 0.06f;
            parallaxX_ += dx;
            bool cameraMoving = (dx * dx > 1e-8f);

            double t = nowSeconds();
            double delta = t - clockPrev;
            clockPrev = t;

            bool animated = stage_->advance(delta, cameraMoving);
            bool moved = cameraMoving || animated;
            idleFrames = moved ? 0 : (idleFrames + 1);

            renderOnce(settings);

            // Once the current scene has settled (idle), pre-build the next scene
            // during this quiet time so the SCREEN_OFF swap is instant. GL upload
            // runs here on the render thread while the current scene still shows.
            if (!wantNext.empty() && idleFrames >= 2) buildNextStage(wantNext);

            // 30 fps while moving, 5 fps after 30 idle frames (behaviour 4).
            int frameMs = (idleFrames >= 30) ? 200 : 33;
            waitForNextFrame(frameMs);
        }
        teardownEgl();
    }

    void waitForNextFrame(int ms) {
        std::unique_lock<std::mutex> lk(mtx_);
        cv_.wait_for(lk, std::chrono::milliseconds(ms),
                     [this] { return !running_ || surfaceDirty_ || wake_; });
    }

    void applySurface(ANativeWindow* win) {
        if (win == nullptr) {
            teardownEgl();
            return;
        }
        if (!egl_.create(win)) { LOGE("EGL create failed"); ANativeWindow_release(win); return; }
        if (!glReady_) {
            std::string err;
            if (!ctx_.init(err)) { LOGE("GLContext init: %s", err.c_str()); return; }
            installSpineTextureBridge();
            glReady_ = true;
        }
        width_ = ANativeWindow_getWidth(win);
        height_ = ANativeWindow_getHeight(win);
        target_.resize(ctx_, width_, height_);
        LOGI("applySurface: win=%dx%d target=%dx%d samples=%d glErr=0x%x",
             width_, height_, target_.width, target_.height, ctx_.samples, glGetError());
        ANativeWindow_release(win);   // EGL holds its own reference
    }

    void applySettings(const EngineSettings& s) {
        if (stage_ && s.spotDir != loadedDir_) {
            // If we already pre-built this exact scene, swap it in instead of a
            // fresh (hitchy) load -- covers a manual scene change that matched the
            // preload as well as the shuffle path.
            if (nextStage_ && nextDir_ == s.spotDir) {
                stage_ = std::move(nextStage_);
                nextStage_.reset();
                nextDir_.clear();
                loadedDir_ = s.spotDir;
                stage_->resetToStart();
            } else {
                loadSpot(s.spotDir);
            }
        }
        if (stage_) {
            stage_->setCharactersVisible(s.showCharacters);
            stage_->setHiddenMembers(s.hiddenMembers);
        }
        parallaxEnabled_ = s.parallax;
    }

    // Build the next scene's Stage on the render thread (GL context current) while
    // the current scene is still visible/playing. Bounded to ONE preloaded stage.
    // Wrapped in try/catch: on OOM or any failure we drop the preload and fall
    // back to the normal (load-at-switch) behaviour, never a double memory spike.
    void buildNextStage(const std::string& dir) {
        {   // clear the request under lock so we build it once
            std::lock_guard<std::mutex> lk(mtx_);
            wantNextDir_.clear();
        }
        if (dir.empty() || dir == loadedDir_) return;
        if (nextStage_ && nextDir_ == dir) return;   // already built
        nextStage_.reset();                          // keep bound: current + one only
        nextDir_.clear();
        try {
            std::unique_ptr<Stage> s(new Stage(spotsDir_, dir));
            glFinish();                              // ensure all uploads landed
            nextStage_ = std::move(s);
            nextDir_ = dir;
            LOGI("preloaded next scene %s (verts=%zu residents=%zu)", dir.c_str(),
                 nextStage_->room.vertices.size(), nextStage_->residents.size());
        } catch (const std::exception& e) {
            LOGE("preload %s failed (fallback to load-on-switch): %s", dir.c_str(), e.what());
            nextStage_.reset();
            nextDir_.clear();
        }
    }

    // SCREEN_OFF: swap to the preloaded stage, rewind to t=0, and draw its first
    // frame into the surface now (while invisible) so screen-on shows the new
    // scene from its first pixel. If no preload is ready, fall back to a plain
    // load here (still before the screen lights up).
    void performScreenOffSwap(const EngineSettings& s) {
        std::string target = nextDir_;
        if (nextStage_ && !target.empty()) {
            stage_ = std::move(nextStage_);
            nextStage_.reset();
            nextDir_.clear();
            loadedDir_ = target;
        } else if (!s.spotDir.empty() && s.spotDir != loadedDir_) {
            loadSpot(s.spotDir);   // preload missed/failed: load now (still off-screen)
        }
        if (!stage_) return;
        stage_->setCharactersVisible(s.showCharacters);
        stage_->setHiddenMembers(s.hiddenMembers);
        stage_->resetToStart();
        parallaxX_ = 0.0f;
        // Draw exactly one frame of the new scene's first frame into the surface.
        renderOnce(s);
        LOGI("screen-off swap -> %s drawn at t=0", loadedDir_.c_str());
    }

    void finishSwap() {
        std::lock_guard<std::mutex> lk(mtx_);
        screenOffSwap_ = false;
        swapDone_.notify_all();
    }

    void loadSpot(const std::string& dir) {
        try {
            stage_.reset();
            stage_.reset(new Stage(spotsDir_, dir));
            loadedDir_ = dir;
            LOGI("loadSpot(%s): verts=%zu indices=%zu meshes=%zu roomTex=%zu residents=%zu glErr=0x%x",
                 dir.c_str(), stage_->room.vertices.size(), stage_->room.indices.size(),
                 stage_->room.meshes.size(), stage_->room.images.size(),
                 stage_->residents.size(), glGetError());
        } catch (const std::exception& e) {
            LOGE("loadSpot(%s) failed: %s", dir.c_str(), e.what());
            stage_.reset();
        }
    }

    void renderOnce(const EngineSettings& s) {
        if (!stage_ || width_ <= 0 || height_ <= 0) return;
        float aspect = (float)width_ / (float)height_;
        float px = parallaxEnabled_ ? parallaxX_ * portraitParallaxScale(aspect) : 0.0f;
        auto cam = spotCamera(stage_->data, (float)width_, (float)height_, px, 0.0f);

        // Portrait crop-to-fill: cover.json only measures aspects >= 0.5625, so a
        // phone narrower than that (9:19.5 = 0.4615, 9:20 = 0.45) gets zoom 1.0 and
        // the landscape-authored scene leaves empty edges. Narrow the lens further
        // here, on Android only, so no uncovered edge shows. Mac/Windows never hit
        // this branch (their aspects are all >= 0.5625) so their look is unchanged.
        float extra = portraitZoom(aspect);
        if (extra > 1.0f) {
            cam.projection.c[0].x *= extra;   cam.projection.c[1].y *= extra;
            cam.sortViewProjection.c[0].x *= extra; cam.sortViewProjection.c[1].y *= extra;
        }

        drawStage(ctx_, target_, *stage_, cam.view, cam.projection, cam.sortViewProjection,
                  s.showCharacters, 0);
        egl_.swap();
    }

    // How much extra to zoom in (crop-to-fill) below the smallest cover aspect.
    // 1.0 at/above 0.5625 (no change -> matches the desktop cover math), rising
    // as the frame gets narrower so the scene's finite backdrop always fills it.
    static float portraitZoom(float aspect) {
        const float kMinCoverAspect = 0.5625f;      // 9:16, the narrowest authored sample
        if (aspect >= kMinCoverAspect) return 1.0f;
        // The scene is authored for landscape; a narrower frame sees more vertical
        // extent than the backdrop covers. Filling it needs the lens narrowed by
        // ~ (kMinCoverAspect / aspect), capped so the framing never crops absurdly.
        float k = kMinCoverAspect / aspect;          // 9:20 -> 1.25, 9:19.5 -> 1.22
        const float kMaxZoom = 1.35f;
        return k < kMaxZoom ? k : kMaxZoom;
    }

    // Below the smallest cover aspect, shrink the swipe parallax range so the
    // (already crop-filled) frame never slides far enough to expose an edge.
    static float portraitParallaxScale(float aspect) {
        const float kMinCoverAspect = 0.5625f;
        if (aspect >= kMinCoverAspect) return 1.0f;
        return 0.5f;   // half the turn range on tall phones
    }

    void teardownEgl() {
        stage_.reset();
        nextStage_.reset();
        nextDir_.clear();
        loadedDir_.clear();
        if (glReady_) { target_.release(); ctx_.shutdown(); glReady_ = false; }
        egl_.destroy();
    }

    static double nowSeconds() {
        return std::chrono::duration<double>(
                   std::chrono::steady_clock::now().time_since_epoch()).count();
    }
    static void sleepMs(int ms) { std::this_thread::sleep_for(std::chrono::milliseconds(ms)); }

    // ---- minimal EGL wrapper ----
    struct Egl {
        EGLDisplay display = EGL_NO_DISPLAY;
        EGLContext context = EGL_NO_CONTEXT;
        EGLSurface surface = EGL_NO_SURFACE;
        EGLConfig config = nullptr;

        bool ready() const { return surface != EGL_NO_SURFACE && context != EGL_NO_CONTEXT; }

        bool create(ANativeWindow* win) {
            if (display == EGL_NO_DISPLAY) {
                display = eglGetDisplay(EGL_DEFAULT_DISPLAY);
                eglInitialize(display, nullptr, nullptr);
            }
            if (context == EGL_NO_CONTEXT) {
                const EGLint attribs[] = {
                    EGL_RENDERABLE_TYPE, EGL_OPENGL_ES3_BIT,
                    EGL_SURFACE_TYPE, EGL_WINDOW_BIT,
                    EGL_RED_SIZE, 8, EGL_GREEN_SIZE, 8, EGL_BLUE_SIZE, 8, EGL_ALPHA_SIZE, 8,
                    EGL_DEPTH_SIZE, 0, EGL_NONE
                };
                EGLint num = 0;
                if (!eglChooseConfig(display, attribs, &config, 1, &num) || num < 1) return false;
                const EGLint ctxAttribs[] = { EGL_CONTEXT_CLIENT_VERSION, 3, EGL_NONE };
                context = eglCreateContext(display, config, EGL_NO_CONTEXT, ctxAttribs);
                if (context == EGL_NO_CONTEXT) return false;
            }
            if (surface != EGL_NO_SURFACE) {
                eglMakeCurrent(display, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);
                eglDestroySurface(display, surface);
                surface = EGL_NO_SURFACE;
            }
            surface = eglCreateWindowSurface(display, config, win, nullptr);
            if (surface == EGL_NO_SURFACE) return false;
            return eglMakeCurrent(display, surface, surface, context) == EGL_TRUE;
        }
        void swap() { if (ready()) eglSwapBuffers(display, surface); }
        void destroy() {
            if (display != EGL_NO_DISPLAY) {
                eglMakeCurrent(display, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);
                if (surface != EGL_NO_SURFACE) eglDestroySurface(display, surface);
                if (context != EGL_NO_CONTEXT) eglDestroyContext(display, context);
                eglTerminate(display);
            }
            display = EGL_NO_DISPLAY; context = EGL_NO_CONTEXT; surface = EGL_NO_SURFACE;
        }
    };

    std::string spotsDir_;
    std::thread thread_;
    std::atomic<bool> running_{false};

    std::mutex mtx_;
    std::condition_variable cv_;
    ANativeWindow* pendingWindow_ = nullptr;
    bool surfaceDirty_ = false;
    bool visible_ = false;
    bool settingsDirty_ = false;
    bool wake_ = false;
    float targetParallaxX_ = 0.0f;
    EngineSettings settings_;

    // Screen-on-shuffle preload/swap handshake (JNI thread <-> render thread).
    std::string wantNextDir_;              // scene to pre-build while ON ("" = none)
    bool screenOffSwap_ = false;           // SCREEN_OFF asked for the swap
    std::condition_variable swapDone_;     // render thread signals swap+draw complete

    // Render-thread-only state.
    Egl egl_;
    GLContext ctx_;
    GLTarget target_;
    bool glReady_ = false;
    std::unique_ptr<Stage> stage_;
    std::string loadedDir_;
    std::unique_ptr<Stage> nextStage_;     // pre-built next scene (current + one, bounded)
    std::string nextDir_;                  // dir nextStage_ was built for
    int width_ = 0, height_ = 0;
    float parallaxX_ = 0.0f;
    bool parallaxEnabled_ = true;
    bool settingsApplied_ = false;   // no scene is presented until host pushes real settings
};

} // namespace onp
