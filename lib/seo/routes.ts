// lib/seo/routes.ts
// One place for every page's title, description and sitemap entry. Titles are complete (they are set as absolute
// titles, so the layout's "%s | Brandbasket" template never runs). Prices are built from lib/pricing.ts.
import { dataNotice } from "@/content/legal/notice";
import { privacyPolicy } from "@/content/legal/privacy";
import { SERVICE_PAGES, type ServicePageContent, servicePageFor } from "@/content/services";
import { refundPolicy } from "@/content/legal/refund";
import { shippingPolicy } from "@/content/legal/shipping";
import { termsOfService } from "@/content/legal/terms";
import { type Currency, formatMoney } from "@/lib/currency";
import { PACKAGES, planPrice, PLANS } from "@/lib/pricing";
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
const UPDATED = "2026-10-21";
const SERVICES_UPDATED = "2026-10-26";

/** The home page's entry in a currency: the price in its description is the visitor's own. */
export function homeRoute(currency: Currency): RouteMeta {
  const gst = currency === "INR" ? ", GST included" : "";
  return {
    path: "/",
    title: `Get your business website free | ${tradeName}`,
    description: `A professional website for your local business, built free and live in about a week. Hosting, security and upkeep for ${formatMoney(planPrice("website", currency), currency)} a month${gst}.`,
    updated: UPDATED,
    priority: 1,
  };
}

/** The pricing page's entry in a currency. Only rupee prices have GST inside them, so only the rupee description says so. */
export function pricingRoute(currency: Currency): RouteMeta {
  const price = (id: keyof typeof PLANS): string => formatMoney(planPrice(id, currency), currency);
  const gst = currency === "INR" ? ", GST included" : "";
  return {
    path: "/pricing",
    title: `Pricing: free website, plans from ${price("website")} a month`,
    description: `Your website is built free. ${PLANS.website.name} ${price("website")} a month, ${PLANS.growth.name} ${price("growth")}, Local SEO ${price("search")}. Packages up to ${Math.max(...PACKAGES.map((p) => p.percent))}% off${gst}.`,
    updated: UPDATED,
    priority: 0.9,
  };
}

/** The registry. The home and pricing entries here are the rupee ones: the sitemap, llms.txt and search engines use these. */
export const ROUTES = {
  home: homeRoute("INR"),
  pricing: pricingRoute("INR"),
  contact: {
    path: "/contact",
    title: `Contact ${tradeName}: free websites for local business`,
    description: `Talk to ${tradeName} about a free website for your local business, a monthly plan or the site you already have. WhatsApp, call, email or send a message.`,
    updated: UPDATED,
    priority: 0.7,
  },
  blog: {
    path: "/blog",
    title: `Blog: guides for local businesses | ${tradeName}`,
    description: `Guides on websites, Google, social and AI search for local businesses, written by the team that runs them for our clients.`,
    updated: UPDATED,
    priority: 0.8,
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

/** The registry entry of one service page (content/services.ts holds its title and description). */
export function serviceRoute(page: ServicePageContent): RouteMeta {
  return { path: page.path, title: page.metaTitle, description: page.metaDescription, updated: SERVICES_UPDATED, priority: 0.8 };
}

/** Every page search engines may index: the registry and the service pages (the rupee copies, the ones crawlers are served), without noindex pages. */
export function indexableRoutes(): RouteMeta[] {
  const routes: readonly RouteMeta[] = [...Object.values(ROUTES), ...SERVICE_PAGES.map((ref) => serviceRoute(servicePageFor(ref.id, "INR")))];
  return routes.filter((r) => !r.noindex);
}

/** Absolute URL of a route, without a trailing slash on the home page. */
export function routeUrl(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
