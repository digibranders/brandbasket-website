// content/pricing.ts
// Copy for /pricing, word for word from the approved mock (docs/design/mock.html, #view-pricing).
// Every price, total, GST figure and cap is built from lib/pricing.ts. The hero add-on rows and basket labels live in
// content/basket.ts. Cancellation wording reuses content/legal/cancellation.ts so pricing and legal agree.
import { AD_BUDGET_CAP, EXTRA_HOURLY_RATE, formatInr, GST_RATE, monthlyTotal, PACKAGES, PLANS, SIGNUP_ADDON_DISCOUNT_LABEL, type Package, type PlanId } from "@/lib/pricing";
import { ADDON_CHANGE, CANCELLATION_NOTICE, OWNERSHIP_ON_CANCEL } from "./legal/cancellation";
import type { FaqItem } from "./types";

export type PricingIconKey = "Globe" | "TrendUp" | "MagnifyingGlass" | "CalendarCheck" | "SignOut" | "Clock" | "Wallet";

const GST_PERCENT = `${Math.round(GST_RATE * 100)}%`;
const MANAGED_MONTHLY = formatInr(PLANS.website.monthly);
const AD_CAP = formatInr(AD_BUDGET_CAP);
const HOURLY = formatInr(EXTRA_HOURLY_RATE);

/** Locked copy: change only with the owner's yes. The offer line is OFFER in content/home.ts. */
export const PRICING_HERO = {
  title: "Simple monthly plans.",
  accent: "Start with your website.",
} as const;

/** One cell of the comparison table: included, not included, or a short quantity such as "2 a month". */
export type CompareCell = boolean | string;
/** One cell per package, in `PACKAGES` order: Website, Website + Growth, Website + Search, All three. */
export type CompareCells = readonly [CompareCell, CompareCell, CompareCell, CompareCell];

export interface CompareRow {
  readonly label: string;
  readonly note?: string;
  readonly cells: CompareCells;
}

export interface CompareGroup {
  readonly title: string;
  readonly rows: readonly CompareRow[];
}

export interface CompareColumn {
  readonly id: Package["id"];
  readonly name: string;
  /** Monthly total before GST, for example "₹9,999". */
  readonly price: string;
  readonly priceSuffix: string;
}

const YES = true;
const NO = false;

export interface Compare {
  readonly heading: string;
  readonly lede: string;
  readonly tabsLabel: string;
  readonly rowHeader: string;
  readonly included: string;
  readonly notIncluded: string;
  readonly columns: readonly CompareColumn[];
  readonly groups: readonly CompareGroup[];
}

export const COMPARE: Compare = {
  heading: "Which basket fits you?",
  lede: `Four ways to combine the plans. Every price is monthly, before GST. Add-ons chosen as you start are ${SIGNUP_ADDON_DISCOUNT_LABEL} off.`,
  tabsLabel: "Show one basket",
  rowHeader: "What is included",
  included: "Included",
  notIncluded: "Not included",
  columns: PACKAGES.map(
    (pkg): CompareColumn => ({ id: pkg.id, name: pkg.name, price: formatInr(monthlyTotal(pkg.addons)), priceSuffix: " /mo" }),
  ),
  groups: [
    {
      title: "Your website",
      rows: [
        { label: "Hosting, SSL, backups and security", cells: [YES, YES, YES, YES] },
        { label: "Small edits", note: "Up to 30 minutes each", cells: ["2 a month", "2 a month", "2 a month", "2 a month"] },
        { label: "Analytics, indexing and sitemap checks", cells: [YES, YES, YES, YES] },
      ],
    },
    {
      title: "Google and social",
      rows: [
        { label: "Google Business Profile posts", cells: [NO, "8 a month", NO, "8 a month"] },
        { label: "Review monitoring and reply drafts", cells: [NO, YES, NO, YES] },
        { label: "Facebook and Instagram ads", note: `Ad budget up to ${AD_CAP} a month, paid by you`, cells: [NO, YES, NO, YES] },
      ],
    },
    {
      title: "Search and AI answers",
      rows: [
        { label: "Local keyword and competitor research", cells: [NO, NO, YES, YES] },
        { label: "Pages optimised", cells: [NO, NO, "5 a month", "5 a month"] },
        { label: "AEO: FAQs, schema and AI visibility", cells: [NO, NO, YES, YES] },
        { label: "Ranking, traffic and enquiry tracking", cells: [NO, NO, YES, YES] },
      ],
    },
    {
      title: "Every plan",
      rows: [{ label: "Monthly report", cells: ["Website health", "+ ads and profile", "+ SEO and AEO", "All of it"] }],
    },
  ],
};

export interface DetailColumn {
  readonly heading: string;
  /** "excluded" columns use the minus icon and the muted style. */
  readonly kind: "included" | "excluded";
  readonly items: readonly string[];
  /** Small note under the list. */
  readonly note?: string;
}

export interface PlanDetail {
  readonly id: PlanId;
  readonly name: string;
  readonly icon: PricingIconKey;
  /** The line under the plan name, for example "+₹7,000 a month · Google Business Profile and Meta ads". */
  readonly summary: string;
  readonly columns: readonly DetailColumn[];
}

export const PLAN_DETAILS_INTRO = {
  heading: "What each plan includes.",
  lede: "Open a plan for every monthly task, and what it leaves out.",
  toggle: "Details",
} as const;

