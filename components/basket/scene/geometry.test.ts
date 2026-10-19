// components/basket/scene/geometry.test.ts
import { describe, expect, it } from "vitest";
import { catmull } from "./geometry";

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
