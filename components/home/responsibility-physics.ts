// components/home/responsibility-physics.ts
// The live basket behind "We Take Responsibility": worry chips lie in a heap and are tossed into a woven basket.
// Ported from docs/design/homepage-final.html (frag.js); the tuning (arcs, rim clearance, two-phase lift) is from that mock.
import type * as MatterNS from "matter-js";

export type MatterLib = typeof MatterNS;

export interface BasketParts {
  readonly arena: HTMLElement;
  /** Receives the two basket SVGs; must not create a stacking context so chips can sit between them. */
  readonly svgHost: HTMLElement;
  readonly floor: HTMLElement;
  /** Every chip element, in label order. Chips marked data-phone="off" are hidden on a narrow stage. */
  readonly chips: readonly HTMLElement[];
  /** Called with how many are still on your mind and how many are in the basket. */
  readonly onCount: (left: number, caught: number) => void;
}

export interface BasketRun {
  readonly start: () => void;
  readonly stop: () => void;
}

interface Geometry {
  readonly Tw: number;
  readonly bh: number;
  readonly ins: number;
  readonly wall: number;
  readonly pad: number;
  readonly left: number;
  readonly topY: number;
}

interface Chip {
  readonly body: MatterNS.Body;
  readonly el: HTMLElement;
  readonly w: number;
  inside: boolean;
}

interface Lift {
  readonly chip: Chip;
  readonly tx: number;
  readonly ty: number;
}

interface Handles {
  raf: number;
  toss: ReturnType<typeof setInterval> | undefined;
  kick: ReturnType<typeof setTimeout> | undefined;
  up: ((e: MouseEvent) => void) | null;
}

const STEP_MS = 1000 / 60;
/** Pixels per step squared at gravity.y = 1. */
const GRAV = 0.001 * STEP_MS * STEP_MS;
const RATIO = 0.56;
const SMALL_RATIO = 0.58;
const MAX_TW = 360;
const BASKET_X = 0.73;
const SMALL_BELOW = 520;
const SVG_NS = "http://www.w3.org/2000/svg";

function weavePattern(id: string): string {
  return `<pattern id="${id}" width="44" height="24" patternUnits="userSpaceOnUse"><rect width="44" height="24" class="rb-p0"/>
    <rect x="2" y="2" width="19" height="9" rx="4" class="rb-p1"/><rect x="23" y="2" width="19" height="9" rx="4" class="rb-p2"/>
    <rect x="-9" y="13" width="19" height="9" rx="4" class="rb-p2"/><rect x="12" y="13" width="19" height="9" rx="4" class="rb-p1"/><rect x="33" y="13" width="19" height="9" rx="4" class="rb-p2"/></pattern>`;
}

/** The back and front halves of the basket; chips render between them so caught ones look inside. */
function basketMarkup(g: Geometry): string {
  const { Tw, bh, ins, wall, pad } = g;
  const fy = bh * 0.8;
  const xl = (y: number): number => (ins * y) / bh;
  const xr = (y: number): number => Tw - (ins * y) / bh;
  const box = `xmlns="${SVG_NS}" width="${Tw + pad * 2}" height="${bh + pad * 2}" viewBox="0 0 ${Tw + pad * 2} ${bh + pad * 2}"`;
  const pos = `left:${g.left - pad}px;top:${g.topY - pad}px`;
  const back = `<svg class="rb-svg back" ${box} style="${pos}" aria-hidden="true"><defs>${weavePattern("rbwvb")}</defs><g transform="translate(${pad} ${pad})">
    <polygon points="0,0 ${Tw},0 ${xr(bh)},${bh} ${xl(bh)},${bh}" fill="url(#rbwvb)"/>
    <polygon points="0,0 ${Tw},0 ${xr(bh)},${bh} ${xl(bh)},${bh}" class="rb-shade"/>
    <path d="M0 0 A ${Tw / 2} 12 0 0 1 ${Tw} 0" class="rb-rim-back"/></g></svg>`;
  const front = `<svg class="rb-svg front" ${box} style="${pos}" aria-hidden="true"><defs>${weavePattern("rbwvf")}</defs><g transform="translate(${pad} ${pad})">
    <polygon points="0,0 ${wall},0 ${xl(bh) + wall},${bh} ${xl(bh)},${bh}" fill="url(#rbwvf)"/>
    <polygon points="${Tw},0 ${Tw - wall},0 ${xr(bh) - wall},${bh} ${xr(bh)},${bh}" fill="url(#rbwvf)"/>
    <polygon points="${xl(fy)},${fy} ${xr(fy)},${fy} ${xr(bh)},${bh} ${xl(bh)},${bh}" fill="url(#rbwvf)"/>
    <path d="M${xl(fy)} ${fy} L${xr(fy)} ${fy}" class="rb-rim"/><path d="M${xl(fy) + 3} ${fy - 2.5} L${xr(fy) - 3} ${fy - 2.5}" class="rb-rim-hi"/>
    <rect x="${Tw / 2 - 56}" y="${(fy + bh) / 2 - 12}" width="112" height="26" rx="13" fill="var(--surface)"/>
    <text class="rb-plate" x="${Tw / 2}" y="${(fy + bh) / 2 + 6}"><tspan class="lt">brand</tspan>basket</text></g></svg>`;
  return back + front;
}

