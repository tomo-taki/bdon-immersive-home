import Metal
import MetalFX
import MetalKit
import simd
import SpineBridge

// Draws a SpotStage the way three.js does in the WebKit build:
//   1. sky gradient
//   2. opaque room cards (depth write, alpha cutout 0.5)
//   3. transparent list, sorted like three's painterSortStable:
//      render order (Unity sortingOrder; room cards 0) asc, then distance
//      far -> near, then creation order. Residents test depth, never write it.
//   4. MSAA resolve, then the CSS filter pass onto the drawable.

private struct Uniforms {
    var viewProjection: Mat4
    var model: Mat4
}

/// QA switches, read once (ProcessInfo.environment builds a dictionary per call).
enum QA {
    private static let env = ProcessInfo.processInfo.environment
    static let cull = env["NP_CULL"]                  // back | front: cull room faces
    static let reverse = env["NP_REVERSE"] != nil      // opaque room back to front (z-fight probe)
    static let noDepth = Set((env["NP_NODEPTH"] ?? "").split(separator: ",").map(String.init))
    static let only = env["NP_ONLY"].map { Set($0.split(separator: ",").map(String.init)) }
    static let texture = env["NP_TEXTURE"]             // shared | private | lossy
    static let scale = env["NP_SCALE"].flatMap(Float.init)
}

final class SpotRenderer {
    static let sampleCount = 4

    let device: MTLDevice
    let queue: MTLCommandQueue
    private let sky: MTLRenderPipelineState
    private let roomCutout: MTLRenderPipelineState
    private let roomTransparent: MTLRenderPipelineState
    private let spine: [MTLRenderPipelineState]     // normal, additive, multiply, screen
    private let blit: MTLRenderPipelineState
    private let depthWrite: MTLDepthStencilState
    private let depthTest: MTLDepthStencilState
    private let noDepth: MTLDepthStencilState
    private let roomSampler: MTLSamplerState
    private let spineSampler: MTLSamplerState

    private var colorMSAA: MTLTexture?
    private var depthMSAA: MTLTexture?
    private var resolved: MTLTexture?

    /// Scene resolution relative to the output. Below 1 the scene renders
    /// smaller and MetalFX's spatial scaler brings it up to the drawable
    /// before the filter pass. NP_SCALE overrides (QA).
    var renderScale: Float = QA.scale ?? 1
    private var scaler: MTLFXSpatialScaler?
    private var upscaled: MTLTexture?
    private var outputSize = (0, 0)

    // Per-frame spine geometry, recycled.
    private var spineVertexBuffers: [MTLBuffer] = []
    private var spineIndexBuffers: [MTLBuffer] = []

