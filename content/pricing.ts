// content/pricing.ts
// Copy for /pricing, word for word from the approved mock (docs/design/mock.html, #view-pricing).
// Every price, total, GST figure and cap is built from lib/pricing.ts. The hero plan rows and basket labels live in
// content/basket.ts. Cancellation wording reuses content/legal/cancellation.ts so pricing and legal agree.
import { AD_BUDGET_CAP, EXTRA_HOURLY_RATE, formatInr, GST_LABEL, PACKAGES, packageSaving, packageTotal, PLANS, type Package, type PlanId } from "@/lib/pricing";
import { CANCEL_ANSWER, PLAN_CHANGE_ANSWER } from "./legal/cancellation";
import type { FaqItem } from "./types";

export type PricingIconKey = "Globe" | "TrendUp" | "MagnifyingGlass" | "CalendarCheck" | "SignOut" | "Clock" | "Wallet";

const MANAGED_MONTHLY = formatInr(PLANS.website.monthly);
const AD_CAP = formatInr(AD_BUDGET_CAP);
const HOURLY = formatInr(EXTRA_HOURLY_RATE);

function packageById(id: Package["id"]): Package {
  const pkg = PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new RangeError(`No package ${id}`);
  return pkg;
}
const adCredit = (id: Package["id"]): number => packageById(id).adCredit;
/** The package for a business that already has a website. */
const SOCIAL_SEO = packageById("growth-search");

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
  /** Monthly total before GST, for example "₹10,400". */
  readonly price: string;
  readonly priceSuffix: string;
}

function isFourCells(cells: readonly CompareCell[]): cells is CompareCells {
  return cells.length === 4;
}

/** One cell per package, in `PACKAGES` order. */
function packageCells(cell: (pkg: Package) => CompareCell): CompareCells {
  const cells = PACKAGES.map(cell);
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
  lede: "Four packages. Every price is monthly, before GST, and stays for as long as you keep every plan in the package.",
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
    }),
  ),
  groups: [
    {
      title: "The package",
      rows: [
        { label: "Off the plans' own prices", cells: packageCells((pkg) => `${pkg.percent}%`) },
        { label: "You save each month", cells: packageCells((pkg) => formatInr(packageSaving(pkg.pick))) },
        {
          label: "Ad money from us, every month",
          note: "When you start with the package",
          cells: packageCells((pkg) => (pkg.adCredit > 0 ? formatInr(pkg.adCredit) : NO)),
        },
      ],
    },
    {
      title: "Your website",
      rows: [
        { label: "Hosting, SSL, backups and security", cells: [YES, YES, NO, YES] },
        { label: "Small edits", note: "Up to 30 minutes each", cells: ["2 a month", "2 a month", NO, "2 a month"] },
        { label: "Analytics, indexing and sitemap checks", cells: [YES, YES, NO, YES] },
      ],
    },
    {
      title: "Social media and ads",
      rows: [
        { label: "Instagram and Facebook posts", note: "Designed, written and scheduled", cells: ["Planned with you", NO, "Planned with you", "Planned with you"] },
        { label: "Google Business Profile posts", cells: ["Planned with you", NO, "Planned with you", "Planned with you"] },
        { label: "Review monitoring and reply drafts", cells: [YES, NO, YES, YES] },
        { label: "Facebook and Instagram ads", note: `Up to ${AD_CAP} a month of your budget managed, plus our ad money`, cells: [YES, NO, YES, YES] },
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
      ],
    },
  ],
};

export interface DetailList {
  readonly heading: string;
  readonly items: readonly string[];
}

export interface DetailColumn extends DetailList {
  /** "excluded" columns use the minus icon and the muted style. */
  readonly kind: "included" | "excluded";
  /** Further lists in the same column, under the first. */
  readonly more?: readonly DetailList[];
  /** Small note under the lists. */
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
        heading: "Instagram and Facebook",
        kind: "included",
        items: ["Posts each month, planned with you", "Captions written for you", "Posts scheduled for you"],
        more: [
          {
            heading: "Google Business Profile",
            items: [
              "Business details and category review",
              "Regular posts: updates, offers, services",
              "Photo updates from your images or agreed creatives",
              "Hours, contact and website link checks",
              "Review monitoring and reply suggestions",
              "Monthly profile report",
            ],
          },
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
        items: ["Ad spend is paid to Meta by you", `We manage up to ${AD_CAP} a month of your budget`, `Reels and video editing at ${HOURLY} an hour`],
        note: `Start Social with the website or with Local SEO and we add ${formatInr(adCredit("website-growth"))} a month to your ads, or ${formatInr(adCredit("everything"))} a month with all three.`,
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
    body: "No notice period. Your plans keep running until the end of the month you have paid for, and your domain stays yours.",
  },
  {
    icon: "Clock",
    title: `${HOURLY} an hour for extras`,
    body: "New pages, extra edits and video editing. Always quoted before we start.",
  },
  {
    icon: "Wallet",
    title: "Ads and tools are paid by you",
    body: "Domain fees, your own ad spend and paid tools are billed to you directly.",
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
    q: "Do I need the website plan?",
    a: `No. Every plan can be bought on its own. If you already have a website, ${SOCIAL_SEO.name} is ${SOCIAL_SEO.percent}% off.`,
  },
  {
    q: "Can I add or drop a plan later?",
    a: PLAN_CHANGE_ANSWER,
  },
  {
    q: "Is ad spend included?",
    a: `No. You pay Meta directly for your own ads, and ${PLANS.growth.name} manages up to ${AD_CAP} a month of it. Packages started together add our ad money on top.`,
  },
  {
    q: "Do you guarantee rankings or leads?",
    a: "No one honestly can. You see the work and the numbers in a report every month.",
  },
];
