// content/ads-page.ts
// Copy for the sections only the Paid Ads Management page has (/services/paid-ads-management): the hero scene, how we run
// ads, where the money goes, what the owner controls and an example report. Hero, who it is for, limits and questions stay in
// content/services.ts. Every claim is in the plan as sold: Meta ads on Facebook and Instagram, AI ad copy and creatives,
// approval before an ad runs, up to the ad budget cap a month of the client's own budget managed, ad spend paid to Meta by
// the client, and spend, leads and cost per lead in the dashboard and the monthly report. The plan is paused ("Coming soon",
// PAUSED_PLAN_IDS). New copy: it goes to the owner before it ships.
import { type Currency, formatMoney } from "@/lib/currency";
import { extrasFor, planPrice } from "@/lib/pricing";
import type { Fact } from "./home";
import type { ExampleReportContent } from "./types";
import { serviceMoneyCopy } from "./services";

/**
 * The hero's picture: one sponsored post for "your business" with the cards around it (an ad waiting for the owner, a new
 * enquiry, the budget, where it runs). A boutique, so no one trade leads the site (owner, 2026-11-17). The photo is
 * public/services/ads-boutique-post.jpg.
 */
export const ADS_HERO_SCENE = {
  ad: {
    handle: "your.business",
    sponsored: "Sponsored",
    photo: "/services/ads-boutique-post.jpg",
    caption: "The festive collection is in. Visit us this week.",
    cta: "Send message",
  },
  approval: { state: "Needs your OK", title: "Festive collection ad, 2 versions", approve: "Approve", back: "Ask for changes" },
  lead: { label: "New enquiry", from: "From your Instagram ad" },
  budget: { label: "Budget on track", note: "Spread across the month" },
  channels: "Running on",
  whatsapp: { label: "Ask about Paid Ads", short: "Ask us", message: "Hi, I would like to know when Paid Ads Management opens." },
} as const;

export function adsFactsFor(currency: Currency): readonly Fact[] {
  return [
    { icon: "Megaphone", text: "Facebook and Instagram ads" },
    { icon: "ThumbsUp", text: "You approve every ad" },
    { icon: "Wallet", text: `Up to ${formatMoney(extrasFor(currency).adBudgetCap, currency)} a month managed` },
    { icon: "ChartBar", text: "One report a month" },
  ];
}

/** The dark band: how an ad goes from an idea to a lead. */
export const ADS_HOW = {
  small: "How we run your ads.",
  large: "Your budget, put to work.",
  body: "We start with who your customers are and where they are, then build ads around one clear offer. Nothing runs until you have seen it.",
  steps: [
    { title: "Understand", body: "A 15-minute call about your customers, your area, your offer and your budget." },
    { title: "Set up", body: "We set up your ad account and the first campaign, aimed at the people most likely to buy." },
    { title: "Create", body: "AI drafts the ad words and pictures in a few versions, from your offer and your photos." },
    { title: "You approve", body: "Every ad comes to you first. Say yes, or ask for changes to any version." },
    { title: "Run and adjust", body: "We watch spend and results, pause what is not working and move the budget to what is." },
    { title: "Report", body: "Each month: what you spent, the enquiries it brought and what each one cost." },
  ],
} as const;

export interface MoneyPart {
  readonly label: string;
  readonly amount: string;
  readonly unit: string;
  readonly body: string;
}

/** "Where your money goes": the plan fee and the ad budget, kept apart. */
export function adsMoneyFor(currency: Currency): { readonly heading: string; readonly lede: string; readonly plus: string; readonly parts: readonly [MoneyPart, MoneyPart] } {
  return {
    heading: "Where your money goes.",
    lede: "Two separate amounts, both shown before you start.",
    plus: "and",
    parts: [
      {
        label: "Our fee",
        amount: formatMoney(planPrice("ads", currency), currency),
        unit: serviceMoneyCopy(currency).perMonth,
        body: "For planning, making, running and reporting on your ads. It stays the same whatever you spend.",
      },
      {
        label: "Your ad budget",
        amount: `Up to ${formatMoney(extrasFor(currency).adBudgetCap, currency)}`,
        unit: "a month, managed by us",
        body: "Paid by you straight to Meta. You choose the amount, and nothing is added on top.",
      },
    ],
  };
}

export interface AdsControlItem {
  readonly icon: "CheckCircle" | "Wallet" | "Tag" | "ChartLineUp";
  readonly title: string;
  readonly body: string;
}

export const ADS_CONTROL = {
  heading: "You stay in control.",
  lede: "We run the ads. You decide what they say and what they spend.",
  items: [
    { icon: "CheckCircle", title: "Approve every ad", body: "No ad goes live until you have seen it and said yes." },
    { icon: "Wallet", title: "Set the budget", body: "Choose what to spend each month, and tell us when you want it to change." },
    { icon: "Tag", title: "Tell us the offer", body: "A sale, a new service or a festival: the next ads are built around it." },
    { icon: "ChartLineUp", title: "See where it goes", body: "Your dashboard shows spend against your budget, with the leads and the cost of each." },
  ] satisfies readonly AdsControlItem[],
} as const;

export interface CampaignRow {
  readonly name: string;
  readonly where: string;
  readonly leads: string;
  readonly perLead: string;
}

/** Sample numbers for a physiotherapy clinic. They add up: campaign leads and spend make the totals. The "Example report" chip must stay. */
const REPORT_NUMBERS: Readonly<Record<Currency, { readonly spent: string; readonly of: string; readonly perLead: string; readonly rows: readonly [string, string] }>> = {
  INR: { spent: "₹9,480", of: "of ₹10,000", perLead: "₹231", rows: ["₹198", "₹289"] },
  USD: { spent: "$114", of: "of $120", perLead: "$2.78", rows: ["$2.38", "$3.47"] },
};

export function adsReportFor(currency: Currency): ExampleReportContent & { readonly campaignsLabel: string; readonly campaigns: readonly CampaignRow[]; readonly leadsLabel: string; readonly perLeadLabel: string } {
  const n = REPORT_NUMBERS[currency];
  return {
    heading: "Know what each enquiry cost.",
    lede: "Your dashboard shows spend against budget, leads and cost per lead. Each month, a short report says what worked and what changes next.",
    ariaLabel: "Example monthly ads report",
    chip: "Example report",
    title: "October report",
    subtitle: "A physiotherapy clinic in Pune · Facebook, Instagram",
    kpis: [
      { label: "Spent", value: n.spent, delta: n.of },
      { label: "Leads", value: "41", delta: "+12 on Sept" },
      { label: "Cost per lead", value: n.perLead, delta: "18% lower than Sept" },
      { label: "People reached", value: "28,600", delta: "+9% on Sept" },
    ],
    campaignsLabel: "Campaigns",
    leadsLabel: "Leads",
    perLeadLabel: "Per lead",
    campaigns: [
      { name: "Back pain check-up offer", where: "Facebook", leads: "26", perLead: n.rows[0] },
      { name: "Sports injury clinic", where: "Instagram", leads: "15", perLead: n.rows[1] },
    ],
  };
}
