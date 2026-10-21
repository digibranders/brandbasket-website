// components/basket/scene/scene.ts
import { Camera, Mesh, Plane, Program, Renderer, Texture, Torus, Transform } from "ogl";
import { ADDONS, type AddonPick } from "@/lib/pricing";
import { iconFace } from "./faces";
import { siteFace } from "./site-preview";
export { loadFaceFonts } from "./faces";
import { catmull, lathe, roundedTile } from "./geometry";
import { hex, material, SHADOW } from "./materials";
import { SHADOW_FRAG, VERT } from "./shaders";
import { createShadowLighting } from "./shadow-lighting";
import { BASE_TILES, DEFS, GROUPS, type TileDef, type TileId } from "./tokens";
import type { BasketScene, BasketSceneOptions } from "./types";
import { bindingCanvas, weaveCanvas } from "./weave";

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
const INNER_PROFILE = catmull([[1.74, 1.42], [1.64, 1.02], [1.48, 0.45], [1.26, 0.13], [0.6, 0.09], [0.001, 0.09]], 6);
const BASE_DROP_DELAY_MS = 250;
const BASE_DROP_GAP_MS = 260;
const ADDON_STAGGER_MS = 180;
const IDLE_MS = 4000;
const SPIN_DAMPING = Math.log(25);
const MAX_SPIN_SPEED = 6;
const RELEASE_PAUSE_MS = 200;

/**
 * The woven 3D basket from the mock. Appends its canvas to `host`, drops the website tiles in, then keeps the add-on
 * tiles in step with `setPick`. Await `loadFaceFonts()` first and pass its result as `labelFamily`, so the faces draw
 * with the right glyphs.
 */
export function createBasketScene(host: HTMLElement, image: HTMLImageElement | null, options: BasketSceneOptions): BasketScene {
  const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, antialias: true, premultipliedAlpha: false });
  try {
    return mountScene(renderer, host, image, options);
  } catch (error) {
    // Free the context a half-built scene would otherwise hold; browsers cap live WebGL contexts.
    renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
    renderer.gl.canvas.remove();
    throw error;
  }
}

