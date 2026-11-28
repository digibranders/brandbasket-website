import { describe, expect, it } from "vitest";
import { fitOrderScene } from "./ecommerce-order-framing";

const artwork = { left: -6.2, right: 6.55, bottom: -3.2, top: 2.75 };

describe("compact order scene framing", () => {
  it("centers the artwork and closely fits its native aspect ratio", () => {
    const aspect = (artwork.right - artwork.left) / (artwork.top - artwork.bottom);
    const result = fitOrderScene(artwork, aspect);
    expect((result.left + result.right) / 2).toBeCloseTo(.175);
    expect((result.bottom + result.top) / 2).toBeCloseTo(-.225);
    expect((artwork.right - artwork.left) / (result.right - result.left)).toBeGreaterThan(.94);
    expect((artwork.top - artwork.bottom) / (result.top - result.bottom)).toBeGreaterThan(.94);
  });

  it.each([1.59, 1.85, 2.1, 2.6])("keeps the full illustration visible without distortion at aspect %s", (aspect) => {
    const result = fitOrderScene(artwork, aspect);
    expect((result.right - result.left) / (result.top - result.bottom)).toBeCloseTo(aspect);
    expect(result.left).toBeLessThan(artwork.left);
    expect(result.right).toBeGreaterThan(artwork.right);
    expect(result.bottom).toBeLessThan(artwork.bottom);
    expect(result.top).toBeGreaterThan(artwork.top);
  });
});
