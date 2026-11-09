#pragma once

#include <algorithm>
#include <cstdint>

namespace onp {

class FrameClock {
public:
    double tick(double now) {
        if (!started_) {
            previous_ = now;
            started_ = true;
            return 0;
        }

        double delta = now - previous_;
        previous_ = now;
        // Bound resume/stall work to the same limit as the macOS renderer.
        return std::clamp(delta, 0.0, kMaxDelta);
    }

    void reset() {
        started_ = false;
    }

private:
    static constexpr double kMaxDelta = 0.25;
    double previous_ = 0;
    bool started_ = false;
};

inline unsigned frameDelay(unsigned targetMs, uint64_t elapsedMs) {
    return elapsedMs >= targetMs ? 0 : targetMs - static_cast<unsigned>(elapsedMs);
}

} // namespace onp
