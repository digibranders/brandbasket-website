// content/home.ts
// Copy for the homepage, word for word from the approved mock (docs/design/mock.html, #view-home).
// Prices and rates are built from lib/pricing.ts, per currency: rupees keep their GST wording, dollars never mention tax. The basket panel and button labels live in content/basket.ts and
// content/navigation.ts (PRIMARY_CTA); they are not repeated here.
import { type Currency, formatMoney } from "@/lib/currency";
import { GST_LABEL, planPrice } from "@/lib/pricing";
import { CANCEL_ANSWER, HOSTED_SERVICE, PAYMENT_FAILURE } from "./legal/cancellation";
import type { FaqItem } from "./types";

/** Phosphor icon component names (replace the mock's Material Symbols). */
export type HomeIconKey =
  | "CurrencyInr"
  | "CurrencyDollar"
  | "RocketLaunch"
  | "Wrench"
  | "FileText"
  | "DeviceMobile"
  | "Phone"
  | "Prohibit"
  | "PencilSimpleLine"
  | "Scroll"
  | "CloudCheck"
  | "ShieldCheck"
  | "LockKey"
  | "Headset"
  | "PencilSimple"
  | "ChartBar"
  | "LockOpen";

export interface OfferLineContent {
  readonly ariaLabel: string;
  readonly build: { readonly price: string; readonly label: string };
  readonly run: { readonly price: string; readonly unit: string; readonly label: string };
}

/** The "0 + monthly" offer line. Shared by the homepage hero and the pricing hero. Rupees end with ", incl. GST"; dollars drop it. */
export function offerFor(currency: Currency): OfferLineContent {
  const zero = formatMoney(0, currency);
  const monthly = formatMoney(planPrice("website", currency), currency);
  const inr = currency === "INR";
  return {
    ariaLabel: `${zero} to build your website, plus ${monthly} a month${inr ? ", GST included," : ""} to keep it running`,
    build: { price: zero, label: "to build your website" },
    run: { price: monthly, unit: "/month", label: inr ? "to keep it running, incl. GST" : "to keep it running" },
  };
}

/** The default share image (app/opengraph-image.tsx): a headline over four split-flap tiles that spell FREE, then an italic line. Owner approved the words, 2026-10-27. */
export const SHARE_IMAGE = {
  lead: "Get your business website for",
  word: "FREE",
  line: "Built for you.",
  lineAccent: "Live in about a week.",
} as const;

/** Locked copy: change only with the owner's yes. */
export const HERO = {
  headline: "Before They Visit You, They Visit",
  headlineAccent: "Your Website.",
  stageLabel: "A woven 3D basket holding the services in your plan",
} as const;

export interface Fact {
  readonly icon: HomeIconKey;
  readonly text: string;
}

export function factsFor(currency: Currency): readonly Fact[] {
  return [
    { icon: currency === "INR" ? "CurrencyInr" : "CurrencyDollar", text: `${formatMoney(0, currency)} to build` },
    { icon: "RocketLaunch", text: "Live in about a week" },
    { icon: "Wrench", text: "No technical work" },
    { icon: "FileText", text: "One report a month" },
  ];
}

/** The responsibility section (docs/design/homepage-final.html, #s-resp). The six on a phone are the ones owners ask about most. */
export const RESPONSIBILITY = {
  small: "More Than a Website.",
  large: "We Take Responsibility.",
  body: "You’re not just paying for a website; you’re protecting your online reputation with ongoing security, maintenance, and performance.",
  worries: ["Hosting", "Security", "Backups", "Updates", "Domain renewal", "Contact form", "Slow pages", "Hackers", "Bug fixes"],
  phoneWorries: ["Hosting", "Security", "Backups", "Updates", "Contact form", "Bug fixes"],
  onYourMind: "On your mind",
  inBasket: "In our basket",
} as const;

export interface IncludedItem {
  readonly icon: HomeIconKey;
  readonly text: string;
}

export interface IncludedPanel {
  readonly title: string;
  readonly pill: string;
  readonly items: readonly IncludedItem[];
}

