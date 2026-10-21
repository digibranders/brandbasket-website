// components/basket/scene/geometry.test.ts
import { describe, expect, it, vi } from "vitest";
import type { Geometry, OGLRenderingContext } from "ogl";
import { catmull, roundedTile } from "./geometry";

// Inspect the real generated vertex data without requiring a GPU in the unit runner.
vi.mock("ogl", () => ({
  Geometry: class {
    constructor(_gl: unknown, public attributes: Record<string, { data: Float32Array | Uint16Array }>) {}
  },
}));

function attributeData(geometry: Geometry, name: string): number[] {
  const data = geometry.attributes[name]?.data;
  if (!(data instanceof Float32Array || data instanceof Uint16Array)) {
    throw new TypeError(`Expected numeric ${name} geometry data`);
  }
  return Array.from(data);
}

describe("roundedTile", () => {
  const tile = (): ReturnType<typeof roundedTile> => roundedTile({} as OGLRenderingContext, 1.7, 1.1, 0.14, 0.14);

  it("rounds the front and back edges with intermediate depth rings", () => {
    const z = attributeData(tile().sides, "position").filter((_, i) => i % 3 === 2);
    expect(new Set(z).size).toBeGreaterThan(4);
    expect(Math.max(...z)).toBeCloseTo(0.07);
    expect(Math.min(...z)).toBeCloseTo(-0.07);
  });

  it("preserves slab dimensions and unit surface normals", () => {
    const { sides } = tile();
    const positions = attributeData(sides, "position");
    const normals = attributeData(sides, "normal");
    expect(Math.max(...positions.filter((_, i) => i % 3 === 0))).toBeCloseTo(0.85);
    expect(Math.max(...positions.filter((_, i) => i % 3 === 1))).toBeCloseTo(0.55);
    for (let i = 0; i < normals.length; i += 3) {
      expect(Math.hypot(normals[i], normals[i + 1], normals[i + 2])).toBeCloseTo(1);
    }
  });

  it("winds every nondegenerate triangle toward its surface normal", () => {
    for (const geometry of Object.values(tile())) {
      const p = attributeData(geometry, "position");
      const n = attributeData(geometry, "normal");
      const indices = attributeData(geometry, "index");
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
        const u = [p[b] - p[a], p[b + 1] - p[a + 1], p[b + 2] - p[a + 2]];
        const v = [p[c] - p[a], p[c + 1] - p[a + 1], p[c + 2] - p[a + 2]];
        const dot = (u[1] * v[2] - u[2] * v[1]) * n[a]
          + (u[2] * v[0] - u[0] * v[2]) * n[a + 1]
          + (u[0] * v[1] - u[1] * v[0]) * n[a + 2];
        expect(dot).toBeGreaterThanOrEqual(-1e-8);
      }
    }
  });
});

describe("catmull", () => {
  it("passes through the control points", () => {
    const pts: [number, number][] = [[0, 0], [1, 1], [2, 0], [3, 1]];
    const out = catmull(pts, 4);
    expect(out[0]).toEqual([0, 0]);
    expect(out.at(-1)).toEqual([3, 1]);
  });

  it("emits steps points per segment plus the last point", () => {
    const pts: [number, number][] = [[0, 0], [1, 1], [2, 0], [3, 1]];
    const out = catmull(pts, 4);
    expect(out).toHaveLength(3 * 4 + 1);
    expect(out[4]).toEqual([1, 1]);
    expect(out[8]).toEqual([2, 0]);
  });
});
