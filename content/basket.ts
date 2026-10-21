// content/basket.ts
// Copy for the basket controls, word for word from the mock (docs/design/mock.html: .phc-act .adds, #h-plans .addpanel, .pbar).
import type { PlanId } from "@/lib/pricing";

export interface AddonCopy {
  readonly name: string;
  readonly summary: string;
  /** Accessible name of the switch. */
  readonly switchLabel: string;
}

/** Pricing hero rows (mock: .add). Names match `PLANS`. */
export const PRICING_PLANS: Readonly<Record<PlanId, AddonCopy>> = {
  website: { name: "Managed Website", summary: "Built free, then hosted, secure and kept up to date", switchLabel: "Add Managed Website" },
  growth: { name: "Social Media and Ads", summary: "Instagram, Facebook, Google profile and Meta ads", switchLabel: "Add Social Media and Ads" },
  search: { name: "Local SEO + AEO", summary: "Google search and AI answers", switchLabel: "Add Local SEO and AEO" },
};

/** Homepage plan rows (mock: .ap-row). */
export const HOME_PLANS: Readonly<Record<PlanId, AddonCopy>> = {
  website: {
    name: "Managed Website",
    summary: "We build it free, then host it, secure it and make 2 small edits a month.",
    switchLabel: "Add Managed Website",
  },
  growth: {
    name: "Social Media and Ads",
    summary: "12 Instagram and Facebook posts and 8 Google profile posts a month, and your Meta ads run for you.",
    switchLabel: "Add Social Media and Ads",
  },
  search: {
    name: "Local SEO + AI search",
    summary: "5 pages improved every month, so you are found in Google and ChatGPT answers.",
    switchLabel: "Add Local SEO and AI search",
  },
};

export const BASKET_COPY = {
  panelTitle: "Add when you are ready",
  explore: "What is included",
  add: "Add",
  added: "Added",
  perMonth: "a month",
  basketPrefix: "Your basket:",
  plusGst: "a month + GST",
  withGstBilled: "a month with GST, billed monthly",
  compare: "Compare all plans",
  totalLabel: "You pay each month, with GST",
  phoneBarCaption: "a month, with GST",
} as const;