/** "What you get": the free build, then the monthly run. Page limit and edit allowance wait on owner decisions 1 and 2 (docs/plans/19). */
export const WHAT_YOU_GET = {
  small: "Built free. Looked after every month.",
  heading: "What you get.",
  build: {
    title: "Built for you",
    pill: "Free",
    items: [
      { icon: "FileText", text: "Up to 10 pages, built for you" },
      { icon: "DeviceMobile", text: "Works on every phone" },
      { icon: "Phone", text: "Enquiry forms, click to call and WhatsApp" },
      { icon: "Prohibit", text: "Spam and bot protection" },
      { icon: "Scroll", text: "Privacy policy and terms included" },
    ],
  },
  run: {
    title: "Kept running",
    pill: "Every month",
    items: [
      { icon: "CloudCheck", text: "Hosting, SSL and backups" },
      { icon: "ShieldCheck", text: "Security updates and uptime monitoring" },
      { icon: "LockKey", text: "Privacy and DPDP readiness support" },
      { icon: "Headset", text: "Human support when you need it" },
      { icon: "PencilSimple", text: "2 edits a month, 15 minutes each" },
      { icon: "ChartBar", text: "Monthly health report" },
    ],
  },
  more: "See the plans",
} as const satisfies { readonly small: string; readonly heading: string; readonly build: IncludedPanel; readonly run: IncludedPanel; readonly more: string };

export interface PromiseCard {
  readonly icon: HomeIconKey;
  readonly title: string;
  readonly text: string;
}

const PROMISE_CARDS: readonly PromiseCard[] = [
  { icon: "LockOpen", title: "No Lock-Ins. Cancel Anytime.", text: "Stay with us because we deliver value, not because you’re tied to a contract." },
  { icon: "ShieldCheck", title: "Privacy-Ready. Compliance-Focused.", text: "We help align your website with applicable requirements of India’s Digital Personal Data Protection (DPDP) Act." },
];

/** Promises with the support chat. The photo and the name Priya are placeholders until a real team member is photographed. */
export const PROMISES = {
  small: "Human Support",
  large: "When It Matters Most",
  body: "When your website goes down or faces a security breach, our dedicated human support team is here to help.",
  photoAlt: "A Brandbasket support team member wearing a headset at her desk",
  chat: {
    customer: "Our website is showing an error.",
    rep: { name: "Priya", role: "Brandbasket support", text: "On it. I will keep you posted until it is fixed." },
  },
  cards: PROMISE_CARDS,
} as const;

/** Heading for the homepage basket section (owner asked for a plans heading, 2026-10-22). */
export const PLANS_SECTION = {
  small: "The more you add, the more you save.",
  large: "Pick your plans.",
} as const;

export interface WorkImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export interface WorkCase {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  /** Domain shown in the browser bar. */
  readonly url: string;
  readonly desktop: WorkImage;
  readonly phone: WorkImage;
  /** Seconds the autoscroll takes to reach the bottom of the page image. */
  readonly scrollSeconds: number;
  readonly desktopAlt: string;
  readonly phoneAlt: string;
}

/**
 * Image paths are served from /work. The files come from docs/design/img (full-<id>-desk.jpg and full-<id>-mob.jpg)
 * and are copied to public/work.
 */
export const WORK = {
  heading: "Real websites, live today.",
  tabsLabel: "Websites we built",
  dragChip: "Drag to scroll",
  /** Appended to each screen's alt text to label its scrollable viewport. */
  scrollableSuffix: ", scrollable",
  cases: [
    {
      id: "curry",
      name: "Curry Cook",
      category: "Restaurant with online ordering",
      url: "currycook.com",
      desktop: { src: "/work/full-curry-desk.jpg", width: 900, height: 1345 },
      phone: { src: "/work/full-curry-mob.jpg", width: 390, height: 2652 },
      scrollSeconds: 14,
      desktopAlt: "The full Curry Cook home page on a laptop",
      phoneAlt: "The Curry Cook home page on a phone",
    },
    {
      id: "gkr",
      name: "GKR Hospitality",
      category: "Consultancy built around one call",
      url: "gkrhospitality.com",
      desktop: { src: "/work/full-gkr-desk.jpg", width: 900, height: 3425 },
      phone: { src: "/work/full-gkr-mob.jpg", width: 390, height: 7839 },
      scrollSeconds: 24,
      desktopAlt: "The full GKR Hospitality home page on a laptop",
      phoneAlt: "The GKR Hospitality home page on a phone",
    },
    {
      id: "payweek",
      name: "PayWeek",
      category: "Software with a free trial",
      url: "payweek.com",
      desktop: { src: "/work/full-payweek-desk.jpg", width: 900, height: 4982 },
      phone: { src: "/work/full-payweek-mob.jpg", width: 390, height: 10553 },
      scrollSeconds: 30,
      desktopAlt: "The full PayWeek home page on a laptop",
      phoneAlt: "The PayWeek home page on a phone",
    },
  ],
} as const satisfies { readonly heading: string; readonly tabsLabel: string; readonly dragChip: string; readonly scrollableSuffix: string; readonly cases: readonly WorkCase[] };

