// content/pricing.ts
// Copy for /pricing, word for word from the approved mock (docs/design/mock.html, #view-pricing).
// Every price, total, GST figure and cap is built from lib/pricing.ts. The hero plan rows and basket labels live in
// content/basket.ts. Cancellation wording reuses content/legal/cancellation.ts so pricing and legal agree.
import { AD_BUDGET_CAP, formatInr, PACKAGES, PLANS, REEL_RATE, type Package, type PlanId } from "@/lib/pricing";
import { CANCEL_ANSWER, PLAN_CHANGE_ANSWER } from "./legal/cancellation";
import type { FaqItem } from "./types";

const MANAGED_MONTHLY = formatInr(PLANS.website.monthly);
const AD_CAP = formatInr(AD_BUDGET_CAP);
const PER_REEL = formatInr(REEL_RATE);

function packageById(id: Package["id"]): Package {
  const pkg = PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new RangeError(`No package ${id}`);
  return pkg;
}
/** The package for a business that already has a website. */
const SOCIAL_SEO = packageById("growth-search");

/** Locked copy: change only with the owner's yes. The offer line is OFFER in content/home.ts. */
export const PRICING_HERO = {
  title: "Simple monthly plans.",
  accent: "Start with your website.",
} as const;

/** One plan as a column of the comparison (docs/design/homepage-v2.html, #cmp-new). Prices come from lib/pricing. */
export interface PlanColumn {
  readonly id: PlanId;
  readonly name: string;
  readonly price: string;
  readonly priceNote: string;
  /** A short tag under the name, only where it adds a fact. */
  readonly tag?: string;
  readonly audience: string;
  readonly does: readonly string[];
  readonly excludes: readonly string[];
}

export const COMPARE = {
  heading: "Which plan fits you?",
  lede: "Three plans, each on its own. Prices are monthly, GST included. Add more than one and the prices drop.",
  doesLabel: "What we do",
  excludesLabel: "Not included",
} as const;

const PRICE_NOTE = "a month, incl. GST";

/** Order is the order on the page: Website, Social, Search. Numbers are built from lib/pricing, so a price change shows here. */
export const PLAN_COLUMNS: readonly PlanColumn[] = [
  {
    id: "website",
    name: PLANS.website.name,
    price: formatInr(PLANS.website.monthly),
    priceNote: PRICE_NOTE,
    tag: "Free build",
    audience: "For businesses that want a website without the technical work.",
    does: [
      "Up to 10 pages, built for you",
      "Enquiry forms, click to call and WhatsApp",
      "Hosting, SSL and backups",
      "Security updates and uptime monitoring",
      "Privacy and DPDP readiness support",
      "Human support when you need it",
      "2 edits a month, 30 minutes each",
      "A monthly website health report",
    ],
    excludes: ["Domain registration or renewal", "Extra pages or a redesign, quoted first", "Content writing, SEO or ads", "E-commerce or new features"],
  },
  {
    id: "growth",
    name: PLANS.growth.name,
    price: formatInr(PLANS.growth.monthly),
    priceNote: PRICE_NOTE,
    audience: "For businesses that want posts, reviews and ads handled for them.",
    does: [
      "Instagram and Facebook posts, planned with you",
      "Captions written and posts scheduled",
      "Google Business Profile posts and updates",
      "Review monitoring and reply drafts",
      "Facebook and Instagram ads: plan, setup and launch",
      `Ad monitoring and budget pacing, up to ${AD_CAP} a month of your budget`,
      "Human support when you need it",
      "A monthly posts, profile and ads report",
    ],
    excludes: ["Ad spend, paid to Meta by you", `Reels and video editing, ${PER_REEL} per reel`, "Guaranteed leads or sales"],
  },
  {
    id: "search",
    name: PLANS.search.name,
    price: formatInr(PLANS.search.monthly),
    priceNote: PRICE_NOTE,
    audience: "For businesses that want to be found on Google and in AI answers.",
    does: [
      "Local keyword and competitor research",
      "5 pages optimised a month: titles, descriptions, headings",
      "Service area page optimisation",
      "Name, address and phone consistency",
      "Schema, citation and directory audit",
      "AEO: your customers' questions shaped into direct answers",
      "AI visibility tracking where measurable",
      "A monthly report on rankings, traffic and enquiries",
    ],
    excludes: ["Guaranteed rankings or AI citations", "Paid backlinks or placements", "Unlimited writing, or new landing pages (quoted separately)"],
  },
];

/** What every plan has in common, shown once under the columns. */
export const EVERY_PLAN = {
  label: "Every plan",
  items: ["Cancel anytime, no notice period", "Billed monthly, GST included", "A real person to ask", "A monthly report in plain words"],
} as const;

/** One list in an Everything included group: ticked lines, or lines that are quoted or added with other plans. */
export interface DetailColumn {
  readonly heading: string;
  /** "excluded" columns use the minus icon and the muted style. */
  readonly kind: "included" | "excluded";
  readonly items: readonly string[];
}

