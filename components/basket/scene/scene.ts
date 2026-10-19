// components/basket/scene/scene.ts
import { Camera, Mesh, Plane, Program, Renderer, Texture, Torus, Transform } from "ogl";
import { ADDONS, type AddonPick } from "@/lib/pricing";
import { iconFace, siteFace } from "./faces";
export { loadFaceFonts } from "./faces";
import { catmull, lathe, roundedTile } from "./geometry";
import { hex, material, SHADOW } from "./materials";
import { SHADOW_FRAG, VERT } from "./shaders";
import { BASE_TILES, DEFS, GROUPS, type TileDef, type TileId } from "./tokens";
import type { BasketScene, BasketSceneOptions } from "./types";
import { weaveCanvas } from "./weave";

interface Token {
  readonly node: Transform;
  readonly d: TileDef;
  y: number;
  vy: number;
  phase: "off" | "drop" | "rest" | "lift";
  s: number;
}

/** Basket body profile as (radius, height) control points, smoothed by Catmull-Rom. */
const PROFILE = catmull([[0.001, 0], [0.6, 0], [1.12, 0], [1.36, 0.08], [1.56, 0.45], [1.72, 1.05], [1.82, 1.42]], 6);
const BASE_DROP_DELAY_MS = 250;
const BASE_DROP_GAP_MS = 260;
const ADDON_STAGGER_MS = 180;
const IDLE_MS = 4000;

/**
 * The woven 3D basket from the mock. Appends its canvas to `host`, drops the website tiles in, then keeps the add-on
 * tiles in step with `setPick`. Await `loadFaceFonts()` first and pass its result as `labelFamily`, so the faces draw
 * with the right glyphs.
 */
