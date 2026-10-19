// content/basket.ts
// Copy for the basket controls, word for word from the mock (docs/design/mock.html: .phc-act .adds, #h-plans .addpanel, .pbar).
import type { AddonId } from "@/lib/pricing";

export interface AddonCopy {
  readonly name: string;
  readonly summary: string;
  /** Accessible name of the switch. */
  readonly switchLabel: string;
}

/** Pricing hero rows (mock: .add). Names match `PLANS`. */
export const PRICING_ADDONS: Readonly<Record<AddonId, AddonCopy>> = {
  growth: { name: "Digital Growth", summary: "Google profile and Meta ads", switchLabel: "Add Digital Growth" },
  search: { name: "Local SEO + AEO", summary: "Google search and AI answers", switchLabel: "Add Local SEO and AEO" },
};

/** Homepage add-on panel rows (mock: .ap-row). */
export const HOME_ADDONS: Readonly<Record<AddonId, AddonCopy>> = {
  growth: {
    name: "Digital Growth",
    summary: "8 Google profile posts a month, and Instagram and Facebook ads run for you.",
    switchLabel: "Add Digital Growth",
  },
  search: {
    name: "Local SEO + AI search",
    summary: "5 pages improved every month, so you are found in Google and ChatGPT answers.",
    switchLabel: "Add Local SEO and AI search",
  },
};

export const BASKET_COPY = {
  rowsTitle: "Add to your basket",
  panelTitle: "Add when you are ready",
  panelNote: "Optional. Switch one on to see your monthly price.",
  explore: "What is included",
  add: "Add",
  added: "Added",
  perMonth: "a month",
  basketPrefix: "Your basket:",
  plusGst: "a month + GST",
  withGstBilled: "a month with GST, billed monthly",
  compare: "Compare all plans",
  totalLabel: "You pay each month, with GST",
  withGst: "with GST",
} as const;