function mountScene(renderer: Renderer, host: HTMLElement, image: HTMLImageElement | null, options: BasketSceneOptions): BasketScene {
  const reduce = options.reducedMotion;
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

  const body = new Mesh(gl, { geometry: lathe(gl, PROFILE, 128), program: material(gl, white, { map: weave, repeat: [14, 2.8], rough: 0.88, interior: 1, relief: 2.4 }) });
  body.setParent(group);
  const lining = new Mesh(gl, {
    geometry: lathe(gl, INNER_PROFILE, 128),
    program: material(gl, white, { map: weave, repeat: [14, 2.8], rough: 0.9, interior: 2, relief: 2.4 }),
  });
  lining.setParent(group);
  const binding = new Texture(gl, { image: bindingCanvas(), wrapS: gl.REPEAT, wrapT: gl.REPEAT, anisotropy: 8 });
  const caneMat = material(gl, white, { map: binding, repeat: [180, 1], rough: 0.8 });
  const handleMat = material(gl, white, { map: binding, repeat: [100, 1], rough: 0.82 });
  const rim = new Mesh(gl, { geometry: new Torus(gl, { radius: 1.82, tube: 0.085, radialSegments: 24, tubularSegments: 192 }), program: caneMat });
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.42;
  rim.setParent(group);
  const handle = new Mesh(gl, { geometry: new Torus(gl, { radius: 1.74, tube: 0.065, radialSegments: 24, tubularSegments: 144, arc: Math.PI }), program: handleMat });
  handle.position.y = 1.37;
  handle.rotation.y = 0.13;
  handle.setParent(group);
  // Bound sockets bury the cut handle ends into the basket's reinforced mouth.
  const socketMat = material(gl, white, { color: hex("#a47b4f"), rough: 0.85 });
  const socketGeo = new Torus(gl, { radius: 0.068, tube: 0.018, radialSegments: 10, tubularSegments: 24 });
  for (const side of [-1, 1]) {
    for (let ring = 0; ring < 5; ring++) {
      const socket = new Mesh(gl, { geometry: socketGeo, program: socketMat });
      socket.rotation.x = Math.PI / 2;
      socket.position.set(side * 1.74 * Math.cos(0.13), 1.36 + ring * 0.027, -side * 1.74 * Math.sin(0.13));
      socket.setParent(group);
    }
  }

  const shadowProg = new Program(gl, {
    vertex: VERT,
    fragment: SHADOW_FRAG,
    transparent: true,
    depthWrite: false,
    cullFace: null,
    uniforms: { uStrength: { value: SHADOW.strength }, uTint: { value: SHADOW.tint } },
  });
  const shadow = new Mesh(gl, { geometry: new Plane(gl, { width: 4.4, height: 4.4 }), program: shadowProg });
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.06, -0.035, 0.08);
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
    const face = new Texture(gl, { image: "side" in d ? siteFace(image, d.h / d.w, options.labelFamily) : iconFace(d.accent, d.glyph, d.label, options.labelFamily, d.h / d.w), anisotropy: 8 });
    const geo = roundedTile(gl, d.w, d.h, 0.14, 0.09);
    const node = new Transform();
    node.setParent(group);
    new Mesh(gl, { geometry: geo.caps, program: material(gl, white, { map: face, rough: 0.78 }) }).setParent(node);
    const edge = hex("side" in d ? d.side : d.accent);
    new Mesh(gl, { geometry: geo.sides, program: material(gl, white, { color: edge, rough: 0.85 }) }).setParent(node);
    node.visible = false;
    tokens.set(id, { node, d, y: 0, vy: 0, phase: "off", s: 1 });
  }
  const renderCastShadows = createShadowLighting(gl, scene, group);

  let running = false, visible = false, destroyed = false, last = performance.now(), time = 0, idleUntil = 0, frame = 0;
  let drag = 0, dragV = 0, dragging = false, lastX = 0, lastMoveAt = 0;
  let activePointer: number | undefined;

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
      const a = Math.min(1, dt * 7), wob = t.phase === "rest" && !reduce ? Math.sin(time * 1.4 + r[0] * 3) * 0.006 : 0;
      m.rotation.x += (t.d.rx - m.rotation.x) * a;
      m.rotation.y += (t.d.ry - m.rotation.y) * a;
      m.rotation.z += (t.d.rz + wob - m.rotation.z) * a;
    }
    if (!dragging && dragV !== 0) {
      const decay = Math.exp(-SPIN_DAMPING * dt);
      drag += dragV * (1 - decay) / SPIN_DAMPING;
      dragV *= decay;
      if (Math.abs(dragV) < 0.005) dragV = 0;
    }
    group.rotation.y = (reduce ? 0 : Math.sin(time * 0.3) * 0.035) + drag;
    camera.position.set(0, 4.3, 8.6);
    camera.lookAt([0, 1.15, 0]);
  }

  function loop(now: number): void {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    step(dt);
    renderCastShadows();
    renderer.render({ scene, camera });
    let busy = dragging || dragV !== 0;
    for (const t of tokens.values()) busy ||= t.phase === "drop" || t.phase === "lift";
    if (visible && (!reduce || busy) && (busy || performance.now() < idleUntil || !reduce)) frame = requestAnimationFrame(loop);
    else running = false;
  }

  function resize(): void {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    // setSize writes pixel sizes inline; keep the canvas fluid so the stage can shrink again (the mock used !important).
    canvas.style.width = canvas.style.height = "100%";
    camera.perspective({ aspect: w / h });
    if (!running) {
      step(0);
      renderCastShadows();
      renderer.render({ scene, camera });
    }
  }

  // Everything that can throw (first render included) runs before listeners, observers and timers exist.
  let pick: AddonPick = options.initialPick;
  for (const id of ADDONS) if (pick[id]) GROUPS[id].forEach(add);
  resize();

  const previousCursor = host.style.cursor;
  const previousUserSelect = host.style.userSelect;
  host.style.cursor = "grab";
  host.style.userSelect = "none";

  const endDrag = (coast = false): void => {
    // Momentum is independent of pointer ownership; interrupted or paused drags stop cleanly.
    if (!coast || performance.now() - lastMoveAt > RELEASE_PAUSE_MS) dragV = 0;
    if (activePointer === undefined) return;
    const pointer = activePointer;
    activePointer = undefined;
    dragging = false;
    host.style.cursor = "grab";
    if (host.hasPointerCapture(pointer)) host.releasePointerCapture(pointer);
    kick();
  };
  const onMove = (e: PointerEvent): void => {
    if (!dragging || e.pointerId !== activePointer) return;
    // A mouseup outside the browser may never reach us; button state is authoritative.
    if ((e.buttons & 1) === 0) {
      endDrag(true);
      return;
    }
    const r = host.getBoundingClientRect();
    const dx = ((e.clientX - lastX) / r.width) * 4;
    const now = performance.now();
    const elapsed = Math.max((now - lastMoveAt) / 1000, 1 / 120);
    dragV = Math.max(-MAX_SPIN_SPEED, Math.min(MAX_SPIN_SPEED, dx / elapsed));
    drag += dx;
    lastX = e.clientX;
    lastMoveAt = now;
    kick();
  };
  const onDown = (e: PointerEvent): void => {
    if (e.button !== 0 || !e.isPrimary || activePointer !== undefined) return;
    e.preventDefault();
    activePointer = e.pointerId;
    dragging = true;
    dragV = 0;
    lastX = e.clientX;
    lastMoveAt = performance.now();
    host.style.cursor = "grabbing";
    host.setPointerCapture(e.pointerId);
    kick();
  };
  const onUp = (e: PointerEvent): void => {
    if (e.pointerId === activePointer) endDrag(e.type === "pointerup");
  };
  const onBlur = (): void => endDrag();
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointercancel", onUp);
  host.addEventListener("lostpointercapture", onUp);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("blur", onBlur);

  const resizer = new ResizeObserver(resize);
  resizer.observe(host);

  BASE_TILES.forEach((k, i) => later(() => add(k), reduce ? 0 : BASE_DROP_DELAY_MS + i * BASE_DROP_GAP_MS));

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
      if (!visible) endDrag();
      if (visible) kick();
    },
    destroy() {
      destroyed = true;
      endDrag();
      visible = false;
      running = false;
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      resizer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("lostpointercapture", onUp);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onBlur);
      host.style.cursor = previousCursor;
      host.style.userSelect = previousUserSelect;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}
