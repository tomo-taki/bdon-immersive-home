// gl_renderer.cpp -- see gl_renderer.h. Port of onp_d3d.cpp to GLES3.
#include "gl_renderer.h"

#include <algorithm>
#include <vector>

#include "gl_shaders.h"
#include "gl_stage.h"

extern "C" {
#include "spine_bridge.h"
}

namespace onp {

// ---- shader compile helpers ----

static GLuint compileShader(GLenum type, const char* src, std::string& err) {
    GLuint sh = glCreateShader(type);
    glShaderSource(sh, 1, &src, nullptr);
    glCompileShader(sh);
    GLint ok = 0;
    glGetShaderiv(sh, GL_COMPILE_STATUS, &ok);
    if (!ok) {
        char log[2048] = {0};
        glGetShaderInfoLog(sh, sizeof(log), nullptr, log);
        err += log;
        glDeleteShader(sh);
        return 0;
    }
    return sh;
}

static bool linkProgram(GLProgram& p, const char* vs, const char* fs, std::string& err) {
    GLuint v = compileShader(GL_VERTEX_SHADER, vs, err);
    GLuint f = compileShader(GL_FRAGMENT_SHADER, fs, err);
    if (!v || !f) { if (v) glDeleteShader(v); if (f) glDeleteShader(f); return false; }
    GLuint prog = glCreateProgram();
    glAttachShader(prog, v);
    glAttachShader(prog, f);
    glLinkProgram(prog);
    glDeleteShader(v);
    glDeleteShader(f);
    GLint ok = 0;
    glGetProgramiv(prog, GL_LINK_STATUS, &ok);
    if (!ok) {
        char log[2048] = {0};
        glGetProgramInfoLog(prog, sizeof(log), nullptr, log);
        err += log;
        glDeleteProgram(prog);
        return false;
    }
    p.program = prog;
    p.uViewProjection = glGetUniformLocation(prog, "uViewProjection");
    p.uModel = glGetUniformLocation(prog, "uModel");
    GLint t = glGetUniformLocation(prog, "uTex");
    p.uTex = (t >= 0) ? t : glGetUniformLocation(prog, "uSrc");
    return true;
}

bool GLContext::init(std::string& err) {
    GLint maxSamples = 0;
    glGetIntegerv(GL_MAX_SAMPLES, &maxSamples);
    samples = std::min(4, std::max(1, (int)maxSamples));

    if (!linkProgram(sky, kGlSkyVS, kGlSkyFS, err)) { err = "sky: " + err; return false; }
    if (!linkProgram(roomCutout, kGlRoomVS, kGlRoomCutoutFS, err)) { err = "roomCutout: " + err; return false; }
    if (!linkProgram(roomTransparent, kGlRoomVS, kGlRoomTransparentFS, err)) { err = "roomTr: " + err; return false; }
    if (!linkProgram(spine, kGlSpineVS, kGlSpineFS, err)) { err = "spine: " + err; return false; }
    if (!linkProgram(blit, kGlBlitVS, kGlBlitFS, err)) { err = "blit: " + err; return false; }

    glGenVertexArrays(1, &emptyVAO);
    glGenVertexArrays(1, &roomVAO);
    glGenVertexArrays(1, &spineVAO);
    return true;
}

void GLContext::shutdown() {
    for (GLProgram* p : {&sky, &roomCutout, &roomTransparent, &spine, &blit})
        if (p->program) { glDeleteProgram(p->program); p->program = 0; }
    if (emptyVAO) glDeleteVertexArrays(1, &emptyVAO);
    if (roomVAO) glDeleteVertexArrays(1, &roomVAO);
    if (spineVAO) glDeleteVertexArrays(1, &spineVAO);
    emptyVAO = roomVAO = spineVAO = 0;
}

// ---- GLTarget ----

bool GLTarget::make(GLContext& c, int w, int h) {
    width = w; height = h;

    glGenFramebuffers(1, &msaaFBO);
    glBindFramebuffer(GL_FRAMEBUFFER, msaaFBO);
    glGenRenderbuffers(1, &msaaColor);
    glBindRenderbuffer(GL_RENDERBUFFER, msaaColor);
    glRenderbufferStorageMultisample(GL_RENDERBUFFER, c.samples, GL_RGBA8, w, h);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, msaaColor);
    glGenRenderbuffers(1, &msaaDepth);
    glBindRenderbuffer(GL_RENDERBUFFER, msaaDepth);
    glRenderbufferStorageMultisample(GL_RENDERBUFFER, c.samples, GL_DEPTH_COMPONENT24, w, h);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, msaaDepth);
    if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) return false;

    glGenFramebuffers(1, &resolveFBO);
    glBindFramebuffer(GL_FRAMEBUFFER, resolveFBO);
    glGenTextures(1, &resolveTex);
    glBindTexture(GL_TEXTURE_2D, resolveTex);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, w, h, 0, GL_RGBA, GL_UNSIGNED_BYTE, nullptr);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, resolveTex, 0);
    if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) return false;

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    return true;
}