export function createBasket(M: MatterLib, parts: BasketParts): BasketRun {
  const { arena, svgHost, floor, chips: chipEls, onCount } = parts;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  let run: Handles | null = null;

  function stop(): void {
    if (!run) return;
    cancelAnimationFrame(run.raf);
    clearInterval(run.toss);
    clearTimeout(run.kick);
    if (run.up) window.removeEventListener("mouseup", run.up);
    svgHost.replaceChildren();
    for (const el of chipEls) { el.style.transform = ""; el.classList.remove("ok", "live"); }
    arena.classList.remove("done", "grabbing");
    onCount(chipEls.filter((el) => !el.hidden).length, 0);
    run = null;
  }

  function start(): void {
    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = M;
    stop();
    const W = arena.clientWidth;
    const H = arena.clientHeight;
    if (W < 200) return; // the section is hidden
    const small = W < SMALL_BELOW;
    const floorY = H - 16;
    // A phone basket is smaller, so it carries the six jobs owners ask about most.
    for (const el of chipEls) el.hidden = small && el.dataset.phone === "off";
    const shown = chipEls.filter((el) => !el.hidden);
    onCount(shown.length, 0);

    const Tw = Math.max(170, Math.min(MAX_TW, W * (small ? SMALL_RATIO : RATIO)));
    const base = { Tw, bh: Tw * 0.62, ins: Tw * 0.1, wall: 14, pad: 18 };
    const left = Math.min(W * BASKET_X, W - Tw / 2 - 8) - Tw / 2;
    const g: Geometry = { ...base, left, topY: floorY - base.bh };
    const bx = g.left + Tw / 2;
    const right = g.left + Tw;
    floor.style.top = `${floorY}px`;
    svgHost.innerHTML = basketMarkup(g);

    const slantedWall = (ax: number, ay: number, bx2: number, by: number, thick: number, side: "left" | "right"): MatterNS.Body => {
      const len = Math.hypot(bx2 - ax, by - ay);
      const dx = (bx2 - ax) / len;
      const dy = (by - ay) / len;
      const n = side === "left" ? [-dy, dx] : [dy, -dx];
      return Bodies.rectangle((ax + bx2) / 2 + (n[0] * thick) / 2, (ay + by) / 2 + (n[1] * thick) / 2, len, thick, { isStatic: true, angle: Math.atan2(by - ay, bx2 - ax), friction: 0.6 });
    };
    const engine = Engine.create({ gravity: { x: 0, y: 1 }, positionIterations: 12, velocityIterations: 10 });
    Composite.add(engine.world, [
      Bodies.rectangle(W / 2, floorY + 30, W * 3, 60, { isStatic: true, friction: 0.8 }),
      Bodies.rectangle(-30, H / 2, 60, H * 4, { isStatic: true }),
      Bodies.rectangle(W + 30, H / 2, 60, H * 4, { isStatic: true }),
      slantedWall(g.left + g.wall, g.topY, g.left + g.ins + g.wall, floorY, 12, "left"),
      slantedWall(right - g.wall, g.topY, right - g.ins - g.wall, floorY, 12, "right"),
    ]);

    const ch = small ? 30 : 36;
    const pileMax = g.left - (small ? 56 : 120);
    const chips: Chip[] = shown.map((el, i) => {
      const w = Math.round((54 + (el.textContent ?? "").length * 7.4) * (small ? 0.8 : 1));
      const x = reduced ? bx + (Math.random() - 0.5) * 40 : 10 + w / 2 + Math.random() * Math.max(10, pileMax - w - 10);
      const y = reduced ? g.topY - 30 - i * (ch + 6) : -40 - i * (ch + 40);
      const body = Bodies.rectangle(x, y, w, ch, { chamfer: { radius: ch / 2 - 1 }, restitution: 0.02, friction: 0.6, frictionAir: 0.0008, angle: (Math.random() - 0.5) * 1.2, density: 0.002 });
      el.style.width = `${w}px`;
      el.style.height = `${ch}px`;
      el.classList.add("live");
      Composite.add(engine.world, body);
      return { body, el, w, inside: false };
    });

    const state = { dragging: false, pausedUntil: 0 };
    let up: ((e: MouseEvent) => void) | null = null;
    if (fine && !reduced) {
      const mouse = Mouse.create(arena);
      // Matter's wheel listeners would swallow page scrolling over the stage.
      const wheel = (mouse as unknown as { mousewheel: EventListener }).mousewheel;
      for (const e of ["mousewheel", "DOMMouseScroll", "wheel"]) arena.removeEventListener(e, wheel);
      const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } as MatterNS.IConstraintDefinition });
      Composite.add(engine.world, mc);
      Events.on(mc, "startdrag", () => { state.dragging = true; arena.classList.add("grabbing"); });
      Events.on(mc, "enddrag", () => { state.dragging = false; state.pausedUntil = performance.now() + 2400; arena.classList.remove("grabbing"); });
      up = (mouse as unknown as { mouseup: (e: MouseEvent) => void }).mouseup;
      window.addEventListener("mouseup", up);
    }

    const paint = (): void => {
      let inCount = 0;
      for (const c of chips) {
        const p = c.body.position;
        c.el.style.transform = `translate(${p.x - c.w / 2}px, ${p.y - ch / 2}px) rotate(${c.body.angle}rad)`;
        const inMouth = p.x > g.left + g.wall + 4 && p.x < right - g.wall - 4;
        // A chip resting on top of a full basket still counts; one passing through the mouth does not.
        const inside = inMouth && (p.y > g.topY + 10 || (p.y > g.topY - 42 && c.body.speed < 1.2));
        if (inside !== c.inside) {
          c.inside = inside;
          c.el.classList.toggle("ok", inside);
        }
        if (inside) inCount++;
      }
      onCount(chips.length - inCount, inCount);
      arena.classList.toggle("done", inCount === chips.length);
    };

    const lifts: Lift[] = [];
    Events.on(engine, "beforeUpdate", () => {
      for (let i = lifts.length - 1; i >= 0; i--) {
        const lift = lifts[i];
        if (!lift) continue;
        const { chip, tx, ty } = lift;
        if (chip.body.velocity.y > -0.4) { // apex reached: aim down into the mouth
          const t = Math.sqrt((2 * Math.max(10, ty - chip.body.position.y)) / GRAV);
          Body.setVelocity(chip.body, { x: (tx - chip.body.position.x) / t, y: chip.body.velocity.y });
          lifts.splice(i, 1);
        }
      }
    });
    const toss = (): void => {
      if (state.dragging || performance.now() < state.pausedUntil) return;
      // Always lift the chip on top of the heap, so nothing is buried or blocked.
      const ready = chips.filter((c) => !c.inside && c.body.speed < 0.8 && c.body.position.y > floorY - ch * 4);
      ready.sort((a, b) => a.body.position.y - b.body.position.y);
      const c = ready[Math.floor(Math.random() * Math.min(2, ready.length))];
      if (!c) return;
      const p = c.body.position;
      const tx = bx + (Math.random() - 0.5) * Tw * 0.3;
      const ty = g.topY - 20;
      const dx = tx - p.x;
      const dy = ty - p.y;
      if (g.left - p.x < 330) {
        // Close to the wall: straight up past the rim, then swing across at the top.
        const rise = Math.max(0, -dy) + 120;
        Body.setVelocity(c.body, { x: 0, y: -Math.sqrt(2 * GRAV * rise) });
        lifts.push({ chip: c, tx, ty });
      } else {
        // Far away: take the lowest arc whose chip still clears the basket rim on the way in.
        let vx = 0;
        let vy = 0;
        for (const margin of [50, 90, 130, 170, 210, 260]) {
          vy = -Math.sqrt(2 * GRAV * (Math.max(0, -dy) + margin));
          const t = (-vy + Math.sqrt(vy * vy + 2 * GRAV * dy)) / GRAV;
          vx = dx / t;
          const tw = (g.left - c.w / 2 - 6 - p.x) / vx;
          const yAtRim = tw > 0 ? p.y + vy * tw + 0.5 * GRAV * tw * tw : p.y;
          if (yAtRim + ch / 2 < g.topY - 6 && p.y - (vy * vy) / (2 * GRAV) > 8) break;
        }
        Body.setVelocity(c.body, { x: vx, y: vy });
      }
      Body.setAngle(c.body, (Math.random() - 0.5) * 0.3);
      Body.setAngularVelocity(c.body, (Math.random() - 0.5) * 0.04);
    };

    if (reduced) {
      // No motion: settle the finished state at once.
      for (let k = 0; k < 1400; k++) Engine.update(engine, STEP_MS);
      paint();
      run = { raf: 0, toss: undefined, kick: undefined, up };
      return;
    }
    let last = performance.now();
    let acc = 0;
    const handles: Handles = { raf: 0, toss: undefined, kick: undefined, up };
    const loop = (now: number): void => {
      acc = Math.min(acc + now - last, STEP_MS * 4);
      last = now;
      while (acc >= STEP_MS) { Engine.update(engine, STEP_MS); acc -= STEP_MS; }
      paint();
      handles.raf = requestAnimationFrame(loop);
    };
    handles.raf = requestAnimationFrame(loop);
    handles.kick = setTimeout(() => { handles.toss = setInterval(toss, 480); }, 2200);
    run = handles;
  }

  return { start, stop };
}
