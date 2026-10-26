import { describe, expect, it } from "vitest";
import { formatInr, PACKAGES, PLAN_IDS, PLANS } from "@/lib/pricing";
import { serviceRoute } from "@/lib/seo/routes";
import { SERVICE_COPY, SERVICE_PAGES, servicePageBySlug, servicePageFor } from "./services";

describe("service pages", () => {
  it("has one page for every plan, at its own address", () => {
    expect(SERVICE_PAGES.map((page) => page.id)).toEqual([...PLAN_IDS]);
    expect(SERVICE_PAGES.map((page) => page.path)).toEqual([
      "/services/managed-website",
      "/services/social-media-and-ads",
      "/services/local-seo-aeo",
    ]);
    for (const page of SERVICE_PAGES) {
      expect(page.path).toBe(`/services/${page.slug}`);
      expect(servicePageBySlug(page.slug)).toBe(page);
      expect(servicePageFor(page.id)).toBe(page);
    }
    expect(servicePageBySlug("nothing")).toBeUndefined();
  });

  it("gives every page a search title and description of a sensible length", () => {
    for (const page of SERVICE_PAGES) {
      const route = serviceRoute(page);
      expect(route.title.length, route.title).toBeLessThanOrEqual(65);
      expect(route.description.length, route.description).toBeGreaterThanOrEqual(50);
      expect(route.description.length, route.description).toBeLessThanOrEqual(160);
      expect(route.title).toContain(formatInr(PLANS[page.id].monthly));
    }
  });

  it("builds every price from the pricing module", () => {
    const text = JSON.stringify(SERVICE_PAGES);
    expect(text).toContain(formatInr(PLANS.website.monthly));
    expect(text).toContain(formatInr(PLANS.growth.monthly));
    expect(text).toContain(formatInr(PLANS.search.monthly));
    expect(text).not.toMatch(/plus (18% )?GST|\+ ?GST|before GST/i);
  });

  it("names the 15 minute edits on the website page and no other length", () => {
    const text = JSON.stringify(servicePageFor("website"));
    expect(text).toContain("15 minutes");
    expect(text).not.toContain("30 minutes");
  });

  it("says what ad money a package earns from the packages themselves", () => {
    const social = JSON.stringify(servicePageFor("growth").spotlight);
    const credits = PACKAGES.filter((pkg) => pkg.adCredit > 0).map((pkg) => formatInr(pkg.adCredit));
    for (const credit of credits) expect(social).toContain(credit);
  });

  it("keeps the same Not included lines as the pricing cards", () => {
    expect(servicePageFor("growth").limits.items).toContain("Ad spend, paid to Meta by you");
    expect(servicePageFor("search").limits.items).toContain("Guaranteed rankings or AI citations");
  });

  it("leaves no dash in any visible copy", () => {
    expect(JSON.stringify([SERVICE_PAGES, SERVICE_COPY])).not.toMatch(new RegExp("[\\u2013\\u2014]"));
  });

  it("keeps every FAQ answer plain, with the cancel answer last", () => {
    for (const page of SERVICE_PAGES) {
      expect(page.faq.length).toBeGreaterThanOrEqual(4);
      expect(page.faq.at(-1)?.q).toBe("Can I cancel?");
    }
  });
});