bool GLTarget::resize(GLContext& c, int w, int h) {
    if (w == width && h == height && msaaFBO) return true;
    release();
    return make(c, w, h);
}

void GLTarget::release() {
    if (msaaColor) glDeleteRenderbuffers(1, &msaaColor);
    if (msaaDepth) glDeleteRenderbuffers(1, &msaaDepth);
    if (msaaFBO) glDeleteFramebuffers(1, &msaaFBO);
    if (resolveTex) glDeleteTextures(1, &resolveTex);
    if (resolveFBO) glDeleteFramebuffers(1, &resolveFBO);
    msaaColor = msaaDepth = msaaFBO = resolveTex = resolveFBO = 0;
    width = height = 0;
}

// ---- uniform upload ----
// onp::Mat4 stores columns contiguously == GLSL column-major, so upload with
// transpose=GL_FALSE and multiply as (M * v) in the shader. No transpose.
static void setMatrices(const GLProgram& p, const Mat4& viewProjection, const Mat4& model) {
    if (p.uViewProjection >= 0)
        glUniformMatrix4fv(p.uViewProjection, 1, GL_FALSE, &viewProjection.c[0].x);
    if (p.uModel >= 0)
        glUniformMatrix4fv(p.uModel, 1, GL_FALSE, &model.c[0].x);
}

// Spine blend mode -> (srcRGB, dstRGB, srcA, dstA). Premultiplied, matching
// D3DContext::spineBlend + the Metal blend states.
static void setSpineBlend(int mode) {
    switch (mode) {
        case 1: glBlendFuncSeparate(GL_ONE, GL_ONE, GL_ONE, GL_ONE); break;                      // additive
        case 2: glBlendFuncSeparate(GL_DST_COLOR, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA); break; // multiply
        case 3: glBlendFuncSeparate(GL_ONE, GL_ONE_MINUS_SRC_COLOR, GL_ONE, GL_ONE_MINUS_SRC_COLOR); break;       // screen
        default: glBlendFuncSeparate(GL_ONE, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA); break;      // normal premul
    }
}

// ---- draw ----

