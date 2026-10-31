// lib/pricing.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES, type Currency, formatMoney } from "./currency";
import {
  adCreditFor,
  basketPlans,
  type BasketPick,
  buildUsualPrice,
  extrasFor,
  GST_LABEL,
  GST_RATE,
  monthlyTotal,
  nextPlanToAdd,
  PACKAGES,
  packageFor,
  packageSaving,
  packageTotal,
  PLAN_IDS,
  planPrice,
  planUsualPrice,
  samePick,
} from "./pricing";

const pick = (website: boolean, growth: boolean, search: boolean): BasketPick => ({ website, growth, search });

describe("plans", () => {
  it("prices the three plans (owner decisions, 2026-10-21 and 2026-10-27)", () => {
    expect(PLAN_IDS.map((id) => planPrice(id, "INR"))).toEqual([2999, 9999, 24999]);
    expect(PLAN_IDS.map((id) => planPrice(id, "USD"))).toEqual([65, 150, 350]);
  });

  it.each(CURRENCIES)("keeps %s prices in whole units and package offers in whole percent (the whole-unit saving relies on both)", (currency) => {
    for (const id of PLAN_IDS) expect(Number.isInteger(planPrice(id, currency))).toBe(true);
    for (const p of PACKAGES) {
      expect(Number.isInteger(p.percent)).toBe(true);
      expect(p.percent).toBeGreaterThanOrEqual(1);
      expect(p.percent).toBeLessThanOrEqual(99);
    }
  });

  it("lists every plan, each sold on its own", () => {
    expect(PLAN_IDS).toEqual(["website", "growth", "search"]);
  });

  it("charges extras in each currency (owner, 2026-10-27 for dollars)", () => {
    expect(extrasFor("INR")).toEqual({ hour: 500, reel: 500, adBudgetCap: 10000 });
    expect(extrasFor("USD")).toEqual({ hour: 10, reel: 10, adBudgetCap: 120 });
  });
});

describe("usual prices", () => {
  it("holds the struck-through prices (owner, 2026-10-31)", () => {
    expect(PLAN_IDS.map((id) => planUsualPrice(id, "INR"))).toEqual([4999, 14999, 39999]);
    expect(PLAN_IDS.map((id) => planUsualPrice(id, "USD"))).toEqual([99, 225, 549]);
    expect(buildUsualPrice("INR")).toBe(35000);
    expect(buildUsualPrice("USD")).toBe(1200);
  });
  it("keeps every usual price above the real one", () => {
    for (const currency of CURRENCIES) for (const id of PLAN_IDS) expect(planUsualPrice(id, currency)).toBeGreaterThan(planPrice(id, currency));
  });
});

describe("samePick", () => {
  it("compares baskets by value", () => {
    expect(samePick(pick(true, false, false), { website: true, growth: false, search: false })).toBe(true);
    expect(samePick(pick(true, false, false), pick(true, true, false))).toBe(false);
  });
});

