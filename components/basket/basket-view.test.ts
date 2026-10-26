import { describe, expect, it } from "vitest";
import { basketNames, dockLabel } from "./basket-view";

describe("basketNames", () => {
  it("names a basket of the website alone", () => expect(basketNames({ website: true, growth: false, search: false })).toBe("Website"));
  it("lists the plans in catalogue order", () => expect(basketNames({ website: true, growth: true, search: true })).toBe("Website + Social + SEO"));
  it("skips the website when it is not picked", () => expect(basketNames({ website: false, growth: true, search: true })).toBe("Social + SEO"));
});

describe("dockLabel", () => {
  it("names the basket, its plan count and its monthly total for a screen reader", () => {
    expect(dockLabel(1, "₹3,538.82")).toBe("Review your basket: 1 plan, ₹3,538.82 a month, with GST");
    expect(dockLabel(3, "₹31,384.46")).toBe("Review your basket: 3 plans, ₹31,384.46 a month, with GST");
  });
});
