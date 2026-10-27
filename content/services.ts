// content/services.ts
// Copy for the three service pages (/services/managed-website, /services/social-media-and-ads, /services/local-seo-aeo).
// New copy: it goes to the owner before it ships (2026-10-26). Every price, percentage and cap is built from lib/pricing.ts for the page's currency (rupees with GST included, dollars with no tax named),
// and the lists of what is and is not included come from content/pricing.ts so the pricing cards and these pages agree.
import { type Currency, formatMoney } from "@/lib/currency";
import { extrasFor, PACKAGES, PLANS, planPrice, type PlanId } from "@/lib/pricing";
import { CANCEL_ANSWER } from "./legal/cancellation";
import { planColumns } from "./pricing";
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

/** A block that sets one service apart: the free build, the ad money or what AEO is. */
export interface ServiceSpotlight {
  readonly kind: "offer" | "ad-money" | "explainer";
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
  readonly spotlight: ServiceSpotlight;
  readonly how: { readonly heading: string; readonly steps: readonly Step[] };
  readonly limits: { readonly heading: string; readonly lede: string; readonly items: readonly string[] };
  readonly faq: readonly FaqItem[];
}

const WEBSITE = PLANS.website;
const GROWTH = PLANS.growth;
const SEARCH = PLANS.search;

/** The words under "Not included" on the pricing card of a plan, so the two never differ. */
function excludesOf(id: PlanId, currency: Currency): readonly string[] {
  const column = planColumns(currency).find((plan) => plan.id === id);
  if (!column) throw new RangeError(`No pricing column for ${id}`);
  return column.excludes;
}

/** The package percentages: the same for every two-plan package, and the all-three one. They do not depend on the currency. */
const TWO_PLAN_PERCENT = Math.min(...PACKAGES.filter((pkg) => Object.values(pkg.pick).filter(Boolean).length === 2).map((pkg) => pkg.percent));
const ALL_PLAN_PERCENT = Math.max(...PACKAGES.map((pkg) => pkg.percent));

/** Rupee prices carry GST and say so; dollar prices never mention a tax. */
function gstNote(currency: Currency): string {
  return currency === "INR" ? ", GST included" : "";
}

