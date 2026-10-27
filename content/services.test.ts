import { describe, expect, it } from "vitest";
import { CURRENCIES, formatMoney } from "@/lib/currency";
import { PACKAGES, PLAN_IDS, PLANS, planPrice } from "@/lib/pricing";
import { serviceRoute } from "@/lib/seo/routes";
import { SERVICE_COPY, SERVICE_PAGES, servicePageBySlug, servicePageFor, servicePageRefFor, servicePages, serviceMoneyCopy } from "./services";

const NO_TAX = /gst|tax|incl\./i;

describe("service pages", () => {
  it("lists the three pages, at their own addresses, without any price", () => {
    expect(SERVICE_PAGES.map((page) => page.id)).toEqual([...PLAN_IDS]);
    expect(SERVICE_PAGES.map((page) => page.path)).toEqual([
      "/services/managed-website",
      "/services/social-media-and-ads",
      "/services/local-seo-aeo",
    ]);
    for (const ref of SERVICE_PAGES) expect(servicePageRefFor(ref.id)).toBe(ref);
    expect(JSON.stringify(SERVICE_PAGES)).not.toMatch(/[₹$]/);
  });

  for (const currency of CURRENCIES) {
    describe(currency, () => {
      const pages = servicePages(currency);

      it("has one page for every plan, at its own address", () => {
        expect(pages.map((page) => page.id)).toEqual([...PLAN_IDS]);
        expect(pages.map((page) => page.path)).toEqual(SERVICE_PAGES.map((page) => page.path));
        for (const page of pages) {
          expect(page.path).toBe(`/services/${page.slug}`);
          expect(servicePageBySlug(page.slug, currency)).toBe(page);
          expect(servicePageFor(page.id, currency)).toBe(page);
        }
        expect(servicePageBySlug("nothing", currency)).toBeUndefined();
      });

      it("gives every page a search title and description of a sensible length", () => {
        for (const page of pages) {
          const route = serviceRoute(page);
          expect(route.title.length, route.title).toBeLessThanOrEqual(65);
          expect(route.description.length, route.description).toBeGreaterThanOrEqual(50);
          expect(route.description.length, route.description).toBeLessThanOrEqual(160);
          expect(route.title).toContain(formatMoney(planPrice(page.id, currency), currency));
        }
      });

      it("builds every price from the pricing module", () => {
        const text = JSON.stringify(pages);
        for (const id of PLAN_IDS) expect(text).toContain(formatMoney(planPrice(id, currency), currency));
        expect(text).not.toMatch(/plus (18% )?GST|\+ ?GST|before GST/i);
      });

      it("names the 15 minute edits on the website page and no other length", () => {
        const text = JSON.stringify(servicePageFor("website", currency));
        expect(text).toContain("15 minutes");
        expect(text).not.toContain("30 minutes");
      });

      it("says what ad money a package earns from the packages themselves", () => {
        const social = JSON.stringify(servicePageFor("growth", currency).spotlight);
        const credits = PACKAGES.filter((pkg) => pkg.adCredit[currency] > 0).map((pkg) => formatMoney(pkg.adCredit[currency], currency));
        expect(credits.length).toBeGreaterThan(0);
        for (const credit of credits) expect(social).toContain(credit);
      });

      it("keeps the same Not included lines as the pricing cards", () => {
        expect(servicePageFor("growth", currency).limits.items).toContain("Ad spend, paid to Meta by you");
        expect(servicePageFor("search", currency).limits.items).toContain("Guaranteed rankings or AI citations");
      });

      it("leaves no dash in any visible copy", () => {
        expect(JSON.stringify([pages, SERVICE_COPY, serviceMoneyCopy(currency)])).not.toMatch(new RegExp("[\\u2013\\u2014]"));
      });

      it("keeps every FAQ answer plain, with the cancel answer last", () => {
        for (const page of pages) {
          expect(page.faq.length).toBeGreaterThanOrEqual(4);
          expect(page.faq.at(-1)?.q).toBe("Can I cancel?");
        }
      });
    });
  }

  it("prints rupees with GST included on the rupee pages", () => {
    const text = JSON.stringify(servicePages("INR"));
    expect(text).toContain("₹2,999 a month, GST included");
    expect(text).toContain("₹10,000");
    expect(text).toContain("₹500 an hour");
    expect(text).toContain("₹500");
    expect(text).toContain("₹1,500");
    expect(text).toContain("₹3,000");
    expect(text).not.toContain("$");
    expect(serviceMoneyCopy("INR")).toEqual({
      perMonth: "a month, GST included",
      packagesLede: "Any two plans are 10% off and all three are 20% off. Every price includes GST.",
    });
  });

  it("prints dollars with no tax anywhere on the dollar pages", () => {
    const pages = servicePages("USD");
    const text = JSON.stringify([pages, serviceMoneyCopy("USD")]);
    expect(text).not.toMatch(NO_TAX);
    expect(text).not.toContain("₹");
    expect(text).not.toContain("DPDP");
    for (const price of ["$65", "$150", "$350", "$120", "$8 an hour", "$30", "$60"]) expect(text).toContain(price);
    expect(servicePageFor("growth", "USD").faq.find((item) => item.q === "What does a reel cost?")?.a).toContain("$8");
    expect(servicePageFor("website", "USD").lede).toContain("for $0");
    expect(serviceMoneyCopy("USD")).toEqual({ perMonth: "a month", packagesLede: "Any two plans are 10% off and all three are 20% off." });
    expect(Object.values(PLANS).map((plan) => plan.name).every((name) => !NO_TAX.test(name))).toBe(true);
  });
});
