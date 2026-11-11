// content/platform-home.ts
// Copy for the AI-platform homepage. Word for word from the owner's Homepage_Copy_Final.docx (2026-11-06), with
// [Brand Name] set to Brandbasket. SEO is left off the homepage, as in the doc (owner, 2026-11-06); its service page stays.
// The words inside the example pictures (the service previews, the review list) are sample UI text and go
// to the owner before release. The main buttons open the basket, like every main button on the site, so they carry a
// label and no address.
import { SERVICE_PAGES } from "./services";
import type { FaqItem } from "./types";
import type { PlanId } from "@/lib/pricing";

/** Where "talk to a person" buttons go. There is no demo booking flow yet, so Book a Demo opens the contact page too. */
const CONTACT_HREF = "/contact";

function servicePath(id: PlanId): string {
  const page = SERVICE_PAGES.find((p) => p.id === id);
  if (!page) throw new RangeError(`No service page for plan ${id}`);
  return page.path;
}

export const PLATFORM_HERO = {
  headline: "Your Entire Digital Presence.",
  headlineAccent: "Managed with AI.",
  body: "Website, social media and paid ads in one platform. Run it yourself, or let our experts run it for you.",
  primary: { label: "Get Started" },
  secondary: { label: "Book a Demo", href: CONTACT_HREF },
} as const;

export type HomeServiceId = "website" | "social" | "ads";

export interface HomeService {
  readonly id: HomeServiceId;
  readonly name: string;
  /** The name on a small chip (homepage step 1). */
  readonly short: string;
  readonly body: string;
  readonly capabilities: readonly string[];
  readonly cta: string;
  readonly href: string;
}

export const SERVICES_HEADING = { lead: "Three Services.", accent: "One Platform." } as const;

export const HOME_SERVICES: readonly HomeService[] = [
  {
    id: "website",
    name: "Website Management",
    short: "Website",
    body: "Build, update and manage your website with AI, without the complexity.",
    capabilities: ["Website creation", "Content updates", "Analytics"],
    cta: "Explore Website Management",
    href: servicePath("website"),
  },
  {
    id: "social",
    name: "Social Media Management",
    short: "Social media",
    body: "Plan, create and publish posts, and keep your channels active without spending hours on content.",
    capabilities: ["Content creation", "Scheduling", "Publishing", "Analytics"],
    cta: "Explore Social Media Management",
    href: servicePath("social"),
  },
  {
    id: "ads",
    name: "Paid Ads Management",
    short: "Paid ads",
    body: "Plan campaigns, create ads and track performance, all in one place.",
    capabilities: ["Ad creation", "Campaign management", "Optimisation", "Reporting"],
    cta: "Explore Paid Ads Management",
    href: servicePath("ads"),
  },
];

export const MODES = {
  heading: "Do It Yourself.",
  headingAccent: "Or Done For You.",
  diy: {
    title: "Do It Yourself",
    body: "AI-powered tools to manage your website, social media and ads. You stay in control. AI does the heavy lifting.",
    cta: { label: "Start Managing Yourself" },
  },
  dfy: {
    title: "Done For You",
    body: "Our experts manage your website, social media and ads, so you can focus on your business.",
    included: "Included at no extra cost when you choose all three services.",
    addOn: "Available as a paid add-on for individual services.",
    cta: { label: "Talk to Our Team", href: CONTACT_HREF },
    photoAlt: "A Brandbasket team member with a headset, smiling at her desk",
  },
} as const;

export interface WhyPoint {
  readonly lead: string;
  readonly rest: string;
}

export const WHY = {
  heading: "Less Effort.",
  headingAccent: "More Control.",
  points: [
    { lead: "Work smarter.", rest: "AI handles content creation and routine tasks." },
    { lead: "Save time.", rest: "Cut repetitive manual work across every channel." },
    { lead: "Stay in control.", rest: "Manage everything from one platform." },
    { lead: "Scale easily.", rest: "Do more without increasing your workload." },
  ] satisfies readonly WhyPoint[],
} as const;

export const WHO = {
  heading: "Built for Businesses That Want to",
  headingAccent: "Grow Online.",
  segments: ["Startups", "Small businesses", "Professional services", "Retail and e-commerce", "Restaurants and hospitality", "Growing companies"],
} as const;

export interface HowStep {
  readonly title: string;
  readonly body: string;
}

export const HOW = {
  heading: "Up and Running in",
  headingAccent: "Three Steps.",
  steps: [
    { title: "Choose your services", body: "Website, social media, paid ads, or all three." },
    { title: "Choose how you manage", body: "Use the platform yourself, or let our experts manage it." },
    { title: "Create, publish and improve", body: "Manage your activities with AI, track performance and keep getting better." },
  ] satisfies readonly HowStep[],
  /** Step 1's chips add plans to the basket; step 2 links to the two ways; step 3 opens the basket. New words for the owner. */
  pickLabel: "Services in your basket",
  waysLink: "Compare both ways",
  start: "Get Started",
} as const;

export const PLATFORM_FAQ_HEADING = { lead: "Frequently Asked", accent: "Questions" } as const;

export const PLATFORM_FAQ: readonly FaqItem[] = [
  { q: "What is Brandbasket?", a: "An AI-powered platform that helps businesses manage their website, social media and paid advertising in one place." },
  { q: "Can I manage everything myself?", a: "Yes. The platform gives you AI-powered tools to run your digital presence without an agency." },
  { q: "Do you offer managed services?", a: "Yes. Our team can manage your digital presence for you. It's included at no extra cost with all three services, and available as a paid add-on for individual services." },
  { q: "Can I use just one service?", a: "Yes. Choose one service or combine them, whatever suits your business." },
  { q: "Do I need technical or marketing expertise?", a: "No. The platform is built for businesses without dedicated technical or marketing teams." },
];

export const FINAL_CTA = {
  heading: "Your Digital Presence",
  headingAccent: "Deserves Better.",
  body: "Website, social media and paid ads. Managed with AI, in one place.",
  primary: { label: "Get Started Today" },
  secondary: { label: "Talk to Our Team", href: CONTACT_HREF },
} as const;

/** The homepage plans section (owner's image, 2026-11-06, in Brandbasket's own design). */
export const HOME_PRICING = {
  heading: "Grow Your Business with",
  headingAccent: "AI-Powered Management.",
  /** Printed above each plan name. */
  planPrefix: "AI-Powered",
  choose: { website: "Choose Website Plan", social: "Choose Social Media Plan", ads: "Choose Ads Plan" },
  start: "Get Started",
} as const satisfies { readonly choose: Readonly<Record<PlanId, string>> } & Record<string, unknown>;
