// content/basket.test.ts
import { describe, expect, it } from "vitest";
import { PLAN_IDS, PLANS } from "@/lib/pricing";
import { BASKET_COPY, HOME_PLANS, PRICING_PLANS } from "./basket";

describe("basket copy", () => {
  it.each([
    ["PRICING_PLANS", PRICING_PLANS],
    ["HOME_PLANS", HOME_PLANS],
  ] as const)("%s has one row per plan", (_label, rows) => {
    expect(Object.keys(rows).sort()).toEqual([...PLAN_IDS].sort());
  });
  it("names the pricing rows as the plans", () => {
    for (const id of PLAN_IDS) expect(PRICING_PLANS[id].name).toBe(PLANS[id].name);
  });
  it("names the homepage rows as the plans, except the approved short search name", () => {
    expect(HOME_PLANS.website.name).toBe(PLANS.website.name);
    expect(HOME_PLANS.growth.name).toBe(PLANS.growth.name);
    expect(HOME_PLANS.search.name).toBe("Local SEO + AI search");
  });
  it("no longer mentions the sign-up offer", () => {
    expect(JSON.stringify({ BASKET_COPY, PRICING_PLANS, HOME_PLANS })).not.toMatch(/sign-up|signup|as you start/);
  });
});
