import { describe, expect, it } from "vitest";
import { basketNames } from "./basket-view";

describe("basketNames", () => {
  it("names a basket of the website alone", () => expect(basketNames({ website: true, growth: false, search: false })).toBe("Website"));
  it("lists the plans in catalogue order", () => expect(basketNames({ website: true, growth: true, search: true })).toBe("Website + Social + SEO"));
  it("skips the website when it is not picked", () => expect(basketNames({ website: false, growth: true, search: true })).toBe("Social + SEO"));
});
