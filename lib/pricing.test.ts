// lib/pricing.test.ts
import { describe, expect, it } from "vitest";
import { ADDONS, basketPlans, firstPayment, formatInr, GST_RATE, monthlyTotal, PACKAGES, PLANS } from "./pricing";

describe("plans", () => {
  it("prices the three plans from the plans document", () => {
    expect(PLANS.website.monthly).toBe(3000);
    expect(PLANS.growth.monthly).toBe(7000);
    expect(PLANS.search.monthly).toBe(25000);
  });

  it("makes every add-on require the website plan", () => {
    for (const id of ADDONS) expect(PLANS[id].requires).toBe("website");
  });
});

describe("monthlyTotal", () => {
  it.each([
    [{ growth: false, search: false }, 3000],
    [{ growth: true, search: false }, 10000],
    [{ growth: false, search: true }, 28000],
    [{ growth: true, search: true }, 35000],
  ])("totals %o as %i", (picked, expected) => {
    expect(monthlyTotal(picked)).toBe(expected);
  });

  it("matches the four published packages", () => {
    expect(PACKAGES.map((p) => monthlyTotal(p.addons))).toEqual([3000, 10000, 28000, 35000]);
  });
});

describe("firstPayment", () => {
  it("charges one month plus 18% GST", () => {
    expect(GST_RATE).toBe(0.18);
    expect(firstPayment(3000)).toEqual({ months: 1, base: 3000, gst: 540, total: 3540 });
    expect(firstPayment(35000)).toEqual({ months: 1, base: 35000, gst: 6300, total: 41300 });
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
});
