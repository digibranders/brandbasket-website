// lib/pricing.test.ts
import { describe, expect, it } from "vitest";
import { ADDONS, basketPlans, firstPayment, formatInr, GST_RATE, monthlyTotal, PACKAGES, PLANS } from "./pricing";

describe("plans", () => {
  it("prices the three plans from the plans document", () => {
    expect(PLANS.website.monthly).toBe(2999);
    expect(PLANS.growth.monthly).toBe(7000);
    expect(PLANS.search.monthly).toBe(25000);
  });

  it("makes every add-on require the website plan", () => {
    for (const id of ADDONS) expect(PLANS[id].requires).toBe("website");
  });
});

describe("monthlyTotal", () => {
  it.each([
    [{ growth: false, search: false }, 2999],
    [{ growth: true, search: false }, 9999],
    [{ growth: false, search: true }, 27999],
    [{ growth: true, search: true }, 34999],
  ])("totals %o as %i", (picked, expected) => {
    expect(monthlyTotal(picked)).toBe(expected);
  });

  it("matches the four published packages", () => {
    expect(PACKAGES.map((p) => monthlyTotal(p.addons))).toEqual([2999, 9999, 27999, 34999]);
  });
});

describe("firstPayment", () => {
  it("charges one month plus 18% GST", () => {
    expect(GST_RATE).toBe(0.18);
  });

  it.each([
    [2999, 539.82, 3538.82],
    [9999, 1799.82, 11798.82],
    [27999, 5039.82, 33038.82],
    [34999, 6299.82, 41298.82],
  ])("shows GST on %i to the paisa without rounding", (base, gst, total) => {
    expect(firstPayment(base)).toEqual({ months: 1, base, gst, total });
  });
});

describe("basketPlans", () => {
  it("always starts with the website plan", () => {
    expect(basketPlans({ growth: false, search: true }).map((p) => p.id)).toEqual(["website", "search"]);
  });
});

describe("formatInr", () => {
  it("uses Indian digit grouping", () => {
    expect(formatInr(3000)).toBe("₹3,000");
    expect(formatInr(47200)).toBe("₹47,200");
    expect(formatInr(120000)).toBe("₹1,20,000");
  });

  it("prints whole amounts without decimals", () => {
    expect(formatInr(2999)).toBe("₹2,999");
  });

  it("prints amounts with paise to exactly two decimals", () => {
    expect(formatInr(3538.82)).toBe("₹3,538.82");
    expect(formatInr(3538.8)).toBe("₹3,538.80");
    expect(formatInr(41298.82)).toBe("₹41,298.82");
  });
});
