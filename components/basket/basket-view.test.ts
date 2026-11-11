import { describe, expect, it } from "vitest";
import { basketNames, dockLabel } from "./basket-view";

describe("basketNames", () => {
  it("names a basket of the website alone", () => expect(basketNames({ website: true, social: false, ads: false })).toBe("Website"));
  it("lists the plans in catalogue order", () => expect(basketNames({ website: true, social: true, ads: true })).toBe("Website + Social + Ads"));
  it("skips the website when it is not picked", () => expect(basketNames({ website: false, social: true, ads: true })).toBe("Social + Ads"));
});

describe("dockLabel", () => {
  it("names the basket, its plan count and its monthly total for a screen reader, with GST in rupees", () => {
    expect(dockLabel(1, "₹2,999", "INR")).toBe("Review your basket: 1 plan, ₹2,999 a month, incl. GST");
    expect(dockLabel(3, "₹30,398", "INR")).toBe("Review your basket: 3 plans, ₹30,398 a month, incl. GST");
  });
  it("names the same basket in dollars without any tax wording", () => {
    expect(dockLabel(1, "$65", "USD")).toBe("Review your basket: 1 plan, $65 a month");
    expect(dockLabel(3, "$565", "USD")).toBe("Review your basket: 3 plans, $565 a month");
    expect(dockLabel(2, "$190", "USD")).not.toMatch(/gst|tax|incl\./i);
  });
});
