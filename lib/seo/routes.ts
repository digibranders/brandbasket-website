// lib/seo/routes.ts
// One place for every page's title, description and sitemap entry. Titles are complete (they are set as absolute
// titles, so the layout's "%s | Brandbasket" template never runs). Prices are built from lib/pricing.ts.
import { INDUSTRIES, type Industry } from "@/content/industries";
import { dataNotice } from "@/content/legal/notice";
import { privacyPolicy } from "@/content/legal/privacy";
import { refundPolicy } from "@/content/legal/refund";
import { shippingPolicy } from "@/content/legal/shipping";
import { termsOfService } from "@/content/legal/terms";
import { formatInr, GST_LABEL, PACKAGES, PLANS } from "@/lib/pricing";
import { businessDetails, siteConfig } from "@/lib/site-config";

export interface RouteMeta {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  /** ISO date of the last real content change. Feeds the sitemap lastModified. */
  readonly updated: string;
  readonly priority: number;
  readonly noindex?: boolean;
}

const { legalName, tradeName, postalAddress } = businessDetails;
const MANAGED = formatInr(PLANS.website.monthly);
const UPDATED = "2026-10-21";

export const ROUTES = {
  home: {
    path: "/",
    title: `Free business website, run for you monthly | ${tradeName}`,
    description: `Get a professional website built free for your local business. We host, secure and update it for ${MANAGED} a month. Add social, ads and local search any time.`,
    updated: UPDATED,
    priority: 1,
  },
  pricing: {
    path: "/pricing",
    title: `Pricing: free website, plans from ${MANAGED} a month`,
    description: `Your website is built free. ${PLANS.website.name} ${MANAGED} a month, ${PLANS.growth.name} ${formatInr(PLANS.growth.monthly)}, Local SEO ${formatInr(PLANS.search.monthly)}. Packages up to ${Math.max(...PACKAGES.map((p) => p.percent))}% off, before ${GST_LABEL} GST.`,
    updated: UPDATED,
    priority: 0.9,
  },
  industries: {
    path: "/industries",
    title: `Websites for local businesses, built free | ${tradeName}`,
    description: "Free websites for clinics, salons, restaurants, gyms, coaching classes, shops, home services and real estate agents, run for you every month.",
    updated: UPDATED,
    priority: 0.8,
  },
  contact: {
    path: "/contact",
    title: `Contact ${tradeName}: free websites for local business`,
    description: `Talk to ${tradeName} about a free website for your local business, a monthly plan or the site you already have. WhatsApp, call, email or send a message.`,
    updated: UPDATED,
    priority: 0.7,
  },
  about: {
    path: "/about",
    title: `About ${tradeName}, a brand of Digibranders`,
    description: `${tradeName} is a brand of ${legalName}, ${postalAddress.locality}. We build local business websites for free, then run them for you every month.`,
    updated: UPDATED,
    priority: 0.6,
  },
  privacy: {
    path: "/privacy",
    title: `${privacyPolicy.title} | ${tradeName}`,
    description: `How ${tradeName}, a brand of ${legalName}, collects, uses and protects personal data under the DPDP Act 2023 of India.`,
    updated: UPDATED,
    priority: 0.3,
  },
  terms: {
    path: "/terms",
    title: `${termsOfService.title} | ${tradeName}`,
    description: `The terms for the free ${tradeName} website build and monthly plans: fees, GST, ownership, cancellation, liability and governing law.`,
    updated: UPDATED,
    priority: 0.3,
  },
  refund: {
    path: "/refund",
    title: `${refundPolicy.title} | ${tradeName}`,
    description: `How ${tradeName} bills its monthly plans, how to cancel, when we refund a payment and how long a refund takes to reach your bank.`,
    updated: UPDATED,
    priority: 0.3,
  },
  shipping: {
    path: "/shipping",
    title: `${shippingPolicy.title} | ${tradeName}`,
    description: `${tradeName} sells digital services and ships nothing physical. How and when your website and monthly services are delivered online.`,
    updated: UPDATED,
    priority: 0.3,
  },
  notice: {
    path: "/notice",
    title: `${dataNotice.title} | ${tradeName}`,
    description: `Notices from ${tradeName} about the personal data we hold, such as a data breach notice, and who to contact about each one.`,
    updated: UPDATED,
    priority: 0.1,
    noindex: true,
  },
} as const satisfies Record<string, RouteMeta>;

/** An industry page's entry. Its title and description live with the rest of its copy in content/industries.ts. */
export function industryRoute(industry: Industry): RouteMeta {
  return { path: `/industries/${industry.slug}`, title: industry.title, description: industry.description, updated: industry.updated, priority: 0.8 };
}

/** Every page search engines may index: the registry plus the eight industry pages, without noindex pages. */
export function indexableRoutes(): RouteMeta[] {
  const routes: readonly RouteMeta[] = [...Object.values(ROUTES), ...INDUSTRIES.map(industryRoute)];
  return routes.filter((r) => !r.noindex);
}

/** Absolute URL of a route, without a trailing slash on the home page. */
export function routeUrl(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
