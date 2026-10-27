// lib/currency.test.ts
import { describe, expect, it } from "vitest";
import { currencyForCountry, currencyFromSegment, currencySegment, formatMoney, isCurrency, visiblePath } from "./currency";

describe("currencyForCountry", () => {
  it("is rupees for India, for no country and for a blank one", () => {
    for (const country of ["IN", "in", " IN ", null, undefined, ""]) expect(currencyForCountry(country)).toBe("INR");
  });
  it("is dollars for every other country", () => {
    for (const country of ["US", "GB", "AE", "SG"]) expect(currencyForCountry(country)).toBe("USD");
  });
});

describe("route segments", () => {
  it("round-trips a currency and its folder name", () => {
    expect(currencySegment("USD")).toBe("usd");
    expect(currencyFromSegment("usd")).toBe("USD");
    expect(currencyFromSegment("inr")).toBe("INR");
  });
  it("refuses anything else", () => {
    expect(currencyFromSegment("eur")).toBeNull();
    expect(currencyFromSegment(undefined)).toBeNull();
    expect(isCurrency("usd")).toBe(false);
  });
});

describe("visiblePath", () => {
  it("drops the currency segment a prebuilt page is rendered under", () => {
    expect(visiblePath("/inr")).toBe("/");
    expect(visiblePath("/usd/pricing")).toBe("/pricing");
    expect(visiblePath("/inr/services/managed-website")).toBe("/services/managed-website");
  });
  it("leaves a real address alone", () => {
    expect(visiblePath("/")).toBe("/");
    expect(visiblePath("/pricing")).toBe("/pricing");
    expect(visiblePath("/blog/usd-prices")).toBe("/blog/usd-prices");
  });
});

describe("formatMoney", () => {
  it("prints each currency in its own style", () => {
    expect(formatMoney(2999, "INR")).toBe("₹2,999");
    expect(formatMoney(65, "USD")).toBe("$65");
  });
});
