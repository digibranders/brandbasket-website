// content/basket.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES } from "@/lib/currency";
import { type BasketPick, PLAN_IDS, PLANS } from "@/lib/pricing";
import { BASKET_COPY, moneyCopy, offerNote, planCount, PRICING_PLANS, saveLine } from "./basket";

const pick = (website: boolean, growth: boolean, search: boolean): BasketPick => ({ website, growth, search });

describe("basket copy", () => {
  it("has one pricing row per plan", () => {
    expect(Object.keys(PRICING_PLANS).sort()).toEqual([...PLAN_IDS].sort());
  });
  it("names the pricing rows as the plans", () => {
    for (const id of PLAN_IDS) expect(PRICING_PLANS[id].name).toBe(PLANS[id].name);
  });
  it("states the package offers as the mock does", () => {
    expect(BASKET_COPY.heroIntro).toBe("Build your basket. Two plans are 10% off, all three are 20% off.");
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

describe("offerNote in rupees", () => {
  it.each([pick(true, false, false), pick(false, true, false), pick(false, false, true)])("invites a single plan to take a package", (one) => {
    expect(offerNote(one, "INR")).toBe("Take two plans and save 10%. Take all three and save 20%.");
  });
  it("prices Website + Social with its ad money for both", () => {
    expect(offerNote(pick(true, true, false), "INR")).toBe("Website + Social: 10% off, so you save ₹1,299 a month. Start with both and we add ₹1,500 a month to your ads.");
  });
  it("prices Website + SEO without ad money", () => {
    expect(offerNote(pick(true, false, true), "INR")).toBe("Website + SEO: 10% off, so you save ₹2,799 a month.");
  });
  it("prices Social + SEO with its ad money for both", () => {
    expect(offerNote(pick(false, true, true), "INR")).toBe("Social + SEO: 10% off, so you save ₹3,499 a month. Start with both and we add ₹1,500 a month to your ads.");
  });
  it("says all three for the full basket", () => {
    expect(offerNote(pick(true, true, true), "INR")).toBe("All three: 20% off, so you save ₹7,599 a month. Start with all three and we add ₹3,000 a month to your ads.");
  });
});

describe("offerNote in dollars", () => {
  it("invites a single plan to take a package", () => {
    expect(offerNote(pick(true, false, false), "USD")).toBe("Take two plans and save 10%. Take all three and save 20%.");
  });
  it("prices Website + Social with its ad money for both", () => {
    expect(offerNote(pick(true, true, false), "USD")).toBe("Website + Social: 10% off, so you save $21 a month. Start with both and we add $30 a month to your ads.");
  });
  it("prices Website + SEO without ad money", () => {
    expect(offerNote(pick(true, false, true), "USD")).toBe("Website + SEO: 10% off, so you save $41 a month.");
  });
  it("prices Social + SEO with its ad money for both", () => {
    expect(offerNote(pick(false, true, true), "USD")).toBe("Social + SEO: 10% off, so you save $50 a month. Start with both and we add $30 a month to your ads.");
  });
  it("says all three for the full basket", () => {
    expect(offerNote(pick(true, true, true), "USD")).toBe("All three: 20% off, so you save $113 a month. Start with all three and we add $60 a month to your ads.");
  });
});

describe("saveLine", () => {
  it("is empty without a saving", () => {
    for (const currency of CURRENCIES) expect(saveLine(pick(true, false, false), currency)).toBe("");
  });
  it("prints the monthly saving of a package", () => {
    expect(saveLine(pick(true, true, true), "INR")).toBe("You save ₹7,599 a month");
    expect(saveLine(pick(true, true, true), "USD")).toBe("You save $113 a month");
  });
});

describe("dollar copy never mentions tax", () => {
  it("has no GST, tax or incl. in any dollar string", () => {
    const picks = [pick(true, false, false), pick(false, true, false), pick(false, false, true), pick(true, true, false), pick(true, false, true), pick(false, true, true), pick(true, true, true)];
    // Values only: the key names (inclGst) are code, not copy.
    const all = [Object.values(moneyCopy("USD")), Object.values(BASKET_COPY), Object.values(PRICING_PLANS).map((p) => Object.values(p)), picks.map((p) => [offerNote(p, "USD"), saveLine(p, "USD")])];
    expect(JSON.stringify(all)).not.toMatch(/gst|tax|incl\./i);
  });
});
