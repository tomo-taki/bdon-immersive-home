// gl_texture.h -- PNG/JPEG -> premultiplied RGBA8 GL texture, matching
// onp_texture.cpp exactly (CoreGraphics-style premultiply; room textures get a
// CPU-built 2x2-box mip chain, atlas pages none). Decoding uses stb_image.
//
// The D3D build returned an ID3D11ShaderResourceView*; here the "texture
// handle" is a GLuint texture id packed into a void* so the spine bridge's
// void* texture contract is unchanged. GL calls must run on the GL thread.

#pragma once

#include <cstdint>
#include <vector>

#include <GLES3/gl3.h>

namespace onp {

// stb straight alpha -> premultiplied RGBA8 (matches decodePremultiplied).
bool decodePremultiplied(const uint8_t* bytes, int byteCount,
                         std::vector<uint8_t>& outRgba, int& outW, int& outH);

// Build a GL_RGBA8 texture from premultiplied RGBA8. Rooms pass mipmapped=true
// (full CPU-generated chain, GL_LINEAR_MIPMAP_LINEAR + GL_REPEAT); atlas pages
// pass mipmapped=false (GL_LINEAR + GL_CLAMP_TO_EDGE). Returns 0 on failure.
GLuint createTexture(const uint8_t* rgba, int w, int h, bool mipmapped);

// Convenience: decode + upload from bytes (room GLB image blobs).
GLuint texFromBytes(const uint8_t* bytes, int byteCount, bool mipmapped);

// Convenience: decode + upload from a file path (atlas pages, sb_texture_load).
GLuint texFromFile(const char* path, bool mipmapped, int* outW, int* outH);

} // namespace onp
