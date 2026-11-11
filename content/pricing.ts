// content/pricing.ts
// Copy for /pricing, word for word from the approved mock (docs/design/mock.html, #view-pricing).
// Every price, total and cap is built from lib/pricing.ts, per currency. Rupee copy says GST is included; dollar copy
// never mentions a tax. The hero plan rows and basket labels live in content/basket.ts. Cancellation wording reuses
// content/legal/cancellation.ts so pricing and legal agree.
import { type Currency, formatMoney } from "@/lib/currency";
import { extrasFor, MONITORING, monitoringPrice, PLANS, planPrice, planUsualPrice, type PlanId } from "@/lib/pricing";
import { CANCEL_ANSWER, PLAN_CHANGE_ANSWER } from "./legal/cancellation";
import type { FaqItem } from "./types";

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
  /** The usual price, struck through beside the price. */
  readonly was: string;
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
    lede: `Three plans, each on its own. Prices are monthly${currency === "INR" ? ", GST included" : ""}. Every plan costs the same.`,
    doesLabel: "What we do",
    excludesLabel: "Not included",
  };
}

/** Order is the order on the page: Website, Social, Ads. The lists follow the AI-powered plans (owner, 2026-11-06). Numbers are built from lib/pricing, so a price change shows here. */
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
      was: formatMoney(planUsualPrice("website", currency), currency),
      priceNote,
      tag: "Free build",
      audience: "For businesses that want a website without the technical work.",
      does: [
        "Website setup, up to 10 pages, built free",
        "Content updates, 2 a month, 15 minutes each",
        "Hosting, SSL, security updates and backups",
        "Performance and uptime monitoring",
        "SEO monitoring",
        "Enquiry forms, click to call and WhatsApp",
        "Technical support from a real person",
        "A monthly website health report",
      ],
      excludes: ["Domain registration or renewal", "Extra pages or a redesign, quoted first", "Content writing or ads", "E-commerce or new features"],
    },
    {
      id: "social",
      name: PLANS.social.name,
      price: formatMoney(planPrice("social", currency), currency),
      was: formatMoney(planUsualPrice("social", currency), currency),
      priceNote,
      audience: "For businesses that want to post often without spending hours on content.",
      does: [
        "AI content and caption generation",
        "AI image and creative generation",
        "Automated posting and scheduling",
        "Up to 4 platforms managed",
        "A monthly performance report",
        "Human support when you need it",
      ],
      excludes: ["Ad campaigns, which are Paid Ads Management", `Reels and video editing, ${perReel} per reel`, "Guaranteed followers, leads or sales"],
    },
    {
      id: "ads",
      name: PLANS.ads.name,
      price: formatMoney(planPrice("ads", currency), currency),
      was: formatMoney(planUsualPrice("ads", currency), currency),
      priceNote,
      audience: "For businesses that want ads that bring enquiries, run for them.",
      does: [
        "Meta ads on Facebook and Instagram",
        "AI ad copy and creative generation",
        "Campaign setup and optimisation",
        `Budget and bidding management, up to ${adCap} a month of your budget`,
        "A monthly performance report",
        "Human support when you need it",
      ],
      excludes: ["Ad spend, paid to Meta by you", "Guaranteed leads or sales"],
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

/** The answers every page that shows them must word the same way: they are promises, so they come from one place. */
export function adSpendAnswer(currency: Currency): string {
  const adCap = formatMoney(extrasFor(currency).adBudgetCap, currency);
  return `No. You pay Meta directly for your own ads, and ${PLANS.ads.name} manages up to ${adCap} a month of it.`;
}
export const NO_GUARANTEE_ANSWER = "No one honestly can. You see the work and the numbers in a report every month.";

export function pricingFaq(currency: Currency): readonly FaqItem[] {
  const managedMonthly = formatMoney(planPrice("website", currency), currency);
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
      a: "No. Every plan can be bought on its own, at the same price.",
    },
    {
      q: "Can I add or drop a plan later?",
      a: PLAN_CHANGE_ANSWER,
    },
    {
      q: "Is ad spend included?",
      a: adSpendAnswer(currency),
    },
    {
      q: "Do you guarantee leads or sales?",
      a: NO_GUARANTEE_ANSWER,
    },
  ];
}

/** Dedicated Expert Monitoring, shown under the plans on the homepage and the pricing page. New copy for the owner (2026-11-06). */
export interface MonitoringCopy {
  readonly title: string;
  readonly price: string;
  readonly priceNote: string;
  readonly included: string;
  readonly body: string;
  readonly pillars: readonly string[];
}

export function monitoringCopy(currency: Currency): MonitoringCopy {
  return {
    title: MONITORING.name,
    price: formatMoney(monitoringPrice(currency), currency),
    priceNote: currency === "INR" ? "a month, incl. GST" : "a month",
    included: "Free with all three plans",
    body: "Our experts watch your website, social media and ads, fix what slips and help you grow.",
    pillars: ["Monitor", "Optimise", "Support", "Growth"],
  };
}

/** The basket's line about monitoring: included with all three plans, priced otherwise. */
export function monitoringNote(allThree: boolean, currency: Currency): string {
  return allThree
    ? `${MONITORING.name} is included with all three plans.`
    : `Pick all three plans and ${MONITORING.name} is included. Otherwise it is ${formatMoney(monitoringPrice(currency), currency)} a month.`;
}