describe("baskets", () => {
  // Every rupee price includes 18% GST (owner, 2026-10-26); dollar prices carry no tax. Either way, what a basket costs is what the customer pays.
  const CASES: readonly (readonly [Currency, BasketPick, number, number, number, number, string | null])[] = [
    ["INR", pick(true, false, false), 2999, 2999, 0, 0, null],
    ["INR", pick(false, true, false), 9999, 9999, 0, 0, null],
    ["INR", pick(false, false, true), 24999, 24999, 0, 0, null],
    ["INR", pick(true, true, false), 12998, 11699, 1299, 1500, "website-growth"],
    ["INR", pick(true, false, true), 27998, 25199, 2799, 0, "website-search"],
    ["INR", pick(false, true, true), 34998, 31499, 3499, 1500, "growth-search"],
    ["INR", pick(true, true, true), 37997, 30398, 7599, 3000, "everything"],
    ["USD", pick(true, false, false), 65, 65, 0, 0, null],
    ["USD", pick(false, true, false), 150, 150, 0, 0, null],
    ["USD", pick(false, false, true), 350, 350, 0, 0, null],
    ["USD", pick(true, true, false), 215, 194, 21, 30, "website-growth"],
    ["USD", pick(true, false, true), 415, 374, 41, 0, "website-search"],
    ["USD", pick(false, true, true), 500, 450, 50, 30, "growth-search"],
    ["USD", pick(true, true, true), 565, 452, 113, 60, "everything"],
  ];

  it.each(CASES)("prices %s %o", (currency, basket, list, monthly, saving, adCredit, packageId) => {
    expect(monthlyTotal(basket, currency)).toBe(list);
    expect(packageTotal(basket, currency)).toBe(monthly);
    expect(packageSaving(basket, currency)).toBe(saving);
    expect(adCreditFor(basket, currency)).toBe(adCredit);
    expect(packageFor(basket)?.id ?? null).toBe(packageId);
  });

  it("takes 10% off two plans and 20% off all three, from the whole price", () => {
    expect(PACKAGES.map((p) => [p.id, p.percent])).toEqual([["website-growth", 10], ["website-search", 10], ["growth-search", 10], ["everything", 20]]);
  });

  it.each(CURRENCIES)("rounds every %s saving down to the whole unit, so the customer pays the unit rounded up", (currency) => {
    for (const p of PACKAGES) {
      expect(Number.isInteger(packageSaving(p.pick, currency))).toBe(true);
      expect(packageSaving(p.pick, currency)).toBe(Math.floor((monthlyTotal(p.pick, currency) * p.percent) / 100));
      expect(packageTotal(p.pick, currency)).toBe(monthlyTotal(p.pick, currency) - packageSaving(p.pick, currency));
    }
  });

  it("gives ad money to Website + Social and Social + SEO (1,500 or $30) and to all three (3,000 or $60), never to Website + SEO", () => {
    expect(PACKAGES.map((p) => [p.id, p.adCredit.INR, p.adCredit.USD])).toEqual([
      ["website-growth", 1500, 30],
      ["website-search", 0, 0],
      ["growth-search", 1500, 30],
      ["everything", 3000, 60],
    ]);
  });

  it.each(CURRENCIES)("prices every %s two-plan package below all three except Social + SEO (owner's choice, 2026-10-22)", (currency) => {
    const everything = packageTotal(pick(true, true, true), currency);
    for (const p of PACKAGES.filter((p) => p.id !== "everything" && p.id !== "growth-search")) expect(packageTotal(p.pick, currency)).toBeLessThan(everything);
  });

  it("prices Social + SEO above all three in rupees (31,499 against 30,398) and $2 below it in dollars ($450 against $452)", () => {
    expect(packageTotal(pick(false, true, true), "INR")).toBeGreaterThan(packageTotal(pick(true, true, true), "INR"));
    expect(packageTotal(pick(true, true, true), "USD") - packageTotal(pick(false, true, true), "USD")).toBe(2);
  });

  it("gives an empty basket no price and no package", () => {
    expect(monthlyTotal(pick(false, false, false), "INR")).toBe(0);
    expect(packageFor(pick(false, false, false))).toBeNull();
  });

  it("lists plans in catalogue order", () => {
    expect(basketPlans(pick(false, true, true)).map((p) => p.id)).toEqual(["growth", "search"]);
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
    expect(formatMoney(65, "USD")).toBe("$65");
    expect(formatMoney(1200, "USD")).toBe("$1,200");
    expect(formatMoney(0, "USD")).toBe("$0");
  });

  it("prints amounts with minor units to exactly two decimals", () => {
    expect(formatMoney(3538.82, "INR")).toBe("₹3,538.82");
    expect(formatMoney(3538.8, "INR")).toBe("₹3,538.80");
    expect(formatMoney(64.5, "USD")).toBe("$64.50");
  });
});

describe("nextPlanToAdd", () => {
  it("picks the plan that adds the most saving and ad credit for its extra cost", () => {
    // Website alone: Social adds 1,299 saved + 1,500 ads for 8,700 more; SEO adds 2,799 for 22,200 more.
    expect(nextPlanToAdd(pick(true, false, false), "INR")).toEqual({ id: "growth", pick: pick(true, true, false), extra: 8700, saving: 1299, adCredit: 1500 });
    expect(nextPlanToAdd(pick(false, true, false), "INR")?.id).toBe("website");
    expect(nextPlanToAdd(pick(true, true, false), "INR")).toEqual({ id: "search", pick: pick(true, true, true), extra: 18699, saving: 7599, adCredit: 3000 });
  });
  it("prices the same choice in dollars", () => {
    expect(nextPlanToAdd(pick(true, false, false), "USD")).toEqual({ id: "growth", pick: pick(true, true, false), extra: 129, saving: 21, adCredit: 30 });
    expect(nextPlanToAdd(pick(true, true, false), "USD")).toEqual({ id: "search", pick: pick(true, true, true), extra: 258, saving: 113, adCredit: 60 });
  });
  it("reports the small extra when a package costs only a little more than the basket now", () => {
    // SEO alone is 24,999; Website + SEO is 25,199.
    expect(nextPlanToAdd(pick(false, false, true), "INR")).toMatchObject({ id: "website", extra: 200, saving: 2799, adCredit: 0 });
  });
  it("returns null when every plan is in the basket", () => {
    expect(nextPlanToAdd(pick(true, true, true), "INR")).toBeNull();
  });
});
