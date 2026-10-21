// content/industries.test.ts
import { describe, expect, it } from "vitest";
import { formatInr, packageFor, packageTotal } from "@/lib/pricing";
import { INDUSTRIES_LINE } from "./home";
import { INDUSTRIES, industryBySlug } from "./industries";

describe("industries", () => {
  it("has the eight launch industries with unique slugs", () => {
    expect(INDUSTRIES.map((i) => i.slug).sort()).toEqual(["clinics", "coaching", "gyms", "home-services", "real-estate", "restaurants", "retail", "salons"]);
  });
  it("names each industry page as the homepage industries line does", () => {
    for (const { slug, label } of INDUSTRIES_LINE.industries) {
      const page = industryBySlug(slug);
      if (page) expect(page.name).toBe(label);
    }
  });
  it.each(INDUSTRIES.map((i) => [i.slug, i] as const))("%s fits the SEO limits", (_, i) => {
    expect(i.title.length).toBeLessThanOrEqual(60);
    expect(i.title.endsWith(" | Brandbasket")).toBe(true);
    expect(i.title.toLowerCase()).toContain(i.searchPhrase);
    expect(i.h1.toLowerCase()).toContain(i.searchPhrase);
    expect(i.description.length).toBeGreaterThanOrEqual(120);
    expect(i.description.length).toBeLessThanOrEqual(155);
    expect(i.lede.split(/\s+/).length).toBeLessThanOrEqual(25);
    expect(i.problems).toHaveLength(3);
    expect(i.whatYouGet.length).toBeGreaterThanOrEqual(4);
    expect(i.whatYouGet.length).toBeLessThanOrEqual(6);
    expect(i.faq.length).toBeGreaterThanOrEqual(3);
    expect(i.faq.length).toBeLessThanOrEqual(4);
    for (const { q } of i.faq) expect(q.endsWith("?")).toBe(true);
    expect(JSON.stringify(i)).not.toMatch(/[\u2013\u2014]/);
  });
  it("quotes the package price and ad credit in the cost answer", () => {
    for (const i of INDUSTRIES) {
      const cost = i.faq[0]?.a ?? "";
      const pkg = packageFor(i.suggested);
      expect(pkg).not.toBeNull();
      expect(cost).toContain(`${formatInr(packageTotal(i.suggested))} a month`);
      if (pkg && pkg.adCredit > 0) expect(cost).toContain(formatInr(pkg.adCredit));
    }
  });
  it("has no sign-up offer and no website-only rule", () => {
    const text = JSON.stringify(INDUSTRIES);
    expect(text).not.toContain("as you start and it is");
    expect(text).not.toContain("Can I get Digital Growth without the website plan?");
    expect(text).not.toContain("needs the Managed Website plan");
  });
  it("finds an industry by slug and nothing for an unknown slug", () => {
    expect(industryBySlug("clinics")?.name).toBe("Clinics");
    expect(industryBySlug("unknown")).toBeUndefined();
  });
});
