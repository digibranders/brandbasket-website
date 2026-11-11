// lib/pricing.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES, type Currency, formatMoney } from "./currency";
import {
  basketPlans,
  type BasketPick,
  buildUsualPrice,
  extrasFor,
  GST_LABEL,
  GST_RATE,
  monitoringIncluded,
  monitoringPrice,
  monthlyTotal,
  PLAN_IDS,
  planPrice,
  planUsualPrice,
  samePick,
} from "./pricing";

const pick = (website: boolean, social: boolean, ads: boolean): BasketPick => ({ website, social, ads });

describe("plans", () => {
  it("prices every plan the same (owner, 2026-11-11: 2,999 rupees or $59)", () => {
    expect(PLAN_IDS.map((id) => planPrice(id, "INR"))).toEqual([2999, 2999, 2999]);
    expect(PLAN_IDS.map((id) => planPrice(id, "USD"))).toEqual([59, 59, 59]);
  });

  it.each(CURRENCIES)("keeps %s prices in whole units", (currency) => {
    for (const id of PLAN_IDS) expect(Number.isInteger(planPrice(id, currency))).toBe(true);
  });

  it("lists every plan, each sold on its own", () => {
    expect(PLAN_IDS).toEqual(["website", "social", "ads"]);
  });

  it("charges extras in each currency (owner, 2026-10-27 for dollars)", () => {
    expect(extrasFor("INR")).toEqual({ hour: 500, reel: 500, adBudgetCap: 10000 });
    expect(extrasFor("USD")).toEqual({ hour: 10, reel: 10, adBudgetCap: 120 });
  });
});

describe("usual prices", () => {
  it("holds the struck-through prices (owner, 2026-10-31)", () => {
    expect(PLAN_IDS.map((id) => planUsualPrice(id, "INR"))).toEqual([4999, 4999, 4999]);
    expect(PLAN_IDS.map((id) => planUsualPrice(id, "USD"))).toEqual([79, 79, 79]);
    expect(buildUsualPrice("INR")).toBe(35000);
    expect(buildUsualPrice("USD")).toBe(1200);
  });
  it("keeps every usual price above the real one", () => {
    for (const currency of CURRENCIES) for (const id of PLAN_IDS) expect(planUsualPrice(id, currency)).toBeGreaterThan(planPrice(id, currency));
  });
});

describe("samePick", () => {
  it("compares baskets by value", () => {
    expect(samePick(pick(true, false, false), { website: true, social: false, ads: false })).toBe(true);
    expect(samePick(pick(true, false, false), pick(true, true, false))).toBe(false);
  });
});

describe("baskets", () => {
  // Every rupee price includes 18% GST (owner, 2026-10-26); dollar prices carry no tax. A basket costs the plans added up:
  // there are no package discounts and no ad money (owner, 2026-11-11).
  const CASES: readonly (readonly [Currency, BasketPick, number])[] = [
    ["INR", pick(true, false, false), 2999],
    ["INR", pick(false, true, false), 2999],
    ["INR", pick(false, false, true), 2999],
    ["INR", pick(true, true, false), 5998],
    ["INR", pick(true, false, true), 5998],
    ["INR", pick(false, true, true), 5998],
    ["INR", pick(true, true, true), 8997],
    ["USD", pick(true, false, false), 59],
    ["USD", pick(false, true, false), 59],
    ["USD", pick(false, false, true), 59],
    ["USD", pick(true, true, false), 118],
    ["USD", pick(true, false, true), 118],
    ["USD", pick(false, true, true), 118],
    ["USD", pick(true, true, true), 177],
  ];

  it.each(CASES)("prices %s %o at the plans added up", (currency, basket, total) => {
    expect(monthlyTotal(basket, currency)).toBe(total);
  });

  it("gives an empty basket no price", () => {
    expect(monthlyTotal(pick(false, false, false), "INR")).toBe(0);
  });

  it("lists plans in catalogue order", () => {
    expect(basketPlans(pick(false, true, true)).map((p) => p.id)).toEqual(["social", "ads"]);
  });
});

describe("offers", () => {
  it("has no package discounts, package prices or ad credit", async () => {
    const pricing = await import("./pricing");
    for (const name of ["PACKAGES", "packageFor", "packageTotal", "packageSaving", "adCreditFor", "nextPlanToAdd"]) expect(pricing).not.toHaveProperty(name);
  });
  it("includes monitoring only when every plan is in the basket", () => {
    expect(monitoringIncluded(pick(true, true, true))).toBe(true);
    for (const basket of [pick(true, false, false), pick(true, true, false), pick(false, true, true)]) expect(monitoringIncluded(basket)).toBe(false);
  });
  it("prices monitoring at 6,000 rupees or $99 (owner, 2026-11-11)", () => {
    expect(monitoringPrice("INR")).toBe(6000);
    expect(monitoringPrice("USD")).toBe(99);
  });
});

describe("GST", () => {
  it("is 18%, already inside every rupee price", () => {
    expect(GST_RATE).toBe(0.18);
    expect(GST_LABEL).toBe("18%");
  });
});

describe("formatMoney", () => {
  it("uses Indian digit grouping for rupees", () => {
    expect(formatMoney(3000, "INR")).toBe("₹3,000");
    expect(formatMoney(47200, "INR")).toBe("₹47,200");
    expect(formatMoney(120000, "INR")).toBe("₹1,20,000");
  });

  it("prints dollars with a dollar sign and thousands commas", () => {
    expect(formatMoney(59, "USD")).toBe("$59");
    expect(formatMoney(1200, "USD")).toBe("$1,200");
    expect(formatMoney(0, "USD")).toBe("$0");
  });

  it("prints amounts with minor units to exactly two decimals", () => {
    expect(formatMoney(3538.82, "INR")).toBe("₹3,538.82");
    expect(formatMoney(3538.8, "INR")).toBe("₹3,538.80");
    expect(formatMoney(64.5, "USD")).toBe("$64.50");
  });
});