void drawStage(GLContext& c, GLTarget& t, Stage& stage,
               const Mat4& view, const Mat4& projection, const Mat4& sortViewProjection,
               bool charactersVisible, GLuint defaultFBO) {
    Mat4 viewProjection = projection * view;

    glBindFramebuffer(GL_FRAMEBUFFER, t.msaaFBO);
    glViewport(0, 0, t.width, t.height);
    glDisable(GL_CULL_FACE);                 // setCullMode(.none)
    glDepthFunc(GL_LEQUAL);

    glClearColor(0, 0, 0, 1);
    glClearDepthf(1.0f);
    // glClear(GL_DEPTH_BUFFER_BIT) is gated by glDepthMask: the previous frame's
    // transparent pass leaves the depth mask GL_FALSE, and it persists into this
    // frame, so without re-enabling it here the depth buffer is NOT cleared and
    // keeps stale depths from an earlier frame's camera. With a still camera the
    // stale depths happen to match the geometry; under parallax the camera has
    // moved, so the room fails the LEQUAL test against last frame's nearer depths
    // and is discarded (pink sky shows through). Enable depth writes before the
    // clear so it always takes effect. (Metal/D3D clear via an unconditional load
    // action, so they never hit this.)
    glDepthMask(GL_TRUE);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // 1. Sky (no depth test/write, attribute-less triangle).
    glBindVertexArray(c.emptyVAO);
    glDisable(GL_DEPTH_TEST);
    glDepthMask(GL_FALSE);
    glDisable(GL_BLEND);
    c.sky.use();
    glDrawArrays(GL_TRIANGLES, 0, 3);

    // 2. Opaque room (depth test+write, alpha cutout, no blend).
    glEnable(GL_DEPTH_TEST);
    glDepthMask(GL_TRUE);
    glDisable(GL_BLEND);
    c.roomCutout.use();
    setMatrices(c.roomCutout, viewProjection, Mat4::identity());
    glUniform1i(c.roomCutout.uTex, 0);
    glActiveTexture(GL_TEXTURE0);
    glBindVertexArray(c.roomVAO);
    stage.bindRoomArrays();
    for (const auto& mesh : stage.room.meshes) {
        if (mesh.transparent) continue;
        glBindTexture(GL_TEXTURE_2D, stage.roomTexture(mesh.texture));
        glDrawElements(GL_TRIANGLES, mesh.indexCount, GL_UNSIGNED_INT,
                       (const void*)(intptr_t)(mesh.firstIndex * sizeof(uint32_t)));
    }

    // 3. Transparent list, painterSortStable: order asc, NDC z far->near, id asc.
    // Depths come from sortViewProjection (camera WITHOUT cursor parallax).
    enum class Kind { Card, Resident };
    struct Item { int order; float z; int id; Kind kind; int index; };
    auto depthOf = [&](const Vec3& p) {
        Vec4 cc = mul(sortViewProjection, Vec4(p, 1));
        return cc.z / cc.w;
    };
    std::vector<Item> items;
    for (size_t i = 0; i < stage.room.meshes.size(); ++i)
        if (stage.room.meshes[i].transparent)
            items.push_back({0, depthOf(stage.room.meshes[i].center), (int)i, Kind::Card, (int)i});
    if (charactersVisible)
        for (size_t i = 0; i < stage.residents.size(); ++i)
            if (stage.residents[i].visible)
                items.push_back({stage.residents[i].character.order,
                                 depthOf(stage.residents[i].model.translation()),
                                 100000 + (int)i, Kind::Resident, (int)i});
    std::stable_sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
        if (a.order != b.order) return a.order < b.order;
        if (a.z != b.z) return a.z > b.z;
        return a.id < b.id;
    });

    // Transparent items: depth test, NO depth write.
    glDepthMask(GL_FALSE);
    for (const auto& it : items) {
        if (it.kind == Kind::Card) {
            const RoomMesh& mesh = stage.room.meshes[it.index];
            c.roomTransparent.use();
            setMatrices(c.roomTransparent, viewProjection, Mat4::identity());
            glUniform1i(c.roomTransparent.uTex, 0);
            glEnable(GL_BLEND);
            glBlendFuncSeparate(GL_ONE, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
            glBindVertexArray(c.roomVAO);
            stage.bindRoomArrays();
            glActiveTexture(GL_TEXTURE0);
            glBindTexture(GL_TEXTURE_2D, stage.roomTexture(mesh.texture));
            glDrawElements(GL_TRIANGLES, mesh.indexCount, GL_UNSIGNED_INT,
                           (const void*)(intptr_t)(mesh.firstIndex * sizeof(uint32_t)));
        } else {
            Resident& r = stage.residents[it.index];
            const SBVertex* verts = nullptr; const uint32_t* idx = nullptr; const SBCommand* cmds = nullptr;
            int vc = 0, ic = 0, cc = 0;
            sb_render(r.drawable, &verts, &vc, &idx, &ic, &cmds, &cc);
            if (vc <= 0 || ic <= 0 || !verts || !idx || !cmds) continue;

            c.spine.use();
            setMatrices(c.spine, viewProjection, r.model);
            glUniform1i(c.spine.uTex, 0);
            glEnable(GL_BLEND);
            glActiveTexture(GL_TEXTURE0);

            // Bind the spine VAO BEFORE configuring its arrays, so the room VAO's
            // attribute/IBO state is never overwritten by the resident's layout
            // (that cross-contamination corrupted any room card drawn after a
            // resident in the painter-sorted list).
            glBindVertexArray(c.spineVAO);
            stage.bindSpineArrays(verts, vc, idx, ic);

            for (int k = 0; k < cc; ++k) {
                const SBCommand& cmd = cmds[k];
                GLuint tex = (GLuint)(uintptr_t)cmd.texture;
                if (!tex) continue;
                setSpineBlend(cmd.blend);
                glBindTexture(GL_TEXTURE_2D, tex);
                glDrawElements(GL_TRIANGLES, cmd.indexCount, GL_UNSIGNED_INT,
                               (const void*)(intptr_t)(cmd.indexStart * sizeof(uint32_t)));
            }
        }
    }

    // Resolve MSAA -> single-sample resolve texture.
    glBindFramebuffer(GL_READ_FRAMEBUFFER, t.msaaFBO);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, t.resolveFBO);
    glBlitFramebuffer(0, 0, t.width, t.height, 0, 0, t.width, t.height,
                      GL_COLOR_BUFFER_BIT, GL_NEAREST);

    // 4. Filter pass onto the default framebuffer (the EGL window surface).
    glBindFramebuffer(GL_FRAMEBUFFER, defaultFBO);
    glViewport(0, 0, t.width, t.height);
    glDisable(GL_DEPTH_TEST);
    glDepthMask(GL_FALSE);
    glDisable(GL_BLEND);
    c.blit.use();
    glUniform1i(c.blit.uTex, 0);
    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, t.resolveTex);
    glBindVertexArray(c.emptyVAO);
    glDrawArrays(GL_TRIANGLES, 0, 3);

    glBindTexture(GL_TEXTURE_2D, 0);
    glBindVertexArray(0);
}

} // namespace onp
