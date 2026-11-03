// lib/seo/jsonld.ts
import type { ServicePageContent } from "@/content/services";
import type { Currency } from "@/lib/currency";
import type { FaqItem } from "@/content/types";
import type { AuthorProfile, Post } from "@/lib/cms/schema";
import { PACKAGES, packageTotal, PLAN_IDS, planPrice, PLANS } from "@/lib/pricing";
import { businessDetails, siteConfig, socialLinks } from "@/lib/site-config";

/** One node id for the organization, so other entities can point at it instead of repeating it. */
export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;

export interface OrganizationLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "Organization";
  readonly "@id": string;
  readonly name: string;
  readonly legalName: string;
  readonly url: string;
  readonly logo: string;
  readonly email: string;
  readonly telephone: string;
  readonly taxID: string;
  readonly foundingDate: string;
  readonly description: string;
  readonly contactPoint: { readonly "@type": "ContactPoint"; readonly contactType: "customer support"; readonly telephone: string; readonly email: string; readonly areaServed: "IN"; readonly availableLanguage: "English" };
  readonly address: {
    readonly "@type": "PostalAddress";
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    readonly postalCode: string;
    readonly addressCountry: string;
  };
  readonly sameAs?: readonly string[];
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
    logo: `${siteConfig.url}/icon-512.png`,
    email: businessDetails.email,
    telephone: businessDetails.phone,
    taxID: businessDetails.gstNumber,
    foundingDate: String(businessDetails.foundingYear),
    description: "Brandbasket builds websites for local businesses in India for free, then runs the website, Google profile, ads and local search for a monthly fee.",
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", telephone: businessDetails.phone, email: businessDetails.email, areaServed: "IN", availableLanguage: "English" },
    address: {
      "@type": "PostalAddress",
      streetAddress: postalAddress.street,
      addressLocality: postalAddress.locality,
      addressRegion: postalAddress.region,
      postalCode: postalAddress.postalCode,
      addressCountry: postalAddress.country,
    },
    ...(socialLinks.length === 0 ? {} : { sameAs: socialLinks.map((link) => link.href) }),
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
        readonly priceCurrency: Currency;
        readonly unitText: "MONTH";
        /** Present only on rupee prices, which have GST inside them. Dollar prices carry no tax talk. */
        readonly valueAddedTaxIncluded?: true;
      };
    }[];
  };
}

function monthlyOffer(name: string, price: number, currency: Currency): ServiceLd["hasOfferCatalog"]["itemListElement"][number] {
  return {
    "@type": "Offer",
    name,
    url: `${siteConfig.url}/pricing`,
    priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: currency, unitText: "MONTH", ...(currency === "INR" ? { valueAddedTaxIncluded: true as const } : {}) },
  };
}

/** One Offer per plan at list price in the page's currency; the pricing page also lists one per package at its package price. */
export function planOffersJsonLd(currency: Currency, { packages = false }: { readonly packages?: boolean } = {}): ServiceLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Website, Google and local search management for local businesses",
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: "India" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Brandbasket plans",
      itemListElement: [
        ...PLAN_IDS.map((id) => monthlyOffer(PLANS[id].name, planPrice(id, currency), currency)),
        ...(packages ? PACKAGES.map((pkg) => monthlyOffer(pkg.name, packageTotal(pkg.pick, currency), currency)) : []),
      ],
    },
  };
}

export interface ServicePageLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "Service";
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly provider: { readonly "@id": string };
  readonly areaServed: { readonly "@type": "Country"; readonly name: string };
  readonly offers: ServiceLd["hasOfferCatalog"]["itemListElement"][number];
}

