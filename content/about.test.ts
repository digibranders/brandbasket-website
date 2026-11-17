// content/about.test.ts
import { describe, expect, it } from "vitest";
import { ABOUT } from "./about";

describe("about content", () => {
  it("covers the three plans, each linking to its own page", () => {
    expect(ABOUT.what.items.map((item) => item.title)).toEqual(["Website build and management", "Social media management", "Paid ads management"]);
    expect(ABOUT.what.items.map((item) => item.plan)).toEqual(["website", "social", "ads"]);
  });
  it("prints no price, which would drift from lib/pricing.ts", () => {
    expect(JSON.stringify(ABOUT)).not.toMatch(/[\u20B9$]|\d,\d{3}/);
  });
  it("says results depend on more than the service", () => {
    expect(ABOUT.what.items.find((item) => item.title === "Paid ads management")?.body).toMatch(/results depend on/i);
  });
  it("keeps the doc's four reasons for choosing BrandBasket", () => {
    expect(ABOUT.why.items).toHaveLength(4);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify(ABOUT)).not.toMatch(/[\u2013\u2014]/);
  });
});
