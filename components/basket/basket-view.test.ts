import { describe, expect, it } from "vitest";
import { basketNames, dockLabel } from "./basket-view";

describe("basketNames", () => {
  it("names a basket of the website alone", () => expect(basketNames({ website: true, growth: false, search: false })).toBe("Website"));
  it("lists the plans in catalogue order", () => expect(basketNames({ website: true, growth: true, search: true })).toBe("Website + Social + SEO"));
  it("skips the website when it is not picked", () => expect(basketNames({ website: false, growth: true, search: true })).toBe("Social + SEO"));
});

describe("dockLabel", () => {
  it("names the basket, its plan count and its monthly total for a screen reader", () => {
    expect(dockLabel(1, "₹2,999")).toBe("Review your basket: 1 plan, ₹2,999 a month, incl. GST");
    expect(dockLabel(3, "₹30,398")).toBe("Review your basket: 3 plans, ₹30,398 a month, incl. GST");
  });
});