/** One service page: the plan as a Service with its monthly price in the page's currency (GST inside the rupee price). */
export function serviceJsonLd(page: ServicePageContent, currency: Currency): ServicePageLd {
  const plan = PLANS[page.id];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: plan.name,
    description: page.metaDescription,
    url: `${siteConfig.url}${page.path}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: "India" },
    offers: { ...monthlyOffer(plan.name, planPrice(page.id, currency), currency), url: `${siteConfig.url}${page.path}` },
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

export interface AboutPageLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "AboutPage";
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly inLanguage: "en-IN";
  readonly about: { readonly "@id": string };
}

export function aboutPageJsonLd({ name, description }: { readonly name: string; readonly description: string }): AboutPageLd {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name,
    description,
    url: `${siteConfig.url}/about`,
    inLanguage: "en-IN",
    about: { "@id": ORGANIZATION_ID },
  };
}

export interface WebPageLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebPage";
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly inLanguage: "en-IN";
  readonly isPartOf: { readonly "@id": string };
  readonly publisher: { readonly "@id": string };
}

/** A plain page (a guide or a comparison): its name, summary and the site it belongs to. */
export function webPageJsonLd({ name, description, path }: { readonly name: string; readonly description: string; readonly path: string }): WebPageLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${siteConfig.url}${path}`,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface DefinedTermSetLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "DefinedTermSet";
  readonly name: string;
  readonly url: string;
  readonly hasDefinedTerm: readonly { readonly "@type": "DefinedTerm"; readonly name: string; readonly description: string }[];
}

export function definedTermSetJsonLd({ name, path, terms }: { readonly name: string; readonly path: string; readonly terms: readonly { readonly term: string; readonly definition: string }[] }): DefinedTermSetLd {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name,
    url: `${siteConfig.url}${path}`,
    hasDefinedTerm: terms.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.definition })),
  };
}

export const blogUrl = (path = ""): string => `${siteConfig.url}/blog${path}`;
/** The author page's address is also the author's id, so a post and the author page point at one entity. */
export const authorUrl = (slug: string): string => blogUrl(`/author/${slug}`);

export interface PersonLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "Person";
  readonly "@id": string;
  readonly name: string;
  readonly url: string;
  readonly jobTitle?: string;
  readonly description?: string;
  readonly image?: string;
  readonly sameAs?: readonly string[];
  readonly worksFor: { readonly "@id": string };
}

export function personJsonLd(author: AuthorProfile): PersonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": authorUrl(author.slug),
    name: author.name,
    url: authorUrl(author.slug),
    ...(author.jobTitle === "" ? {} : { jobTitle: author.jobTitle }),
    ...(author.bio === "" ? {} : { description: author.bio }),
    ...(author.photo === null ? {} : { image: author.photo.src }),
    ...(author.sameAs.length === 0 ? {} : { sameAs: author.sameAs }),
    worksFor: { "@id": ORGANIZATION_ID },
  };
}

export interface ProfilePageLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "ProfilePage";
  readonly url: string;
  readonly inLanguage: "en-IN";
  readonly mainEntity: { readonly "@id": string };
}

export function profilePageJsonLd(author: AuthorProfile): ProfilePageLd {
  return { "@context": "https://schema.org", "@type": "ProfilePage", url: authorUrl(author.slug), inLanguage: "en-IN", mainEntity: { "@id": authorUrl(author.slug) } };
}

export interface BlogPostingLd {
  readonly "@context": "https://schema.org";
  readonly "@type": "BlogPosting";
  readonly "@id": string;
  readonly mainEntityOfPage: string;
  readonly url: string;
  readonly headline: string;
  readonly description: string;
  readonly inLanguage: "en-IN";
  readonly wordCount: number;
  readonly image?: string;
  readonly datePublished?: string;
  readonly dateModified?: string;
  readonly articleSection?: string;
  readonly author?: { readonly "@type": "Person"; readonly "@id": string; readonly name: string };
  readonly publisher: { readonly "@id": string };
}

/** dateModified is the CMS's modifiedAt, the last time readers saw different words, never a settings change. */
export function blogPostingJsonLd(post: Post): BlogPostingLd {
  const url = blogUrl(`/${post.slug}`);
  const image = post.ogImage?.src ?? post.cover?.src;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.seo.description,
    inLanguage: "en-IN",
    wordCount: post.wordCount,
    ...(image === undefined ? {} : { image }),
    ...(post.publishedAt === null ? {} : { datePublished: post.publishedAt }),
    ...(post.modifiedAt === null ? {} : { dateModified: post.modifiedAt }),
    ...(post.category === null ? {} : { articleSection: post.category.name }),
    ...(post.author === null ? {} : { author: { "@type": "Person" as const, "@id": authorUrl(post.author.slug), name: post.author.name } }),
    publisher: { "@id": ORGANIZATION_ID },
  };
}
