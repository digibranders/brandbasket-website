// content/pricing.ts
// Copy for /pricing, word for word from the approved mock (docs/design/mock.html, #view-pricing).
// Every price, total and cap is built from lib/pricing.ts, per currency. Rupee copy says GST is included; dollar copy
// never mentions a tax. The hero plan rows and basket labels live in content/basket.ts. Cancellation wording reuses
// content/legal/cancellation.ts so pricing and legal agree.
import { type Currency, formatMoney } from "@/lib/currency";
import { extrasFor, PACKAGES, PLANS, planPrice, type Package, type PlanId } from "@/lib/pricing";
import { CANCEL_ANSWER, PLAN_CHANGE_ANSWER } from "./legal/cancellation";
import type { FaqItem } from "./types";

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

export interface CompareCopy {
  readonly heading: string;
  readonly lede: string;
  readonly doesLabel: string;
  readonly excludesLabel: string;
}

export function compareCopy(currency: Currency): CompareCopy {
  return {
    heading: "Which plan fits you?",
    lede: `Three plans, each on its own. Prices are monthly${currency === "INR" ? ", GST included" : ""}. Add more than one and the prices drop.`,
    doesLabel: "What we do",
    excludesLabel: "Not included",
  };
}

/** Order is the order on the page: Website, Social, Search. Numbers are built from lib/pricing, so a price change shows here. */
export function planColumns(currency: Currency): readonly PlanColumn[] {
  const { adBudgetCap, reel } = extrasFor(currency);
  const adCap = formatMoney(adBudgetCap, currency);
  const perReel = formatMoney(reel, currency);
  const priceNote = currency === "INR" ? "a month, incl. GST" : "a month";
  return [
    {
      id: "website",
      name: PLANS.website.name,
      price: formatMoney(planPrice("website", currency), currency),
      priceNote,
      tag: "Free build",
      audience: "For businesses that want a website without the technical work.",
      does: [
        "Up to 10 pages, built for you",
        "Enquiry forms, click to call and WhatsApp",
        "Hosting, SSL and backups",
        "Security updates and uptime monitoring",
        "Privacy and DPDP readiness support",
        "Human support when you need it",
        "2 edits a month, 15 minutes each",
        "A monthly website health report",
      ],
      excludes: ["Domain registration or renewal", "Extra pages or a redesign, quoted first", "Content writing, SEO or ads", "E-commerce or new features"],
    },
    {
      id: "growth",
      name: PLANS.growth.name,
      price: formatMoney(planPrice("growth", currency), currency),
      priceNote,
      audience: "For businesses that want posts, reviews and ads handled for them.",
      does: [
        "Instagram and Facebook posts, planned with you",
        "Captions written and posts scheduled",
        "Google Business Profile posts and updates",
        "Review monitoring and reply drafts",
        "Facebook and Instagram ads: plan, setup and launch",
        `Ad monitoring and budget pacing, up to ${adCap} a month of your budget`,
        "Human support when you need it",
        "A monthly posts, profile and ads report",
      ],
      excludes: ["Ad spend, paid to Meta by you", `Reels and video editing, ${perReel} per reel`, "Guaranteed leads or sales"],
    },
    {
      id: "search",
      name: PLANS.search.name,
      price: formatMoney(planPrice("search", currency), currency),
      priceNote,
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
}

/** What every plan has in common, shown once under the columns. */
export interface EveryPlanCopy {
  readonly label: string;
  readonly items: readonly string[];
}

export function everyPlan(currency: Currency): EveryPlanCopy {
  return {
    label: "Every plan",
    items: ["Cancel anytime, no notice period", currency === "INR" ? "Billed monthly, GST included" : "Billed monthly", "A real person to ask", "A monthly report in plain words"],
  };
}

export const PRICING_FAQ_HEADING = "Questions about pricing.";

export function pricingFaq(currency: Currency): readonly FaqItem[] {
  const managedMonthly = formatMoney(planPrice("website", currency), currency);
  const adCap = formatMoney(extrasFor(currency).adBudgetCap, currency);
  return [
    {
      q: "Is the website build really free?",
      a: `Yes. We design and build it for ${formatMoney(0, currency)}. The ${managedMonthly} monthly plan keeps it hosted, secure and up to date.`,
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
      a: `No. You pay Meta directly for your own ads, and ${PLANS.growth.name} manages up to ${adCap} a month of it. Packages started together add our ad money on top.`,
    },
    {
      q: "Do you guarantee rankings or leads?",
      a: "No one honestly can. You see the work and the numbers in a report every month.",
    },
  ];
}
