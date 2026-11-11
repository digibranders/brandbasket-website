import { describe, expect, it } from "vitest";
import { CURRENCIES, formatMoney } from "@/lib/currency";
import { PLAN_IDS, PLANS, planPrice } from "@/lib/pricing";
import { serviceRoute } from "@/lib/seo/routes";
import { NO_GUARANTEE_ANSWER, pricingFaq } from "./pricing";
import { SERVICE_COPY, SERVICE_PAGES, servicePageBySlug, servicePageFor, servicePageRefFor, servicePages, serviceMoneyCopy } from "./services";

const NO_TAX = /gst|tax|incl\./i;

describe("service pages", () => {
  it("lists the three pages, at their own addresses, without any price", () => {
    expect(SERVICE_PAGES.map((page) => page.id)).toEqual([...PLAN_IDS]);
    expect(SERVICE_PAGES.map((page) => page.path)).toEqual([
      "/services/managed-website",
      "/services/social-media-management",
      "/services/paid-ads-management",
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
          expect(route.title.length, route.title).toBeLessThanOrEqual(60);
          expect(route.description.length, route.description).toBeGreaterThanOrEqual(120);
          expect(route.description.length, route.description).toBeLessThanOrEqual(155);
          // A shared link shows the title and description, so neither carries a price.
          expect(`${route.title} ${route.description}`, route.title).not.toMatch(/[₹$]|\bgst\b/i);
        }
      });

      it("builds every price from the pricing module", () => {
        const text = JSON.stringify(pages);
        expect(text).toContain(formatMoney(planPrice("website", currency), currency));
        expect(text).not.toMatch(/plus (18% )?GST|\+ ?GST|before GST/i);
      });

      it("names the 15 minute edits on the website page and no other length", () => {
        const text = JSON.stringify(servicePageFor("website", currency));
        expect(text).toContain("15 minutes");
        expect(text).not.toContain("30 minutes");
      });

      it("keeps the free build card on the website page only", () => {
        expect(servicePageFor("website", currency).spotlight?.kind).toBe("offer");
        expect(servicePageFor("social", currency).spotlight).toBeUndefined();
        expect(servicePageFor("ads", currency).spotlight).toBeUndefined();
      });

      it("lists the social plan's AI work and its 4 platforms", () => {
        const items = servicePageFor("social", currency).does.groups.flatMap((group) => group.items);
        for (const item of ["AI content and caption generation", "AI image and creative generation", "Up to 4 platforms managed"]) expect(items).toContain(item);
      });

      it("keeps the same Not included lines as the pricing cards", () => {
        expect(servicePageFor("ads", currency).limits.items).toContain("Ad spend, paid to Meta by you");
        expect(servicePageFor("social", currency).limits.items).toContain("Ad campaigns, which are Paid Ads Management");
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
    expect(text).toContain("₹2,999 a month covers everything below, GST included");
    expect(text).toContain("₹10,000");
    expect(text).toContain("₹500 an hour");
    expect(text).toContain("₹500");
    expect(text).not.toContain("$");
    expect(serviceMoneyCopy("INR")).toEqual({ perMonth: "a month, GST included" });
  });

  it("prints dollars with no tax anywhere on the dollar pages", () => {
    const pages = servicePages("USD");
    const text = JSON.stringify([pages, serviceMoneyCopy("USD")]);
    expect(text).not.toMatch(NO_TAX);
    expect(text).not.toContain("₹");
    expect(text).not.toContain("DPDP");
    for (const price of ["$59", "$120", "$10 an hour"]) expect(text).toContain(price);
    expect(servicePageFor("social", "USD").faq.find((item) => item.q === "What does a reel cost?")?.a).toContain("$10");
    expect(servicePageFor("website", "USD").lede).toContain("for $0");
    expect(serviceMoneyCopy("USD")).toEqual({ perMonth: "a month" });
    expect(Object.values(PLANS).map((plan) => plan.name).every((name) => !NO_TAX.test(name))).toBe(true);
  });

  it("lists DPDP readiness on the rupee Managed Website page only, matching the pricing page", () => {
    const privacy = servicePageFor("website", "INR").does.groups.find((group) => group.title === "Privacy done properly");
    expect(privacy?.items).toContain("DPDP Act readiness support");
    expect(servicePageFor("website", "USD").does.groups.find((group) => group.title === "Privacy done properly")?.items.join(" ")).not.toContain("DPDP");
  });

  it("words the ad spend and no guarantee answers like the pricing page, whichever page they are on", () => {
    for (const currency of CURRENCIES) {
      const pricing = pricingFaq(currency);
      const adSpend = servicePageFor("ads", currency).faq.find((item) => item.q === "Is ad spend included?")?.a;
      expect(adSpend).toBe(pricing.find((item) => item.q === "Is ad spend included?")?.a);
      for (const id of PLAN_IDS) {
        const guarantee = servicePageFor(id, currency).faq.find((item) => item.q.startsWith("Do you guarantee"));
        if (id !== "website") expect(guarantee?.a).toBe(NO_GUARANTEE_ANSWER);
      }
    }
  });
});
