// components/basket/scene/spin.test.ts
import { describe, expect, it } from "vitest";
import { MAX_SPIN_SPEED, recordSpin, releaseSpin, type SpinSample } from "./spin";

function drag(events: readonly (readonly [number, number])[]): SpinSample[] {
  const samples: SpinSample[] = [];
  for (const [t, angle] of events) recordSpin(samples, t, angle);
  return samples;
}

/** `count` events every `gap` ms, the angle following `angleAt(t)`. */
const stroke = (count: number, gap: number, angleAt: (t: number) => number): SpinSample[] =>
  drag(Array.from({ length: count }, (_, i) => [i * gap, angleAt(i * gap)] as const));

describe("releaseSpin", () => {
  it("reads the same speed whatever the pointer's report rate", () => {
    // 1 rad/s sampled every millisecond (a 1000 Hz mouse), every 8 ms (120 Hz), every 16 ms (60 Hz) and every 40 ms.
    for (const gap of [1, 8, 16, 40]) {
      const samples = stroke(Math.ceil(300 / gap), gap, (t) => t / 1000);
      expect(releaseSpin(samples, samples[samples.length - 1].t)).toBeCloseTo(1, 1);
    }
  });

  it("keeps the last 100 ms and always the last two events", () => {
    const samples = drag([[0, 0], [60, 1], [120, 2], [180, 3]]);
    expect(samples.map((s) => s.t)).toEqual([60, 120, 180]);
    expect(drag([[0, 0], [500, 1]])).toHaveLength(2);
  });

  it("follows the pointer's speed at release, not the stroke's average", () => {
    // 0.512 rad in 160 ms is 3.2 rad/s on average.
    expect(releaseSpin(stroke(11, 16, (t) => 0.00002 * t * t), 160)).toBeGreaterThan(5);
    expect(releaseSpin(stroke(11, 16, (t) => 0.512 * (1 - (1 - t / 160) ** 2)), 160)).toBeLessThan(1);
  });

  it("is still when the pointer paused before release or never moved", () => {
    expect(releaseSpin(drag([[0, 0], [16, 0.1], [32, 0.2]]), 32 + 300)).toBe(0);
    expect(releaseSpin(drag([[0, 0]]), 5)).toBe(0);
    expect(releaseSpin([], 5)).toBe(0);
  });

  it("caps a fling and signs it by direction", () => {
    expect(releaseSpin(drag([[0, 0], [40, 10]]), 40)).toBe(MAX_SPIN_SPEED);
    expect(releaseSpin(drag([[0, 0], [40, -10]]), 40)).toBe(-MAX_SPIN_SPEED);
  });

  it("does not read two near-simultaneous events as a fling", () => {
    expect(releaseSpin(drag([[0, 0], [2, 0.05]]), 2)).toBeCloseTo(3.125, 2);
  });
});