export const PLAN_DETAILS: readonly PlanDetail[] = [
  {
    id: "website",
    name: PLANS.website.name,
    icon: "Globe",
    summary: `${MANAGED_MONTHLY} a month · for businesses that want a site without the technical work`,
    columns: [
      {
        heading: "Looking after your site",
        kind: "included",
        items: [
          "Hosting and SSL certificate",
          "Uptime and availability monitoring",
          "Security checks and routine maintenance",
          "Regular backups and recovery support",
          "Bug fixes and small mobile fixes",
        ],
      },
      {
        heading: "Keeping it working for you",
        kind: "included",
        items: [
          "Contact and enquiry form checks",
          "Basic analytics setup and monitoring",
          "Indexing and sitemap checks",
          "Monthly health check and support",
          "2 small content edits a month, 30 minutes each",
        ],
      },
      {
        heading: "Not included",
        kind: "excluded",
        items: [
          "Domain registration or renewal",
          "New pages or redesigns",
          "Content writing, SEO or AEO",
          "Ads or ad spend",
          "E-commerce or new features",
        ],
      },
    ],
  },
  {
    id: "growth",
    name: PLANS.growth.name,
    icon: "TrendUp",
    summary: `+${formatInr(PLANS.growth.monthly)} a month · Google Business Profile and Meta ads`,
    columns: [
      {
        heading: "Google Business Profile",
        kind: "included",
        items: [
          "Business details and category review",
          "Up to 8 posts a month: updates, offers, services",
          "Photo updates from your images or agreed creatives",
          "Hours, contact and website link checks",
          "Review monitoring and reply suggestions",
          "Monthly profile report",
        ],
      },
      {
        heading: "Facebook and Instagram ads",
        kind: "included",
        items: [
          "Monthly campaign plan",
          "Setup, audience, objective and placements",
          "Ad copy and basic creatives",
          "Launch, monitoring and budget pacing",
          "A/B tests where budget allows",
          "Monthly ads report",
        ],
      },
      {
        heading: "Good to know",
        kind: "excluded",
        items: ["Ad spend is paid to Meta by you", `Covers ad budgets up to ${AD_CAP} a month`, `Reels and video editing at ${HOURLY} an hour`],
        note: "Needs the Managed Website plan.",
      },
    ],
  },
  {
    id: "search",
    name: PLANS.search.name,
    icon: "MagnifyingGlass",
    summary: `+${formatInr(PLANS.search.monthly)} a month · local search and AI answer visibility`,
    columns: [
      {
        heading: "Local SEO",
        kind: "included",
        items: [
          "Local keyword and intent research",
          "Competitor analysis",
          "Titles, descriptions and headings, up to 5 pages a month",
          "Service area page optimisation",
          "Name, address and phone consistency",
          "Schema, citation and directory audit",
          "Ranking, traffic and enquiry tracking",
        ],
      },
      {
        heading: "Answer Engine Optimisation",
        kind: "included",
        items: [
          "Research the questions customers ask",
          "Content shaped into direct answers",
          "FAQ planning and structured data",
          "Brand and entity consistency checks",
          "Topic and content gap analysis",
          "AI visibility tracking where measurable",
        ],
      },
      {
        heading: "Not included",
        kind: "excluded",
        items: [
          "Guaranteed rankings or AI citations",
          "Guaranteed leads or traffic",
          "Paid backlinks or placements",
          "Unlimited writing or new landing pages",
        ],
        note: "Needs the Managed Website plan. New landing pages are quoted separately.",
      },
    ],
  },
];

export interface GoodToKnowItem {
  readonly icon: PricingIconKey;
  readonly title: string;
  readonly body: string;
}

export const GOOD_TO_KNOW_HEADING = { text: "Good to know", accent: "before you start." } as const;

export const GOOD_TO_KNOW: readonly GoodToKnowItem[] = [
  {
    icon: "CalendarCheck",
    title: "Billed monthly, plus GST",
    body: `Pay one month at a time, plus ${GST_PERCENT} GST. Your invoice shows both.`,
  },
  {
    icon: "SignOut",
    title: "Cancel any month",
    body: `Give ${CANCELLATION_NOTICE} to stop. ${OWNERSHIP_ON_CANCEL}`,
  },
  {
    icon: "Clock",
    title: `${HOURLY} an hour for extras`,
    body: "New pages, extra edits and video editing. Always quoted before we start.",
  },
  {
    icon: "Wallet",
    title: "Ads and tools are paid by you",
    body: "Domain fees, ad spend and paid tools are billed to you directly.",
  },
];

export const PRICING_FAQ_HEADING = "Questions about pricing.";

export const PRICING_FAQ: readonly FaqItem[] = [
  {
    q: "Is the website build really free?",
    a: `Yes. We design and build it for ₹0. The ${MANAGED_MONTHLY} monthly plan keeps it hosted, secure and up to date.`,
  },
  {
    q: "Can I cancel?",
    a: `Yes, with ${CANCELLATION_NOTICE}. ${OWNERSHIP_ON_CANCEL}`,
  },
  {
    q: "Can I add or drop Growth and Search later?",
    a: `Yes. ${ADDON_CHANGE}`,
  },
  {
    q: "Is ad spend included?",
    a: `No. You pay Meta directly for ads. ${PLANS.growth.name} manages budgets up to ${AD_CAP} a month.`,
  },
  {
    q: "Do you guarantee rankings or leads?",
    a: "No one honestly can. You see the work and the numbers in a report every month.",
  },
];
