// lib/seo/routes.ts
// One place for every page's title, description and sitemap entry. Titles are complete (they are set as absolute
// titles, so the layout's "%s | Brandbasket" template never runs). No title or description carries a price.
import { GLOSSARY, GUIDE_PAGES, type GuidePageContent } from "@/content/guides";
import { dataNotice } from "@/content/legal/notice";
import { privacyPolicy } from "@/content/legal/privacy";
import { SERVICE_PAGES, type ServicePageContent, servicePageFor } from "@/content/services";
import { refundPolicy } from "@/content/legal/refund";
import { shippingPolicy } from "@/content/legal/shipping";
import { termsOfService } from "@/content/legal/terms";
import { PLANS } from "@/lib/pricing";
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
const UPDATED = "2026-10-31";
const LEGAL_UPDATED = "2026-10-28";
const SERVICES_UPDATED = "2026-10-26";
const GUIDES_UPDATED = "2026-10-28";

/** The home page's entry. Titles and descriptions never carry a price, so one entry serves both currencies. */
export const HOME_ROUTE: RouteMeta = {
  path: "/",
  title: `Get your business website free | ${tradeName}`,
  description: "A professional website for your local business, built free and live in 7 working days. We host, secure and update it for you every month.",
  updated: UPDATED,
  priority: 1,
};

/** The pricing page's entry. No price here either: a shared link or a search result shows the words, not the amounts. */
export const PRICING_ROUTE: RouteMeta = {
  path: "/pricing",
  title: `Pricing: a free website and monthly plans | ${tradeName}`,
  description: `Your website is built free. Choose ${PLANS.website.name}, ${PLANS.social.name} or ${PLANS.ads.name}, on their own or together, and pay month to month.`,
  updated: UPDATED,
  priority: 0.9,
};

/** The registry: the sitemap, llms.txt and search engines use these. */
export const ROUTES = {
  home: HOME_ROUTE,
  pricing: PRICING_ROUTE,
  contact: {
    path: "/contact",
    title: `Contact ${tradeName}: free websites for local business`,
    description: `Talk to ${tradeName} about a free website for your local business, a monthly plan or the site you already have. WhatsApp, call, email or send a message.`,
    updated: UPDATED,
    priority: 0.7,
  },
  start: {
    path: "/website-landing-page",
    title: `Start your free business website | ${tradeName}`,
    description: "Get a professional website for your local business, built free and live in 7 working days. We host, secure and look after it every month.",
    updated: "2026-10-31",
    priority: 0,
    // The page ad clicks land on: it repeats the homepage's offer, so it stays out of search and the sitemap. Its links are still followed.
    noindex: true,
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
    updated: LEGAL_UPDATED,
    priority: 0.3,
  },
  terms: {
    path: "/terms",
    title: `${termsOfService.title} | ${tradeName}`,
    description: `The terms for the free ${tradeName} website build and monthly plans: fees, GST, ownership, cancellation, liability and governing law.`,
    updated: LEGAL_UPDATED,
    priority: 0.3,
  },
  refund: {
    path: "/refund",
    title: `${refundPolicy.title} | ${tradeName}`,
    description: `How ${tradeName} bills its monthly plans, how to cancel, when we refund a payment and how long a refund takes to reach your bank.`,
    updated: LEGAL_UPDATED,
    priority: 0.3,
  },
  shipping: {
    path: "/shipping",
    title: `${shippingPolicy.title} | ${tradeName}`,
    description: `${tradeName} sells digital services and ships nothing physical. How and when your website and monthly services are delivered online.`,
    updated: LEGAL_UPDATED,
    priority: 0.3,
  },
  glossary: {
    path: "/glossary",
    title: GLOSSARY.metaTitle,
    description: GLOSSARY.metaDescription,
    updated: GUIDES_UPDATED,
    priority: 0.5,
  },
  notice: {
    path: "/notice",
    title: `${dataNotice.title} | ${tradeName}`,
    description: `Notices from ${tradeName} about the personal data we hold, such as a data breach notice, and who to contact about each one.`,
    updated: LEGAL_UPDATED,
    priority: 0.1,
    noindex: true,
  },
} as const satisfies Record<string, RouteMeta>;

/** The registry entry of one service page (content/services.ts holds its title and description). */
export function serviceRoute(page: ServicePageContent): RouteMeta {
  return { path: page.path, title: page.metaTitle, description: page.metaDescription, updated: SERVICES_UPDATED, priority: 0.8 };
}

/** The registry entry of one guide or comparison page (content/guides.ts holds its title and description). */
export function guideRoute(page: GuidePageContent): RouteMeta {
  return { path: page.path, title: page.metaTitle, description: page.metaDescription, updated: GUIDES_UPDATED, priority: 0.7 };
}

/** Every page search engines may index: the registry, the service pages (the rupee copies, the ones crawlers are served) and the guides, without noindex pages. */
export function indexableRoutes(): RouteMeta[] {
  const routes: readonly RouteMeta[] = [...Object.values(ROUTES), ...SERVICE_PAGES.map((ref) => serviceRoute(servicePageFor(ref.id, "INR"))), ...GUIDE_PAGES.map(guideRoute)];
  return routes.filter((r) => !r.noindex);
}

/** Absolute URL of a route, without a trailing slash on the home page. */
export function routeUrl(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
