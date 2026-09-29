// Draws one Home Spot situation of home_003_yumemita_01_vrfloor_03 with three.js:
// the room's cards from room.glb and every resident as their Spot Spine 4.2
// character, seen through the Spot camera. Ported from SobiMate
// app/spending-home/spot-stage.ts (one resident) to all residents.
//
// Coordinates: spot.json holds Unity world values (left-handed). room.glb is
// already right-handed (the exporter negated z), so Unity matrices M are used
// as S·M·S with S = diag(1, 1, -1), and points as (x, y, -z).

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AtlasAttachmentLoader, ClippingAttachment, Physics, SkeletonBinary, SkeletonJson, SkeletonMesh, TextureAtlas, ThreeJsTexture } from "@esotericsoftware/spine-threejs";
import { lookTarget, toRightHanded, type SpotPose, type SpotSituation, type Vec3 } from "./spot-camera";

type Quat = { x: number; y: number; z: number; w: number };
type UnityTransform = { localPosition: Vec3; localRotation: Quat; localScale: Vec3 };

export type SpotCharacter = {
  name: string;
  skeleton: string;
  atlas: string;
  scale: number;
  world: number[];
  animation: string | null;
  loop: boolean;
  order: number;
};

export type SpotData = {
  name: string;
  situation: SpotSituation;
  camera: { near: number; far: number; fieldOfView: number };
  roomRoot: UnityTransform;
  roomNodes: boolean[];
  characters: SpotCharacter[];
};

const MIRROR_Z = new THREE.Matrix4().makeScale(1, 1, -1);
const DEG = Math.PI / 180;
// Idle gap before a resident replays her entrance (the Spot has no idle loop).
const REPLAY_MIN_S = 18;
const REPLAY_MAX_S = 40;
// Keep drawing this long after the last clip ends, for physics to settle.
const SETTLE_S = 3;

function unityMatrix(values: number[]) {
  const m = new THREE.Matrix4().fromArray(values);
  return MIRROR_Z.clone().multiply(m).multiply(MIRROR_Z);
}

// Unity TRS with Quaternion.Euler order (z, then x, then y).
function unityTrs(position: Vec3, euler: Vec3, scale: Vec3) {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(euler.x * DEG, euler.y * DEG, euler.z * DEG, "YXZ"));
  return new THREE.Matrix4().compose(new THREE.Vector3(position.x, position.y, position.z), q, new THREE.Vector3(scale.x, scale.y, scale.z));
}

// SpotSceneRoot.SetObject: background matrix with the room file's baked root taken out.
function roomMatrix(data: SpotData) {
  const s = data.situation;
  const background = unityTrs(s.backgroundPosition, s.backgroundRotation, s.backgroundScale);
  const root = data.roomRoot;
  const baked = new THREE.Matrix4().compose(
    new THREE.Vector3(root.localPosition.x, root.localPosition.y, root.localPosition.z),
    new THREE.Quaternion(root.localRotation.x, root.localRotation.y, root.localRotation.z, root.localRotation.w),
    new THREE.Vector3(root.localScale.x, root.localScale.y, root.localScale.z),
  );
  const unity = background.multiply(baked.invert());
  return MIRROR_Z.clone().multiply(unity).multiply(MIRROR_Z);
}

// Room materials: "_material" = Unlit/Transparent Cutout, "_transparent" = Unlit/Transparent.
function unlitMaterial(source: THREE.Material) {
  const map = (source as THREE.MeshStandardMaterial).map ?? null;
  if (map) {
    map.colorSpace = THREE.SRGBColorSpace;
  }
  const transparent = source.name.endsWith("_transparent");
  return new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide, transparent, alphaTest: transparent ? 0 : 0.5, depthWrite: !transparent });
}

async function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

async function fetchOk(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }
  return response;
}

type Resident = {
  mesh: SkeletonMesh;
  character: SpotCharacter;
  animation: string | null;
  // Slots that draw people; the rest is furniture that stays with characters off.
  personSlots: number[];
  hasProps: boolean;
};

// The Spot's pink sky beyond the dome's edges (was the page's CSS background).
const SKY_STOPS: [number, string][] = [[0, "#f6b9dd"], [0.45, "#f3c6e6"], [1, "#bfeaf4"]];
let sky: THREE.Texture | null = null;

