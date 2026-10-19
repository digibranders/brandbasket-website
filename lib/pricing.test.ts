// lib/pricing.test.ts
import { describe, expect, it } from "vitest";
import {
  ADDONS,
  basketPlans,
  firstPayment,
  formatInr,
  GST_LABEL,
  GST_RATE,
  monthlyTotal,
  PACKAGES,
  PLANS,
  SIGNUP_ADDON_DISCOUNT,
  signupAddonPrice,
  signupTotal,
} from "./pricing";

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

describe("sign-up add-on discount", () => {
  it("is 5% off add-ons chosen with the website", () => {
    expect(SIGNUP_ADDON_DISCOUNT).toBe(0.05);
    expect(signupAddonPrice("growth")).toBe(6650);
    expect(signupAddonPrice("search")).toBe(23750);
  });

  it.each([
    [{ growth: false, search: false }, 2999, 3538.82],
    [{ growth: true, search: false }, 9649, 11385.82],
    [{ growth: false, search: true }, 26749, 31563.82],
    [{ growth: true, search: true }, 33399, 39410.82],
  ])("totals %o at sign-up as %i, %d with GST", (picked, monthly, withGst) => {
    expect(signupTotal(picked)).toBe(monthly);
    expect(firstPayment(signupTotal(picked)).total).toBe(withGst);
  });

  it("never discounts the website plan", () => {
    expect(signupTotal({ growth: false, search: false })).toBe(PLANS.website.monthly);
    expect(signupTotal({ growth: true, search: false }) - signupAddonPrice("growth")).toBe(PLANS.website.monthly);
  });

  it("leaves list prices to monthlyTotal", () => {
    expect(monthlyTotal({ growth: true, search: true })).toBe(34999);
  });
});

describe("firstPayment", () => {
  it("charges one month plus 18% GST", () => {
    expect(GST_RATE).toBe(0.18);
  });

  it("prints the GST rate as 18% in copy", () => {
    expect(GST_LABEL).toBe("18%");
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
