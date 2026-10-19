// lib/seo/jsonld.test.ts
import { describe, expect, it } from "vitest";
import { aboutPageJsonLd, audienceServiceJsonLd, breadcrumbJsonLd, contactPageJsonLd, faqJsonLd, organizationJsonLd, planOffersJsonLd, webSiteJsonLd } from "./jsonld";

describe("organizationJsonLd", () => {
  it("names the legal entity and the brand", () => {
    const org = organizationJsonLd();
    expect(org["@type"]).toBe("Organization");
    expect(org.legalName).toBe("Digibranders Private Limited");
    expect(org.name).toBe("Brandbasket");
    expect(org.taxID).toBe("27AAICD9268J1Z0");
  });

  it("carries the @id the WebSite publisher points at", () => {
    expect(organizationJsonLd()["@id"]).toBe("https://brandbasket.in/#organization");
  });
});

describe("webSiteJsonLd", () => {
  it("describes the site and names the organization as publisher", () => {
    const site = webSiteJsonLd();
    expect(site["@type"]).toBe("WebSite");
    expect(site.url).toBe("https://brandbasket.in");
    expect(site.publisher["@id"]).toBe("https://brandbasket.in/#organization");
  });
});

describe("planOffersJsonLd", () => {
  it("publishes each plan's monthly price from the pricing module", () => {
    const service = planOffersJsonLd();
    const prices = service.hasOfferCatalog.itemListElement.map((offer) => offer.priceSpecification.price);
    expect(prices).toEqual([2999, 7000, 25000]);
    expect(service.hasOfferCatalog.itemListElement[0].priceSpecification.priceCurrency).toBe("INR");
    expect(service.hasOfferCatalog.itemListElement[0].priceSpecification.valueAddedTaxIncluded).toBe(false);
    expect(service.provider["@id"]).toBe("https://brandbasket.in/#organization");
  });
});

describe("faqJsonLd", () => {
  it("turns questions into FAQPage entities", () => {
    const faq = faqJsonLd([{ q: "Is ad spend included?", a: "No. You pay Meta directly." }]);
    expect(faq.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Is ad spend included?",
      acceptedAnswer: { "@type": "Answer", text: "No. You pay Meta directly." },
    });
  });
});

describe("breadcrumbJsonLd", () => {
  it("builds absolute URLs in order", () => {
    const crumbs = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]);
    expect(crumbs.itemListElement.map((c) => c.item)).toEqual(["https://brandbasket.in/", "https://brandbasket.in/pricing"]);
    expect(crumbs.itemListElement[1].position).toBe(2);
  });
});

describe("contactPageJsonLd", () => {
  it("points at /contact and carries the site-config phone and email", () => {
    const page = contactPageJsonLd();
    expect(page.url).toBe("https://brandbasket.in/contact");
    expect(page.about.telephone).toBe("+91 789 789 6607");
    expect(page.about.email).toBe("hello@brandbasket.in");
  });
});

describe("audienceServiceJsonLd", () => {
  it("names the audience and points the provider at the organization", () => {
    const service = audienceServiceJsonLd({ name: "A website for clinics", description: "Built free.", path: "/industries/clinics", audienceType: "Clinics" });
    expect(service["@type"]).toBe("Service");
    expect(service.url).toBe("https://brandbasket.in/industries/clinics");
    expect(service.audience).toEqual({ "@type": "BusinessAudience", audienceType: "Clinics" });
    expect(service.provider["@id"]).toBe("https://brandbasket.in/#organization");
    expect(service.areaServed.name).toBe("India");
  });
});

describe("aboutPageJsonLd", () => {
  it("points at /about and is about the organization", () => {
    const page = aboutPageJsonLd({ name: "About Brandbasket", description: "Who we are." });
    expect(page["@type"]).toBe("AboutPage");
    expect(page.url).toBe("https://brandbasket.in/about");
    expect(page.about["@id"]).toBe("https://brandbasket.in/#organization");
  });
});