export type IncludedIconKey = "FileText" | "Phone" | "PlugsConnected" | "ShieldCheck" | "LockKey" | "ChartLineUp" | "Headset";

export interface IncludedGroup {
  readonly id: string;
  readonly icon: IncludedIconKey;
  /** One of the site's plan colours (--c-site, --c-growth, --c-search, --c-care). */
  readonly colour: "site" | "growth" | "search" | "care";
  readonly title: string;
  readonly summary: string;
  readonly columns: readonly DetailColumn[];
}

export interface IncludedPart {
  readonly groups: readonly IncludedGroup[];
}

/**
 * "Everything included" (docs/design/homepage-v2.html, docs/plans/21-pricing-page-content.md): the owner's checklist cut
 * to what a shop owner can check. Lines that wait on an owner decision are left out until it is made: tested backup
 * restores, revision history, published support hours and the privacy-request contact.
 */
export const INCLUDED = {
  heading: "Everything",
  accent: "included.",
  lede: "What you get with the free website, and what the monthly plan keeps doing for you.",
  toggle: "Details",
  build: {
    groups: [
      {
        id: "pages",
        icon: "FileText",
        colour: "site",
        title: "Website pages",
        summary: "Up to 10 pages, built for you",
        columns: [
          { heading: "The pages", kind: "included", items: ["Homepage", "About Us", "Services or Products", "Contact Us", "FAQ", "Individual service pages"] },
          { heading: "The essentials", kind: "included", items: ["Privacy Policy and Terms and Conditions", "Refund and shipping policies, where your business needs them", "Reviews and testimonials on your pages", "Works on every phone"] },
        ],
      },
      {
        id: "enquiries",
        icon: "Phone",
        colour: "growth",
        title: "Enquiries and conversion",
        summary: "Forms, calls and WhatsApp",
        columns: [
          { heading: "Ways to reach you", kind: "included", items: ["Contact and enquiry forms", "Click-to-call buttons", "WhatsApp click-to-chat", "Every enquiry emailed to you"] },
          { heading: "Built to convert", kind: "included", items: ["Spam and bot protection", "Clear contact details, map and location", "Customer reviews and trust signals"] },
        ],
      },
      {
        id: "tools",
        icon: "PlugsConnected",
        colour: "site",
        title: "Connected tools",
        summary: "Maps, reviews and social",
        columns: [
          { heading: "Connected for you", kind: "included", items: ["Google Maps", "Your Google reviews", "Links to your social accounts"] },
          { heading: "Quoted separately", kind: "excluded", items: ["Chatbot", "Appointment booking and calendar", "Payment gateway and online payments", "Business email, billed by the provider"] },
        ],
      },
    ],
  },
  run: {
    groups: [
      {
        id: "security",
        icon: "ShieldCheck",
        colour: "site",
        title: "Security and reliability",
        summary: "Kept safe, backed up and watched",
        columns: [
          { heading: "Locked down", kind: "included", items: ["HTTPS and an SSL certificate that stays valid", "Secure login for you and your team", "Security updates and vulnerability checks"] },
          { heading: "Protected and recoverable", kind: "included", items: ["Regular backups and recovery support", "Uptime and error monitoring", "Recovery if something breaks"] },
        ],
      },
      {
        id: "privacy",
        icon: "LockKey",
        colour: "care",
        title: "Privacy and DPDP readiness",
        summary: "Handling customer data the right way",
        columns: [
          { heading: "Notices and consent", kind: "included", items: ["A privacy policy written for your business", "Privacy notices on your forms", "Consent where the law requires it"] },
          { heading: "The data you collect", kind: "included", items: ["Forms that ask only for what you need"] },
        ],
      },
      {
        id: "analytics",
        icon: "ChartLineUp",
        colour: "growth",
        title: "Analytics and reporting",
        summary: "Know what your website is doing",
        columns: [
          { heading: "What we set up", kind: "included", items: ["Google Search Console", "Enquiry form tracking", "Phone and WhatsApp click tracking", "A monthly website health report"] },
          { heading: "Added with the growth plans", kind: "excluded", items: ["Google Analytics 4 and Tag Manager", "Heatmaps and session recordings"] },
        ],
      },
      {
        id: "support",
        icon: "Headset",
        colour: "search",
        title: "Support and maintenance",
        summary: "Real people, every month",
        columns: [
          { heading: "Support", kind: "included", items: ["A clear way to reach us", "Change requests, 2 edits a month, 30 minutes each", "Help if you cancel or move"] },
          { heading: "Monthly checks", kind: "included", items: ["Forms and links tested", "Performance checks", "SEO and indexing checks", "Domain and SSL renewal monitoring", "Integration checks, where used"] },
        ],
      },
    ],
  },
  privacyNote: "Policy pages and consent banners alone do not establish legal compliance. We help you take the right steps, and your own data practices still matter.",
} as const satisfies {
  readonly heading: string;
  readonly accent: string;
  readonly lede: string;
  readonly toggle: string;
  readonly build: IncludedPart;
  readonly run: IncludedPart;
  readonly privacyNote: string;
};

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
