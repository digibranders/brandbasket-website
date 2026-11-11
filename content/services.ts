// content/services.ts
// Copy for the three service pages (/services/managed-website, /services/social-media-management, /services/paid-ads-management).
// The social and ads pages replaced Social Media and Ads and Local SEO + AEO with the AI-powered plans (owner, 2026-11-06).
// New copy: it goes to the owner before it ships (2026-10-26). Every price, percentage and cap is built from lib/pricing.ts for the page's currency (rupees with GST included, dollars with no tax named),
// and the lists of what is and is not included come from content/pricing.ts so the pricing cards and these pages agree.
import { type Currency, formatMoney } from "@/lib/currency";
import { extrasFor, planPrice, type PlanId } from "@/lib/pricing";
import { CANCEL_ANSWER } from "./legal/cancellation";
import { adSpendAnswer, NO_GUARANTEE_ANSWER, planColumns } from "./pricing";
import type { Step } from "./home";
import type { FaqItem } from "./types";

export type ServiceIconKey =
  | "FileText"
  | "Phone"
  | "ShieldCheck"
  | "LockKey"
  | "Headset"
  | "InstagramLogo"
  | "MapPin"
  | "Star"
  | "Megaphone"
  | "ChartLineUp"
  | "MagnifyingGlass"
  | "Article"
  | "Buildings"
  | "Question";

export interface ServiceGroup {
  readonly icon: ServiceIconKey;
  readonly title: string;
  readonly items: readonly string[];
}

export interface ServiceSituation {
  readonly title: string;
  readonly body: string;
}

/** A block that sets one service apart: the free build or what AEO is. */
export interface ServiceSpotlight {
  readonly kind: "offer" | "explainer";
  readonly heading: string;
  readonly body: readonly string[];
}

export interface ServicePageContent {
  readonly id: PlanId;
  /** The last part of the address: /services/<slug>. */
  readonly slug: string;
  readonly path: `/services/${string}`;
  /** Complete page title and description for search results (lib/seo/routes.ts). */
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly lede: string;
  /** The facts shown in the card beside the headline. */
  readonly glance: readonly string[];
  readonly who: { readonly heading: string; readonly items: readonly ServiceSituation[] };
  readonly does: { readonly heading: string; readonly lede: string; readonly groups: readonly ServiceGroup[] };
  /** Left out when a service has nothing to set apart (Social and Ads). */
  readonly spotlight?: ServiceSpotlight;
  readonly how: { readonly heading: string; readonly steps: readonly Step[] };
  readonly limits: { readonly heading: string; readonly lede: string; readonly items: readonly string[] };
  readonly faq: readonly FaqItem[];
}

/** The words under "Not included" on the pricing card of a plan, so the two never differ. */
function excludesOf(id: PlanId, currency: Currency): readonly string[] {
  const column = planColumns(currency).find((plan) => plan.id === id);
  if (!column) throw new RangeError(`No pricing column for ${id}`);
  return column.excludes;
}

/** Rupee prices carry GST and say so; dollar prices never mention a tax. */
function gstNote(currency: Currency): string {
  return currency === "INR" ? ", GST included" : "";
}

