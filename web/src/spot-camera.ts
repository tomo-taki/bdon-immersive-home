// Home Spot camera in Unity world space (left-handed, y up, camera looks +z).
// Ported from SobiMate lib/spending-home/spot-camera.ts, which follows
// ournotes-player's SpotCamera and the Spot's SpotSituationSettings.
//
//   default pose : position = defaultPositionOffset - orbitRatio * forward,
//                  looking at originalOffset
//   shift        : yaw / pitch (degrees) limited by maxLeft/Right/Up/DownShift

export type Vec3 = { x: number; y: number; z: number };

export type SpotSituation = {
  originalOffset: Vec3;
  defaultPositionOffset: Vec3;
  orbitRatio: number;
  fieldOfView: number;
  maxLeftShift: number;
  maxRightShift: number;
  maxUpShift: number;
  maxDownShift: number;
  backgroundPosition: Vec3;
  backgroundRotation: Vec3;
  backgroundScale: Vec3;
};

export type SpotPose = { position: Vec3; forward: Vec3; yaw: number; pitch: number; fov: number };

// The game frames its Spots for a 16:9 screen.
export const REFERENCE_ASPECT = 16 / 9;
// Widest vertical view allowed when a display is narrower than 16:9.
const MAX_FIT_FOV = 32;
const DEG = Math.PI / 180;

const add = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const sub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const scale = (a: Vec3, k: number): Vec3 => ({ x: a.x * k, y: a.y * k, z: a.z * k });

function normalize(a: Vec3): Vec3 {
  const l = Math.hypot(a.x, a.y, a.z);
  return l > 0 ? scale(a, 1 / l) : { x: 0, y: 0, z: 1 };
}

// Unity forward rotated by yaw around world up, then pitch. +yaw turns right, +pitch looks up.
export function lookDirection(pose: SpotPose): Vec3 {
  const f = normalize(pose.forward);
  const yaw = Math.atan2(f.x, f.z) + pose.yaw * DEG;
  const pitch = Math.asin(Math.max(-1, Math.min(1, f.y))) + pose.pitch * DEG;
  return { x: Math.sin(yaw) * Math.cos(pitch), y: Math.sin(pitch), z: Math.cos(yaw) * Math.cos(pitch) };
}

export function lookTarget(pose: SpotPose): Vec3 {
  return add(pose.position, lookDirection(pose));
}

// Pull-back: frame the horizontal view the game shows on a 19.5:9 phone
// (its fixed vertical FOV widens sideways there), not the tighter 16:9 one.
const WIDE_ASPECT = 19.5 / 9;

// Vertical FOV keeping the game's phone-width horizontal view on this display.
export function fitFov(s: SpotSituation, width: number, height: number) {
  const half = Math.tan((s.fieldOfView * DEG) / 2) * WIDE_ASPECT * (height / Math.max(width, 1));
  return Math.min(MAX_FIT_FOV, Math.max(s.fieldOfView, (2 * Math.atan(half)) / DEG));
}

export function defaultPose(s: SpotSituation, fov: number): SpotPose {
  const forward = normalize(sub(s.originalOffset, s.defaultPositionOffset));
  const position = sub(s.defaultPositionOffset, scale(forward, s.orbitRatio));
  return { position, forward, yaw: 0, pitch: 0, fov };
}

// Pointer in [-1, 1]² mapped onto the Spot's own look-around limits.
// A view wider than the game's (pull-back) eats into those limits by the
// extra half-angle, so the room's edge never comes into view.
export function shiftedPose(base: SpotPose, px: number, py: number, s: SpotSituation, aspect: number): SpotPose {
  const extraV = Math.max(0, (base.fov - s.fieldOfView) / 2);
  const halfH = (fov: number, a: number) => Math.atan(Math.tan((fov * DEG) / 2) * a) / DEG;
  const extraH = Math.max(0, halfH(base.fov, aspect) - halfH(s.fieldOfView, WIDE_ASPECT));
  const limit = (max: number, extra: number) => Math.max(0, max - extra);

  const yaw = px >= 0 ? px * limit(s.maxRightShift, extraH) : px * limit(s.maxLeftShift, extraH);
  const pitch = py >= 0 ? py * limit(s.maxUpShift, extraV) : py * limit(s.maxDownShift, extraV);
  return { ...base, yaw, pitch };
}

// Unity (left-handed) to three.js / glTF (right-handed): negate z.
export const toRightHanded = (v: Vec3): Vec3 => ({ x: v.x, y: v.y, z: -v.z });