export type ReportTone = "site" | "growth" | "growth2" | "search";

export interface ReportKpi {
  readonly tone: ReportTone;
  readonly label: string;
  readonly value: string;
  readonly delta: string;
}

/** Sample data. The "Example report" chip marks it as such and must stay. */
export const REPORT = {
  heading: "You always know",
  headingAccent: "what you paid for.",
  ariaLabel: "Example monthly report",
  chip: "Example report",
  title: "October report",
  subtitle: "A dental clinic in Pune · Website, Social, SEO",
  chart: {
    title: "Enquiries a week",
    range: "Sep to Oct",
    svgTitle: "Example: weekly enquiries rising from 9 to 21 over eight weeks",
    /** Y coordinates in the mock's 400 by 110 viewBox, for points at x = 10, 60, 110 ... 360. */
    viewBox: { width: 400, height: 110 },
    pointsY: [90, 83, 86, 72, 66, 58, 47, 38],
    firstX: 10,
    stepX: 50,
    baselineY: 104,
  },
} as const;

/** What one sample ad lead cost, in whole units of each currency. */
const SAMPLE_LEAD_COST: Readonly<Record<Currency, number>> = { INR: 214, USD: 5 };

/** The example report with its sample figures in the visitor's currency. */
export function reportFor(currency: Currency): typeof REPORT & { readonly kpis: readonly ReportKpi[] } {
  return {
    ...REPORT,
    kpis: [
      { tone: "site", label: "Uptime", value: "99.97%", delta: "0 incidents" },
      { tone: "growth", label: "Profile views", value: "2,184", delta: "+18% on Sept" },
      { tone: "growth2", label: "Ad leads", value: "37", delta: `${formatMoney(SAMPLE_LEAD_COST[currency], currency)} a lead` },
      { tone: "search", label: "Calls from search", value: "62", delta: "+9 on Sept" },
    ],
  };
}

export interface Step {
  readonly when: string;
  readonly what: string;
}

export const STEPS: readonly Step[] = [
  { when: "Day 1", what: "A 15-minute call" },
  { when: "Week 1", what: "We set everything up" },
  { when: "Every month", what: "We run it and send a report" },
];

export const HOME_FAQ_HEADING = "Questions, answered.";

/** The owner's approved FAQ (replaces the mock's four questions). The cancel, payment and ownership answers come from content/legal/cancellation.ts. */
export function homeFaqFor(currency: Currency): readonly FaqItem[] {
  const inr = currency === "INR";
  return [
    {
      q: "Is the website really free?",
      a: `Yes. There is no design or build fee: you pay nothing for us to build your website. You pay the monthly plan, ${formatMoney(planPrice("website", currency), currency)} a month${inr ? ", GST included" : ""}, which keeps it hosted, secure and up to date.`,
    },
    {
      q: "What do I pay for every month?",
      a: "Keeping your website running: hosting and SSL, security, backups, updates and upkeep, monitoring all month, 2 edits a month of 15 minutes each and a monthly health report. The build itself is free.",
    },
    {
      q: "Is there anything to pay up front?",
      a: inr ? `Just your first month. The price already includes ${GST_LABEL} GST. After that you pay monthly.` : "Just your first month. After that you pay monthly.",
    },
    {
      q: "How long does it take to build my website?",
      a: "Once you have sent your details and made your first payment, your website goes live within 7 working days. It can take a little longer if we are waiting on feedback or content from you, or on your domain being connected.",
    },
    {
      q: "How many pages do I get?",
      a: "Up to 10 pages. More pages or bigger features can be added for an extra fee, and we always confirm the price before doing anything.",
    },
    {
      q: "Do I pay for hosting separately?",
      a: "No. Hosting is included in the monthly plan.",
    },
    {
      q: "Who owns the domain and the content?",
      a: `You register and pay for your own domain, so it is always in your name. No domain yet? We will set your website up on a temporary domain for free until you have one. ${HOSTED_SERVICE}`,
    },
    {
      q: "Can I make changes later?",
      a: "Yes. Send us any change. We always tell you the cost before we start anything that costs extra.",
    },
    { q: "Can I cancel?", a: CANCEL_ANSWER },
    { q: "What happens if a payment fails?", a: PAYMENT_FAILURE },
    {
      q: "What technology is my website built on?",
      a: "Next.js: a modern, fast and scalable foundation.",
    },
  ];
}