function buildServicePages(currency: Currency): readonly ServicePageContent[] {
  const WEBSITE_PRICE = formatMoney(planPrice("website", currency), currency);
  const FREE = formatMoney(0, currency);
  const GST_NOTE = gstNote(currency);
  const extras = extrasFor(currency);
  const adCap = formatMoney(extras.adBudgetCap, currency);
  const hour = formatMoney(extras.hour, currency);
  const perReel = formatMoney(extras.reel, currency);

  return [
    {
      id: "website",
      slug: "managed-website",
      path: "/services/managed-website",
      metaTitle: "Website Management: a free build, run for you | Brandbasket",
      metaDescription: "We build up to 10 pages free and put them live within 7 working days. Then we host, secure and update it every month, with 2 edits included.",
      h1: "A free website for your business, looked after every month.",
      lede: `We design up to 10 pages for ${FREE} and put them online. Then we keep them hosted, secure and up to date, so you never deal with the technical side.`,
      glance: ["Up to 10 pages, built for you", "Live within 7 working days", "2 edits a month, 15 minutes each", "A monthly website health report"],
      who: {
        heading: "Who it is for.",
        items: [
          { title: "You have no website yet", body: "Customers look you up before they visit. We build a site they can trust and put it online." },
          { title: "You do not want the technical work", body: "Hosting, security, backups and updates are ours. You tell us what to change." },
          { title: "You want one clear monthly cost", body: `${WEBSITE_PRICE} a month covers everything below${GST_NOTE}. Anything outside the plan is quoted before we start.` },
        ],
      },
      does: {
        heading: "What we do.",
        lede: "What the free build covers, and what the monthly plan keeps doing.",
        groups: [
          { icon: "Phone", title: "Ways for customers to reach you", items: ["Contact and enquiry forms", "Click-to-call buttons", "WhatsApp click-to-chat", "Every enquiry emailed to you"] },
          { icon: "ShieldCheck", title: "Kept safe and online", items: ["Hosting and SSL that stays valid", "Regular backups", "Security updates", "Uptime monitoring"] },
          { icon: "LockKey", title: "Privacy done properly", items: ["A privacy policy written for your business", "Privacy notices on your forms", "Consent where the law requires it", ...(currency === "INR" ? ["DPDP Act readiness support"] : [])] },
          { icon: "Headset", title: "A person to ask", items: ["Human support when you need it", "2 edits a month, 15 minutes each", "A monthly website health report"] },
          { icon: "FileText", title: "10 pages for the website", items: ["Home Page", "About Us", "Services Overview", "Individual Service Pages", "Contact Us", "Pricing", "Case Studies / Portfolio", "Blog / Resources", "Privacy Policy", "Terms and Conditions"] },
        ],
      },
      spotlight: {
        kind: "offer",
        heading: "The build is free.",
        body: [`We design and build your website for ${FREE}. The monthly plan keeps it online, safe and up to date.`, "You can cancel anytime."],
      },
      how: {
        heading: "How it works.",
        steps: [
          { when: "Day 1", what: "A 15-minute call" },
          { when: "Week 1", what: "We build it and you approve it" },
          { when: "Every month", what: "We run it and send a report" },
        ],
      },
      limits: {
        heading: "What is not included.",
        lede: `So there are no surprises. Work outside the plan is quoted first, at ${hour} an hour.`,
        items: excludesOf("website", currency),
      },
      faq: [
        {
          q: "Is the build really free?",
          a: `Yes. We design and build it for ${FREE}. The ${WEBSITE_PRICE} monthly plan keeps it hosted, secure and up to date.`,
        },
        {
          q: "What counts as an edit?",
          a: `A small change that takes about 15 minutes, such as new opening hours, a changed price or a swapped photo. You get 2 a month. Bigger changes, new pages or a redesign are quoted first, at ${hour} an hour.`,
        },
        {
          q: "How long does it take?",
          a: "Your website goes live within 7 working days of you sending your details and making your first payment. It can take a little longer if we are waiting on content from you or on your domain being connected.",
        },
        {
          q: "Do I need my own domain?",
          a: "You register and pay for your own domain, so it is always in your name. No domain yet? We set your website up on a temporary one for free until you have one.",
        },
        { q: "Can I cancel?", a: CANCEL_ANSWER },
      ],
    },
    {
      id: "social",
      slug: "social-media-management",
      path: "/services/social-media-management",
      metaTitle: "Social Media Management with AI | Brandbasket",
      metaDescription: "AI drafts your posts, captions and images, and they go out on schedule on up to 4 platforms. A monthly performance report in plain words.",
      h1: "Posts that go out on time, made with AI.",
      lede: "AI drafts your posts, captions and images, you approve them, and they go out on schedule on up to 4 platforms. You get a report every month.",
      glance: ["AI posts, captions and images", "Automated posting and scheduling", "Up to 4 platforms managed", "A monthly performance report"],
      who: {
        heading: "Who it is for.",
        items: [
          { title: "You know you should post, but never have the time", body: "AI drafts the month's posts and captions, and they go out on schedule." },
          { title: "Your pages look quiet or out of date", body: "Fresh posts and images keep your channels active, so customers see a business that is open." },
          { title: "You cannot tell what is working", body: "A monthly report shows what went out and how people responded." },
        ],
      },
      does: {
        heading: "What we do.",
        lede: "Content made with AI, posted on time, and reported in plain words.",
        groups: [
          { icon: "InstagramLogo", title: "Content made with AI", items: ["AI content and caption generation", "AI image and creative generation", "Posts for you to approve"] },
          { icon: "Article", title: "Posting on time", items: ["Automated posting and scheduling", "Up to 4 platforms managed"] },
          { icon: "ChartLineUp", title: "A report in plain words", items: ["A monthly performance report", "Human support when you need it"] },
        ],
      },
      how: {
        heading: "How it works.",
        steps: [
          { when: "Day 1", what: "A 15-minute call about your business and customers" },
          { when: "Week 1", what: "We connect your platforms and plan the first posts" },
          { when: "Every month", what: "AI drafts, you approve, posts go out and a report follows" },
        ],
      },
      limits: {
        heading: "What is not included.",
        lede: "So there are no surprises.",
        items: excludesOf("social", currency),
      },
      faq: [
        {
          q: "What does a reel cost?",
          a: `Reels and video editing are not part of the plan. Each reel is ${perReel}, quoted before we start.`,
        },
        {
          q: "Do I need the website plan?",
          a: `No. Every plan can be bought on its own, at the same price.`,
        },
        {
          q: "Do you guarantee followers, leads or sales?",
          a: NO_GUARANTEE_ANSWER,
        },
        { q: "Can I cancel?", a: CANCEL_ANSWER },
      ],
    },
    {
      id: "ads",
      slug: "paid-ads-management",
      path: "/services/paid-ads-management",
      metaTitle: "Paid Ads Management with AI | Brandbasket",
      metaDescription: "Facebook and Instagram ads with AI ad copy and creatives, set up, optimised and kept within your budget, with a report in plain words every month.",
      h1: "Ads that bring enquiries, run for you.",
      lede: `We set up your Facebook and Instagram ads with AI copy and creatives, manage up to ${adCap} a month of your budget and show you the results every month.`,
      glance: ["Meta ads on Facebook and Instagram", "AI ad copy and creatives", `Budget and bidding managed, up to ${adCap} a month`, "A monthly performance report"],
      who: {
        heading: "Who it is for.",
        items: [
          { title: "You have boosted posts and cannot tell what worked", body: "We plan, set up and launch campaigns with a clear goal, and show the result in a report." },
          { title: "Making ads takes too long", body: "AI drafts ad copy and creatives for you to approve, so campaigns go live sooner." },
          { title: "Your budget runs out early, or never gets spent", body: "We manage spend and bids so your budget lasts the month." },
        ],
      },
      does: {
        heading: "What we do.",
        lede: "Campaigns built with AI, run carefully and reported every month.",
        groups: [
          { icon: "Megaphone", title: "Campaigns, set up and run", items: ["Meta ads on Facebook and Instagram", "Campaign setup and optimisation"] },
          { icon: "Article", title: "Ads made with AI", items: ["AI ad copy and creative generation", "Ads for you to approve before they run"] },
          { icon: "ChartLineUp", title: "Budget and results", items: [`Budget and bidding management, up to ${adCap} a month of your budget`, "A monthly performance report", "Human support when you need it"] },
        ],
      },
      how: {
        heading: "How it works.",
        steps: [
          { when: "Day 1", what: "A 15-minute call about your customers and budget" },
          { when: "Week 1", what: "We set up your ad account and first campaigns" },
          { when: "Every month", what: "We optimise, manage the budget and send a report" },
        ],
      },
      limits: {
        heading: "What is not included.",
        lede: "So there are no surprises.",
        items: excludesOf("ads", currency),
      },
      faq: [
        {
          q: "Is ad spend included?",
          a: adSpendAnswer(currency),
        },
        {
          q: "Do I need the website plan?",
          a: `No. Every plan can be bought on its own, at the same price.`,
        },
        {
          q: "Do you guarantee leads or sales?",
          a: NO_GUARANTEE_ANSWER,
        },
        { q: "Can I cancel?", a: CANCEL_ANSWER },
      ],
    },
  ];
}

