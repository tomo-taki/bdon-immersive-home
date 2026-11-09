#include "../scene/onp_frame.h"

#include <cassert>
#include <cmath>
#include <iostream>

int main() {
    onp::FrameClock clock;
    assert(clock.tick(100) == 0);
    assert(std::abs(clock.tick(100.033) - 0.033) < 1e-9);

    // A suspended process must not simulate hours of Spine updates on resume.
    assert(clock.tick(3700) == 0.25);
    assert(clock.tick(3699) == 0);
    clock.reset();
    assert(clock.tick(7200) == 0);
    assert(std::abs(clock.tick(7200.033) - 0.033) < 1e-9);

    // Rendering/vsync is part of the frame budget, including slow frames.
    assert(onp::frameDelay(33, 0) == 33);
    assert(onp::frameDelay(33, 20) == 13);
    assert(onp::frameDelay(33, 33) == 0);
    assert(onp::frameDelay(33, 100) == 0);
    assert(onp::frameDelay(200, 17) == 183);
    std::cout << "Frame clock and pacing passed\n";
}