    init(device: MTLDevice) throws {
        self.device = device
        queue = device.makeCommandQueue()!
        let library = try device.makeLibrary(source: shaderSource, options: nil)

        func pipeline(_ vertex: String, _ fragment: String, vertexDescriptor: MTLVertexDescriptor?,
                      blend: (MTLBlendFactor, MTLBlendFactor, MTLBlendFactor, MTLBlendFactor)?,
                      msaa: Bool = true, depth: Bool = true, alphaToCoverage: Bool = false) throws -> MTLRenderPipelineState {
            let d = MTLRenderPipelineDescriptor()
            d.vertexFunction = library.makeFunction(name: vertex)
            d.fragmentFunction = library.makeFunction(name: fragment)
            d.vertexDescriptor = vertexDescriptor
            d.rasterSampleCount = msaa ? Self.sampleCount : 1
            d.isAlphaToCoverageEnabled = alphaToCoverage
            d.colorAttachments[0].pixelFormat = .bgra8Unorm
            if depth {
                d.depthAttachmentPixelFormat = .depth32Float
            }
            if let (src, dst, srcA, dstA) = blend {
                let c = d.colorAttachments[0]!
                c.isBlendingEnabled = true
                c.sourceRGBBlendFactor = src
                c.destinationRGBBlendFactor = dst
                c.sourceAlphaBlendFactor = srcA
                c.destinationAlphaBlendFactor = dstA
            }
            return try device.makeRenderPipelineState(descriptor: d)
        }

        let roomLayout = MTLVertexDescriptor()
        roomLayout.attributes[0].format = .float3
        roomLayout.attributes[0].offset = 0
        roomLayout.attributes[1].format = .float2
        roomLayout.attributes[1].offset = MemoryLayout<SIMD3<Float>>.stride
        roomLayout.layouts[0].stride = MemoryLayout<RoomVertex>.stride

        let spineLayout = MTLVertexDescriptor()
        let formats: [(MTLVertexFormat, Int)] = [(.float2, 0), (.float2, 8), (.float4, 16), (.float3, 32)]
        for (i, (format, offset)) in formats.enumerated() {
            spineLayout.attributes[i].format = format
            spineLayout.attributes[i].offset = offset
        }
        spineLayout.layouts[0].stride = MemoryLayout<SBVertex>.stride

        sky = try pipeline("skyVertex", "skyFragment", vertexDescriptor: nil, blend: nil)
        roomCutout = try pipeline("roomVertex", "roomCutout", vertexDescriptor: roomLayout, blend: nil)
        roomTransparent = try pipeline("roomVertex", "roomTransparent", vertexDescriptor: roomLayout,
                                       blend: (.one, .oneMinusSourceAlpha, .one, .oneMinusSourceAlpha))
        // spine-threejs blend modes with premultiplied alpha.
        spine = try [
            (MTLBlendFactor.one, MTLBlendFactor.oneMinusSourceAlpha, MTLBlendFactor.one, MTLBlendFactor.oneMinusSourceAlpha),
            (.one, .one, .one, .one),
            (.destinationColor, .oneMinusSourceAlpha, .one, .oneMinusSourceAlpha),
            (.one, .oneMinusSourceColor, .one, .oneMinusSourceColor),
        ].map { try pipeline("spineVertex", "spineFragment", vertexDescriptor: spineLayout, blend: $0) }
        blit = try pipeline("blitVertex", "blitFragment", vertexDescriptor: nil, blend: nil, msaa: false, depth: false)

        func depthState(write: Bool, test: Bool) -> MTLDepthStencilState {
            let d = MTLDepthStencilDescriptor()
            d.depthCompareFunction = test ? .lessEqual : .always
            d.isDepthWriteEnabled = write
            return device.makeDepthStencilState(descriptor: d)!
        }
        depthWrite = depthState(write: true, test: true)
        depthTest = depthState(write: false, test: true)
        noDepth = depthState(write: false, test: false)

        func sampler(mip: Bool) -> MTLSamplerState {
            let d = MTLSamplerDescriptor()
            d.minFilter = .linear
            d.magFilter = .linear
            d.mipFilter = mip ? .linear : .notMipmapped
            d.sAddressMode = mip ? .repeat : .clampToEdge
            d.tAddressMode = mip ? .repeat : .clampToEdge
            d.maxAnisotropy = 1
            return device.makeSamplerState(descriptor: d)!
        }
        roomSampler = sampler(mip: true)
        spineSampler = sampler(mip: false)
    }

    private func ensureTargets(outputWidth: Int, outputHeight: Int) -> (Int, Int) {
        let scale = min(1, max(0.5, renderScale))
        let width = scale < 1 ? Int((Float(outputWidth) * scale).rounded()) : outputWidth
        let height = scale < 1 ? Int((Float(outputHeight) * scale).rounded()) : outputHeight
        defer { outputSize = (outputWidth, outputHeight) }
        if let c = colorMSAA, c.width == width, c.height == height, outputSize == (outputWidth, outputHeight) {
            return (width, height)
        }
        func make(_ format: MTLPixelFormat, samples: Int, usage: MTLTextureUsage, storage: MTLStorageMode,
                  width: Int, height: Int) -> MTLTexture {
            let d = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: format, width: width, height: height, mipmapped: false)
            d.textureType = samples > 1 ? .type2DMultisample : .type2D
            d.sampleCount = samples
            d.usage = usage
            d.storageMode = storage
            return device.makeTexture(descriptor: d)!
        }
        // Apple GPUs keep MSAA samples and depth in tile memory: no backing
        // store at all (~260 MB saved at 4K).
        let tileOnly: MTLStorageMode = device.supportsFamily(.apple1) ? .memoryless : .private
        colorMSAA = make(.bgra8Unorm, samples: Self.sampleCount, usage: .renderTarget, storage: tileOnly, width: width, height: height)
        depthMSAA = make(.depth32Float, samples: Self.sampleCount, usage: .renderTarget, storage: tileOnly, width: width, height: height)
        resolved = make(.bgra8Unorm, samples: 1, usage: [.renderTarget, .shaderRead], storage: .private, width: width, height: height)