function skyTexture() {
  if (sky) {
    return sky;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  for (const [stop, color] of SKY_STOPS) {
    gradient.addColorStop(stop, color);
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  sky = new THREE.CanvasTexture(canvas);
  sky.colorSpace = THREE.SRGBColorSpace;
  return sky;
}

/**
 * The page's one renderer; every SpotStage draws through it. A second
 * WebGLRenderer on the same canvas shares the GL context but not the state
 * cache, so each one's GL calls corrupt what the other believes is bound.
 * Opaque (alpha: false) so the page behind can never show through a frame.
 */
export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  return renderer;
}

// Easter egg: band members a resident's name or slot names refer to.
// Rana is never hidden, so a skeleton shared with her only loses the others' slots.
const MEMBER_TOKENS: Record<string, string[]> = {
  tomori: ["tomori", "燈"],
  taki: ["taki", "立希"],
  anon: ["anon", "愛音"],
  soyo: ["soyo", "そよ"],
  rana: ["rana", "楽奈"],
};

function membersIn(name: string) {
  const lower = name.toLowerCase();
  return Object.keys(MEMBER_TOKENS).filter((m) => MEMBER_TOKENS[m].some((t) => lower.includes(t)));
}

// Character toggle: Spot skeletons also carry the furniture the room model
// leaves out (tables, chairs, benches, stage effects), so hiding characters
// must blank only the people's slots. Audited against every Spot's slot names.
const PEOPLE = [
  "tomori", "taki", "anon", "soyo", "rana", "燈", "立希", "愛音", "そよ", "楽奈",
  "sakiko", "uika", "mutsumi", "umiri", "nyamu", "祥子", "初華", "睦", "海鈴", "にゃむ",
  "nonoka", "arare", "miyako", "yuno", "ritsu", "manager", "marukun",
  "houka", "hotaru", "mahoro", "natsume", "nagi", "kanata",
  "raika", "chieri", "yomogi", "miku", "shizuku",
];
// Furniture even when named after a resident or a shadow ("hotaru_chair_3", "chair_shadow").
const PROP_ALWAYS = /chair|armrest|sofa|door|handrail|menu|coaster|teaset|komono|bucket|balcony|_item|(^|_)pc(_|$)/;
// A resident's shadow cast on furniture ("table_hand_shadow") belongs to her,
// as does her speech-bubble backdrop ("arare_wipe_bg").
const SHADOW = /shadow|syadow|wipe/;
// "table(?!t)": a held tablet is hers.
const PROP = /table(?!t)|stall|bench|stage|dish|(^|_)bg(\d|_|$)|(^|_)ef_\d|smoke/;

function isPerson(name: string) {
  const lower = name.toLowerCase();
  return PEOPLE.some((p) => lower.includes(p));
}

function isPropSlot(name: string) {
  const lower = name.toLowerCase();
  return PROP_ALWAYS.test(lower) || (!SHADOW.test(lower) && PROP.test(lower));
}

export class SpotStage {
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private residents: Resident[] = [];
  // Atlas pages are GPU textures the SkeletonMeshes do not own; freed in dispose().
  private readonly atlases = new Map<string, TextureAtlas>();
  private clock = 0;
  private replayAt = Infinity;
  private charactersVisible = true;
  // Easter egg: residents drawn not at all, and slots blanked inside shared skeletons.
  private hiddenResidents = new Set<Resident>();
  private hiddenSlots = new Map<Resident, number[]>();

  private constructor(private readonly renderer: THREE.WebGLRenderer, readonly data: SpotData) {
    this.scene.background = skyTexture();
    this.camera = new THREE.PerspectiveCamera(data.camera.fieldOfView, 16 / 9, data.camera.near, data.camera.far);
  }

  static async create(renderer: THREE.WebGLRenderer, base: string, dir: string) {
    const data = (await (await fetchOk(`${base}/${dir}/spot.json`)).json()) as SpotData;
    const stage = new SpotStage(renderer, data);
    // Situations of one room share its glb: <room>/room.glb next to <room>/<spotId>/.
    const room = await (await fetchOk(`${base}/${dir.split("/")[0]}/room.glb`)).arrayBuffer();
    await stage.buildRoom(room);
    await stage.buildResidents(`${base}/${dir}`);
    return stage;
  }

  /** Show or hide every resident; animations keep running either way. */
  setCharactersVisible(visible: boolean) {
    this.charactersVisible = visible;
    this.applyVisibility();
  }

  /**
   * Hide these members (e.g. ["anon", "soyo"]). A resident that is only hidden
   * members disappears; one shared with a shown member (TakiRana) keeps its
   * skeleton and blanks the hidden member's slots.
   */
  setHiddenMembers(members: string[]) {
    const hidden = new Set(members);
    this.hiddenResidents.clear();
    this.hiddenSlots.clear();

    for (const resident of this.residents) {
      const named = membersIn(resident.character.name);
      if (!named.some((m) => hidden.has(m))) {
        continue;
      }
      if (named.every((m) => hidden.has(m))) {
        this.hiddenResidents.add(resident);
        continue;
      }
      const slots = resident.mesh.skeleton.slots
        .map((slot, index) => ({ index, members: membersIn(slot.data.name) }))
        .filter((s) => s.members.length > 0 && s.members.every((m) => hidden.has(m)))
        .map((s) => s.index);
      this.hiddenSlots.set(resident, slots);
    }
    this.applyVisibility();
  }

  private applyVisibility() {
    this.invalidate();
    for (const resident of this.residents) {
      // Blanked slots only get an attachment back from a keyed animation, so
      // parts the clip never keys (most of the body) would stay empty after
      // turning characters back on. Restore the setup pose; the next update
      // re-applies the clip on top of it.
      resident.mesh.skeleton.setSlotsToSetupPose();
      // Characters off: a resident with furniture keeps drawing it (see blankSlots).
      const peopleOnly = resident.personSlots.length > 0 && !resident.hasProps;
      const off = !this.charactersVisible && peopleOnly;
      resident.mesh.parent!.visible = !off && !this.hiddenResidents.has(resident);
    }
  }

  /** Slots left empty this frame: easter-egg members, and people with characters off. */
  private blankSlots(resident: Resident) {
    const egg = this.hiddenSlots.get(resident) ?? [];
    return this.charactersVisible ? egg : [...egg, ...resident.personSlots];
  }

  /** SkeletonMesh.update with hidden slots cleared after the pose is applied. */
  private updateResident(resident: Resident, delta: number) {
    const slots = this.blankSlots(resident);
    if (!slots.length) {
      resident.mesh.update(delta);
      return;
    }
    const { state, skeleton } = resident.mesh;
    state.update(delta);
    state.apply(skeleton);
    for (const index of slots) {
      const slot = skeleton.slots[index];
      // Clipping masks draw nothing; clearing one would unclip the slots after it.
      if (!(slot.getAttachment() instanceof ClippingAttachment)) {
        slot.setAttachment(null);
      }
    }
    skeleton.update(delta);
    skeleton.updateWorldTransform(Physics.update);
    // updateGeometry is private in the typings but is what update() ends with.
    (resident.mesh as unknown as { updateGeometry(): void }).updateGeometry();
  }

  private async buildRoom(room: ArrayBuffer) {
    const gltf = await new GLTFLoader().parseAsync(room, "");
    const root = new THREE.Group();
    root.matrixAutoUpdate = false;
    root.matrix.copy(roomMatrix(this.data));
    root.add(gltf.scene);

    // Show only the cards this situation's Prepare activates.
    gltf.scene.traverse((object) => {
      const association = gltf.parser.associations.get(object);
      const nodeIndex = association && "nodes" in association ? association.nodes : undefined;
      if (nodeIndex !== undefined && this.data.roomNodes[nodeIndex] === false) {
        object.visible = false;
      }
      if (object instanceof THREE.Mesh) {
        object.material = unlitMaterial(object.material as THREE.Material);
      }
    });
    this.scene.add(root);
  }

  private async buildResidents(dir: string) {
    const atlases = this.atlases;

    for (const character of this.data.characters) {
      let atlas = atlases.get(character.atlas);
      if (!atlas) {
        atlas = new TextureAtlas(await (await fetchOk(`${dir}/${character.atlas}`)).text());
        for (const page of atlas.pages) {
          page.setTexture(new ThreeJsTexture(await loadImage(`${dir}/${page.name}`)));
        }
        atlases.set(character.atlas, atlas);
      }

      // Spine exports come as JSON or as 4.2 binary (.skel).
      const url = `${dir}/${character.skeleton}`;
      const attachments = new AtlasAttachmentLoader(atlas);
      const skeletonData = character.skeleton.endsWith(".skel")
        ? Object.assign(new SkeletonBinary(attachments), { scale: character.scale })
            .readSkeletonData(new Uint8Array(await (await fetchOk(url)).arrayBuffer()))
        : Object.assign(new SkeletonJson(attachments), { scale: character.scale })
            .readSkeletonData(await (await fetchOk(url)).json());
      const mesh = new SkeletonMesh({
        skeletonData,
        materialFactory: (parameters) => new THREE.MeshBasicMaterial({ ...parameters, depthWrite: false }),
      });
      // Unity sorts attachments by draw order at zSpacing 0; no depth offsets.
      mesh.zOffset = 0;

      // No (or unknown) animation name: Unity shows the setup pose.
      const animation = character.animation && skeletonData.findAnimation(character.animation) ? character.animation : null;
      if (animation) {
        mesh.state.setAnimation(0, animation, character.loop);
      }

      const holder = new THREE.Group();
      holder.matrixAutoUpdate = false;
      holder.matrix.copy(unityMatrix(character.world));
      holder.add(mesh);
      // Unity sortingOrder, shared with the room's cards (order 0): higher draws
      // later; equal orders sort by distance, so a card nearer the camera than
      // the resident (a teapot on the table) still covers her.
      holder.renderOrder = character.order;
      this.scene.add(holder);

      // Furniture-only skeletons (Item, Bg, smoke, Effect) name no person anywhere.
      const slotNames = skeletonData.slots.map((slot) => slot.name);
      const person = isPerson(character.name) || slotNames.some(isPerson);
      const personSlots = person ? slotNames.flatMap((name, index) => (isPropSlot(name) ? [] : [index])) : [];
      const hasProps = personSlots.length < slotNames.length;
      const resident: Resident = { mesh, character, animation, personSlots, hasProps };
      if (animation) {
        mesh.state.addListener({ complete: () => this.scheduleReplay() });
      }
      this.residents.push(resident);
    }
  }

  /**
   * The residents' home_start clips are one choreography, so they replay
   * together: once any of them finishes, pick one time for the whole situation.
   */
  private scheduleReplay() {
    if (this.replayAt !== Infinity || this.residents.some((r) => r.character.loop)) {
      return;
    }
    this.replayAt = this.clock + REPLAY_MIN_S + Math.random() * (REPLAY_MAX_S - REPLAY_MIN_S);
  }

  setSize(width: number, height: number) {
    // Resizing clears the canvas: draw again even when idle.
    this.invalidate();
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setPose(pose: SpotPose) {
    const position = toRightHanded(pose.position);
    const target = toRightHanded(lookTarget(pose));
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(target.x, target.y, target.z);
    this.camera.fov = pose.fov;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Advance animations by `delta` seconds and draw one frame. Once every clip
   * has finished (and physics had SETTLE_S to come to rest) frames are
   * skipped: the canvas keeps showing the last one, so an idle wallpaper
   * costs no GPU time. `moving` (the camera turned) forces a frame.
   */
  render(delta: number, moving = false) {
    this.clock += delta;
    const replay = this.clock >= this.replayAt;
    if (replay) {
      this.replayAt = Infinity;
      this.invalidate();
    }
    if (this.animating()) {
      this.invalidate();
    }
    if (!moving && this.clock > this.settleUntil) {
      return;
    }
    for (const resident of this.residents) {
      if (replay && resident.animation) {
        resident.mesh.state.setAnimation(0, resident.animation, false);
      }
      this.updateResident(resident, delta);
    }
    this.renderer.render(this.scene, this.camera);
    this.drawn++;
  }

  /** Frames actually drawn (QA). */
  drawn = 0;
  private settleUntil = SETTLE_S;

  /** Draw for the next SETTLE_S seconds even if nothing animates. */
  invalidate() {
    this.settleUntil = this.clock + SETTLE_S;
  }

  private animating() {
    return this.residents.some((resident) => {
      const track = resident.mesh.state.tracks[0];
      return track !== null && track !== undefined && (track.loop || !track.isComplete());
    });
  }

  dispose() {
    for (const resident of this.residents) {
      resident.mesh.dispose();
    }
    for (const atlas of this.atlases.values()) {
      // Drop the decoded page images too, not only their GPU copies.
      for (const page of atlas.pages) {
        const image = (page.texture as ThreeJsTexture | null)?.texture.image as HTMLImageElement | undefined;
        if (image instanceof HTMLImageElement) {
          image.src = "";
        }
      }
      atlas.dispose();
    }
    // Free the room's GPU buffers and texture before the next situation loads.
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh && !(object.parent instanceof SkeletonMesh)) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials as THREE.MeshBasicMaterial[]) {
          // The room texture's decoded bitmap (tens of MB) would otherwise
          // wait for WebKit's GC; release it now so switches don't pile up.
          const image = material.map?.image;
          if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
            image.close();
          }
          material.map?.dispose();
          material.dispose();
        }
      }
    });
  }
}
