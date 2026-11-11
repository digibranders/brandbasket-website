// content/basket.ts
// Copy for the basket controls, word for word from the mock (docs/design/mock.html: .phc-act .adds, #h-plans .addpanel,
// .offer-note, .pbar). Money comes from lib/pricing.ts, in the page's currency. There are no package discounts or ad money
// (owner, 2026-11-11); the one offer is Dedicated Expert Monitoring free with all three plans.
import type { Currency } from "@/lib/currency";
import { type BasketPick, basketPlans, monitoringIncluded, PLAN_IDS, type PlanId } from "@/lib/pricing";
import { monitoringNote } from "./pricing";

export interface PlanCopy {
  readonly name: string;
  readonly summary: string;
  /** Accessible name of the switch. */
  readonly switchLabel: string;
}

/** Pricing hero rows (mock: .add). Names match `PLANS`. */
export const PRICING_PLANS: Readonly<Record<PlanId, PlanCopy>> = {
  website: { name: "Website Management", summary: "Built free, hosted and kept up to date", switchLabel: "Add Website Management" },
  social: { name: "Social Media Management", summary: "AI posts, captions and scheduling on up to 4 platforms", switchLabel: "Add Social Media Management" },
  ads: { name: "Paid Ads Management", summary: "Meta ads with AI creatives, set up and optimised", switchLabel: "Add Paid Ads Management" },
};

export const BASKET_COPY = {
  heroIntro: "Build your basket. Take all three plans and Dedicated Expert Monitoring is included.",
  perMonth: "a month",
  basketPrefix: "Your basket:",
  /** Read before the struck list price. */
  was: "Usually",
  compare: "Compare all plans",
  /** On a phone, where two buttons share one row. */
  compareShort: "Compare plans",
  /** The pricing page's two main buttons, beside the basket total. They work for any plan, so they do not say "free website" (owner's pick, 2026-10-23). */
  startPlan: "Start my plan",
  /** The floating basket at the foot of the screen. */
  dockLabel: "Your basket",
  /** The basket pop-up opened from the nav button and the dock. */
  reviewBasket: "Review your basket",
  panelClose: "Close basket",
  proceed: "Proceed to checkout",
  rowAdd: "Add",
  rowRemove: "Remove",
  rowLast: "In basket",
  planOne: "plan",
  planMany: "plans",
} as const;

/** The three lines that sit beside a basket total. */
export interface MoneyCopy {
  /** Under a total on the pricing band and the Basket Card. */
  readonly inclGst: string;
  /** Above the pricing total. */
  readonly totalLabel: string;
  /** Beside the total on the dock, the wall tag and the basket pop-up, and in their accessible names. */
  readonly phoneBarCaption: string;
}

const MONEY_COPY: Readonly<Record<Currency, MoneyCopy>> = {
  // Every rupee price includes GST (owner, 2026-10-26), so the total is the one figure and the note says so.
  INR: { inclGst: "a month, incl. GST", totalLabel: "You pay each month, incl. GST", phoneBarCaption: "a month, incl. GST" },
  // Dollar prices carry no tax, and the site never names one beside them (owner, 2026-10-27).
  USD: { inclGst: "a month", totalLabel: "You pay each month", phoneBarCaption: "a month" },
};

export function moneyCopy(currency: Currency): MoneyCopy {
  return MONEY_COPY[currency];
}

/** The basket card's count beside its title, e.g. "2 of 3 plans" (docs/design/nav-cart-options.html). */
export function planCount(pick: BasketPick): string {
  return `${basketPlans(pick).length} of ${PLAN_IDS.length} plans`;
}

/** The strip under the plan rows: the one offer, Dedicated Expert Monitoring free with all three plans. */
export function offerNote(pick: BasketPick, currency: Currency): string {
  return monitoringNote(monitoringIncluded(pick), currency);
}