export function createBasketScene(host: HTMLElement, image: HTMLImageElement | null, options: BasketSceneOptions): BasketScene {
  const reduce = options.reducedMotion;
  const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, antialias: true, premultipliedAlpha: false });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas;
  canvas.style.cssText = "position:relative;z-index:1;display:block;width:100%;height:100%;touch-action:pan-y";
  host.insertBefore(canvas, host.firstChild);

  const camera = new Camera(gl, { fov: 30, near: 0.1, far: 100 });
  const scene = new Transform();
  const group = new Transform();
  group.setParent(scene);

  const white = new Texture(gl, { image: new Uint8Array([255, 255, 255, 255]), width: 1, height: 1, generateMipmaps: false });
  const weave = new Texture(gl, { image: weaveCanvas(), wrapS: gl.REPEAT, wrapT: gl.REPEAT, anisotropy: 8 });

  const body = new Mesh(gl, { geometry: lathe(gl, PROFILE, 128), program: material(gl, white, { map: weave, repeat: [16, 3.2], rough: 0.85, interior: 1 }) });
  body.setParent(group);
  const caneMat = material(gl, white, { color: hex("#a06a33"), rough: 0.5 });
  const rim = new Mesh(gl, { geometry: new Torus(gl, { radius: 1.82, tube: 0.1, radialSegments: 20, tubularSegments: 140 }), program: caneMat });
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.42;
  rim.setParent(group);
  const handle = new Mesh(gl, { geometry: new Torus(gl, { radius: 1.66, tube: 0.075, radialSegments: 16, tubularSegments: 90, arc: Math.PI }), program: caneMat });
  handle.position.y = 1.42;
  handle.rotation.y = 0.32;
  handle.setParent(group);

  const shadowProg = new Program(gl, {
    vertex: VERT,
    fragment: SHADOW_FRAG,
    transparent: true,
    depthWrite: false,
    cullFace: null,
    uniforms: { uStrength: { value: SHADOW.strength }, uTint: { value: SHADOW.tint } },
  });
  const shadow = new Mesh(gl, { geometry: new Plane(gl, { width: 6.2, height: 6.2 }), program: shadowProg });
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.18, 0.003, 0.1);
  shadow.setParent(scene);

  const timers = new Set<number>();
  const later = (fn: () => void, ms: number): void => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  const tokens = new Map<TileId, Token>();
  for (const [id, d] of Object.entries(DEFS) as [TileId, TileDef][]) {
    const face = new Texture(gl, { image: "side" in d ? siteFace(image) : iconFace(d.bg, d.glyph, d.label, options.labelFamily), anisotropy: 8 });
    const geo = roundedTile(gl, d.w, d.h, 0.14, 0.14);
    const node = new Transform();
    node.setParent(group);
    new Mesh(gl, { geometry: geo.caps, program: material(gl, white, { map: face, rough: 0.35 }) }).setParent(node);
    const [r, g, b] = hex("side" in d ? d.side : d.bg), k = "side" in d ? 1 : 0.78;
    new Mesh(gl, { geometry: geo.sides, program: material(gl, white, { color: [r * k, g * k, b * k], rough: 0.45 }) }).setParent(node);
    node.visible = false;
    tokens.set(id, { node, d, y: 0, vy: 0, phase: "off", s: 1 });
  }

  let running = false, visible = false, destroyed = false, last = performance.now(), time = 0, idleUntil = 0, frame = 0;
  let drag = 0, dragV = 0, dragging = false, lastX = 0, px = 0, py = 0, cpx = 0, cpy = 0;

  function kick(): void {
    idleUntil = performance.now() + IDLE_MS;
    if (visible && !running && !destroyed) {
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }
  }

  function add(k: TileId): void {
    const t = tokens.get(k);
    if (!t) return;
    t.phase = "drop";
    t.node.visible = true;
    t.s = 1;
    t.node.scale.set(1, 1, 1);
    t.y = t.d.rest[1] + (reduce ? 0 : 5 + Math.random() * 1.5);
    t.vy = 0;
    t.node.rotation.set(-0.2 + (reduce ? 0 : (Math.random() - 0.5) * 1.6), (Math.random() - 0.5) * 0.8, t.d.rz + (reduce ? 0 : (Math.random() - 0.5) * 2));
    kick();
  }

  function remove(k: TileId): void {
    const t = tokens.get(k);
    if (!t || t.phase === "off") return;
    t.phase = "lift";
    t.vy = 3;
    kick();
  }

  function step(dt: number): void {
    for (const t of tokens.values()) {
      if (t.phase === "off") continue;
      const r = t.d.rest, m = t.node;
      if (t.phase === "drop") {
        t.vy -= 24 * dt;
        t.y += t.vy * dt;
        if (t.y < r[1]) {
          t.y = r[1];
          t.vy = -t.vy * 0.36;
          if (Math.abs(t.vy) < 0.7) {
            t.vy = 0;
            t.phase = "rest";
          }
        }
      } else if (t.phase === "lift") {
        t.vy += 14 * dt;
        t.y += t.vy * dt;
        t.s = Math.max(0, t.s - dt * 1.6);
        m.scale.set(t.s, t.s, t.s);
        if (t.s <= 0) {
          t.phase = "off";
          m.visible = false;
        }
      }
      m.position.set(r[0], t.y, r[2]);
      const a = Math.min(1, dt * 7), wob = t.phase === "rest" && !reduce ? Math.sin(time * 1.4 + r[0] * 3) * 0.02 : 0;
      m.rotation.x += (-0.2 - m.rotation.x) * a;
      m.rotation.y += (0 - m.rotation.y) * a;
      m.rotation.z += (t.d.rz + wob - m.rotation.z) * a;
    }
    if (!dragging) {
      drag += dragV * dt;
      dragV *= Math.pow(0.04, dt);
    }
    cpx += (px - cpx) * Math.min(1, dt * 4);
    cpy += (py - cpy) * Math.min(1, dt * 4);
    group.rotation.y = (reduce ? 0 : Math.sin(time * 0.3) * 0.1) + cpx * 0.3 + drag;
    camera.position.set(cpx * 0.7, 4.3 - cpy * 0.5, 8.6);
    camera.lookAt([0, 1.15, 0]);
  }

  function loop(now: number): void {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    step(dt);
    renderer.render({ scene, camera });
    let busy = Math.abs(dragV) > 0.01 || dragging;
    for (const t of tokens.values()) busy ||= t.phase === "drop" || t.phase === "lift";
    if (visible && (!reduce || busy) && (busy || performance.now() < idleUntil || !reduce)) frame = requestAnimationFrame(loop);
    else running = false;
  }

  function resize(): void {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.perspective({ aspect: w / h });
    if (!running) {
      step(0);
      renderer.render({ scene, camera });
    }
  }

  const onMove = (e: PointerEvent): void => {
    const r = host.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
    if (dragging) {
      const dx = ((e.clientX - lastX) / r.width) * 4;
      drag += dx;
      dragV = dx * 60;
      lastX = e.clientX;
    }
    kick();
  };
  const onDown = (e: PointerEvent): void => {
    dragging = true;
    lastX = e.clientX;
    host.setPointerCapture(e.pointerId);
  };
  const onUp = (): void => {
    dragging = false;
    kick();
  };
  const onLeave = (): void => {
    px = 0;
    py = 0;
    kick();
  };
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointerleave", onLeave);

  const resizer = new ResizeObserver(resize);
  resizer.observe(host);

  BASE_TILES.forEach((k, i) => later(() => add(k), reduce ? 0 : BASE_DROP_DELAY_MS + i * BASE_DROP_GAP_MS));
  let pick: AddonPick = options.initialPick;
  for (const id of ADDONS) if (pick[id]) GROUPS[id].forEach(add);
  resize();

  return {
    setPick(next) {
      for (const id of ADDONS) {
        if (next[id] === pick[id]) continue;
        const on = next[id];
        GROUPS[id].forEach((k, i) => later(() => (on ? add(k) : remove(k)), reduce ? 0 : i * ADDON_STAGGER_MS));
      }
      pick = next;
    },
    setVisible(next) {
      visible = next;
      if (visible) kick();
    },
    destroy() {
      destroyed = true;
      visible = false;
      running = false;
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      resizer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}
