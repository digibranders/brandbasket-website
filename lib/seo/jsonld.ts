// lib/seo/jsonld.ts
import type { FaqItem } from "@/content/types";
import { PLANS, type PlanId } from "@/lib/pricing";
import { businessDetails, siteConfig } from "@/lib/site-config";

/** One node id for the organization, so other entities can point at it instead of repeating it. */
export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;

export interface OrganizationLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "Organization";
  readonly "@id": string;
  readonly name: string;
  readonly legalName: string;
  readonly url: string;
  readonly email: string;
  readonly telephone: string;
  readonly taxID: string;
  readonly foundingDate: string;
  readonly address: {
    readonly "@type": "PostalAddress";
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    readonly postalCode: string;
    readonly addressCountry: string;
  };
}

export function organizationJsonLd(): OrganizationLd {
  const { postalAddress } = businessDetails;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: businessDetails.tradeName,
    legalName: businessDetails.legalName,
    url: siteConfig.url,
    email: businessDetails.email,
    telephone: businessDetails.phone,
    taxID: businessDetails.gstNumber,
    foundingDate: String(businessDetails.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: postalAddress.street,
      addressLocality: postalAddress.locality,
      addressRegion: postalAddress.region,
      postalCode: postalAddress.postalCode,
      addressCountry: postalAddress.country,
    },
  };
}

export interface WebSiteLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebSite";
  readonly "@id": string;
  readonly name: string;
  readonly url: string;
  readonly inLanguage: "en-IN";
  readonly publisher: { readonly "@id": string };
}

export function webSiteJsonLd(): WebSiteLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: businessDetails.tradeName,
    url: siteConfig.url,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

const PLAN_ORDER: readonly PlanId[] = ["website", "growth", "search"];

export interface ServiceLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "Service";
  readonly name: string;
  readonly provider: { readonly "@id": string };
  readonly areaServed: { readonly "@type": "Country"; readonly name: string };
  readonly hasOfferCatalog: {
    readonly "@type": "OfferCatalog";
    readonly name: string;
    readonly itemListElement: readonly {
      readonly "@type": "Offer";
      readonly name: string;
      readonly url: string;
      readonly priceSpecification: {
        readonly "@type": "UnitPriceSpecification";
        readonly price: number;
        readonly priceCurrency: "INR";
        readonly unitText: "MONTH";
        readonly valueAddedTaxIncluded: boolean;
      };
    }[];
  };
}

export function planOffersJsonLd(): ServiceLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Website, Google and local search management for local businesses",
    provider: { "@id": ORGANIZATION_ID },
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

export interface FaqPageLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "FAQPage";
  readonly mainEntity: readonly {
    readonly "@type": "Question";
    readonly name: string;
    readonly acceptedAnswer: { readonly "@type": "Answer"; readonly text: string };
  }[];
}

export function faqJsonLd(items: readonly FaqItem[]): FaqPageLd {
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

export interface BreadcrumbLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "BreadcrumbList";
  readonly itemListElement: readonly {
    readonly "@type": "ListItem";
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }[];
}

export function breadcrumbJsonLd(crumbs: readonly { readonly name: string; readonly path: string }[]): BreadcrumbLd {
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

export interface ContactPageLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "ContactPage";
  readonly name: string;
  readonly url: string;
  readonly about: {
    readonly "@type": "Organization";
    readonly name: string;
    readonly url: string;
    readonly telephone: string;
    readonly email: string;
  };
}

export function contactPageJsonLd(): ContactPageLd {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${businessDetails.tradeName}`,
    url: `${siteConfig.url}/contact`,
    about: { "@type": "Organization", name: businessDetails.tradeName, url: siteConfig.url, telephone: businessDetails.phone, email: businessDetails.email },
  };
}
