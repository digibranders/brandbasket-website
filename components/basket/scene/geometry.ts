// components/basket/scene/geometry.ts
import { Geometry, type OGLRenderingContext } from "ogl";

export type Point = readonly [number, number];

/** Catmull-Rom spline through `pts`, `steps` samples per segment, ending on the last point. */
export function catmull(pts: readonly Point[], steps: number): Point[] {
  const out: Point[] = [];
  const last = pts.length - 1;
  for (let i = 0; i < last; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(last, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const at = (k: 0 | 1): number =>
        0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      out.push([at(0), at(1)]);
    }
  }
  const end = pts[last];
  if (end) out.push(end);
  return out;
}

function meshGeometry(gl: OGLRenderingContext, pos: number[], nor: number[], uvs: number[], idx: number[]): Geometry {
  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(pos) },
    normal: { size: 3, data: new Float32Array(nor) },
    uv: { size: 2, data: new Float32Array(uvs) },
    index: { data: new Uint16Array(idx) },
  });
}

/** Spins a (radius, height) profile around the y axis: the basket body. */
export function lathe(gl: OGLRenderingContext, profile: readonly Point[], segs: number): Geometry {
  const rings = profile.length, pos: number[] = [], nor: number[] = [], uvs: number[] = [], idx: number[] = [];
  const at = (i: number): Point => profile[Math.min(rings - 1, Math.max(0, i))];
  const len = [0];
  for (let i = 1; i < rings; i++) len.push(len[i - 1] + Math.hypot(at(i)[0] - at(i - 1)[0], at(i)[1] - at(i - 1)[1]));
  const total = len[rings - 1];
  for (let i = 0; i < rings; i++) {
    const a = at(i - 1), b = at(i + 1);
    let dr = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dr, dy) || 1;
    dr /= l;
    dy /= l;
    const nr = dy, ny = -dr;
    for (let s = 0; s <= segs; s++) {
      const ang = (s / segs) * Math.PI * 2, c = Math.cos(ang), si = Math.sin(ang);
      pos.push(at(i)[0] * c, at(i)[1], at(i)[0] * si);
      nor.push(nr * c, ny, nr * si);
      uvs.push(s / segs, len[i] / total);
    }
  }
  for (let i = 0; i < rings - 1; i++) {
    for (let s = 0; s < segs; s++) {
      const a = i * (segs + 1) + s, b = a + segs + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return meshGeometry(gl, pos, nor, uvs, idx);
}

export interface TileGeometry {
  /** Front and back faces: they carry the picture. */
  readonly caps: Geometry;
  /** The rounded rim: it carries the colour. */
  readonly sides: Geometry;
}

/** A rounded rectangle slab `w` by `h`, corner radius `r`, depth `d`. */
export function roundedTile(gl: OGLRenderingContext, w: number, h: number, r: number, d: number, seg = 8): TileGeometry {
  const bevel = Math.min(0.025, d / 4, r / 3);
  const out: [number, number, number, number][] = [];
  const corners: [number, number, number][] = [[w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, 90], [-w / 2 + r, -h / 2 + r, 180], [w / 2 - r, -h / 2 + r, 270]];
  for (const [cx, cy, a0] of corners) {
    for (let s = 0; s <= seg; s++) {
      const a = ((a0 + (s / seg) * 90) * Math.PI) / 180;
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), Math.cos(a), Math.sin(a)]);
    }
  }
  const n = out.length;
  const cp: number[] = [], cn: number[] = [], cu: number[] = [], ci: number[] = [];
  const faces: [number, number][] = [[d / 2, 1], [-d / 2, -1]];
  faces.forEach(([z, dir], f) => {
    const base = cp.length / 3;
    cp.push(0, 0, z);
    cn.push(0, 0, dir);
    cu.push(0.5, 0.5);
    for (const [ox, oy, nx, ny] of out) {
      const x = ox - nx * bevel, y = oy - ny * bevel;
      cp.push(x, y, z);
      cn.push(0, 0, dir);
      cu.push(f ? 1 - (x / w + 0.5) : x / w + 0.5, y / h + 0.5);
    }
    for (let i = 0; i < n; i++) {
      const a = base + 1 + i, b = base + 1 + ((i + 1) % n);
      if (f) ci.push(base, b, a);
      else ci.push(base, a, b);
    }
  });
  const sp: number[] = [], sn: number[] = [], su: number[] = [], si: number[] = [];
  // Sweep a quarter-circle from each flat cap into the side wall.
  const rings: [number, number, number, number][] = [];
  for (const dir of [1, -1]) {
    for (let j = 0; j <= 4; j++) {
      const angle = (dir === 1 ? j : 4 - j) / 4 * Math.PI / 2;
      rings.push([bevel * (1 - Math.sin(angle)), dir * (d / 2 - bevel + bevel * Math.cos(angle)), Math.sin(angle), dir * Math.cos(angle)]);
    }
  }
  rings.forEach(([inset, z, radial, nz], ring) => {
    out.forEach(([x, y, nx, ny], i) => {
      sp.push(x - nx * inset, y - ny * inset, z);
      sn.push(nx * radial, ny * radial, nz);
      su.push(i / n, ring / (rings.length - 1));
    });
  });
  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let i = 0; i < n; i++) {
      const a = ring * n + i, b = ring * n + (i + 1) % n;
      si.push(a, a + n, b, a + n, b + n, b);
    }
  }
  return { caps: meshGeometry(gl, cp, cn, cu, ci), sides: meshGeometry(gl, sp, sn, su, si) };
}
