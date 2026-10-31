// content/start.ts
// Copy for the ad landing page (/start). The headline is the owner's own wording (2026-10-31); the rest is proposed and goes to the owner before it ships.
// Prices, the offer line and the FAQ answers are built from content/home.ts and lib/pricing.ts, so they cannot drift from the site.
import { type Currency, formatMoney } from "@/lib/currency";
import { businessDetails } from "@/lib/site-config";

export type StartIconKey =
  | "CurrencyInr"
  | "CurrencyDollar"
  | "RocketLaunch"
  | "FileText"
  | "LockOpen"
  | "Browser"
  | "MagnifyingGlass"
  | "Devices"
  | "ShieldCheck"
  | "Prohibit"
  | "Pulse"
  | "WhatsappLogo"
  | "MapPin"
  | "PhoneCall"
  | "PencilSimpleLine"
  | "ChartBar"
  | "Wrench"
  | "CreditCard"
  | "Hammer"
  | "Receipt";

export const START = {
  headline: "Your Website.",
  headlineAccent: "Our Responsibility.",
  lede: "We build your business website free. For one flat monthly price, we host it, secure it and look after it.",
  reach: { call: "Call us", whatsapp: "Chat on WhatsApp" },
} as const;

/** The one label for the paying intent, used on every button that goes to the form. */
export const START_PAY_LABEL = "Continue to payment";

export const START_FORM = {
  title: "Start your website",
  sub: "Three details. Your sign-up page opens already filled in.",
  labels: { name: "Your name", phone: "Mobile number", email: "Email address" },
  emailHint: "You sign in with it, so use one you check.",
  consentPre: "I agree to the",
  consentMid: "and",
  consentPost: "Brandbasket may contact me about my website.",
  privacy: "Privacy Policy",
  terms: "Terms",
  pay: START_PAY_LABEL,
  paying: "Opening sign-up",
  or: "or",
  support: "Speak to support first",
  /** Typed ready to send when the support button opens WhatsApp. */
  whatsappMessage: "Hi Brandbasket, I would like to know more about the business website.",
} as const;

export const START_ERRORS = {
  name: "Please tell us your name.",
  phoneIndia: "Enter a 10-digit mobile number.",
  phoneWorld: "Enter your number with its country code, such as +44 7700 900123.",
  email: "Enter a valid email address.",
  consent: "Tick the box to agree to the Privacy Policy and Terms.",
  form: "Please check the form.",
  invalid: "Invalid request",
  tooLarge: "Request too large",
  tooMany: "Too many requests. Try again shortly.",
  send: "We could not send this. Please call or WhatsApp us instead.",
} as const;

/** The small print under the pay button. The price and GST are on the offer line above it. */
export const START_PAY_NOTE = "Cancel anytime.";

/** The phone bar's small line under the monthly price. The GST wording stays on the offer line and the form's note, so the bar fits one tidy row. */
export function barNoteFor(currency: Currency): string {
  return `${formatMoney(0, currency)} to build`;
}

/** The support team's hours, said once: the confirmation after "speak with your support team first" and the closing band. */
export const SUPPORT_HOURS = businessDetails.hours;

export interface StartFact {
  readonly icon: StartIconKey;
  readonly text: string;
}

export function startFactsFor(currency: Currency): readonly StartFact[] {
  return [
    { icon: currency === "INR" ? "CurrencyInr" : "CurrencyDollar", text: `${formatMoney(0, currency)} to build` },
    { icon: "RocketLaunch", text: "Live in 7 working days" },
    { icon: "FileText", text: "Up to 10 pages" },
    { icon: "LockOpen", text: "Cancel anytime" },
  ];
}

export interface CareItem {
  readonly icon: StartIconKey;
  readonly title: string;
  readonly text: string;
}

export interface CareGroup {
  readonly title: string;
  readonly items: readonly CareItem[];
}

/** The twelve things the monthly plan covers (owner's list, 2026-10-31), in four groups. WhatsApp, Google Business Profile, blog and call tracking wait on the owner confirming they are included. */
export const CARE = {
  heading: "What we take care of,",
  headingAccent: "every month.",
  priceTitle: "One flat price. Nothing on top.",
  priceNote: "Cancel anytime. No notice period.",
  groups: [
    {
      title: "Your website",
      items: [
        { icon: "Browser", title: "Up to 10 professional pages", text: "A modern website for your business, products and services. Built once, free." },
        { icon: "MagnifyingGlass", title: "SEO-friendly", text: "Search-engine-friendly structure and the essential technical SEO foundations." },
        { icon: "Devices", title: "Phone, tablet and desktop", text: "Looks great and works smoothly on every screen." },
      ],
    },
    {
      title: "Kept safe",
      items: [
        { icon: "ShieldCheck", title: "Website security", text: "Measures that help protect your website from hackers and cyber threats." },
        { icon: "Prohibit", title: "Bot and spam protection", text: "Unwanted bots and junk form submissions stay out." },
        { icon: "Pulse", title: "24/7 monitoring", text: "We watch for downtime and technical issues all day and night." },
      ],
    },
    {
      title: "Brings you customers",
      items: [
        { icon: "WhatsappLogo", title: "WhatsApp on your website", text: "Visitors reach your business directly in one tap." },
        { icon: "MapPin", title: "Google Business Profile", text: "Connected to your website, so customers find you easily." },
        { icon: "PhoneCall", title: "Call and enquiry tracking", text: "See the calls and enquiries that come through your website." },
      ],
    },
    {
      title: "Looked after",
      items: [
        { icon: "PencilSimpleLine", title: "Easy blog management", text: "Publish and edit your blogs yourself, no technical help needed." },
        { icon: "ChartBar", title: "Monthly performance report", text: "Regular updates on how your website is doing." },
        { icon: "Wrench", title: "Maintenance and updates", text: "Backups, software updates, technical upkeep and ongoing support." },
      ],
    },
  ],
} as const satisfies { readonly heading: string; readonly headingAccent: string; readonly priceTitle: string; readonly priceNote: string; readonly groups: readonly CareGroup[] };

export interface StartStep {
  readonly icon: StartIconKey;
  readonly when: string;
  readonly title: string;
  readonly text: string;
}

export const START_STEPS = {
  heading: "Pay today.",
  headingAccent: "Live in 7 working days.",
  steps: [
    { icon: "CreditCard", when: "Today", title: "Pay and sign up", text: "Pay your first month and tell us about your business." },
    { icon: "Hammer", when: "Within 7 working days", title: "We build it", text: "Your website goes live. We handle everything technical." },
    { icon: "Receipt", when: "Every month", title: "We run it", text: "We look after it and send you a report on how it is doing." },
  ],
} as const satisfies { readonly heading: string; readonly headingAccent: string; readonly steps: readonly StartStep[] };

/** The homepage questions an ad visitor needs answered before paying, in the order shown. The answers come from content/home.ts. */
export const START_FAQ_QUESTIONS = [
  "Is the website really free?",
  "Is there anything to pay up front?",
  "How long does it take to build my website?",
  "Can I cancel?",
  "Who owns the domain and the content?",
] as const;

export const START_CLOSING = {
  heading: "Let’s get your website",
  headingAccent: "live.",
  ringPre: "Questions first? Call",
} as const;

export const START_FAQ_HEADING = "Questions, answered.";
export const START_WORK_HEADING = "Real websites, live today.";
