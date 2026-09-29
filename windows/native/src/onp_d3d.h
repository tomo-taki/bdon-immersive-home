// onp_d3d.h -- Direct3D 11 port of Sources/BDONImmersiveHome/Render/Renderer.swift.
// Same passes and state: sky gradient; opaque room (cutout 0.5, depth write);
// transparent list sorted (order asc, NDC z far->near, id); residents depth-test
// no write; 4 spine blend modes; 4x MSAA + resolve; CSS filter pass.
//
// One D3DContext owns the device (HARDWARE, else WARP). One SwapTarget per
// window owns its swapchain + MSAA/depth/resolve textures.

#pragma once

#include <cstdint>
#include <string>
#include <vector>

#include <d3d11.h>
#include <dxgi1_2.h>

#include "onp_math.h"

namespace onp {

class Stage;   // onp_stage.h

// Which driver the device came up on (logged, per SPEC behaviour 7).
enum class DriverKind { Hardware, Warp, None };

struct D3DContext {
    ID3D11Device* device = nullptr;
    ID3D11DeviceContext* ctx = nullptr;
    DriverKind driver = DriverKind::None;

    // Pipelines / shaders (compiled once at init).
    ID3D11VertexShader* skyVS = nullptr;
    ID3D11PixelShader* skyPS = nullptr;
    ID3D11VertexShader* roomVS = nullptr;
    ID3D11PixelShader* roomCutoutPS = nullptr;
    ID3D11PixelShader* roomTransparentPS = nullptr;
    ID3D11InputLayout* roomLayout = nullptr;
    ID3D11VertexShader* spineVS = nullptr;
    ID3D11PixelShader* spinePS = nullptr;
    ID3D11InputLayout* spineLayout = nullptr;
    ID3D11VertexShader* blitVS = nullptr;
    ID3D11PixelShader* blitPS = nullptr;

    ID3D11Buffer* uniforms = nullptr;              // b0, updated per-draw
    ID3D11DepthStencilState* depthWrite = nullptr; // test lessEqual, write
    ID3D11DepthStencilState* depthTest = nullptr;  // test lessEqual, no write
    ID3D11DepthStencilState* noDepth = nullptr;    // always, no write
    ID3D11RasterizerState* rasterNoCull = nullptr;
    ID3D11BlendState* blendNone = nullptr;
    ID3D11BlendState* blendPremul = nullptr;       // ONE, 1-SRCA (normal / room transparent)
    ID3D11BlendState* blendAdd = nullptr;          // ONE, ONE
    ID3D11BlendState* blendMultiply = nullptr;     // DEST, 1-SRCA
    ID3D11BlendState* blendScreen = nullptr;       // ONE, 1-SRCCOLOR
    ID3D11SamplerState* roomSampler = nullptr;     // linear + mips + repeat
    ID3D11SamplerState* spineSampler = nullptr;    // linear, clamp
    ID3D11SamplerState* nearestSampler = nullptr;  // blit

    bool init(std::string& errorOut);
    void shutdown();
    ID3D11BlendState* spineBlend(int mode) const;
};

// Per-window (or per-offscreen) render surface: swapchain + MSAA + depth + resolve.
struct SwapTarget {
    IDXGISwapChain1* swap = nullptr;
    int width = 0, height = 0;
    static const int kSamples = 4;

    ID3D11Texture2D* colorMSAA = nullptr;
    ID3D11RenderTargetView* colorRTV = nullptr;
    ID3D11Texture2D* depthMSAA = nullptr;
    ID3D11DepthStencilView* depthDSV = nullptr;
    ID3D11Texture2D* resolved = nullptr;
    ID3D11ShaderResourceView* resolvedSRV = nullptr;
    ID3D11RenderTargetView* backbufferRTV = nullptr;

    // Create a swapchain bound to an HWND. Returns false on failure.
    bool createForWindow(D3DContext& c, void* hwnd, int w, int h);
    // Create an offscreen target (snapshot mode) with a staging readback.
    bool createOffscreen(D3DContext& c, int w, int h);
    bool resize(D3DContext& c, int w, int h);   // window resize
    void releaseSizeDependent();
    void release();

private:
    bool makeTargets(D3DContext& c, int w, int h);
    bool offscreen = false;
    ID3D11Texture2D* offscreenColor = nullptr;
    ID3D11RenderTargetView* offscreenRTV = nullptr;
public:
    ID3D11RenderTargetView* finalRTV(D3DContext& c);  // backbuffer or offscreen
    ID3D11Texture2D* offscreenTexture() const { return offscreenColor; }
};

// Draw the stage seen through view/projection into `target`. Reproduces the
// Renderer.swift pass order and the painterSortStable transparent sort.
void drawStage(D3DContext& c, SwapTarget& target, Stage& stage,
               const Mat4& view, const Mat4& projection, bool charactersVisible);

} // namespace onp
