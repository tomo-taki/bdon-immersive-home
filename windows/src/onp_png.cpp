// onp_png.cpp -- BGRA framebuffer -> PNG file (snapshot mode), via stb_image_write.
#include <cstdint>
#include <string>
#include <vector>

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

// Declared in main.cpp.
bool savePngBGRA(const std::string& path, const uint8_t* bgra, int w, int h);

bool savePngBGRA(const std::string& path, const uint8_t* bgra, int w, int h) {
    std::vector<uint8_t> rgba((size_t)w * h * 4);
    for (size_t i = 0; i < (size_t)w * h; ++i) {
        rgba[i * 4 + 0] = bgra[i * 4 + 2]; // R <- B
        rgba[i * 4 + 1] = bgra[i * 4 + 1]; // G
        rgba[i * 4 + 2] = bgra[i * 4 + 0]; // B <- R
        rgba[i * 4 + 3] = 255;             // opaque
    }
    return stbi_write_png(path.c_str(), w, h, 4, rgba.data(), w * 4) != 0;
}
