// gl_shaders.h -- OpenGL ES 3.0 (GLSL ES 300) ports of onp_shaders.h (HLSL).
//
// The colour math is copied verbatim from the D3D/Metal/three.js builds:
//   room:  premultiplied texel; cutout un-premultiplies (rgb/a) at alphaTest 0.5
//   spine: premultiplied texel * premultiplied vertex colour, tint black
//   final: CSS filter saturate(1.04) brightness(1.02) contrast(1.02)
//
// Matrix convention: onp::Mat4 is column-major with column vectors (M * v),
// which is exactly what GLSL's mat4 + (M * v) expects, so uniforms upload as
// the raw column storage with NO transpose (unlike the HLSL path, which
// declared row_major and relied on the implicit transpose).

#pragma once

namespace onp {

// ---- Sky: full-screen triangle gradient (gl_VertexID) ----
inline const char* kGlSkyVS = R"(#version 300 es
out mediump float vT;
void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    gl_Position = vec4(p * 2.0 - 1.0, 1.0, 1.0);
    vT = 1.0 - p.y;                 // 0 at the top (matches skyVertex)
}
)";

inline const char* kGlSkyFS = R"(#version 300 es
precision mediump float;
in float vT;
out vec4 fragColor;
void main() {
    vec3 top    = vec3(246.0, 185.0, 221.0) / 255.0;
    vec3 mid    = vec3(243.0, 198.0, 230.0) / 255.0;
    vec3 bottom = vec3(191.0, 234.0, 244.0) / 255.0;
    vec3 c = vT < 0.45 ? mix(top, mid, vT / 0.45)
                       : mix(mid, bottom, (vT - 0.45) / 0.55);
    fragColor = vec4(c, 1.0);
}
)";

// ---- Room (world-space verts) ----
inline const char* kGlRoomVS = R"(#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUV;
uniform mat4 uViewProjection;
uniform mat4 uModel;
out vec2 vUV;
void main() {
    gl_Position = uViewProjection * (uModel * vec4(aPosition, 1.0));
    vUV = aUV;
}
)";

// "_material": Unlit/Transparent Cutout (alphaTest 0.5), premultiplied texels.
inline const char* kGlRoomCutoutFS = R"(#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uTex;
out vec4 fragColor;
void main() {
    vec4 t = texture(uTex, vUV);
    if (t.a < 0.5) discard;
    fragColor = vec4(t.rgb / t.a, 1.0);
}
)";

// "_transparent": Unlit/Transparent, premultiplied output (ONE, 1-SRC_ALPHA).
inline const char* kGlRoomTransparentFS = R"(#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uTex;
out vec4 fragColor;
void main() {
    fragColor = texture(uTex, vUV);
}
)";

// ---- Residents (skeleton-space verts through model matrix) ----
inline const char* kGlSpineVS = R"(#version 300 es
layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aUV;
layout(location = 2) in vec4 aLight;
layout(location = 3) in vec3 aDark;
uniform mat4 uViewProjection;
uniform mat4 uModel;
out vec2 vUV;
out vec4 vLight;
out vec3 vDark;
void main() {
    vec4 world = uModel * vec4(aPosition, 0.0, 1.0);
    gl_Position = uViewProjection * world;
    vUV = aUV;
    vLight = aLight;
    vDark = aDark;
}
)";

inline const char* kGlSpineFS = R"(#version 300 es
precision mediump float;
in vec2 vUV;
in vec4 vLight;
in vec3 vDark;
uniform sampler2D uTex;
out vec4 fragColor;
void main() {
    vec4 t = texture(uTex, vUV);
    float a = t.a * vLight.a;
    if (a < 0.001) discard;
    vec3 rgb = (a - t.rgb) * vDark + t.rgb * vLight.rgb;
    fragColor = vec4(rgb, a);
}
)";

// ---- Final blit: resolved scene -> default framebuffer with the CSS filter ----
inline const char* kGlBlitVS = R"(#version 300 es
out mediump vec2 vUV;
void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    // GL texture origin is bottom-left; the resolved FBO was rendered with the
    // same NDC as D3D, so sample p.y directly (no 1-y flip) to keep it upright.
    vUV = vec2(p.x, p.y);
}
)";

inline const char* kGlBlitFS = R"(#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uSrc;
out vec4 fragColor;
void main() {
    vec3 c = texture(uSrc, vUV).rgb;
    float k = 1.04;                              // saturate(1.04)
    // Row-major CSS/SVG saturate matrix. GLSL mat3 is column-major, so build it
    // transposed and multiply as (m * c) to match the HLSL mul(m, c).
    mat3 m = mat3(
        0.213 + 0.787 * k, 0.213 - 0.213 * k, 0.213 - 0.213 * k,   // column 0
        0.715 - 0.715 * k, 0.715 + 0.285 * k, 0.715 - 0.715 * k,   // column 1
        0.072 - 0.072 * k, 0.072 - 0.072 * k, 0.072 + 0.928 * k);  // column 2
    c = clamp(m * c, 0.0, 1.0);
    c = clamp(c * 1.02, 0.0, 1.0);               // brightness(1.02)
    c = clamp((c - 0.5) * 1.02 + 0.5, 0.0, 1.0); // contrast(1.02)
    fragColor = vec4(c, 1.0);
}
)";

} // namespace onp
