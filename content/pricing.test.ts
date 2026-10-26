// content/pricing.test.ts
import { describe, expect, it } from "vitest";
import { CANCEL_ANSWER, PLAN_CHANGE_ANSWER } from "./legal/cancellation";
import { AD_BUDGET_CAP, formatInr, PACKAGES, PLANS, REEL_RATE } from "@/lib/pricing";
import { COMPARE, EVERY_PLAN, INCLUDED, PLAN_COLUMNS, PRICING_FAQ, PRICING_HERO } from "./pricing";

describe("pricing content", () => {
  it("keeps the locked hero headline", () => {
    expect(`${PRICING_HERO.title} ${PRICING_HERO.accent}`).toBe("Simple monthly plans. Start with your website.");
  });
  it("has the item counts of the mock", () => {
    expect(PRICING_FAQ).toHaveLength(6);
  });
  it("has one comparison column per plan, priced from lib/pricing", () => {
    expect(PLAN_COLUMNS.map((c) => c.id)).toEqual(["website", "growth", "search"]);
    for (const column of PLAN_COLUMNS) {
      expect(column.name).toBe(PLANS[column.id].name);
      expect(column.price).toBe(formatInr(PLANS[column.id].monthly));
    }
  });
  it("lists what each plan does and leaves out, and says it only once", () => {
    for (const column of PLAN_COLUMNS) {
      expect(column.does.length).toBeGreaterThan(5);
      expect(column.excludes.length).toBeGreaterThan(2);
      const all = [...column.does, ...column.excludes];
      expect(new Set(all).size).toBe(all.length);
    }
  });
  it("says up to 10 pages and the 2 edits on the website plan, and the 5 optimised pages on the search plan", () => {
    const [website, , search] = PLAN_COLUMNS;
    expect(website?.does).toContain("Up to 10 pages, built for you");
    expect(website?.does).toContain("2 edits a month, 30 minutes each");
    expect(search?.does.join(" ")).toContain("5 pages optimised a month");
  });
  it("builds the ad cap and the per-reel price into the social plan", () => {
    const social = PLAN_COLUMNS.find((c) => c.id === "growth");
    expect(social?.does.join(" ")).toContain(`up to ${formatInr(AD_BUDGET_CAP)} a month of your budget`);
    expect(social?.excludes.join(" ")).toContain(`${formatInr(REEL_RATE)} per reel`);
  });
  it("has the two parts of Everything included, without part headings", () => {
    expect(INCLUDED.build.groups).toHaveLength(3);
    expect(INCLUDED.run.groups).toHaveLength(4);
    expect(Object.keys(INCLUDED.build)).toEqual(["groups"]);
    expect(Object.keys(INCLUDED.run)).toEqual(["groups"]);
    const ids = [...INCLUDED.build.groups, ...INCLUDED.run.groups].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("states the 10 pages and the 2 edits in Everything included", () => {
    const text = JSON.stringify(INCLUDED);
    expect(text).toContain("Up to 10 pages, built for you");
    expect(text).toContain("2 edits a month, 30 minutes each");
    expect(text).not.toContain("small edits");
  });
  it("no longer claims a dashboard to edit your own site", () => {
    expect(JSON.stringify([INCLUDED, PLAN_COLUMNS, PRICING_FAQ]).toLowerCase()).not.toContain("dashboard");
  });
  it("leaves out claims that wait on an owner decision", () => {
    const text = JSON.stringify(INCLUDED).toLowerCase();
    for (const claim of ["we test that they restore", "restore earlier versions", "support hours", "privacy requests"]) expect(text).not.toContain(claim);
  });
  it("keeps the lede free of sign-up wording and states what every plan shares", () => {
    expect(COMPARE.lede).not.toMatch(/chosen as you start|sign-up/);
    expect(EVERY_PLAN.items).toHaveLength(4);
  });
  it("builds the ad cap and the per-reel price from lib/pricing", () => {
    const text = JSON.stringify([PRICING_FAQ, PLAN_COLUMNS]);
    expect(text).toContain(formatInr(AD_BUDGET_CAP));
    expect(text).toContain(`${formatInr(REEL_RATE)} per reel`);
  });
  it("states cancellation exactly as the legal constant does", () => {
    expect(PRICING_FAQ.find((f) => f.q === "Can I cancel?")?.a).toBe(CANCEL_ANSWER);
  });
  it("asks the pricing questions in the mock's order", () => {
    expect(PRICING_FAQ.map((f) => f.q)).toEqual([
      "Is the website build really free?",
      "Can I cancel?",
      "Do I need the website plan?",
      "Can I add or drop a plan later?",
      "Is ad spend included?",
      "Do you guarantee rankings or leads?",
    ]);
    expect(PRICING_FAQ[2]?.a).toBe("No. Every plan can be bought on its own. If you already have a website, Social + SEO is 20% off.");
  });
  it("keeps the Social ad money equal across the two-plan packages that include it", () => {
    // One amount covers both two-plan packages with Social, so they must stay equal.
    expect(PACKAGES.find((p) => p.id === "website-growth")?.adCredit).toBe(PACKAGES.find((p) => p.id === "growth-search")?.adCredit);
  });
  it("answers the plan change question with the shared legal wording", () => {
    expect(PRICING_FAQ.find((f) => f.q === "Can I add or drop a plan later?")?.a).toBe(PLAN_CHANGE_ANSWER);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ PRICING_HERO, COMPARE, PLAN_COLUMNS, EVERY_PLAN, INCLUDED, PRICING_FAQ })).not.toMatch(/[\u2013\u2014]/);
  });
});
