// content/basket.ts
// Copy for the basket controls, word for word from the mock (docs/design/mock.html: .phc-act .adds, #h-plans .addpanel, .pbar).
import { type AddonId, SIGNUP_ADDON_DISCOUNT_LABEL } from "@/lib/pricing";

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
  rowsTitle: `Add to your basket. ${SIGNUP_ADDON_DISCOUNT_LABEL} off when you add them as you start.`,
  panelTitle: "Add when you are ready",
  panelNote: `Optional. Add them as you start and they are ${SIGNUP_ADDON_DISCOUNT_LABEL} off for as long as they run.`,
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