function buildServicePages(currency: Currency): readonly ServicePageContent[] {
  const WEBSITE_PRICE = formatMoney(planPrice("website", currency), currency);
  const GROWTH_PRICE = formatMoney(planPrice("growth", currency), currency);
  const SEARCH_PRICE = formatMoney(planPrice("search", currency), currency);
  const FREE = formatMoney(0, currency);
  const GST_NOTE = gstNote(currency);
  const extras = extrasFor(currency);
  const adCap = formatMoney(extras.adBudgetCap, currency);
  const hour = formatMoney(extras.hour, currency);
  const perReel = formatMoney(extras.reel, currency);
  /** The ad money a package earns, from the packages themselves, lowest first. */
  const adMoney = [...new Set(PACKAGES.map((pkg) => pkg.adCredit[currency]).filter((amount) => amount > 0))].sort((a, b) => a - b);
  const lowestAdMoney = formatMoney(adMoney[0] ?? 0, currency);
  const highestAdMoney = formatMoney(adMoney.at(-1) ?? 0, currency);

  return [
    {
      id: "website",
      slug: "managed-website",
      path: "/services/managed-website",
      metaTitle: `Managed Website, free build, ${WEBSITE_PRICE} a month | Brandbasket`,
      metaDescription: `We build up to 10 pages for your business for free, then host, secure and update them for ${WEBSITE_PRICE} a month${GST_NOTE}.`,
      h1: "A free website for your business, looked after every month.",
      lede: `We design up to 10 pages for ${FREE} and put them online. Then we keep them hosted, secure and up to date, so you never deal with the technical side.`,
      glance: ["Up to 10 pages, built for you", "Live in about a week", "2 edits a month, 15 minutes each", "A monthly website health report"],
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
          { icon: "FileText", title: "The pages we build", items: ["Homepage and About Us", "Services or Products", "Contact Us and FAQ", "Individual service pages", "Works on every phone"] },
          { icon: "Phone", title: "Ways for customers to reach you", items: ["Contact and enquiry forms", "Click-to-call buttons", "WhatsApp click-to-chat", "Every enquiry emailed to you"] },
          { icon: "ShieldCheck", title: "Kept safe and online", items: ["Hosting and SSL that stays valid", "Regular backups", "Security updates", "Uptime monitoring"] },
          { icon: "LockKey", title: "Privacy done properly", items: ["A privacy policy written for your business", "Privacy notices on your forms", "Consent where the law requires it"] },
          { icon: "Headset", title: "A person to ask", items: ["Human support when you need it", "2 edits a month, 15 minutes each", "A monthly website health report"] },
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
      id: "growth",
      slug: "social-media-and-ads",
      path: "/services/social-media-and-ads",
      metaTitle: `Social Media and Ads, ${GROWTH_PRICE} a month | Brandbasket`,
      metaDescription: `We plan your Instagram and Facebook posts, reply to reviews and run your ads for ${GROWTH_PRICE} a month${GST_NOTE}. Ad money with packages.`,
      h1: "Posts, reviews and ads, handled for you.",
      lede: `We plan your Instagram and Facebook posts with you, keep your Google Business Profile current and run your Facebook and Instagram ads. You get a report every month.`,
      glance: ["Posts planned with you and scheduled", "Google Business Profile kept current", `Ads managed, up to ${adCap} a month of your budget`, "A monthly posts, profile and ads report"],
      who: {
        heading: "Who it is for.",
        items: [
          { title: "You know you should post, but never have the time", body: "We plan the month with you, write the captions and schedule the posts." },
          { title: "Reviews and messages pile up unanswered", body: "We watch your reviews and draft replies, so customers see a business that answers." },
          { title: "You have boosted posts and cannot tell what worked", body: "We plan, set up and launch your ads, watch your budget and show the result in a report." },
        ],
      },
      does: {
        heading: "What we do.",
        lede: "Four jobs every month, so your business keeps showing up where customers look.",
        groups: [
          { icon: "InstagramLogo", title: "Posts that go out on time", items: ["Instagram and Facebook posts, planned with you", "Captions written for you", "Posts scheduled"] },
          { icon: "MapPin", title: "A Google Business Profile that is current", items: ["Posts and updates on your profile", "Your details kept consistent with your website"] },
          { icon: "Star", title: "Reviews, watched", items: ["Review monitoring", "Reply drafts for you to approve"] },
          { icon: "Megaphone", title: "Ads, planned and run", items: ["Facebook and Instagram ads: plan, setup and launch", `Monitoring and budget pacing, up to ${adCap} a month of your budget`] },
          { icon: "ChartLineUp", title: "A report in plain words", items: ["Posts, profile and ads, once a month", "Human support when you need it"] },
        ],
      },
      spotlight: {
        kind: "ad-money",
        heading: "Start together and we add ad money.",
        body: [
          `Take two or three plans together at your first checkout and we add ad money to your account every month: ${lowestAdMoney} with Website + Social or Social + SEO, and ${highestAdMoney} with all three.`,
          "The ad money comes only when you start the plans together, at your first checkout.",
        ],
      },
      how: {
        heading: "How it works.",
        steps: [
          { when: "Day 1", what: "A 15-minute call about your customers and budget" },
          { when: "Week 1", what: "We plan your posts with you and set up your ads" },
          { when: "Every month", what: "We post, watch reviews and ads, and send a report" },
        ],
      },
      limits: {
        heading: "What is not included.",
        lede: "So there are no surprises.",
        items: excludesOf("growth", currency),
      },
      faq: [
        {
          q: "Is ad spend included?",
          a: `No. You pay Meta directly for your own ads, and ${GROWTH.name} manages up to ${adCap} a month of it. Packages started together add our ad money on top.`,
        },
        {
          q: "What does a reel cost?",
          a: `Reels and video editing are not part of the plan. Each reel is ${perReel}, quoted before we start.`,
        },
        {
          q: "Do I need the website plan?",
          a: `No. Every plan can be bought on its own. Taken with ${WEBSITE.name} or ${SEARCH.name}, the prices drop.`,
        },
        {
          q: "Do you guarantee leads or sales?",
          a: "No one honestly can. You see the work and the numbers in a report every month.",
        },
        { q: "Can I cancel?", a: CANCEL_ANSWER },
      ],
    },
    {
      id: "search",
      slug: "local-seo-aeo",
      path: "/services/local-seo-aeo",
      metaTitle: `Local SEO + AEO, ${SEARCH_PRICE} a month | Brandbasket`,
      metaDescription: `We improve how your business shows up on Google and in AI answers: local research, 5 pages a month and a monthly report. ${SEARCH_PRICE} a month${GST_NOTE}.`,
      h1: "Be the answer when customers search near you.",
      lede: "We improve how your business shows up on Google and in AI answers, with local research, 5 optimised pages a month and a report you can read.",
      glance: ["Local keyword and competitor research", "5 pages optimised a month", "Your questions shaped into direct answers", "A monthly report on rankings, traffic and enquiries"],
      who: {
        heading: "Who it is for.",
        items: [
          { title: "Customers find your competitors first", body: "We find the searches your customers make near you, and fix your pages and listings to match them." },
          { title: "Your details differ from one place to the next", body: "Name, address and phone number are checked across your website, Google and the directories." },
          { title: "Customers now ask AI tools before they search", body: "We shape your pages into clear answers that Google and AI tools can use." },
        ],
      },
      does: {
        heading: "What we do.",
        lede: "Research first, then a steady monthly routine.",
        groups: [
          { icon: "MagnifyingGlass", title: "Research", items: ["Local keyword and competitor research", "The questions your customers ask"] },
          { icon: "Article", title: "5 pages a month", items: ["Titles, descriptions and headings", "Service area page optimisation"] },
          { icon: "Buildings", title: "Your local footprint", items: ["Name, address and phone consistency", "Schema, citation and directory audit"] },
          { icon: "Question", title: "Answers for AI search", items: ["AEO: your customers' questions shaped into direct answers", "AI visibility tracking where measurable"] },
          { icon: "ChartLineUp", title: "A report you can read", items: ["Rankings, traffic and enquiries, once a month", "Human support when you need it"] },
        ],
      },
      spotlight: {
        kind: "explainer",
        heading: "What is AEO?",
        body: [
          "AEO is answer engine optimisation. More people now ask Google's AI answers, ChatGPT or a voice assistant a question instead of scrolling a list of links.",
          "AEO shapes your pages so those tools can quote your business: a clear answer to each question your customers really ask, set up so a machine can read it.",
        ],
      },
      how: {
        heading: "How it works.",
        steps: [
          { when: "Day 1", what: "A 15-minute call about your services and areas" },
          { when: "Week 1", what: "We research your searches and audit your listings" },
          { when: "Every month", what: "We optimise 5 pages, fix what the audit found and send a report" },
        ],
      },
      limits: {
        heading: "What is not included.",
        lede: "So there are no surprises.",
        items: excludesOf("search", currency),
      },
      faq: [
        {
          q: "What is the difference between SEO and AEO?",
          a: "SEO helps your business rank in the list of results on Google. AEO helps your pages be used when Google's AI answers, ChatGPT or a voice assistant answer a question directly. We do both.",
        },
        {
          q: "Do you guarantee rankings or AI citations?",
          a: "No one honestly can. You see the work and the numbers in a report every month.",
        },
        {
          q: "Do you write new pages?",
          a: "We optimise 5 pages a month: titles, descriptions and headings. New landing pages and unlimited writing are quoted separately, before we start.",
        },
        {
          q: "Do I need the website plan?",
          a: `No. Every plan can be bought on its own. Taken with ${WEBSITE.name} or ${GROWTH.name}, the prices drop.`,
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
  packages: {
    heading: "Add a plan, pay less.",
    aloneLabel: "On its own",
    saveLabel: "You save",
    adMoneyLabel: "Ad money a month",
    adMoneyNote: "Only when the plans start together at your first checkout.",
    none: "None",
  },
  faqHeading: "Questions about this plan.",
  exploreMore: "Explore more",
} as const;

/** The two lines of service copy that name the price basis: the unit under a price, and the packages lede. */
export function serviceMoneyCopy(currency: Currency): { readonly perMonth: string; readonly packagesLede: string } {
  const offers = `Any two plans are ${TWO_PLAN_PERCENT}% off and all three are ${ALL_PLAN_PERCENT}% off.`;
  return currency === "INR"
    ? { perMonth: "a month, GST included", packagesLede: `${offers} Every price includes GST.` }
    : { perMonth: "a month", packagesLede: offers };
}
