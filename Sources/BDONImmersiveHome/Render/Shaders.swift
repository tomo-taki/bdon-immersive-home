// Metal shaders, compiled at run time (Command Line Tools ship no offline
// Metal compiler). Colour math mirrors what three.js does in the WebKit build:
//  - room: sRGB texture decoded then re-encoded -> raw texel values
//  - spine: premultiplied texel * premultiplied vertex colour, tint black,
//    no colour-space conversion (spine-threejs strips it)
//  - final pass: the page's CSS filter saturate(1.04) brightness(1.02) contrast(1.02)
let shaderSource = """
#include <metal_stdlib>
using namespace metal;

struct Uniforms { float4x4 viewProjection; float4x4 model; };

// Sky: full-screen gradient (the Spot's pink sky behind the dome).
struct SkyOut { float4 position [[position]]; float t; };

vertex SkyOut skyVertex(uint id [[vertex_id]]) {
    float2 p = float2((id << 1) & 2, id & 2);
    SkyOut out;
    out.position = float4(p * 2 - 1, 1, 1);
    out.t = 1 - p.y;           // 0 at the top
    return out;
}

fragment float4 skyFragment(SkyOut in [[stage_in]]) {
    float3 top = float3(0xf6, 0xb9, 0xdd) / 255, mid = float3(0xf3, 0xc6, 0xe6) / 255, bottom = float3(0xbf, 0xea, 0xf4) / 255;
    float3 c = in.t < 0.45 ? mix(top, mid, in.t / 0.45) : mix(mid, bottom, (in.t - 0.45) / 0.55);
    return float4(c, 1);
}

// Room cards (world-space vertices).
struct RoomIn { float3 position [[attribute(0)]]; float2 uv [[attribute(1)]]; };
struct RoomOut { float4 position [[position]]; float2 uv; };

vertex RoomOut roomVertex(RoomIn in [[stage_in]], constant Uniforms &u [[buffer(1)]]) {
    RoomOut out;
    out.position = u.viewProjection * float4(in.position, 1);
    out.uv = in.uv;
    return out;
}

// "_material": Unlit/Transparent Cutout (alphaTest 0.5). Texels are premultiplied.
fragment float4 roomCutout(RoomOut in [[stage_in]], texture2d<float> tex [[texture(0)]], sampler s [[sampler(0)]]) {
    float4 t = tex.sample(s, in.uv);
    if (t.a < 0.5) discard_fragment();
    return float4(t.rgb / t.a, 1);
}

// "_transparent": Unlit/Transparent, premultiplied output (ONE, 1 - SRC_ALPHA).
fragment float4 roomTransparent(RoomOut in [[stage_in]], texture2d<float> tex [[texture(0)]], sampler s [[sampler(0)]]) {
    return tex.sample(s, in.uv);
}

// Residents: skeleton-space vertices through the holder (Unity) matrix.
struct SpineIn {
    float2 position [[attribute(0)]];
    float2 uv [[attribute(1)]];
    float4 light [[attribute(2)]];
    float3 dark [[attribute(3)]];
};
struct SpineOut { float4 position [[position]]; float2 uv; float4 light; float3 dark; };

vertex SpineOut spineVertex(SpineIn in [[stage_in]], constant Uniforms &u [[buffer(1)]]) {
    SpineOut out;
    out.position = u.viewProjection * u.model * float4(in.position, 0, 1);
    out.uv = in.uv;
    out.light = in.light;
    out.dark = in.dark;
    return out;
}

fragment float4 spineFragment(SpineOut in [[stage_in]], texture2d<float> tex [[texture(0)]], sampler s [[sampler(0)]]) {
    float4 t = tex.sample(s, in.uv);
    float a = t.a * in.light.a;
    if (a < 0.001) discard_fragment();
    float3 rgb = (a - t.rgb) * in.dark + t.rgb * in.light.rgb;
    return float4(rgb, a);
}

// Final: resolve texture -> drawable with the page's CSS filter.
struct BlitOut { float4 position [[position]]; float2 uv; };

vertex BlitOut blitVertex(uint id [[vertex_id]]) {
    float2 p = float2((id << 1) & 2, id & 2);
    BlitOut out;
    out.position = float4(p * 2 - 1, 0, 1);
    out.uv = float2(p.x, 1 - p.y);
    return out;
}

fragment float4 blitFragment(BlitOut in [[stage_in]], texture2d<float> tex [[texture(0)]]) {
    constexpr sampler s(filter::nearest);
    float3 c = tex.sample(s, in.uv).rgb;
    // saturate(1.04): CSS / SVG feColorMatrix saturate.
    float k = 1.04;
    float3x3 m = float3x3(
        float3(0.213 + 0.787 * k, 0.213 - 0.213 * k, 0.213 - 0.213 * k),
        float3(0.715 - 0.715 * k, 0.715 + 0.285 * k, 0.715 - 0.715 * k),
        float3(0.072 - 0.072 * k, 0.072 - 0.072 * k, 0.072 + 0.928 * k));
    c = saturate(m * c);
    c = saturate(c * 1.02);                    // brightness(1.02)
    c = saturate((c - 0.5) * 1.02 + 0.5);      // contrast(1.02)
    return float4(c, 1);
}
"""