/** Where a service page lives. It does not depend on the currency, so routes, sitemaps and links can use it without one. */
export interface ServicePageRef {
  readonly id: PlanId;
  readonly slug: string;
  readonly path: `/services/${string}`;
}

const SERVICE_PAGES_BY_CURRENCY: Readonly<Record<Currency, readonly ServicePageContent[]>> = {
  INR: buildServicePages("INR"),
  USD: buildServicePages("USD"),
};

/** Every service page, in order, with only the fields that are the same in both currencies. */
export const SERVICE_PAGES: readonly ServicePageRef[] = SERVICE_PAGES_BY_CURRENCY.INR.map(({ id, slug, path }) => ({ id, slug, path }));

/** The three pages, with their copy and prices in one currency. */
export function servicePages(currency: Currency): readonly ServicePageContent[] {
  return SERVICE_PAGES_BY_CURRENCY[currency];
}

/** The page for a slug in a currency, or undefined for an address that is not a service page. */
export function servicePageBySlug(slug: string, currency: Currency): ServicePageContent | undefined {
  return servicePages(currency).find((page) => page.slug === slug);
}

/** The page of a plan in a currency. Every plan has one. */
export function servicePageFor(id: PlanId, currency: Currency): ServicePageContent {
  const page = servicePages(currency).find((candidate) => candidate.id === id);
  if (!page) throw new RangeError(`No service page for ${id}`);
  return page;
}

/** Where the page of a plan lives (the same in both currencies). */
export function servicePageRefFor(id: PlanId): ServicePageRef {
  const ref = SERVICE_PAGES.find((candidate) => candidate.id === id);
  if (!ref) throw new RangeError(`No service page for ${id}`);
  return ref;
}

/** Copy around the sections that is the same on every service page and in both currencies. */
export const SERVICE_COPY = {
  breadcrumb: "Services",
  glanceLabel: "At a glance",
  freeBuild: "Free build",
  start: "Start my plan",
  /** The site's own "View pricing" label, short enough to sit beside the main button on a phone. */
  compare: "View pricing",
  faqHeading: "Questions about this plan.",
  exploreMore: "Explore more",
} as const;

/** The unit printed under a plan price: rupee prices carry GST and say so; dollar prices never mention a tax. */
export function serviceMoneyCopy(currency: Currency): { readonly perMonth: string } {
  return { perMonth: currency === "INR" ? "a month, GST included" : "a month" };
}
