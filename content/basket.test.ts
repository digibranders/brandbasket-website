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
  it("states no offer: monitoring is no longer free with all three plans (owner, 2026-11-27)", () => {
    expect(BASKET_COPY.heroIntro).toBe("Build your basket. Pick the plans you want.");
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
  it.each(CURRENCIES)("prices monitoring as an optional extra, whatever is in the basket (%s)", (currency) => {
    expect(offerNote(currency, false)).toMatch(/^Dedicated Expert Monitoring is an optional extra at /);
    expect(offerNote(currency, true)).toMatch(/^Dedicated Expert Monitoring is in your basket at /);
  });
  it("prices monitoring in the page's currency", () => {
    expect(offerNote("INR", false)).toContain("₹6,000 a month");
    expect(offerNote("USD", false)).toContain("$99 a month");
  });
  it("offers no discount and no ad money", () => {
    for (const currency of CURRENCIES) expect(offerNote(currency, false)).not.toMatch(/% off|save|ad money|for your ads/i);
  });
});

describe("dollar copy never mentions tax", () => {
  it("has no GST, tax or incl. in any dollar string", () => {
    // Values only: the key names (inclGst) are code, not copy.
    const all = [Object.values(moneyCopy("USD")), Object.values(BASKET_COPY), Object.values(PRICING_PLANS).map((p) => Object.values(p)), offerNote("USD", false), offerNote("USD", true)];
    expect(JSON.stringify(all)).not.toMatch(/gst|tax|incl\./i);
  });
});
