// onp_texture.cpp
#include "onp_texture.h"

#include <algorithm>
#include <utility>

#define STB_IMAGE_IMPLEMENTATION
#define STBI_ONLY_PNG
#define STBI_ONLY_JPEG
#include "../third_party/stb_image.h"

namespace onp {

bool decodePremultiplied(const uint8_t* bytes, int byteCount,
                         std::vector<uint8_t>& outRgba, int& outW, int& outH) {
    int w = 0, h = 0, comp = 0;
    unsigned char* pixels = stbi_load_from_memory(bytes, byteCount, &w, &h, &comp, 4);
    if (!pixels) return false;
    outW = w;
    outH = h;
    outRgba.resize((size_t)w * h * 4);
    // Straight alpha -> premultiplied (CoreGraphics premultipliedLast).
    for (size_t i = 0; i < (size_t)w * h; ++i) {
        uint32_t a = pixels[i * 4 + 3];
        outRgba[i * 4 + 0] = (uint8_t)((pixels[i * 4 + 0] * a + 127) / 255);
        outRgba[i * 4 + 1] = (uint8_t)((pixels[i * 4 + 1] * a + 127) / 255);
        outRgba[i * 4 + 2] = (uint8_t)((pixels[i * 4 + 2] * a + 127) / 255);
        outRgba[i * 4 + 3] = (uint8_t)a;
    }
    stbi_image_free(pixels);
    return true;
}

ID3D11ShaderResourceView* createSRV(ID3D11Device* device, ID3D11DeviceContext* /*ctx*/,
                                    const uint8_t* rgba, int w, int h, bool mipmapped) {
    // Spots load on a worker thread, so nothing here may touch the immediate
    // context (UpdateSubresource / GenerateMips would race the UI thread's
    // rendering). The mip chain is built on the CPU (2x2 box filter on the
    // premultiplied texels, like a GPU mip generator) and handed over as
    // initial data; ID3D11Device creation calls are free-threaded.
    std::vector<std::vector<uint8_t>> levels;
    std::vector<std::pair<int, int>> sizes;
    levels.emplace_back(rgba, rgba + (size_t)w * h * 4);
    sizes.emplace_back(w, h);
    while (mipmapped && (sizes.back().first > 1 || sizes.back().second > 1)) {
        const auto& src = levels.back();
        int sw = sizes.back().first, sh = sizes.back().second;
        int dw = std::max(1, sw / 2), dh = std::max(1, sh / 2);
        std::vector<uint8_t> dst((size_t)dw * dh * 4);
        for (int y = 0; y < dh; ++y) {
            for (int x = 0; x < dw; ++x) {
                int x0 = std::min(sw - 1, x * 2), x1 = std::min(sw - 1, x * 2 + 1);
                int y0 = std::min(sh - 1, y * 2), y1 = std::min(sh - 1, y * 2 + 1);
                for (int c = 0; c < 4; ++c) {
                    unsigned sum = src[((size_t)y0 * sw + x0) * 4 + c] + src[((size_t)y0 * sw + x1) * 4 + c]
                                 + src[((size_t)y1 * sw + x0) * 4 + c] + src[((size_t)y1 * sw + x1) * 4 + c];
                    dst[((size_t)y * dw + x) * 4 + c] = (uint8_t)((sum + 2) / 4);
                }
            }
        }
        levels.push_back(std::move(dst));
        sizes.emplace_back(dw, dh);
    }

    D3D11_TEXTURE2D_DESC td = {};
    td.Width = (UINT)w;
    td.Height = (UINT)h;
    td.MipLevels = (UINT)levels.size();
    td.ArraySize = 1;
    // Plain UNORM like the Metal (rgba8Unorm) and WebGL builds: blending and
    // the filter pass work on the stored (sRGB-encoded) values. An _SRGB
    // format would decode to linear and darken every texel.
    td.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    td.SampleDesc.Count = 1;
    td.Usage = D3D11_USAGE_IMMUTABLE;
    td.BindFlags = D3D11_BIND_SHADER_RESOURCE;

    std::vector<D3D11_SUBRESOURCE_DATA> data(levels.size());
    for (size_t i = 0; i < levels.size(); ++i) {
        data[i].pSysMem = levels[i].data();
        data[i].SysMemPitch = (UINT)sizes[i].first * 4;
    }
    ID3D11Texture2D* tex = nullptr;
    if (FAILED(device->CreateTexture2D(&td, data.data(), &tex))) return nullptr;

    D3D11_SHADER_RESOURCE_VIEW_DESC vd = {};
    vd.Format = td.Format;
    vd.ViewDimension = D3D11_SRV_DIMENSION_TEXTURE2D;
    vd.Texture2D.MipLevels = (UINT)-1;
    ID3D11ShaderResourceView* srv = nullptr;
    HRESULT hr = device->CreateShaderResourceView(tex, &vd, &srv);
    tex->Release();
    return SUCCEEDED(hr) ? srv : nullptr;
}

ID3D11ShaderResourceView* srvFromBytes(ID3D11Device* device, ID3D11DeviceContext* ctx,
                                       const uint8_t* bytes, int byteCount, bool mipmapped) {
    std::vector<uint8_t> rgba;
    int w = 0, h = 0;
    if (!decodePremultiplied(bytes, byteCount, rgba, w, h)) return nullptr;
    return createSRV(device, ctx, rgba.data(), w, h, mipmapped);
}

ID3D11ShaderResourceView* srvFromFile(ID3D11Device* device, ID3D11DeviceContext* ctx,
                                      const char* path, bool mipmapped, int* outW, int* outH) {
    int w = 0, h = 0, comp = 0;
    unsigned char* pixels = stbi_load(path, &w, &h, &comp, 4);
    if (!pixels) return nullptr;
    std::vector<uint8_t> rgba((size_t)w * h * 4);
    for (size_t i = 0; i < (size_t)w * h; ++i) {
        uint32_t a = pixels[i * 4 + 3];
        rgba[i * 4 + 0] = (uint8_t)((pixels[i * 4 + 0] * a + 127) / 255);
        rgba[i * 4 + 1] = (uint8_t)((pixels[i * 4 + 1] * a + 127) / 255);
        rgba[i * 4 + 2] = (uint8_t)((pixels[i * 4 + 2] * a + 127) / 255);
        rgba[i * 4 + 3] = (uint8_t)a;
    }
    stbi_image_free(pixels);
    if (outW) *outW = w;
    if (outH) *outH = h;
    return createSRV(device, ctx, rgba.data(), w, h, mipmapped);
}

} // namespace onp
