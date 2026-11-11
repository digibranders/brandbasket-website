// content/basket.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES } from "@/lib/currency";
import { type BasketPick, PLAN_IDS, PLANS } from "@/lib/pricing";
import { BASKET_COPY, moneyCopy, offerNote, planCount, PRICING_PLANS } from "./basket";

const pick = (website: boolean, social: boolean, ads: boolean): BasketPick => ({ website, social, ads });

describe("basket copy", () => {
  it("has one pricing row per plan", () => {
    expect(Object.keys(PRICING_PLANS).sort()).toEqual([...PLAN_IDS].sort());
  });
  it("names the pricing rows as the plans", () => {
    for (const id of PLAN_IDS) expect(PRICING_PLANS[id].name).toBe(PLANS[id].name);
  });
  it("states the one offer, monitoring with all three plans (owner, 2026-11-11)", () => {
    expect(BASKET_COPY.heroIntro).toBe("Build your basket. Take all three plans and Dedicated Expert Monitoring is included.");
    expect(BASKET_COPY.startPlan).toBe("Start my plan");
    expect(BASKET_COPY.proceed).toBe("Proceed to checkout");
  });
  it("no longer mentions the sign-up offer", () => {
    expect(JSON.stringify({ BASKET_COPY, PRICING_PLANS })).not.toMatch(/sign-up|signup|as you start/);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ BASKET_COPY, PRICING_PLANS, INR: moneyCopy("INR"), USD: moneyCopy("USD") })).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("phone labels", () => {
  it("keeps the full wording and adds a shorter one for phones", () => {
    expect(BASKET_COPY.compare).toBe("Compare all plans");
    expect(BASKET_COPY.compareShort).toBe("Compare plans");
  });
});

describe("planCount", () => {
  it("counts the basket out of every plan", () => {
    expect(planCount(pick(true, false, false))).toBe("1 of 3 plans");
    expect(planCount(pick(true, true, true))).toBe("3 of 3 plans");
  });
});

describe("money copy", () => {
  it("keeps the rupee wording with GST", () => {
    expect(moneyCopy("INR")).toEqual({ inclGst: "a month, incl. GST", totalLabel: "You pay each month, incl. GST", phoneBarCaption: "a month, incl. GST" });
  });
  it("drops the GST phrase for dollars", () => {
    expect(moneyCopy("USD")).toEqual({ inclGst: "a month", totalLabel: "You pay each month", phoneBarCaption: "a month" });
  });
});

describe("offerNote", () => {
  it.each(CURRENCIES)("says monitoring is included only when all three plans are in the basket (%s)", (currency) => {
    expect(offerNote(pick(true, true, true), currency)).toBe("Dedicated Expert Monitoring is included with all three plans.");
    for (const p of [pick(true, false, false), pick(false, true, false), pick(false, false, true), pick(true, true, false), pick(true, false, true), pick(false, true, true)]) {
      expect(offerNote(p, currency)).toMatch(/^Pick all three plans and Dedicated Expert Monitoring is included\. Otherwise it is /);
    }
  });
  it("prices monitoring in the page's currency", () => {
    expect(offerNote(pick(true, false, false), "INR")).toContain("₹6,000 a month");
    expect(offerNote(pick(true, false, false), "USD")).toContain("$99 a month");
  });
  it("offers no discount and no ad money", () => {
    for (const currency of CURRENCIES) expect(offerNote(pick(true, true, false), currency)).not.toMatch(/% off|save|ad money|for your ads/i);
  });
});

describe("dollar copy never mentions tax", () => {
  it("has no GST, tax or incl. in any dollar string", () => {
    const picks = [pick(true, false, false), pick(false, true, false), pick(false, false, true), pick(true, true, false), pick(true, false, true), pick(false, true, true), pick(true, true, true)];
    // Values only: the key names (inclGst) are code, not copy.
    const all = [Object.values(moneyCopy("USD")), Object.values(BASKET_COPY), Object.values(PRICING_PLANS).map((p) => Object.values(p)), picks.map((p) => offerNote(p, "USD"))];
    expect(JSON.stringify(all)).not.toMatch(/gst|tax|incl\./i);
  });
});
