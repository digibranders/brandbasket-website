// content/pricing.test.ts
import * as Phosphor from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import { ADDON_CHANGE, CANCELLATION_NOTICE, OWNERSHIP_ON_CANCEL } from "./legal/cancellation";
import { AD_BUDGET_CAP, EXTRA_HOURLY_RATE, formatInr, monthlyTotal, PACKAGES, PLANS } from "@/lib/pricing";
import { COMPARE, GOOD_TO_KNOW, PLAN_DETAILS, PRICING_FAQ, PRICING_HERO } from "./pricing";

describe("pricing content", () => {
  it("keeps the locked hero headline", () => {
    expect(`${PRICING_HERO.title} ${PRICING_HERO.accent}`).toBe("Simple monthly plans. Start with your website.");
  });
  it("has the item counts of the mock", () => {
    expect(PRICING_FAQ).toHaveLength(5);
    expect(GOOD_TO_KNOW).toHaveLength(4);
    expect(PLAN_DETAILS).toHaveLength(3);
  });
  it("prices each comparison column from its package", () => {
    expect(COMPARE.columns).toHaveLength(PACKAGES.length);
    PACKAGES.forEach((pkg, i) => {
      expect(COMPARE.columns[i]?.id).toBe(pkg.id);
      expect(COMPARE.columns[i]?.price).toBe(formatInr(monthlyTotal(pkg.addons)));
    });
  });
  it("tells the reader that add-ons chosen at sign-up are 5% off", () => {
    expect(COMPARE.lede).toBe("Four ways to combine the plans. Every price is monthly, before GST. Add-ons chosen as you start are 5% off.");
  });
  it("has one cell per package in every comparison row", () => {
    for (const group of COMPARE.groups) for (const row of group.rows) expect(row.cells).toHaveLength(PACKAGES.length);
  });
  it("includes the ranking and tracking row on Search packages only", () => {
    const row = COMPARE.groups.flatMap((g) => g.rows).find((r) => r.label === "Ranking, traffic and enquiry tracking");
    expect(row?.cells).toEqual(PACKAGES.map((p) => p.addons.search));
  });
  it("builds plan summaries and caps from lib/pricing", () => {
    for (const detail of PLAN_DETAILS) expect(detail.summary).toContain(formatInr(PLANS[detail.id].monthly));
    const text = JSON.stringify([PLAN_DETAILS, GOOD_TO_KNOW, PRICING_FAQ, COMPARE.groups]);
    expect(text).toContain(formatInr(AD_BUDGET_CAP));
    expect(text).toContain(formatInr(EXTRA_HOURLY_RATE));
  });
  it("states cancellation and add-on changes exactly as the legal constants do", () => {
    const text = JSON.stringify([GOOD_TO_KNOW, PRICING_FAQ]);
    for (const rule of [CANCELLATION_NOTICE, OWNERSHIP_ON_CANCEL, ADDON_CHANGE]) expect(text).toContain(rule);
  });
  it("uses Phosphor icons that exist", () => {
    for (const key of [...PLAN_DETAILS.map((d) => d.icon), ...GOOD_TO_KNOW.map((g) => g.icon)]) expect(Phosphor).toHaveProperty(key);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ PRICING_HERO, COMPARE, PLAN_DETAILS, GOOD_TO_KNOW, PRICING_FAQ })).not.toMatch(/[\u2013\u2014]/);
  });
});
