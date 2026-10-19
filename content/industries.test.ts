// content/industries.test.ts
import { describe, expect, it } from "vitest";
import { INDUSTRIES_LINE } from "./home";
import { INDUSTRIES, industryBySlug } from "./industries";

describe("industries", () => {
  it("has the eight launch industries with unique slugs", () => {
    expect(INDUSTRIES.map((i) => i.slug).sort()).toEqual(["clinics", "coaching", "gyms", "home-services", "real-estate", "restaurants", "retail", "salons"]);
  });
  it("names each industry as the homepage industries line does", () => {
    for (const { slug, label } of INDUSTRIES_LINE.industries) expect(INDUSTRIES.find((i) => i.slug === slug)?.name).toBe(label);
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
  it("links all eight industry pages from the homepage industries line", () => {
    expect(INDUSTRIES_LINE.industries.map((i) => i.slug).sort()).toEqual(INDUSTRIES.map((i) => i.slug).sort());
  });
  it("finds an industry by slug and nothing for an unknown slug", () => {
    expect(industryBySlug("clinics")?.name).toBe("Clinics");
    expect(industryBySlug("unknown")).toBeUndefined();
  });
});