        scaler = nil
        upscaled = nil
        if width != outputWidth {
            let d = MTLFXSpatialScalerDescriptor()
            d.inputWidth = width
            d.inputHeight = height
            d.outputWidth = outputWidth
            d.outputHeight = outputHeight
            d.colorTextureFormat = .bgra8Unorm
            d.outputTextureFormat = .bgra8Unorm
            // The scene is display-referred sRGB-ish 8-bit, not linear light.
            d.colorProcessingMode = .perceptual
            if MTLFXSpatialScalerDescriptor.supportsDevice(device), let s = d.makeSpatialScaler(device: device) {
                scaler = s
                upscaled = make(.bgra8Unorm, samples: 1, usage: [s.outputTextureUsage, .shaderRead], storage: .private,
                                width: outputWidth, height: outputHeight)
            }
        }
        return (width, height)
    }

    /// Draw `stage` seen through `camera` into `target` (a drawable or an offscreen texture).
    /// `sortViewProjection` orders the transparent layers (the camera without
    /// cursor parallax; defaults to the drawn camera).
    func draw(stage: SpotStage, view: Mat4, projection: Mat4, sortViewProjection: Mat4? = nil, charactersVisible: Bool,
              into target: MTLTexture, commandBuffer: MTLCommandBuffer) {
        _ = ensureTargets(outputWidth: target.width, outputHeight: target.height)
        let viewProjection = projection * view
        let sortViewProjection = sortViewProjection ?? viewProjection

        let pass = MTLRenderPassDescriptor()
        pass.colorAttachments[0].texture = colorMSAA
        pass.colorAttachments[0].resolveTexture = resolved
        pass.colorAttachments[0].loadAction = .clear
        pass.colorAttachments[0].clearColor = MTLClearColor(red: 0, green: 0, blue: 0, alpha: 1)
        pass.colorAttachments[0].storeAction = .multisampleResolve
        pass.depthAttachment.texture = depthMSAA
        pass.depthAttachment.loadAction = .clear
        pass.depthAttachment.clearDepth = 1
        pass.depthAttachment.storeAction = .dontCare
        guard let encoder = commandBuffer.makeRenderCommandEncoder(descriptor: pass) else { return }

        // 1. Sky.
        encoder.setRenderPipelineState(sky)
        encoder.setDepthStencilState(noDepth)
        encoder.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 3)

        // 2. Opaque room.
        var uniforms = Uniforms(viewProjection: viewProjection, model: matrix_identity_float4x4)
        encoder.setRenderPipelineState(roomCutout)
        encoder.setDepthStencilState(depthWrite)
        switch QA.cull {
        case "back": encoder.setFrontFacing(.counterClockwise); encoder.setCullMode(.back)
        case "front": encoder.setFrontFacing(.counterClockwise); encoder.setCullMode(.front)
        default: encoder.setCullMode(.none)
        }
        encoder.setVertexBuffer(stage.roomVertices, offset: 0, index: 0)
        encoder.setVertexBytes(&uniforms, length: MemoryLayout<Uniforms>.stride, index: 1)
        encoder.setFragmentSamplerState(roomSampler, index: 0)
        // QA: NP_REVERSE=1 draws the opaque room back to front; any pixel that
        // changes is two surfaces sharing one depth (z-fighting).
        let opaque = stage.room.meshes.filter { !$0.transparent }
        for mesh in QA.reverse ? opaque.reversed() : opaque {
            encoder.setFragmentTexture(stage.room.textures[mesh.texture], index: 0)
            encoder.drawIndexedPrimitives(type: .triangle, indexCount: mesh.indexCount, indexType: .uint32,
                                          indexBuffer: stage.roomIndices, indexBufferOffset: mesh.firstIndex * 4)
        }

        // 3. Transparent list.
        enum Item { case card(RoomMesh), resident(Resident) }
        // Far -> near by projected depth under the camera WITHOUT cursor
        // parallax. Depth under the turned camera changes with the turn:
        // cards and residents at similar depth (Chieri's shadow and the
        // pillar card beside it in Spot 50007) swapped order as the cursor
        // moved and the pillar flickered. (Distance from the eye would also
        // be turn-invariant, but it puts large cards such as the rooftop
        // fence in front of the residents.)
        func depth(_ p: SIMD3<Float>) -> Float {
            let c = sortViewProjection * SIMD4(p, 1)
            return c.z / c.w
        }
        var items: [(order: Int, z: Float, id: Int, item: Item)] = []
        for (i, mesh) in stage.room.meshes.enumerated() where mesh.transparent {
            items.append((0, depth(mesh.center), i, .card(mesh)))
        }
        if charactersVisible {
            for (i, resident) in stage.residents.enumerated() where resident.visible {
                items.append((resident.character.order, depth(resident.model.translation), 100_000 + i, .resident(resident)))
            }
        }
        items.sort { a, b in
            if a.order != b.order { return a.order < b.order }
            if a.z != b.z { return a.z > b.z }
            return a.id < b.id
        }
        if let dump = ProcessInfo.processInfo.environment["BDON_SORTDUMP"], !dump.isEmpty {
            let names = items.map { entry -> String in
                switch entry.item {
                case .card(let mesh): return "card\(stage.room.meshes.firstIndex { $0.firstIndex == mesh.firstIndex } ?? -1)"
                case .resident(let r): return r.character.name
                }
            }
            FileHandle.standardError.write(Data((names.joined(separator: " ") + "\n").utf8))
        }

        var bufferIndex = 0
        encoder.setDepthStencilState(depthTest)
        for entry in items {
            switch entry.item {
            case .card(let mesh):
                encoder.setRenderPipelineState(roomTransparent)
                encoder.setVertexBuffer(stage.roomVertices, offset: 0, index: 0)
                uniforms.model = matrix_identity_float4x4
                encoder.setVertexBytes(&uniforms, length: MemoryLayout<Uniforms>.stride, index: 1)
                encoder.setFragmentSamplerState(roomSampler, index: 0)
                encoder.setFragmentTexture(stage.room.textures[mesh.texture], index: 0)
                encoder.drawIndexedPrimitives(type: .triangle, indexCount: mesh.indexCount, indexType: .uint32,
                                              indexBuffer: stage.roomIndices, indexBufferOffset: mesh.firstIndex * 4)
            case .resident(let resident):
                // QA: NP_NODEPTH=Name draws that resident without the room depth test.
                let skip = QA.noDepth.contains(resident.character.name)
                encoder.setDepthStencilState(skip ? noDepth : depthTest)
                drawResident(resident, uniforms: &uniforms, encoder: encoder, bufferIndex: &bufferIndex)
                encoder.setDepthStencilState(depthTest)
            }
        }
        encoder.endEncoding()

        // 4. MetalFX spatial upscale (renderScale < 1), then the filter pass.
        var source = resolved
        if let scaler, let upscaled, let resolved {
            scaler.colorTexture = resolved
            scaler.outputTexture = upscaled
            scaler.inputContentWidth = resolved.width
            scaler.inputContentHeight = resolved.height
            scaler.encode(commandBuffer: commandBuffer)
            source = upscaled
        }
        let final = MTLRenderPassDescriptor()
        final.colorAttachments[0].texture = target
        final.colorAttachments[0].loadAction = .dontCare
        final.colorAttachments[0].storeAction = .store
        guard let post = commandBuffer.makeRenderCommandEncoder(descriptor: final) else { return }
        post.setRenderPipelineState(blit)
        post.setFragmentTexture(source, index: 0)
        post.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 3)
        post.endEncoding()
    }

    private func drawResident(_ resident: Resident, uniforms: inout Uniforms, encoder: MTLRenderCommandEncoder,
                              bufferIndex: inout Int) {
        var vertices: UnsafePointer<SBVertex>?
        var indices: UnsafePointer<UInt32>?
        var commands: UnsafePointer<SBCommand>?
        var vertexCount: Int32 = 0, indexCount: Int32 = 0, commandCount: Int32 = 0
        sb_render(resident.drawable, &vertices, &vertexCount, &indices, &indexCount, &commands, &commandCount)
        guard vertexCount > 0, indexCount > 0, let vertices, let indices, let commands else { return }

        let vBytes = Int(vertexCount) * MemoryLayout<SBVertex>.stride
        let iBytes = Int(indexCount) * 4
        let vBuffer = buffer(in: &spineVertexBuffers, at: bufferIndex, bytes: vBytes)
        let iBuffer = buffer(in: &spineIndexBuffers, at: bufferIndex, bytes: iBytes)
        bufferIndex += 1
        vBuffer.contents().copyMemory(from: vertices, byteCount: vBytes)
        iBuffer.contents().copyMemory(from: indices, byteCount: iBytes)

        uniforms.model = resident.model
        encoder.setVertexBuffer(vBuffer, offset: 0, index: 0)
        encoder.setVertexBytes(&uniforms, length: MemoryLayout<Uniforms>.stride, index: 1)
        encoder.setFragmentSamplerState(spineSampler, index: 0)
        for i in 0 ..< Int(commandCount) {
            let command = commands[i]
            guard let texture = TextureBridge.texture(command.texture) else { continue }
            encoder.setRenderPipelineState(spine[Int(command.blend)])
            encoder.setFragmentTexture(texture, index: 0)
            encoder.drawIndexedPrimitives(type: .triangle, indexCount: Int(command.indexCount), indexType: .uint32,
                                          indexBuffer: iBuffer, indexBufferOffset: Int(command.indexStart) * 4)
        }
    }

    /// Growable shared buffers, one per resident slot in the frame.
    /// Frames are serialised (one in flight), so reuse is safe.
    private func buffer(in list: inout [MTLBuffer], at index: Int, bytes: Int) -> MTLBuffer {
        if index < list.count, list[index].length >= bytes {
            return list[index]
        }
        let buffer = device.makeBuffer(length: max(bytes, 64 * 1024) * 2, options: .storageModeShared)!
        if index < list.count {
            list[index] = buffer
        } else {
            list.append(buffer)
        }
        return buffer
    }
}
