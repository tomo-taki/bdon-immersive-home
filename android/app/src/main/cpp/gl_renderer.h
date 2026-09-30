// gl_renderer.h -- OpenGL ES 3.0 port of onp_d3d.{h,cpp} (Renderer.swift).
// Same passes and state as the D3D/Metal builds: sky gradient; opaque room
// (cutout 0.5, depth write); transparent list sorted (order asc, NDC z
// far->near, id) with residents depth-test/no-write and the 4 spine blend
// modes; 4x MSAA into an offscreen FBO, resolved with glBlitFramebuffer; then
// the CSS-filter blit onto the default framebuffer.
//
// One GLContext owns the programs + GL state objects (created once on the GL
// thread). One GLTarget owns the size-dependent MSAA/resolve framebuffers.

#pragma once

#include <cstdint>
#include <string>

#include <GLES3/gl3.h>

#include "onp_math.h"

namespace onp {

class Stage;

// One compiled program plus its two matrix uniform locations and the sampler.
struct GLProgram {
    GLuint program = 0;
    GLint uViewProjection = -1;
    GLint uModel = -1;
    GLint uTex = -1;       // or uSrc for the blit
    void use() const { glUseProgram(program); }
};

struct GLContext {
    GLProgram sky;            // no matrices
    GLProgram roomCutout;     // uViewProjection, uModel, uTex
    GLProgram roomTransparent;
    GLProgram spine;
    GLProgram blit;           // uSrc

    // Empty VAO for attribute-less draws (sky, blit) -- required by GLES3 core.
    GLuint emptyVAO = 0;
    // Dynamic VAOs for room and spine vertex formats.
    GLuint roomVAO = 0;
    GLuint spineVAO = 0;

    int samples = 4;          // MSAA sample count (clamped to GL_MAX_SAMPLES)

    bool init(std::string& errorOut);
    void shutdown();
};

// Per-surface render target: MSAA color+depth renderbuffers in one FBO, a
// single-sample resolve FBO with a sampleable color texture.
struct GLTarget {
    int width = 0, height = 0;

    GLuint msaaFBO = 0;
    GLuint msaaColor = 0;     // renderbuffer
    GLuint msaaDepth = 0;     // renderbuffer
    GLuint resolveFBO = 0;
    GLuint resolveTex = 0;    // GL_RGBA8 texture, sampled by the blit

    bool make(GLContext& c, int w, int h);
    bool resize(GLContext& c, int w, int h);
    void release();
};

// Draw the stage seen through view/projection into `target`, then blit the
// filtered result onto the currently-bound default framebuffer (fbo 0 with the
// given viewport). Reproduces drawStage()'s pass order and painterSortStable
// transparent sort, whose depths come from sortViewProjection.
void drawStage(GLContext& c, GLTarget& target, Stage& stage,
               const Mat4& view, const Mat4& projection, const Mat4& sortViewProjection,
               bool charactersVisible, GLuint defaultFBO);

} // namespace onp
