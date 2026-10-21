// lib/pricing.test.ts
import { describe, expect, it } from "vitest";
import {
  adCreditFor,
  basketPlans,
  type BasketPick,
  firstPayment,
  formatInr,
  GST_LABEL,
  GST_RATE,
  monthlyTotal,
  PACKAGES,
  packageFor,
  packageSaving,
  packageTotal,
  PLAN_IDS,
  PLANS,
  samePick,
} from "./pricing";

const pick = (website: boolean, growth: boolean, search: boolean): BasketPick => ({ website, growth, search });

describe("plans", () => {
  it("prices the three plans (owner decision, 2026-10-21)", () => {
    expect(PLANS.website.monthly).toBe(2999);
    expect(PLANS.growth.monthly).toBe(9999);
    expect(PLANS.search.monthly).toBe(24999);
  });

  it("keeps prices in whole rupees and package offers in whole percent (the paise maths relies on both)", () => {
    for (const id of PLAN_IDS) expect(Number.isInteger(PLANS[id].monthly)).toBe(true);
    for (const p of PACKAGES) {
      expect(Number.isInteger(p.percent)).toBe(true);
      expect(p.percent).toBeGreaterThanOrEqual(1);
      expect(p.percent).toBeLessThanOrEqual(99);
    }
  });

  it("lists every plan, each sold on its own", () => {
    expect(PLAN_IDS).toEqual(["website", "growth", "search"]);
  });
});

describe("samePick", () => {
  it("compares baskets by value", () => {
    expect(samePick(pick(true, false, false), { website: true, growth: false, search: false })).toBe(true);
    expect(samePick(pick(true, false, false), pick(true, true, false))).toBe(false);
  });
});

describe("baskets", () => {
  it.each([
    [pick(true, false, false), 2999, 2999, 3538.82, 0, 0, null],
    [pick(false, true, false), 9999, 9999, 11798.82, 0, 0, null],
    [pick(false, false, true), 24999, 24999, 29498.82, 0, 0, null],
    [pick(true, true, false), 12998, 10398, 12269.64, 2600, 2000, "website-growth"],
    [pick(true, false, true), 27998, 22398, 26429.64, 5600, 0, "website-search"],
    [pick(false, true, true), 34998, 24498, 28907.64, 10500, 2000, "growth-search"],
    [pick(true, true, true), 37997, 26597, 31384.46, 11400, 5000, "everything"],
  ])("prices %o", (basket, list, monthly, withGst, saving, adCredit, packageId) => {
    expect(monthlyTotal(basket)).toBe(list);
    expect(packageTotal(basket)).toBe(monthly);
    expect(firstPayment(packageTotal(basket)).total).toBe(withGst);
    expect(packageSaving(basket)).toBe(saving);
    expect(adCreditFor(basket)).toBe(adCredit);
    expect(packageFor(basket)?.id ?? null).toBe(packageId);
  });

  it("rounds every package price down to the whole rupee", () => {
    for (const p of PACKAGES) {
      expect(Number.isInteger(packageTotal(p.pick))).toBe(true);
      expect(packageTotal(p.pick)).toBe(Math.floor((monthlyTotal(p.pick) * (100 - p.percent)) / 100));
    }
  });

  it("never prices a two-plan package above all three", () => {
    const everything = packageTotal(pick(true, true, true));
    for (const p of PACKAGES.filter((p) => p.id !== "everything")) expect(packageTotal(p.pick)).toBeLessThan(everything);
  });

  it("gives an empty basket no price and no package", () => {
    expect(monthlyTotal(pick(false, false, false))).toBe(0);
    expect(packageFor(pick(false, false, false))).toBeNull();
  });

  it("lists plans in catalogue order", () => {
    expect(basketPlans(pick(false, true, true)).map((p) => p.id)).toEqual(["growth", "search"]);
  });
});

describe("firstPayment", () => {
  it("charges one month plus 18% GST", () => {
    expect(GST_RATE).toBe(0.18);
    expect(GST_LABEL).toBe("18%");
  });

  it.each([
    [2999, 539.82, 3538.82],
    [10398, 1871.64, 12269.64],
    [26597, 4787.46, 31384.46],
    [2999, 539.82, 3538.82],
  ])("shows GST on %i to the paisa without rounding", (base, gst, total) => {
    expect(firstPayment(base)).toEqual({ months: 1, base, gst, total });
  });
});

describe("formatInr", () => {
  it("uses Indian digit grouping", () => {
    expect(formatInr(3000)).toBe("₹3,000");
    expect(formatInr(47200)).toBe("₹47,200");
    expect(formatInr(120000)).toBe("₹1,20,000");
  });

  it("prints amounts with paise to exactly two decimals", () => {
    expect(formatInr(3538.82)).toBe("₹3,538.82");
    expect(formatInr(3538.8)).toBe("₹3,538.80");
  });
});
