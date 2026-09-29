// onp_math.h -- faithful C++ port of Sources/YumemitaWallpaper/Render/Math.swift.
//
// The Swift original uses Apple's simd: column-major storage, COLUMN vectors
// (m * v), right-handed look-at, Metal's [0,1] depth range. We reproduce those
// exact conventions here so the camera/room matrices match bit-for-close.
//
// Matrix layout: Mat4.c[k] is column k (a Vec4). Element (row r, col k) = c[k][r].
// This mirrors simd_float4x4(columns: (c0, c1, c2, c3)).

#pragma once

#include <array>
#include <cmath>

namespace onp {

constexpr float kPi = 3.14159265358979323846f;
constexpr float kDeg = kPi / 180.0f; // "degrees" in Math.swift: multiply degrees by this

struct Vec2 { float x = 0, y = 0; };

struct Vec3 {
    float x = 0, y = 0, z = 0;
    Vec3() = default;
    Vec3(float x_, float y_, float z_) : x(x_), y(y_), z(z_) {}
};

struct Vec4 {
    float x = 0, y = 0, z = 0, w = 0;
    Vec4() = default;
    Vec4(float x_, float y_, float z_, float w_) : x(x_), y(y_), z(z_), w(w_) {}
    Vec4(const Vec3& v, float w_) : x(v.x), y(v.y), z(v.z), w(w_) {}
    float operator[](int i) const { return (&x)[i]; }
    float& operator[](int i) { return (&x)[i]; }
};

// ---- Vec3 ops ----

inline Vec3 operator+(const Vec3& a, const Vec3& b) { return {a.x + b.x, a.y + b.y, a.z + b.z}; }
inline Vec3 operator-(const Vec3& a, const Vec3& b) { return {a.x - b.x, a.y - b.y, a.z - b.z}; }
inline Vec3 operator*(const Vec3& a, float s) { return {a.x * s, a.y * s, a.z * s}; }
inline Vec3 operator*(float s, const Vec3& a) { return a * s; }

inline float dot(const Vec3& a, const Vec3& b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
inline Vec3 cross(const Vec3& a, const Vec3& b) {
    return {a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x};
}
inline float length(const Vec3& a) { return std::sqrt(dot(a, a)); }
inline Vec3 normalize(const Vec3& a) {
    float len = length(a);
    return len > 0 ? a * (1.0f / len) : a;
}
inline Vec3 vmin(const Vec3& a, const Vec3& b) {
    return {std::fmin(a.x, b.x), std::fmin(a.y, b.y), std::fmin(a.z, b.z)};
}
inline Vec3 vmax(const Vec3& a, const Vec3& b) {
    return {std::fmax(a.x, b.x), std::fmax(a.y, b.y), std::fmax(a.z, b.z)};
}

// ---- Quaternion (x, y, z, w) ----

struct Quat {
    float x = 0, y = 0, z = 0, w = 1;
};

// Matches simd_quatf multiplication (Hamilton product), lhs applied after rhs.
inline Quat operator*(const Quat& a, const Quat& b) {
    return {
        a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
        a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
        a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
        a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    };
}

inline Quat quatAxisAngle(float angle, const Vec3& axis) {
    // simd_quatf(angle:axis:) expects a normalized axis; ours already are.
    float h = angle * 0.5f;
    float s = std::sin(h);
    return {axis.x * s, axis.y * s, axis.z * s, std::cos(h)};
}

// ---- Mat4: column-major, column vectors ----

struct Mat4 {
    // c[0..3] are the four columns.
    std::array<Vec4, 4> c{};

    Mat4() = default;
    Mat4(const Vec4& c0, const Vec4& c1, const Vec4& c2, const Vec4& c3) {
        c[0] = c0; c[1] = c1; c[2] = c2; c[3] = c3;
    }

    static Mat4 identity() {
        return Mat4({1, 0, 0, 0}, {0, 1, 0, 0}, {0, 0, 1, 0}, {0, 0, 0, 1});
    }

    static Mat4 diagonal(float d0, float d1, float d2, float d3) {
        return Mat4({d0, 0, 0, 0}, {0, d1, 0, 0}, {0, 0, d2, 0}, {0, 0, 0, d3});
    }

    // Mat4.init(columnMajor v: [Float]) -- three.js/Metal column-major order.
    static Mat4 columnMajor(const float* v) {
        return Mat4({v[0], v[1], v[2], v[3]}, {v[4], v[5], v[6], v[7]},
                    {v[8], v[9], v[10], v[11]}, {v[12], v[13], v[14], v[15]});
    }

    Vec3 translation() const { return {c[3].x, c[3].y, c[3].z}; }
};

// Matrix from a unit quaternion, matching simd_float4x4(quat).
inline Mat4 mat4FromQuat(const Quat& q) {
    float xx = q.x * q.x, yy = q.y * q.y, zz = q.z * q.z;
    float xy = q.x * q.y, xz = q.x * q.z, yz = q.y * q.z;
    float wx = q.w * q.x, wy = q.w * q.y, wz = q.w * q.z;
    // Columns of the rotation matrix (column-vector convention).
    return Mat4(
        {1 - 2 * (yy + zz), 2 * (xy + wz), 2 * (xz - wy), 0},
        {2 * (xy - wz), 1 - 2 * (xx + zz), 2 * (yz + wx), 0},
        {2 * (xz + wy), 2 * (yz - wx), 1 - 2 * (xx + yy), 0},
        {0, 0, 0, 1});
}

// Mat4 * Mat4 (column-vector: result column k = a * b.column(k)).
inline Vec4 mul(const Mat4& a, const Vec4& v) {
    return {
        a.c[0].x * v.x + a.c[1].x * v.y + a.c[2].x * v.z + a.c[3].x * v.w,
        a.c[0].y * v.x + a.c[1].y * v.y + a.c[2].y * v.z + a.c[3].y * v.w,
        a.c[0].z * v.x + a.c[1].z * v.y + a.c[2].z * v.z + a.c[3].z * v.w,
        a.c[0].w * v.x + a.c[1].w * v.y + a.c[2].w * v.z + a.c[3].w * v.w,
    };
}

inline Mat4 operator*(const Mat4& a, const Mat4& b) {
    return Mat4(mul(a, b.c[0]), mul(a, b.c[1]), mul(a, b.c[2]), mul(a, b.c[3]));
}

// Mat4.compose(t, q, s): rotation scaled per-column, translation in column 3.
inline Mat4 compose(const Vec3& t, const Quat& q, const Vec3& s) {
    Mat4 m = mat4FromQuat(q);
    m.c[0] = {m.c[0].x * s.x, m.c[0].y * s.x, m.c[0].z * s.x, m.c[0].w * s.x};
    m.c[1] = {m.c[1].x * s.y, m.c[1].y * s.y, m.c[1].z * s.y, m.c[1].w * s.y};
    m.c[2] = {m.c[2].x * s.z, m.c[2].y * s.z, m.c[2].z * s.z, m.c[2].w * s.z};
    m.c[3] = {t.x, t.y, t.z, 1};
    return m;
}

// General 4x4 inverse (cofactor method). simd's .inverse.
inline Mat4 inverse(const Mat4& m) {
    // Flatten to a[col*4+row].
    const float* a = &m.c[0].x;
    float inv[16], det;
    float M[16];
    for (int i = 0; i < 16; ++i) M[i] = a[i];

    inv[0] = M[5]*M[10]*M[15] - M[5]*M[11]*M[14] - M[9]*M[6]*M[15] + M[9]*M[7]*M[14] + M[13]*M[6]*M[11] - M[13]*M[7]*M[10];
    inv[4] = -M[4]*M[10]*M[15] + M[4]*M[11]*M[14] + M[8]*M[6]*M[15] - M[8]*M[7]*M[14] - M[12]*M[6]*M[11] + M[12]*M[7]*M[10];
    inv[8] = M[4]*M[9]*M[15] - M[4]*M[11]*M[13] - M[8]*M[5]*M[15] + M[8]*M[7]*M[13] + M[12]*M[5]*M[11] - M[12]*M[7]*M[9];
    inv[12] = -M[4]*M[9]*M[14] + M[4]*M[10]*M[13] + M[8]*M[5]*M[14] - M[8]*M[6]*M[13] - M[12]*M[5]*M[10] + M[12]*M[6]*M[9];
    inv[1] = -M[1]*M[10]*M[15] + M[1]*M[11]*M[14] + M[9]*M[2]*M[15] - M[9]*M[3]*M[14] - M[13]*M[2]*M[11] + M[13]*M[3]*M[10];
    inv[5] = M[0]*M[10]*M[15] - M[0]*M[11]*M[14] - M[8]*M[2]*M[15] + M[8]*M[3]*M[14] + M[12]*M[2]*M[11] - M[12]*M[3]*M[10];
    inv[9] = -M[0]*M[9]*M[15] + M[0]*M[11]*M[13] + M[8]*M[1]*M[15] - M[8]*M[3]*M[13] - M[12]*M[1]*M[11] + M[12]*M[3]*M[9];
    inv[13] = M[0]*M[9]*M[14] - M[0]*M[10]*M[13] - M[8]*M[1]*M[14] + M[8]*M[2]*M[13] + M[12]*M[1]*M[10] - M[12]*M[2]*M[9];
    inv[2] = M[1]*M[6]*M[15] - M[1]*M[7]*M[14] - M[5]*M[2]*M[15] + M[5]*M[3]*M[14] + M[13]*M[2]*M[7] - M[13]*M[3]*M[6];
    inv[6] = -M[0]*M[6]*M[15] + M[0]*M[7]*M[14] + M[4]*M[2]*M[15] - M[4]*M[3]*M[14] - M[12]*M[2]*M[7] + M[12]*M[3]*M[6];
    inv[10] = M[0]*M[5]*M[15] - M[0]*M[7]*M[13] - M[4]*M[1]*M[15] + M[4]*M[3]*M[13] + M[12]*M[1]*M[7] - M[12]*M[3]*M[5];
    inv[14] = -M[0]*M[5]*M[14] + M[0]*M[6]*M[13] + M[4]*M[1]*M[14] - M[4]*M[2]*M[13] - M[12]*M[1]*M[6] + M[12]*M[2]*M[5];
    inv[3] = -M[1]*M[6]*M[11] + M[1]*M[7]*M[10] + M[5]*M[2]*M[11] - M[5]*M[3]*M[10] - M[9]*M[2]*M[7] + M[9]*M[3]*M[6];
    inv[7] = M[0]*M[6]*M[11] - M[0]*M[7]*M[10] - M[4]*M[2]*M[11] + M[4]*M[3]*M[10] + M[8]*M[2]*M[7] - M[8]*M[3]*M[6];
    inv[11] = -M[0]*M[5]*M[11] + M[0]*M[7]*M[9] + M[4]*M[1]*M[11] - M[4]*M[3]*M[9] - M[8]*M[1]*M[7] + M[8]*M[3]*M[5];
    inv[15] = M[0]*M[5]*M[10] - M[0]*M[6]*M[9] - M[4]*M[1]*M[10] + M[4]*M[2]*M[9] + M[8]*M[1]*M[6] - M[8]*M[2]*M[5];

    det = M[0]*inv[0] + M[1]*inv[4] + M[2]*inv[8] + M[3]*inv[12];
    Mat4 out;
    if (det == 0.0f) return Mat4::identity();
    float idet = 1.0f / det;
    float* o = &out.c[0].x;
    for (int i = 0; i < 16; ++i) o[i] = inv[i] * idet;
    return out;
}

// ---- Scene helpers (Math.swift / Spot.swift) ----

// S = diag(1,1,-1,1) mirror. mirrorZ in Math.swift.
inline Mat4 mirrorZ() { return Mat4::diagonal(1, 1, -1, 1); }

// unityMatrix(values): mirrorZ * columnMajor(values) * mirrorZ.
inline Mat4 unityMatrix(const float* values) {
    Mat4 mz = mirrorZ();
    return mz * Mat4::columnMajor(values) * mz;
}

// eulerYXZ(e): qy * qx * qz, angles in degrees.
inline Quat eulerYXZ(const Vec3& e) {
    Quat qy = quatAxisAngle(e.y * kDeg, {0, 1, 0});
    Quat qx = quatAxisAngle(e.x * kDeg, {1, 0, 0});
    Quat qz = quatAxisAngle(e.z * kDeg, {0, 0, 1});
    return qy * qx * qz;
}

// Right-handed lookAt, matching Math.swift exactly.
inline Mat4 lookAt(const Vec3& eye, const Vec3& target, const Vec3& up = {0, 1, 0}) {
    Vec3 z = normalize(eye - target);
    Vec3 x = normalize(cross(up, z));
    Vec3 y = cross(z, x);
    return Mat4(
        {x.x, y.x, z.x, 0},
        {x.y, y.y, z.y, 0},
        {x.z, y.z, z.z, 0},
        {-dot(x, eye), -dot(y, eye), -dot(z, eye), 1});
}

// Right-handed perspective, Metal [0,1] depth range. fovY in DEGREES.
inline Mat4 perspective(float fovYDegrees, float aspect, float nearZ, float farZ) {
    float f = 1.0f / std::tan(fovYDegrees * kDeg / 2.0f);
    float range = farZ / (nearZ - farZ);
    return Mat4(
        {f / aspect, 0, 0, 0},
        {0, f, 0, 0},
        {0, 0, range, -1},
        {0, 0, range * nearZ, 0});
}

// Transpose (for HLSL, which is row-major and uses row vectors by default).
inline Mat4 transpose(const Mat4& m) {
    return Mat4(
        {m.c[0].x, m.c[1].x, m.c[2].x, m.c[3].x},
        {m.c[0].y, m.c[1].y, m.c[2].y, m.c[3].y},
        {m.c[0].z, m.c[1].z, m.c[2].z, m.c[3].z},
        {m.c[0].w, m.c[1].w, m.c[2].w, m.c[3].w});
}

} // namespace onp
