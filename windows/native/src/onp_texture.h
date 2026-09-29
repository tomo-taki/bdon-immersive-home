// onp_texture.h -- PNG/JPEG -> premultiplied RGBA8 D3D11 shader resource view,
// matching what makeTexture() produces in Room.swift (CoreGraphics premultiplied)
// and what spine-threejs uploads for atlas pages. Room textures get mips; atlas
// pages none. Decoding uses stb_image (third_party).

#pragma once

#include <cstdint>
#include <vector>

#include <d3d11.h>

namespace onp {

// Decode raw image bytes (from a GLB bufferView or a file) into premultiplied
// RGBA8. stb gives straight alpha; we premultiply to match CoreGraphics.
bool decodePremultiplied(const uint8_t* bytes, int byteCount,
                         std::vector<uint8_t>& outRgba, int& outW, int& outH);

// Build a texture + SRV from premultiplied RGBA8. mipmapped rooms use a full
// chain generated on the GPU; atlas pages pass mipmapped=false.
ID3D11ShaderResourceView* createSRV(ID3D11Device* device, ID3D11DeviceContext* ctx,
                                    const uint8_t* rgba, int w, int h, bool mipmapped);

// Convenience: decode + upload from bytes.
ID3D11ShaderResourceView* srvFromBytes(ID3D11Device* device, ID3D11DeviceContext* ctx,
                                       const uint8_t* bytes, int byteCount, bool mipmapped);

// Convenience: decode + upload from a file path (atlas pages, sb_texture_load).
ID3D11ShaderResourceView* srvFromFile(ID3D11Device* device, ID3D11DeviceContext* ctx,
                                      const char* path, bool mipmapped, int* outW, int* outH);

} // namespace onp
