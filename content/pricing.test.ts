// content/pricing.test.ts
import { describe, expect, it } from "vitest";
import { CANCEL_ANSWER, PLAN_CHANGE_ANSWER } from "./legal/cancellation";
import { CURRENCIES, type Currency, formatMoney } from "@/lib/currency";
import { extrasFor, PACKAGES, PLANS, planPrice } from "@/lib/pricing";
import { compareCopy, everyPlan, planColumns, PRICING_HERO, pricingFaq } from "./pricing";

const TAX_WORDS = /gst|tax|incl\./i;

function allCopy(currency: Currency): string {
  return JSON.stringify({ PRICING_HERO, compare: compareCopy(currency), columns: planColumns(currency), every: everyPlan(currency), faq: pricingFaq(currency) });
}

describe("pricing content", () => {
  it("keeps the locked hero headline", () => {
    expect(`${PRICING_HERO.title} ${PRICING_HERO.accent}`).toBe("Simple monthly plans. Start with your website.");
  });
  it("keeps the Social ad money equal across the two-plan packages that include it", () => {
    // One amount covers both two-plan packages with Social, so they must stay equal.
    expect(PACKAGES.find((p) => p.id === "website-growth")?.adCredit).toEqual(PACKAGES.find((p) => p.id === "growth-search")?.adCredit);
  });

  describe.each(CURRENCIES)("in %s", (currency) => {
    const columns = planColumns(currency);
    const faq = pricingFaq(currency);
    const extras = extrasFor(currency);

    it("has the item counts of the mock", () => {
      expect(faq).toHaveLength(6);
      expect(everyPlan(currency).items).toHaveLength(4);
    });
    it("has one comparison column per plan, priced from lib/pricing", () => {
      expect(columns.map((c) => c.id)).toEqual(["website", "growth", "search"]);
      for (const column of columns) {
        expect(column.name).toBe(PLANS[column.id].name);
        expect(column.price).toBe(formatMoney(planPrice(column.id, currency), currency));
      }
    });
    it("lists what each plan does and leaves out, and says it only once", () => {
      for (const column of columns) {
        expect(column.does.length).toBeGreaterThan(5);
        expect(column.excludes.length).toBeGreaterThan(2);
        const all = [...column.does, ...column.excludes];
        expect(new Set(all).size).toBe(all.length);
      }
    });
    it("says up to 10 pages and the 2 edits on the website plan, and the 5 optimised pages on the search plan", () => {
      const [website, , search] = columns;
      expect(website?.does).toContain("Up to 10 pages, built for you");
      expect(website?.does).toContain("2 edits a month, 15 minutes each");
      expect(search?.does.join(" ")).toContain("5 pages optimised a month");
    });
    it("builds the ad cap and the per-reel price into the social plan and the FAQ", () => {
      const social = columns.find((c) => c.id === "growth");
      expect(social?.does.join(" ")).toContain(`up to ${formatMoney(extras.adBudgetCap, currency)} a month of your budget`);
      expect(social?.excludes.join(" ")).toContain(`${formatMoney(extras.reel, currency)} per reel`);
      expect(faq.find((f) => f.q === "Is ad spend included?")?.a).toContain(`up to ${formatMoney(extras.adBudgetCap, currency)} a month`);
    });
    it("states cancellation and plan changes exactly as the legal constants do", () => {
      expect(faq.find((f) => f.q === "Can I cancel?")?.a).toBe(CANCEL_ANSWER);
      expect(faq.find((f) => f.q === "Can I add or drop a plan later?")?.a).toBe(PLAN_CHANGE_ANSWER);
    });
    it("asks the pricing questions in the mock's order", () => {
      expect(faq.map((f) => f.q)).toEqual([
        "Is the website build really free?",
        "Can I cancel?",
        "Do I need the website plan?",
        "Can I add or drop a plan later?",
        "Is ad spend included?",
        "Do you guarantee rankings or leads?",
      ]);
      expect(faq[2]?.a).toBe("No. Every plan can be bought on its own. If you already have a website, Social + SEO is 10% off.");
    });
    it("has no em or en dashes", () => {
      expect(allCopy(currency)).not.toMatch(/[\u2013\u2014]/);
    });
  });

  describe("rupee copy", () => {
    it("keeps the approved prices and GST wording", () => {
      expect(planColumns("INR").map((c) => c.price)).toEqual(["₹2,999", "₹9,999", "₹24,999"]);
      expect(planColumns("INR").every((c) => c.priceNote === "a month, incl. GST")).toBe(true);
      expect(compareCopy("INR").lede).toBe("Three plans, each on its own. Prices are monthly, GST included. Add more than one and the prices drop.");
      expect(everyPlan("INR").items).toContain("Billed monthly, GST included");
      expect(pricingFaq("INR")[0]?.a).toBe("Yes. We design and build it for ₹0. The ₹2,999 monthly plan keeps it hosted, secure and up to date.");
      expect(pricingFaq("INR")[4]?.a).toContain("up to ₹10,000 a month");
      expect(planColumns("INR")[1]?.excludes).toContain("Reels and video editing, ₹500 per reel");
    });
  });

  describe("dollar copy", () => {
    it("prints dollar prices", () => {
      expect(planColumns("USD").map((c) => c.price)).toEqual(["$65", "$150", "$350"]);
      expect(planColumns("USD").every((c) => c.priceNote === "a month")).toBe(true);
      expect(compareCopy("USD").lede).toBe("Three plans, each on its own. Prices are monthly. Add more than one and the prices drop.");
      expect(pricingFaq("USD")[0]?.a).toBe("Yes. We design and build it for $0. The $65 monthly plan keeps it hosted, secure and up to date.");
      expect(pricingFaq("USD")[4]?.a).toContain("up to $120 a month");
      expect(planColumns("USD")[1]?.excludes).toContain("Reels and video editing, $10 per reel");
    });
    it("never mentions GST, tax or inclusive prices, and prints no rupee", () => {
      const text = allCopy("USD");
      expect(text).not.toMatch(TAX_WORDS);
      expect(text).not.toContain("₹");
    });
  });
});
