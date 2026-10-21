// content/home.ts
// Copy for the homepage, word for word from the approved mock (docs/design/mock.html, #view-home).
// Prices and rates are built from lib/pricing.ts. The add-on panel and button labels live in content/basket.ts and
// content/navigation.ts (PRIMARY_CTA); they are not repeated here.
import { formatInr, PLANS } from "@/lib/pricing";
import { CANCEL_ANSWER, HOSTED_SERVICE, PAYMENT_FAILURE } from "./legal/cancellation";
import type { FaqItem } from "./types";

/** Phosphor icon component names (replace the mock's Material Symbols). */
export type HomeIconKey =
  | "CurrencyInr"
  | "RocketLaunch"
  | "Wrench"
  | "FileText"
  | "Tooth"
  | "Scissors"
  | "ForkKnife"
  | "Barbell"
  | "GraduationCap"
  | "Storefront"
  | "Toolbox"
  | "Buildings"
  | "Bed"
  | "Coffee"
  | "Pill"
  | "BookOpen"
  | "Scales"
  | "Calculator"
  | "Car";

const MANAGED_MONTHLY = formatInr(PLANS.website.monthly);

/** The "₹0 + monthly" offer line. Shared by the homepage hero and the pricing hero. */
export const OFFER = {
  ariaLabel: `₹0 to build your website, plus ${MANAGED_MONTHLY} a month plus GST to keep it running`,
  build: { price: "₹0", label: "to build your website" },
  run: { price: MANAGED_MONTHLY, unit: "/month", label: "to keep it running, + GST" },
} as const;

/** The default share image (app/opengraph-image.tsx): the hero subhead without "for free", then the offer line. */
export const SHARE_IMAGE = {
  headline: "Your Business Has a Name. Give It a Place on the Internet.",
  line: `${OFFER.build.price} ${OFFER.build.label} + ${OFFER.run.price}${OFFER.run.unit} ${OFFER.run.label}`,
} as const;

/** Locked copy: change only with the owner's yes. */
export const HERO = {
  headline: "Before They Visit You, They Visit",
  headlineAccent: "Your Website.",
  subhead: "Your Business Has a Name. Give It a Place on the Internet for free.",
  offer: OFFER,
  stageLabel: "A woven 3D basket holding the services in your plan",
} as const;

export interface Fact {
  readonly icon: HomeIconKey;
  readonly text: string;
}

export const FACTS: readonly Fact[] = [
  { icon: "CurrencyInr", text: "₹0 to build" },
  { icon: "RocketLaunch", text: "Live in about a week" },
  { icon: "Wrench", text: "No technical work" },
  { icon: "FileText", text: "One report a month" },
];

export interface Industry {
  /** Matches /industries/[slug] when that industry has a page. */
  readonly slug: string;
  readonly label: string;
  readonly icon: HomeIconKey;
}

export const INDUSTRIES_LINE = {
  title: "Built for local businesses",
  industries: [
    { slug: "clinics", label: "Clinics", icon: "Tooth" },
    { slug: "salons", label: "Salons", icon: "Scissors" },
    { slug: "restaurants", label: "Restaurants", icon: "ForkKnife" },
    { slug: "gyms", label: "Gyms", icon: "Barbell" },
    { slug: "coaching", label: "Coaching", icon: "GraduationCap" },
    { slug: "retail", label: "Shops", icon: "Storefront" },
    { slug: "home-services", label: "Home services", icon: "Toolbox" },
    { slug: "real-estate", label: "Real estate", icon: "Buildings" },
    { slug: "hotels", label: "Hotels", icon: "Bed" },
    { slug: "cafes", label: "Cafes", icon: "Coffee" },
    { slug: "pharmacies", label: "Pharmacies", icon: "Pill" },
    { slug: "tuition-classes", label: "Tuition classes", icon: "BookOpen" },
    { slug: "lawyers", label: "Lawyers", icon: "Scales" },
    { slug: "accountants", label: "Accountants", icon: "Calculator" },
    { slug: "car-services", label: "Car services", icon: "Car" },
  ],
} as const satisfies { readonly title: string; readonly industries: readonly Industry[] };

export interface PlanSide {
  readonly label: string;
  readonly price: string;
  readonly priceNote: string;
  readonly ticks: readonly string[];
  readonly explore: string;
}

/** Heading kept word for word. Explore links go to /pricing#details. */
export const PLANS_SECTION = {
  heading: "You do not pay to build it.",
  headingAccent: "You pay to keep it running.",
  exploreHref: "/pricing#details",
  build: {
    label: "We build it",
    price: "₹0",
    priceNote: "development fee",
    ticks: ["Up to 5 pages", "Works on every phone", "Enquiry forms and click to call"],
    explore: "What is in the free build",
  },
  run: {
    label: "We keep it running",
    price: MANAGED_MONTHLY,
    priceNote: "a month + GST",
    ticks: ["Hosting, SSL and backups", "Security and uptime", "2 small edits a month", "Monthly health report"],
    explore: "Everything the care plan covers",
  },
} as const satisfies {
  readonly heading: string;
  readonly headingAccent: string;
  readonly exploreHref: string;
  readonly build: PlanSide;
  readonly run: PlanSide;
};

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
  kpis: [
    { tone: "site", label: "Uptime", value: "99.97%", delta: "0 incidents" },
    { tone: "growth", label: "Profile views", value: "2,184", delta: "+18% on Sept" },
    { tone: "growth2", label: "Ad leads", value: "37", delta: "₹214 a lead" },
    { tone: "search", label: "Calls from search", value: "62", delta: "+9 on Sept" },
  ] satisfies readonly ReportKpi[],
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

export interface Step {
  readonly when: string;
  readonly what: string;
}

export const STEPS: readonly Step[] = [
  { when: "Day 1", what: "A free 15-minute call" },
  { when: "Week 1", what: "We set everything up" },
  { when: "Every month", what: "We run it and send a report" },
];

export const HOME_FAQ_HEADING = "Questions, answered.";

/** The owner's approved FAQ (replaces the mock's four questions). The cancel, payment and ownership answers come from content/legal/cancellation.ts. */
export const HOME_FAQ: readonly FaqItem[] = [
  {
    q: "Is the website really free?",
    a: `Yes. There is no design or build fee: you pay nothing for us to build your website. You pay the monthly plan, ${MANAGED_MONTHLY} a month + GST, which keeps it hosted, secure and up to date.`,
  },
  {
    q: "What do I pay for every month?",
    a: "Keeping your website running: hosting and SSL, security, backups, updates and upkeep, monitoring all month, 2 small edits a month and a monthly health report. The build itself is free.",
  },
  {
    q: "Is there anything to pay up front?",
    a: `Only your first month. Your first payment is ${MANAGED_MONTHLY} + GST for the website, or your package price + GST, and it covers your first month. There is no separate build fee.`,
  },
  {
    q: "How long does it take to build my website?",
    a: "Once you have sent your details and made your first payment, your website goes live within 7 working days. It can take a little longer if we are waiting on feedback or content from you, or on your domain being connected.",
  },
  {
    q: "How many pages do I get?",
    a: "Up to 5 pages. More pages or bigger features can be added for an extra fee, and we always confirm the price before doing anything.",
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
    a: "Yes. Send any change from your dashboard. We always tell you the cost before we start anything that costs extra.",
  },
  { q: "Can I cancel?", a: CANCEL_ANSWER },
  { q: "What happens if a payment fails?", a: PAYMENT_FAILURE },
  {
    q: "What technology is my website built on?",
    a: "Next.js: a modern, fast and scalable foundation.",
  },
];
