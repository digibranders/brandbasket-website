// content/pricing.ts
// Copy for /pricing, word for word from the approved mock (docs/design/mock.html, #view-pricing).
// Every price, total, GST figure and cap is built from lib/pricing.ts. The hero add-on rows and basket labels live in
// content/basket.ts. Cancellation wording reuses content/legal/cancellation.ts so pricing and legal agree.
import { AD_BUDGET_CAP, EXTRA_HOURLY_RATE, formatInr, GST_LABEL, PACKAGES, packageSaving, packageTotal, PLANS, type Package, type PlanId } from "@/lib/pricing";
import { CANCEL_ANSWER } from "./legal/cancellation";
import type { FaqItem } from "./types";

export type PricingIconKey = "Globe" | "TrendUp" | "MagnifyingGlass" | "CalendarCheck" | "SignOut" | "Clock" | "Wallet";

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
/** One cell per package, in `PACKAGES` order: Website + Social, Website + SEO, Social + SEO, All three. */
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
  /** The offer: "20% off, save ₹2,600 a month". */
  readonly note: string;
  /** The monthly ad credit, only for packages that carry one. */
  readonly creditNote?: string;
}

function isFourCells(cells: readonly CompareCell[]): cells is CompareCells {
  return cells.length === 4;
}

/** The ad credit of each package, in `PACKAGES` order. */
function adCreditCells(): CompareCells {
  const cells = PACKAGES.map((p): CompareCell => (p.adCredit > 0 ? formatInr(p.adCredit) : "None"));
  if (!isFourCells(cells)) throw new RangeError(`Expected 4 packages, got ${cells.length}`);
  return cells;
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
  lede: "Four packages. Every price is monthly, before GST, and the package price stays for as long as you keep every plan in it.",
  tabsLabel: "Show one basket",
  rowHeader: "What is included",
  included: "Included",
  notIncluded: "Not included",
  columns: PACKAGES.map(
    (pkg): CompareColumn => ({
      id: pkg.id,
      name: pkg.name,
      price: formatInr(packageTotal(pkg.pick)),
      priceSuffix: " /mo",
      note: `${pkg.percent}% off, save ${formatInr(packageSaving(pkg.pick))} a month`,
      ...(pkg.adCredit > 0 ? { creditNote: `+ ${formatInr(pkg.adCredit)} a month for your ads` } : {}),
    }),
  ),
  groups: [
    {
      title: "Your website",
      rows: [
        { label: "Hosting, SSL, backups and security", cells: [YES, YES, NO, YES] },
        { label: "Small edits", note: "Up to 30 minutes each", cells: ["2 a month", "2 a month", NO, "2 a month"] },
        { label: "Analytics, indexing and sitemap checks", cells: [YES, YES, NO, YES] },
      ],
    },
    {
      title: "Google and social",
      rows: [
        { label: "Google Business Profile posts", cells: ["8 a month", NO, "8 a month", "8 a month"] },
        { label: "Review monitoring and reply drafts", cells: [YES, NO, YES, YES] },
        { label: "Facebook and Instagram ads", note: `Up to ${AD_CAP} a month of your own budget managed, plus our ad credit`, cells: [YES, NO, YES, YES] },
      ],
    },
    {
      title: "Search and AI answers",
      rows: [
        { label: "Local keyword and competitor research", cells: [NO, YES, YES, YES] },
        { label: "Pages optimised", cells: [NO, "5 a month", "5 a month", "5 a month"] },
        { label: "AEO: FAQs, schema and AI visibility", cells: [NO, YES, YES, YES] },
        { label: "Ranking, traffic and enquiry tracking", cells: [NO, YES, YES, YES] },
      ],
    },
    {
      title: "Every plan",
      rows: [
        { label: "Monthly report", cells: ["Site + social", "Site + search", "Social + search", "All of it"] },
        { label: "Ad credit from us, every month", cells: adCreditCells() },
      ],
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
  /** The line under the plan name, for example "₹10,000 a month · Instagram, Facebook, Google profile and Meta ads". */
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
    summary: `${formatInr(PLANS.growth.monthly)} a month · Instagram, Facebook, Google profile and Meta ads`,
    columns: [
      {
        heading: "Social and Google profile",
        kind: "included",
        items: [
          "Instagram and Facebook: 12 designed posts a month, with captions and scheduling",
          "Google Business Profile: 8 posts a month",
          "Review replies",
          "Monthly report",
        ],
      },
      {
        heading: "Meta ads",
        kind: "included",
        items: [
          `Meta ads managed for up to ${AD_CAP} a month of your budget, plus the ad credit`,
          "Setup, audience, objective and placements",
          "Launch, monitoring and budget pacing",
          "A/B tests where budget allows",
        ],
      },
      {
        heading: "Good to know",
        kind: "excluded",
        items: ["Ad spend is paid to Meta by you", `Covers ad budgets up to ${AD_CAP} a month`, `Reels at ${HOURLY} an hour`],
      },
    ],
  },
  {
    id: "search",
    name: PLANS.search.name,
    icon: "MagnifyingGlass",
    summary: `${formatInr(PLANS.search.monthly)} a month · local search and AI answer visibility`,
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
        note: "New landing pages are quoted separately.",
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
    body: `Pay one month at a time, plus ${GST_LABEL} GST. Your invoice shows both.`,
  },
  {
    icon: "SignOut",
    title: "Cancel anytime",
    body: "No notice period. Your website stays online until the end of the month you have paid for, and your domain stays yours.",
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
    a: CANCEL_ANSWER,
  },
  {
    q: "Can I add or drop a plan later?",
    a: "Yes. Add a plan any time and your basket moves to the package price from your next bill. Drop one from a package and the plans you keep go back to their own prices from your next bill, and the package offer ends.",
  },
  {
    q: "Is ad spend included?",
    a: `No. You pay Meta directly for your own ads, and ${PLANS.growth.name} manages up to ${AD_CAP} a month of it. Packages with ad credit add our money on top.`,
  },
  {
    q: "Do you guarantee rankings or leads?",
    a: "No one honestly can. You see the work and the numbers in a report every month.",
  },
];
