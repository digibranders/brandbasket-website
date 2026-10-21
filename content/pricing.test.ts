// content/pricing.test.ts
import * as Phosphor from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import { CANCEL_ANSWER, PLAN_CHANGE_ANSWER } from "./legal/cancellation";
import { AD_BUDGET_CAP, EXTRA_HOURLY_RATE, formatInr, PACKAGES, packageSaving, packageTotal, PLANS } from "@/lib/pricing";
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
      expect(COMPARE.columns[i]?.price).toBe(formatInr(packageTotal(pkg.pick)));
      expect(COMPARE.columns[i]?.note).toContain(formatInr(packageSaving(pkg.pick)));
    });
  });
  it("has four packages and no sign-up offer in the lede", () => {
    expect(COMPARE.columns).toHaveLength(4);
    expect(COMPARE.lede).not.toMatch(/chosen as you start|sign-up/);
  });
  it("shows the ad credit of each package", () => {
    const row = COMPARE.groups.flatMap((g) => g.rows).find((r) => r.label === "Ad credit from us, every month");
    expect(row?.cells).toEqual(PACKAGES.map((p) => (p.adCredit > 0 ? formatInr(p.adCredit) : "None")));
  });
  it("has one cell per package in every comparison row", () => {
    for (const group of COMPARE.groups) for (const row of group.rows) expect(row.cells).toHaveLength(PACKAGES.length);
  });
  it("includes the ranking and tracking row on Search packages only", () => {
    const row = COMPARE.groups.flatMap((g) => g.rows).find((r) => r.label === "Ranking, traffic and enquiry tracking");
    expect(row?.cells).toEqual(PACKAGES.map((p) => p.pick.search));
  });
  it("builds plan summaries and caps from lib/pricing", () => {
    for (const detail of PLAN_DETAILS) expect(detail.summary).toContain(formatInr(PLANS[detail.id].monthly));
    const text = JSON.stringify([PLAN_DETAILS, GOOD_TO_KNOW, PRICING_FAQ, COMPARE.groups]);
    expect(text).toContain(formatInr(AD_BUDGET_CAP));
    expect(text).toContain(formatInr(EXTRA_HOURLY_RATE));
  });
  it("states cancellation exactly as the legal constant does", () => {
    expect(PRICING_FAQ.find((f) => f.q === "Can I cancel?")?.a).toBe(CANCEL_ANSWER);
    expect(GOOD_TO_KNOW.find((g) => g.icon === "SignOut")).toEqual({
      icon: "SignOut",
      title: "Cancel anytime",
      body: "No notice period. Your website stays online until the end of the month you have paid for, and your domain stays yours.",
    });
  });
  it("answers the plan change question with the shared legal wording", () => {
    expect(PRICING_FAQ.find((f) => f.q === "Can I add or drop a plan later?")?.a).toBe(PLAN_CHANGE_ANSWER);
  });
  it("uses Phosphor icons that exist", () => {
    for (const key of [...PLAN_DETAILS.map((d) => d.icon), ...GOOD_TO_KNOW.map((g) => g.icon)]) expect(Phosphor).toHaveProperty(key);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ PRICING_HERO, COMPARE, PLAN_DETAILS, GOOD_TO_KNOW, PRICING_FAQ })).not.toMatch(/[\u2013\u2014]/);
  });
});
