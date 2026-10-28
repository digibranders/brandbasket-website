// content/about.test.ts
import { describe, expect, it } from "vitest";
import { ABOUT } from "./about";

describe("about content", () => {
  it("covers the five services", () => {
    expect(ABOUT.what.items.map((item) => item.title)).toEqual([
      "Website development",
      "Website management",
      "Social media management",
      "Paid advertising management",
      "Local SEO",
    ]);
  });
  it("floats one hero tile for each of the five services", () => {
    expect(ABOUT.heroTiles).toHaveLength(ABOUT.what.items.length);
  });
  it("prints no price, which would drift from lib/pricing.ts", () => {
    expect(JSON.stringify(ABOUT)).not.toMatch(/[\u20B9$]|\d,\d{3}/);
  });
  it("says results are not guaranteed", () => {
    expect(ABOUT.what.items.find((item) => item.title === "Local SEO")?.body).toMatch(/cannot be guaranteed/i);
  });
  it("keeps the doc's four reasons for choosing BrandBasket", () => {
    expect(ABOUT.why.items).toHaveLength(4);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify(ABOUT)).not.toMatch(/[\u2013\u2014]/);
  });
});
