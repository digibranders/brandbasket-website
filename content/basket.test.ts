// content/basket.test.ts
import { describe, expect, it } from "vitest";
import { type BasketPick, PLAN_IDS, PLANS } from "@/lib/pricing";
import { BASKET_COPY, offerNote, PRICING_PLANS, saveLine } from "./basket";

const pick = (website: boolean, growth: boolean, search: boolean): BasketPick => ({ website, growth, search });

describe("basket copy", () => {
  it("has one pricing row per plan", () => {
    expect(Object.keys(PRICING_PLANS).sort()).toEqual([...PLAN_IDS].sort());
  });
  it("names the pricing rows as the plans", () => {
    for (const id of PLAN_IDS) expect(PRICING_PLANS[id].name).toBe(PLANS[id].name);
  });
  it("states the package offers as the mock does", () => {
    expect(BASKET_COPY.heroIntro).toBe("Build your basket. Two plans are 20% off or more, all three are 30% off.");
  });
  it("no longer mentions the sign-up offer", () => {
    expect(JSON.stringify({ BASKET_COPY, PRICING_PLANS })).not.toMatch(/sign-up|signup|as you start/);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ BASKET_COPY, PRICING_PLANS })).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("offerNote", () => {
  it.each([pick(true, false, false), pick(false, true, false), pick(false, false, true)])("invites a single plan to take a package", (one) => {
    expect(offerNote(one)).toBe("Take two plans and save 20% or more. Take all three and save 30%.");
  });
  it("prices Website + Social with its ad money for both", () => {
    expect(offerNote(pick(true, true, false))).toBe("Website + Social: 20% off, so you save ₹2,600 a month. Start with both and we add ₹2,000 a month to your ads.");
  });
  it("prices Website + SEO without ad money", () => {
    expect(offerNote(pick(true, false, true))).toBe("Website + SEO: 20% off, so you save ₹5,600 a month.");
  });
  it("prices Social + SEO with its ad money for both", () => {
    expect(offerNote(pick(false, true, true))).toBe("Social + SEO: 30% off, so you save ₹10,500 a month. Start with both and we add ₹2,000 a month to your ads.");
  });
  it("says all three for the full basket", () => {
    expect(offerNote(pick(true, true, true))).toBe("All three: 30% off, so you save ₹11,400 a month. Start with all three and we add ₹5,000 a month to your ads.");
  });
});

describe("saveLine", () => {
  it("is empty without a saving", () => {
    expect(saveLine(pick(true, false, false))).toBe("");
  });
  it("prints the monthly saving of a package", () => {
    expect(saveLine(pick(true, true, true))).toBe("You save ₹11,400 a month");
  });
});
