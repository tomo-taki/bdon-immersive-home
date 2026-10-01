// onp_shaders.h -- HLSL ports of macos/Sources/Render/Shaders.swift,
// compiled at runtime with D3DCompile. The colour math matches three.js/the
// Metal build exactly:
//   room:  sRGB texel -> raw texel (un-premultiply for cutout)
//   spine: premultiplied texel * premultiplied vertex colour, tint black
//   final: CSS filter saturate(1.04) brightness(1.02) contrast(1.02)
//
// Matrices: our Mat4 stores columns contiguously and the cbuffer declares
// them `row_major`, so HLSL sees the transpose and mul(float4, matrix)
// equals the Swift column-vector (matrix * vector) form. Upload as is.

#pragma once

namespace onp {

// One cbuffer shared by room + spine vertex shaders: viewProjection, model.
// b0. Matrices are pre-transposed on the CPU.
inline const char* kHlslCommon = R"(
cbuffer Uniforms : register(b0) {
    row_major float4x4 viewProjection;
    row_major float4x4 model;
};
Texture2D    tex : register(t0);
SamplerState samp : register(s0);
)";

// ---- Sky: full-screen triangle gradient ----
inline const char* kHlslSky = R"(
struct SkyOut { float4 pos : SV_Position; float t : TEXCOORD0; };

SkyOut VSMain(uint id : SV_VertexID) {
    float2 p = float2((id << 1) & 2, id & 2);
    SkyOut o;
    o.pos = float4(p * 2 - 1, 1, 1);
    o.t = 1 - p.y;              // 0 at the top (matches Metal skyVertex)
    return o;
}

float4 PSMain(SkyOut i) : SV_Target {
    float3 top    = float3(0xf6, 0xb9, 0xdd) / 255.0;
    float3 mid    = float3(0xf3, 0xc6, 0xe6) / 255.0;
    float3 bottom = float3(0xbf, 0xea, 0xf4) / 255.0;
    float3 c = i.t < 0.45 ? lerp(top, mid, i.t / 0.45)
                          : lerp(mid, bottom, (i.t - 0.45) / 0.55);
    return float4(c, 1);
}
)";

// ---- Room (world-space verts, cbuffer b0) ----
inline const char* kHlslRoom = R"(
struct RoomIn  { float3 position : POSITION; float2 uv : TEXCOORD0; };
struct RoomOut { float4 pos : SV_Position; float2 uv : TEXCOORD0; };

RoomOut VSMain(RoomIn i) {
    RoomOut o;
    o.pos = mul(float4(i.position, 1), viewProjection);
    o.uv = i.uv;
    return o;
}

// "_material": Unlit/Transparent Cutout (alphaTest 0.5), premultiplied texels.
float4 PSCutout(RoomOut i) : SV_Target {
    float4 t = tex.Sample(samp, i.uv);
    if (t.a < 0.5) discard;
    return float4(t.rgb / t.a, 1);
}

// "_transparent": Unlit/Transparent, premultiplied output (ONE, 1-SRC_ALPHA).
float4 PSTransparent(RoomOut i) : SV_Target {
    return tex.Sample(samp, i.uv);
}
)";

// ---- Residents (skeleton-space verts through model matrix) ----
inline const char* kHlslSpine = R"(
struct SpineIn {
    float2 position : POSITION;
    float2 uv       : TEXCOORD0;
    float4 light    : COLOR0;
    float3 dark     : COLOR1;
};
struct SpineOut {
    float4 pos   : SV_Position;
    float2 uv    : TEXCOORD0;
    float4 light : COLOR0;
    float3 dark  : COLOR1;
};

SpineOut VSMain(SpineIn i) {
    SpineOut o;
    float4 world = mul(float4(i.position, 0, 1), model);
    o.pos = mul(world, viewProjection);
    o.uv = i.uv;
    o.light = i.light;
    o.dark = i.dark;
    return o;
}

float4 PSMain(SpineOut i) : SV_Target {
    float4 t = tex.Sample(samp, i.uv);
    float a = t.a * i.light.a;
    if (a < 0.001) discard;
    float3 rgb = (a - t.rgb) * i.dark + t.rgb * i.light.rgb;
    return float4(rgb, a);
}
)";

// ---- Final blit: resolved scene -> backbuffer with the CSS filter ----
inline const char* kHlslBlit = R"(
Texture2D    src : register(t0);
SamplerState nearestSamp : register(s0);

struct BlitOut { float4 pos : SV_Position; float2 uv : TEXCOORD0; };

BlitOut VSMain(uint id : SV_VertexID) {
    float2 p = float2((id << 1) & 2, id & 2);
    BlitOut o;
    o.pos = float4(p * 2 - 1, 0, 1);
    o.uv = float2(p.x, 1 - p.y);
    return o;
}

float4 PSMain(BlitOut i) : SV_Target {
    float3 c = src.Sample(nearestSamp, i.uv).rgb;
    float k = 1.04;                            // saturate(1.04)
    float3x3 m = float3x3(
        0.213 + 0.787 * k, 0.715 - 0.715 * k, 0.072 - 0.072 * k,
        0.213 - 0.213 * k, 0.715 + 0.285 * k, 0.072 - 0.072 * k,
        0.213 - 0.213 * k, 0.715 - 0.715 * k, 0.072 + 0.928 * k);
    c = saturate(mul(m, c));
    c = saturate(c * 1.02);                    // brightness(1.02)
    c = saturate((c - 0.5) * 1.02 + 0.5);      // contrast(1.02)
    return float4(c, 1);
}
)";

} // namespace onp
