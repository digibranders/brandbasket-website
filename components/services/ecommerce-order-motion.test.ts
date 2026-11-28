import { describe, expect, it } from "vitest";
import { ECOMMERCE_ORDER_STEPS } from "@/content/ecommerce";
import { LOADING_LANE, orderPlaybackElapsed, orderPlaybackFrame, orderStageTime, sampleOrderMotion } from "./ecommerce-order-motion";

describe("ecommerce order motion", () => {
  it("lifts the shelf parcel clear before setting it onto the rail", () => {
    const rack = sampleOrderMotion(0).parcel;
    const lift = sampleOrderMotion(.47).parcel;
    const rail = sampleOrderMotion(1).parcel;
    const next = sampleOrderMotion(1.55).parcel;
    expect(lift[1]).toBeGreaterThan(rack[1]);
    expect(lift[2]).toBeGreaterThan(rack[2]);
    expect(rail[1]).toBeCloseTo(.31);
    expect(next[1]).toBeCloseTo(rail[1]);
    expect(next[0]).toBeGreaterThan(rail[0]);
  });

  it("joins all handoffs without changing any object's pose at the boundary", () => {
    for (let stage = 1; stage < ECOMMERCE_ORDER_STEPS.length; stage++) {
      expect(orderStageTime(stage - 1, 1)).toBe(orderStageTime(stage, 0));
      const before = sampleOrderMotion(stage - .000001);
      const after = sampleOrderMotion(stage + .000001);
      for (const vector of ["parcel", "lift", "card", "trackingPin"] as const) {
        for (let axis = 0; axis < 3; axis++) {
          expect(before[vector][axis]).toBeCloseTo(after[vector][axis], 4);
        }
      }
      for (const scalar of ["packingLift", "awning", "confirmation", "receipt", "flaps", "label", "van", "cargoDoor"] as const) {
        expect(before[scalar]).toBeCloseTo(after[scalar], 4);
      }
    }
  });

  it("keeps the parcel attached to the van while it drives to the customer", () => {
    for (const time of [5.47, 5.56, 5.65, 5.76]) {
      const frame = sampleOrderMotion(time);
      expect(frame.parcel[0]).toBeCloseTo(frame.van + .24);
      expect(frame.parcel[2]).toBeCloseTo(LOADING_LANE);
    }
  });
});

describe("journey playback clock", () => {
  const durations = [2000, 3000, 1000];

  it("preserves the next stage's progress when a frame crosses a boundary", () => {
    expect(orderPlaybackFrame(2250, durations)).toEqual({ index: 1, time: 1 + 250 / 3000, done: false });
  });

  it("finishes on the last pose even if a browser frame is delayed", () => {
    expect(orderPlaybackFrame(9000, durations)).toEqual({ index: 2, time: 3, done: true });
  });

  it("can resume from a sampled pose without skipping a handoff", () => {
    const time = 1.6;
    expect(orderPlaybackFrame(orderPlaybackElapsed(time, durations), durations).time).toBeCloseTo(time);
  });
});

describe("physical handoff timing", () => {
  it("keeps the parcel on the raised lift until it can slide onto the bench", () => {
    const lift = sampleOrderMotion(4.33);
    const bench = sampleOrderMotion(4.39);
    expect(lift.parcel[0]).toBe(5.28);
    expect(lift.parcel[1] - lift.packingLift).toBeCloseTo(.26, 2);
    expect(bench.parcel[1] - bench.packingLift).toBeCloseTo(.265);
  });

  it("separates the lanes and follows the dispatch ramp into the road", () => {
    const conveyor = sampleOrderMotion(3).parcel;
    const rampTop = sampleOrderMotion(5.11).parcel;
    const rampMiddle = sampleOrderMotion(5.19).parcel;
    const road = sampleOrderMotion(5.27).parcel;
    expect(road[2] - conveyor[2]).toBeGreaterThan(3.75);
    expect(rampMiddle[2]).toBeCloseTo((rampTop[2] + road[2]) / 2);
    expect(rampMiddle[1]).toBeCloseTo((rampTop[1] + road[1]) / 2);
  });

  it("opens the cargo door before the parcel enters and closes it before driving", () => {
    const dock = sampleOrderMotion(5.27);
    const loaded = sampleOrderMotion(5.43);
    const departing = sampleOrderMotion(5.53);
    expect(dock.cargoDoor).toBe(1);
    expect(dock.parcel[0]).toBeGreaterThan(loaded.van + 1);
    expect(loaded.cargoDoor).toBe(1);
    expect(departing.cargoDoor).toBe(0);
    expect(departing.van).toBe(loaded.van);
    expect(sampleOrderMotion(5.7).van).toBeLessThan(departing.van);
  });

  it("stops, unloads through the rear, and leaves the same parcel in the customer's hands", () => {
    const parked = sampleOrderMotion(5.77);
    const unloaded = sampleOrderMotion(5.91);
    const delivered = sampleOrderMotion(6);
    expect(unloaded.van).toBe(parked.van);
    expect(unloaded.cargoDoor).toBe(1);
    expect(unloaded.parcel[0]).toBeGreaterThan(parked.van + 1);
    expect(delivered.parcel[2]).toBeLessThan(unloaded.parcel[2]);
    expect(delivered.parcel[1]).toBeGreaterThan(unloaded.parcel[1]);
    expect(unloaded.customerStep).toBeGreaterThan(0);
    expect(delivered.customerStep).toBe(0);
    expect(delivered.customerReach).toBe(1);
    expect(sampleOrderMotion(7).parcel).toEqual(delivered.parcel);
  });
});
