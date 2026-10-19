// content/home.test.ts
import * as Phosphor from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import { AD_BUDGET_CAP, formatInr, PLANS } from "@/lib/pricing";
import { CLOSING, FACTS, HERO, HOME_FAQ, INDUSTRIES_LINE, OFFER, REPORT, STEPS, WORK } from "./home";

describe("home content", () => {
  it("keeps the locked hero copy", () => {
    expect(`${HERO.headline} ${HERO.headlineAccent}`).toBe("Before They Visit You, They Visit Your Website.");
    expect(HERO.subhead).toBe("Your Business Has a Name. Give It a Place on the Internet for free.");
  });
  it("builds the offer line from the managed website price", () => {
    expect(OFFER.build.price).toBe("₹0");
    expect(OFFER.run.price).toBe(formatInr(PLANS.website.monthly));
    expect(OFFER.ariaLabel).toContain(OFFER.run.price);
  });
  it("has the section counts of the mock", () => {
    expect(FACTS).toHaveLength(4);
    expect(WORK.cases).toHaveLength(3);
    expect(STEPS).toHaveLength(3);
    expect(REPORT.kpis).toHaveLength(4);
    expect(INDUSTRIES_LINE.industries).toHaveLength(8);
    expect(HOME_FAQ).toHaveLength(4);
  });
  it("keeps the Example report chip", () => {
    expect(REPORT.chip).toBe("Example report");
  });
  it("gives every industry a unique slug and no href yet", () => {
    const slugs = INDUSTRIES_LINE.industries.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
    expect(JSON.stringify(INDUSTRIES_LINE)).not.toContain("href");
  });
  it("points every work case at a desktop and phone image", () => {
    for (const c of WORK.cases) {
      expect(c.desktop.src).toBe(`/work/full-${c.id}-desk.jpg`);
      expect(c.phone.src).toBe(`/work/full-${c.id}-mob.jpg`);
    }
  });
  it("builds the FAQ prices from lib/pricing", () => {
    const text = JSON.stringify(HOME_FAQ);
    expect(text).toContain(formatInr(PLANS.website.monthly));
    expect(text).toContain(formatInr(AD_BUDGET_CAP));
  });
  it("uses Phosphor icons that exist", () => {
    const keys = [...FACTS.map((f) => f.icon), ...INDUSTRIES_LINE.industries.map((i) => i.icon)];
    for (const key of keys) expect(Phosphor).toHaveProperty(key);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ HERO, FACTS, INDUSTRIES_LINE, WORK, REPORT, STEPS, HOME_FAQ, CLOSING })).not.toMatch(/[\u2013\u2014]/);
  });
});
