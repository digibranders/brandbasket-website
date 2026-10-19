// content/about.ts
// Copy for /about. Approved by the owner on 2026-10-19 (plan 02, Task 7.3).
// Business facts come from lib/site-config.ts, the steps from content/home.ts and the promises from the pricing
// Good to know (content/pricing.ts, content/legal/cancellation.ts). The page closes with the shared registered office
// card, components/legal/RegisteredOffice.tsx, so it holds no copy here.
import { businessDetails } from "@/lib/site-config";
import { STEPS, type Step } from "./home";
import { CANCELLATION_NOTICE, OWNERSHIP_ON_CANCEL } from "./legal/cancellation";

export interface AboutPromise {
  readonly title: string;
  readonly body: string;
}

/** The page title and description live in lib/seo/routes.ts with every other page's. */
export interface About {
  readonly h1: string;
  readonly lede: string;
  readonly who: { readonly heading: string; readonly paragraphs: readonly string[] };
  readonly how: { readonly heading: string; readonly steps: readonly Step[] };
  readonly wontDo: { readonly heading: string; readonly items: readonly AboutPromise[] };
}

const { legalName, tradeName, foundingYear, postalAddress } = businessDetails;

export const ABOUT: About = {
  h1: "Websites and local marketing, run for you",
  lede: "For clinics, salons, shops and other local businesses in India that want to be found online without doing the technical work.",
  who: {
    heading: "Who we are",
    paragraphs: [
      `${tradeName} is a brand of ${legalName}, founded in ${foundingYear} and based in ${postalAddress.locality}, ${postalAddress.region}.`,
      "We build your website for free, then run it every month: hosting, security, edits and a report. When you are ready, we also run your Google profile, your Meta ads and your local search.",
    ],
  },
  how: { heading: "How we work", steps: STEPS },
  wontDo: {
    heading: "What we will not do",
    items: [
      { title: "Lock you in", body: `Cancel any month with ${CANCELLATION_NOTICE}. ${OWNERSHIP_ON_CANCEL}` },
      { title: "Promise rankings or leads", body: "No one honestly can. You see the work and the numbers in a report every month." },
      { title: "Bill you for ad spend", body: "You pay Meta directly, so your ad spend stays in your name. Domain fees and paid tools are billed to you directly too." },
    ],
  },
};
