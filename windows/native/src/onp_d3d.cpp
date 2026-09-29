// onp_d3d.cpp -- Direct3D 11 renderer implementation. See onp_d3d.h.
#include "onp_d3d.h"

#include <algorithm>
#include <cstdio>

#include <d3dcompiler.h>

#include "onp_shaders.h"
#include "onp_stage.h"

namespace onp {

// cbuffer layout (b0): two row-major float4x4, uploaded pre-transposed.
struct Uniforms {
    Mat4 viewProjection;
    Mat4 model;
};

// ---- shader compile helpers ----

static ID3DBlob* compile(const char* src, const char* prelude, const char* entry,
                         const char* target, std::string& err) {
    // Prepend the shared prelude (cbuffer + texture/sampler) when supplied.
    std::string full;
    if (prelude) full += prelude;
    full += src;
    ID3DBlob* code = nullptr;
    ID3DBlob* errors = nullptr;
    UINT flags = D3DCOMPILE_OPTIMIZATION_LEVEL3 | D3DCOMPILE_ENABLE_STRICTNESS;
    HRESULT hr = D3DCompile(full.c_str(), full.size(), nullptr, nullptr, nullptr,
                            entry, target, flags, 0, &code, &errors);
    if (FAILED(hr)) {
        if (errors) {
            err += (const char*)errors->GetBufferPointer();
            errors->Release();
        }
        return nullptr;
    }
    if (errors) errors->Release();
    return code;
}

bool D3DContext::init(std::string& errorOut) {
    UINT flags = 0;
#ifndef NDEBUG
    // Debug layer is optional; ignore failure.
#endif
    D3D_FEATURE_LEVEL levels[] = {D3D_FEATURE_LEVEL_11_1, D3D_FEATURE_LEVEL_11_0, D3D_FEATURE_LEVEL_10_1};
    D3D_FEATURE_LEVEL got;

    // Try HARDWARE, then WARP (the VM has no GPU).
    HRESULT hr = D3D11CreateDevice(nullptr, D3D_DRIVER_TYPE_HARDWARE, nullptr, flags, levels,
                                   (UINT)std::size(levels), D3D11_SDK_VERSION, &device, &got, &ctx);
    if (SUCCEEDED(hr)) {
        driver = DriverKind::Hardware;
    } else {
        hr = D3D11CreateDevice(nullptr, D3D_DRIVER_TYPE_WARP, nullptr, flags, levels,
                               (UINT)std::size(levels), D3D11_SDK_VERSION, &device, &got, &ctx);
        if (SUCCEEDED(hr)) {
            driver = DriverKind::Warp;
        } else {
            errorOut = "D3D11CreateDevice failed for HARDWARE and WARP";
            return false;
        }
    }

    // --- Compile shaders ---
    std::string err;
    ID3DBlob* skyVSb = compile(kHlslSky, nullptr, "VSMain", "vs_5_0", err);
    ID3DBlob* skyPSb = compile(kHlslSky, nullptr, "PSMain", "ps_5_0", err);
    ID3DBlob* roomVSb = compile(kHlslRoom, kHlslCommon, "VSMain", "vs_5_0", err);
    ID3DBlob* roomCutb = compile(kHlslRoom, kHlslCommon, "PSCutout", "ps_5_0", err);
    ID3DBlob* roomTrb = compile(kHlslRoom, kHlslCommon, "PSTransparent", "ps_5_0", err);
    ID3DBlob* spineVSb = compile(kHlslSpine, kHlslCommon, "VSMain", "vs_5_0", err);
    ID3DBlob* spinePSb = compile(kHlslSpine, kHlslCommon, "PSMain", "ps_5_0", err);
    ID3DBlob* blitVSb = compile(kHlslBlit, nullptr, "VSMain", "vs_5_0", err);
    ID3DBlob* blitPSb = compile(kHlslBlit, nullptr, "PSMain", "ps_5_0", err);
    if (!skyVSb || !skyPSb || !roomVSb || !roomCutb || !roomTrb || !spineVSb || !spinePSb || !blitVSb || !blitPSb) {
        errorOut = "shader compile failed: " + err;
        return false;
    }

    auto vs = [&](ID3DBlob* b, ID3D11VertexShader** out) {
        device->CreateVertexShader(b->GetBufferPointer(), b->GetBufferSize(), nullptr, out);
    };
    auto ps = [&](ID3DBlob* b, ID3D11PixelShader** out) {
        device->CreatePixelShader(b->GetBufferPointer(), b->GetBufferSize(), nullptr, out);
    };
    vs(skyVSb, &skyVS); ps(skyPSb, &skyPS);
    vs(roomVSb, &roomVS); ps(roomCutb, &roomCutoutPS); ps(roomTrb, &roomTransparentPS);
    vs(spineVSb, &spineVS); ps(spinePSb, &spinePS);
    vs(blitVSb, &blitVS); ps(blitPSb, &blitPS);

    // Input layouts.
    D3D11_INPUT_ELEMENT_DESC roomIL[] = {
        {"POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 12, D3D11_INPUT_PER_VERTEX_DATA, 0},
    };
    device->CreateInputLayout(roomIL, 2, roomVSb->GetBufferPointer(), roomVSb->GetBufferSize(), &roomLayout);

    // SBVertex: x,y (pos), u,v, r,g,b,a (light), dr,dg,db (dark) -> offsets 0,8,16,32.
    D3D11_INPUT_ELEMENT_DESC spineIL[] = {
        {"POSITION", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 0, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 8, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"COLOR", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 16, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"COLOR", 1, DXGI_FORMAT_R32G32B32_FLOAT, 0, 32, D3D11_INPUT_PER_VERTEX_DATA, 0},
    };
    device->CreateInputLayout(spineIL, 4, spineVSb->GetBufferPointer(), spineVSb->GetBufferSize(), &spineLayout);

    skyVSb->Release(); skyPSb->Release(); roomVSb->Release(); roomCutb->Release(); roomTrb->Release();
    spineVSb->Release(); spinePSb->Release(); blitVSb->Release(); blitPSb->Release();

    // Uniform cbuffer.
    D3D11_BUFFER_DESC ubd = {};
    ubd.ByteWidth = sizeof(Uniforms);
    ubd.Usage = D3D11_USAGE_DYNAMIC;
    ubd.BindFlags = D3D11_BIND_CONSTANT_BUFFER;
    ubd.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
    device->CreateBuffer(&ubd, nullptr, &uniforms);

    // Depth states.
    auto depthState = [&](bool write, bool test, ID3D11DepthStencilState** out) {
        D3D11_DEPTH_STENCIL_DESC d = {};
        d.DepthEnable = TRUE;
        d.DepthWriteMask = write ? D3D11_DEPTH_WRITE_MASK_ALL : D3D11_DEPTH_WRITE_MASK_ZERO;
        d.DepthFunc = test ? D3D11_COMPARISON_LESS_EQUAL : D3D11_COMPARISON_ALWAYS;
        device->CreateDepthStencilState(&d, out);
    };
    depthState(true, true, &depthWrite);
    depthState(false, true, &depthTest);
    depthState(false, false, &noDepth);

    D3D11_RASTERIZER_DESC rd = {};
    rd.FillMode = D3D11_FILL_SOLID;
    rd.CullMode = D3D11_CULL_NONE;         // matches setCullMode(.none)
    rd.FrontCounterClockwise = TRUE;
    device->CreateRasterizerState(&rd, &rasterNoCull);

    // Blend states. All premultiplied; alpha channel matches the Metal setup.
    auto blend = [&](D3D11_BLEND src, D3D11_BLEND dst, D3D11_BLEND srcA, D3D11_BLEND dstA,
                     bool enable, ID3D11BlendState** out) {
        D3D11_BLEND_DESC b = {};
        auto& rt = b.RenderTarget[0];
        rt.BlendEnable = enable;
        rt.SrcBlend = src; rt.DestBlend = dst; rt.BlendOp = D3D11_BLEND_OP_ADD;
        rt.SrcBlendAlpha = srcA; rt.DestBlendAlpha = dstA; rt.BlendOpAlpha = D3D11_BLEND_OP_ADD;
        rt.RenderTargetWriteMask = D3D11_COLOR_WRITE_ENABLE_ALL;
        device->CreateBlendState(&b, out);
    };
    blend(D3D11_BLEND_ONE, D3D11_BLEND_ZERO, D3D11_BLEND_ONE, D3D11_BLEND_ZERO, FALSE, &blendNone);
    blend(D3D11_BLEND_ONE, D3D11_BLEND_INV_SRC_ALPHA, D3D11_BLEND_ONE, D3D11_BLEND_INV_SRC_ALPHA, TRUE, &blendPremul);
    blend(D3D11_BLEND_ONE, D3D11_BLEND_ONE, D3D11_BLEND_ONE, D3D11_BLEND_ONE, TRUE, &blendAdd);
    blend(D3D11_BLEND_DEST_COLOR, D3D11_BLEND_INV_SRC_ALPHA, D3D11_BLEND_ONE, D3D11_BLEND_INV_SRC_ALPHA, TRUE, &blendMultiply);
    blend(D3D11_BLEND_ONE, D3D11_BLEND_INV_SRC_COLOR, D3D11_BLEND_ONE, D3D11_BLEND_INV_SRC_COLOR, TRUE, &blendScreen);

    // Samplers.
    auto sampler = [&](bool mip, bool repeat, D3D11_FILTER filter, ID3D11SamplerState** out) {
        D3D11_SAMPLER_DESC s = {};
        s.Filter = filter;
        auto mode = repeat ? D3D11_TEXTURE_ADDRESS_WRAP : D3D11_TEXTURE_ADDRESS_CLAMP;
        s.AddressU = s.AddressV = s.AddressW = mode;
        s.MaxLOD = mip ? D3D11_FLOAT32_MAX : 0;
        s.MaxAnisotropy = 1;
        device->CreateSamplerState(&s, out);
    };
    sampler(true, true, D3D11_FILTER_MIN_MAG_MIP_LINEAR, &roomSampler);
    sampler(false, false, D3D11_FILTER_MIN_MAG_MIP_LINEAR, &spineSampler);
    sampler(false, false, D3D11_FILTER_MIN_MAG_MIP_POINT, &nearestSampler);

    return true;
}

ID3D11BlendState* D3DContext::spineBlend(int mode) const {
    switch (mode) {
        case 1: return blendAdd;
        case 2: return blendMultiply;
        case 3: return blendScreen;
        default: return blendPremul;
    }
}

template <class T> static void safeRelease(T*& p) { if (p) { p->Release(); p = nullptr; } }

void D3DContext::shutdown() {
    safeRelease(skyVS); safeRelease(skyPS); safeRelease(roomVS); safeRelease(roomCutoutPS);
    safeRelease(roomTransparentPS); safeRelease(roomLayout); safeRelease(spineVS); safeRelease(spinePS);
    safeRelease(spineLayout); safeRelease(blitVS); safeRelease(blitPS); safeRelease(uniforms);
    safeRelease(depthWrite); safeRelease(depthTest); safeRelease(noDepth); safeRelease(rasterNoCull);
    safeRelease(blendNone); safeRelease(blendPremul); safeRelease(blendAdd); safeRelease(blendMultiply);
    safeRelease(blendScreen); safeRelease(roomSampler); safeRelease(spineSampler); safeRelease(nearestSampler);
    safeRelease(ctx); safeRelease(device);
}

// ---- SwapTarget ----

bool SwapTarget::makeTargets(D3DContext& c, int w, int h) {
    width = w; height = h;
    D3D11_TEXTURE2D_DESC td = {};
    td.Width = (UINT)w; td.Height = (UINT)h; td.MipLevels = 1; td.ArraySize = 1;
    td.Format = DXGI_FORMAT_B8G8R8A8_UNORM;
    td.SampleDesc.Count = kSamples;
    td.Usage = D3D11_USAGE_DEFAULT;
    td.BindFlags = D3D11_BIND_RENDER_TARGET;
    if (FAILED(c.device->CreateTexture2D(&td, nullptr, &colorMSAA))) return false;
    if (FAILED(c.device->CreateRenderTargetView(colorMSAA, nullptr, &colorRTV))) return false;

    D3D11_TEXTURE2D_DESC dd = td;
    dd.Format = DXGI_FORMAT_D32_FLOAT;
    dd.BindFlags = D3D11_BIND_DEPTH_STENCIL;
    if (FAILED(c.device->CreateTexture2D(&dd, nullptr, &depthMSAA))) return false;
    if (FAILED(c.device->CreateDepthStencilView(depthMSAA, nullptr, &depthDSV))) return false;

    D3D11_TEXTURE2D_DESC rd = td;
    rd.SampleDesc.Count = 1;
    rd.BindFlags = D3D11_BIND_RENDER_TARGET | D3D11_BIND_SHADER_RESOURCE;
    if (FAILED(c.device->CreateTexture2D(&rd, nullptr, &resolved))) return false;
    if (FAILED(c.device->CreateShaderResourceView(resolved, nullptr, &resolvedSRV))) return false;
    return true;
}

bool SwapTarget::createForWindow(D3DContext& c, void* hwnd, int w, int h) {
    IDXGIDevice* dxgiDevice = nullptr;
    if (FAILED(c.device->QueryInterface(__uuidof(IDXGIDevice), (void**)&dxgiDevice))) return false;
    IDXGIAdapter* adapter = nullptr;
    dxgiDevice->GetAdapter(&adapter);
    IDXGIFactory2* factory = nullptr;
    adapter->GetParent(__uuidof(IDXGIFactory2), (void**)&factory);

    DXGI_SWAP_CHAIN_DESC1 sd = {};
    sd.Width = (UINT)w; sd.Height = (UINT)h;
    sd.Format = DXGI_FORMAT_B8G8R8A8_UNORM;
    sd.SampleDesc.Count = 1;
    sd.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
    sd.BufferCount = 2;
    sd.SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD;
    sd.AlphaMode = DXGI_ALPHA_MODE_IGNORE;

    HRESULT hr = factory->CreateSwapChainForHwnd(c.device, (HWND)hwnd, &sd, nullptr, nullptr, &swap);
    factory->Release(); adapter->Release(); dxgiDevice->Release();
    if (FAILED(hr)) {
        // Some flip models fail on WARP; retry with a legacy swap effect.
        sd.SwapEffect = DXGI_SWAP_EFFECT_DISCARD;
        sd.BufferCount = 1;
        // Re-acquire factory.
        c.device->QueryInterface(__uuidof(IDXGIDevice), (void**)&dxgiDevice);
        dxgiDevice->GetAdapter(&adapter);
        adapter->GetParent(__uuidof(IDXGIFactory2), (void**)&factory);
        hr = factory->CreateSwapChainForHwnd(c.device, (HWND)hwnd, &sd, nullptr, nullptr, &swap);
        factory->Release(); adapter->Release(); dxgiDevice->Release();
        if (FAILED(hr)) return false;
    }

    ID3D11Texture2D* bb = nullptr;
    swap->GetBuffer(0, __uuidof(ID3D11Texture2D), (void**)&bb);
    c.device->CreateRenderTargetView(bb, nullptr, &backbufferRTV);
    bb->Release();
    return makeTargets(c, w, h);
}

bool SwapTarget::createOffscreen(D3DContext& c, int w, int h) {
    offscreen = true;
    D3D11_TEXTURE2D_DESC td = {};
    td.Width = (UINT)w; td.Height = (UINT)h; td.MipLevels = 1; td.ArraySize = 1;
    td.Format = DXGI_FORMAT_B8G8R8A8_UNORM;
    td.SampleDesc.Count = 1;
    td.Usage = D3D11_USAGE_DEFAULT;
    td.BindFlags = D3D11_BIND_RENDER_TARGET | D3D11_BIND_SHADER_RESOURCE;
    if (FAILED(c.device->CreateTexture2D(&td, nullptr, &offscreenColor))) return false;
    if (FAILED(c.device->CreateRenderTargetView(offscreenColor, nullptr, &offscreenRTV))) return false;
    return makeTargets(c, w, h);
}

bool SwapTarget::resize(D3DContext& c, int w, int h) {
    if (w == width && h == height) return true;
    releaseSizeDependent();
    if (swap) {
        swap->ResizeBuffers(0, (UINT)w, (UINT)h, DXGI_FORMAT_UNKNOWN, 0);
        ID3D11Texture2D* bb = nullptr;
        swap->GetBuffer(0, __uuidof(ID3D11Texture2D), (void**)&bb);
        c.device->CreateRenderTargetView(bb, nullptr, &backbufferRTV);
        bb->Release();
    }
    return makeTargets(c, w, h);
}

ID3D11RenderTargetView* SwapTarget::finalRTV(D3DContext&) {
    return offscreen ? offscreenRTV : backbufferRTV;
}

void SwapTarget::releaseSizeDependent() {
    safeRelease(colorRTV); safeRelease(colorMSAA); safeRelease(depthDSV); safeRelease(depthMSAA);
    safeRelease(resolvedSRV); safeRelease(resolved); safeRelease(backbufferRTV);
}

void SwapTarget::release() {
    releaseSizeDependent();
    safeRelease(offscreenRTV); safeRelease(offscreenColor);
    safeRelease(swap);
}

// ---- draw ----

static void setUniforms(D3DContext& c, const Mat4& viewProjection, const Mat4& model) {
    // HLSL row_major float4x4 wants the transpose of our column-major storage.
    Uniforms u{transpose(viewProjection), transpose(model)};
    D3D11_MAPPED_SUBRESOURCE m;
    if (SUCCEEDED(c.ctx->Map(c.uniforms, 0, D3D11_MAP_WRITE_DISCARD, 0, &m))) {
        memcpy(m.pData, &u, sizeof(u));
        c.ctx->Unmap(c.uniforms, 0);
    }
}

void drawStage(D3DContext& c, SwapTarget& t, Stage& stage,
               const Mat4& view, const Mat4& projection, bool charactersVisible) {
    ID3D11DeviceContext* dc = c.ctx;
    Mat4 viewProjection = projection * view;

    D3D11_VIEWPORT vp = {0, 0, (float)t.width, (float)t.height, 0, 1};
    dc->RSSetViewports(1, &vp);
    dc->RSSetState(c.rasterNoCull);

    dc->OMSetRenderTargets(1, &t.colorRTV, t.depthDSV);
    float clear[4] = {0, 0, 0, 1};
    dc->ClearRenderTargetView(t.colorRTV, clear);
    dc->ClearDepthStencilView(t.depthDSV, D3D11_CLEAR_DEPTH, 1.0f, 0);

    float noBlend[4] = {0, 0, 0, 0};
    dc->PSSetSamplers(0, 1, &c.roomSampler);

    // 1. Sky (no depth, no vertex buffer -- SV_VertexID triangle).
    dc->IASetInputLayout(nullptr);
    dc->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
    dc->OMSetDepthStencilState(c.noDepth, 0);
    dc->OMSetBlendState(c.blendNone, noBlend, 0xffffffff);
    dc->VSSetShader(c.skyVS, nullptr, 0);
    dc->PSSetShader(c.skyPS, nullptr, 0);
    dc->Draw(3, 0);

    // 2. Opaque room (depth write, alpha cutout).
    UINT stride = sizeof(RoomVertex), offset = 0;
    dc->IASetInputLayout(c.roomLayout);
    dc->IASetVertexBuffers(0, 1, &stage.roomVB, &stride, &offset);
    dc->IASetIndexBuffer(stage.roomIB, DXGI_FORMAT_R32_UINT, 0);
    dc->OMSetDepthStencilState(c.depthWrite, 0);
    dc->OMSetBlendState(c.blendNone, noBlend, 0xffffffff);
    dc->VSSetShader(c.roomVS, nullptr, 0);
    dc->PSSetShader(c.roomCutoutPS, nullptr, 0);
    setUniforms(c, viewProjection, Mat4::identity());
    dc->VSSetConstantBuffers(0, 1, &c.uniforms);
    for (const auto& mesh : stage.room.meshes) {
        if (mesh.transparent) continue;
        dc->PSSetShaderResources(0, 1, &stage.roomTextures[mesh.texture]);
        dc->DrawIndexed((UINT)mesh.indexCount, (UINT)mesh.firstIndex, 0);
    }

    // 3. Transparent list, painterSortStable: order asc, NDC z far->near, id asc.
    enum class Kind { Card, Resident };
    struct Item { int order; float z; int id; Kind kind; int index; };
    auto depthOf = [&](const Vec3& p) {
        Vec4 cc = mul(viewProjection, Vec4(p, 1));
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

    dc->OMSetDepthStencilState(c.depthTest, 0);
    for (const auto& it : items) {
        if (it.kind == Kind::Card) {
            const RoomMesh& mesh = stage.room.meshes[it.index];
            dc->IASetInputLayout(c.roomLayout);
            dc->IASetVertexBuffers(0, 1, &stage.roomVB, &stride, &offset);
            dc->IASetIndexBuffer(stage.roomIB, DXGI_FORMAT_R32_UINT, 0);
            dc->VSSetShader(c.roomVS, nullptr, 0);
            dc->PSSetShader(c.roomTransparentPS, nullptr, 0);
            dc->PSSetSamplers(0, 1, &c.roomSampler);
            dc->OMSetBlendState(c.blendPremul, noBlend, 0xffffffff);
            setUniforms(c, viewProjection, Mat4::identity());
            dc->VSSetConstantBuffers(0, 1, &c.uniforms);
            dc->PSSetShaderResources(0, 1, &stage.roomTextures[mesh.texture]);
            dc->DrawIndexed((UINT)mesh.indexCount, (UINT)mesh.firstIndex, 0);
        } else {
            Resident& r = stage.residents[it.index];
            const SBVertex* verts = nullptr; const uint32_t* idx = nullptr; const SBCommand* cmds = nullptr;
            int vc = 0, ic = 0, cc = 0;
            sb_render(r.drawable, &verts, &vc, &idx, &ic, &cmds, &cc);
            if (vc <= 0 || ic <= 0 || !verts || !idx || !cmds) continue;

            // Upload dynamic vertex/index for this resident.
            D3D11_BUFFER_DESC vbd = {};
            vbd.ByteWidth = vc * (UINT)sizeof(SBVertex);
            vbd.Usage = D3D11_USAGE_IMMUTABLE;
            vbd.BindFlags = D3D11_BIND_VERTEX_BUFFER;
            D3D11_SUBRESOURCE_DATA vsd = {verts, 0, 0};
            ID3D11Buffer* vb = nullptr;
            c.device->CreateBuffer(&vbd, &vsd, &vb);
            D3D11_BUFFER_DESC ibd = {};
            ibd.ByteWidth = ic * (UINT)sizeof(uint32_t);
            ibd.Usage = D3D11_USAGE_IMMUTABLE;
            ibd.BindFlags = D3D11_BIND_INDEX_BUFFER;
            D3D11_SUBRESOURCE_DATA isd = {idx, 0, 0};
            ID3D11Buffer* ib = nullptr;
            c.device->CreateBuffer(&ibd, &isd, &ib);
            if (!vb || !ib) { safeRelease(vb); safeRelease(ib); continue; }

            UINT sstride = sizeof(SBVertex), soff = 0;
            dc->IASetInputLayout(c.spineLayout);
            dc->IASetVertexBuffers(0, 1, &vb, &sstride, &soff);
            dc->IASetIndexBuffer(ib, DXGI_FORMAT_R32_UINT, 0);
            dc->VSSetShader(c.spineVS, nullptr, 0);
            dc->PSSetShader(c.spinePS, nullptr, 0);
            dc->PSSetSamplers(0, 1, &c.spineSampler);
            dc->OMSetDepthStencilState(c.depthTest, 0);
            setUniforms(c, viewProjection, r.model);
            dc->VSSetConstantBuffers(0, 1, &c.uniforms);
            for (int k = 0; k < cc; ++k) {
                const SBCommand& cmd = cmds[k];
                auto* srv = (ID3D11ShaderResourceView*)cmd.texture;
                if (!srv) continue;
                dc->OMSetBlendState(c.spineBlend(cmd.blend), noBlend, 0xffffffff);
                dc->PSSetShaderResources(0, 1, &srv);
                dc->DrawIndexed((UINT)cmd.indexCount, (UINT)cmd.indexStart, 0);
            }
            vb->Release(); ib->Release();
        }
    }

    // Resolve MSAA -> single-sample.
    dc->ResolveSubresource(t.resolved, 0, t.colorMSAA, 0, DXGI_FORMAT_B8G8R8A8_UNORM);

    // 4. Filter pass onto the final target (backbuffer or offscreen).
    ID3D11RenderTargetView* rtv = t.finalRTV(c);
    dc->OMSetRenderTargets(1, &rtv, nullptr);
    dc->IASetInputLayout(nullptr);
    dc->OMSetDepthStencilState(c.noDepth, 0);
    dc->OMSetBlendState(c.blendNone, noBlend, 0xffffffff);
    dc->VSSetShader(c.blitVS, nullptr, 0);
    dc->PSSetShader(c.blitPS, nullptr, 0);
    dc->PSSetSamplers(0, 1, &c.nearestSampler);
    dc->PSSetShaderResources(0, 1, &t.resolvedSRV);
    dc->Draw(3, 0);

    // Unbind the SRV so it can be a render target again next frame.
    ID3D11ShaderResourceView* nullSRV = nullptr;
    dc->PSSetShaderResources(0, 1, &nullSRV);
}

} // namespace onp
