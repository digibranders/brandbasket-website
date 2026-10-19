// lib/seo/jsonld.ts
import type { FaqItem } from "@/content/types";
import { PLANS, type PlanId } from "@/lib/pricing";
import { businessDetails, siteConfig } from "@/lib/site-config";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessDetails.tradeName,
    legalName: businessDetails.legalName,
    url: siteConfig.url,
    email: businessDetails.email,
    telephone: businessDetails.phone,
    taxID: businessDetails.gstNumber,
    foundingDate: String(businessDetails.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: businessDetails.address.slice(0, 2).join(" "),
      addressLocality: "Thane",
      addressRegion: "Maharashtra",
      postalCode: "400607",
      addressCountry: "IN",
    },
  } as const;
}

const PLAN_ORDER: readonly PlanId[] = ["website", "growth", "search"];

export function planOffersJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Website, Google and local search management for local businesses",
    provider: { "@type": "Organization", name: businessDetails.tradeName, url: siteConfig.url },
    areaServed: { "@type": "Country", name: "India" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Brandbasket plans",
      itemListElement: PLAN_ORDER.map((id) => ({
        "@type": "Offer",
        name: PLANS[id].name,
        url: `${siteConfig.url}/pricing`,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: PLANS[id].monthly,
          priceCurrency: "INR",
          unitText: "MONTH",
          valueAddedTaxIncluded: false,
        },
      })),
    },
  };
}

export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(crumbs: readonly { readonly name: string; readonly path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}
