// lib/device-hints.test.ts
import { describe, expect, it } from "vitest";
import { shouldRender3D } from "./device-hints";

const ok = { webgl: true, reducedMotion: false, saveData: false, deviceMemory: 8 };

describe("shouldRender3D", () => {
  it("renders on a capable device", () => expect(shouldRender3D(ok)).toBe(true));
  it.each([
    ["no webgl", { ...ok, webgl: false }],
    ["reduced motion", { ...ok, reducedMotion: true }],
    ["save data", { ...ok, saveData: true }],
    ["4 GB or less", { ...ok, deviceMemory: 4 }],
  ])("keeps the poster with %s", (_, hints) => expect(shouldRender3D(hints)).toBe(false));
  it("renders when device memory is unknown (Safari, Firefox)", () => expect(shouldRender3D({ ...ok, deviceMemory: undefined })).toBe(true));
});
