// lib/pricing.ts
import type { Currency } from "@/lib/currency";

/**
 * Brandbasket's plans and every sum the site prints (owner decisions, 2026-10-21 to 2026-11-11; docs/plans/25-money-gst-and-offers.md).
 * There are no package discounts and no ad money (owner, 2026-11-11): a basket costs the plans added up, and the only
 * offer is Dedicated Expert Monitoring free with all three plans. Prices are monthly, in
 * rupees or dollars. Rupee prices INCLUDE 18% GST: what a basket costs is what the customer pays, and GST is worked out
 * from inside it only for invoices. Dollar prices have no tax and the site never mentions one beside them.
 * Change a price or an offer here and nowhere else; brandbasket-platform holds the same numbers and is changed in the same release.
 */
/**
 * Every plan, in the order the site lists them. Each can be bought on its own. The AI-powered plans (owner, 2026-11-06)
 * replace Social Media and Ads ("growth") and Local SEO + AEO ("search"): Social and Ads are now separate plans and SEO
 * is no longer sold. The ids go to the platform in ?plan=, so brandbasket-platform must know "social" and "ads" before release.
 */
export const PLAN_IDS = ["website", "social", "ads"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly short: string;
}

export const PLANS: Readonly<Record<PlanId, Plan>> = {
  website: { id: "website", name: "Website Management", short: "Website" },
  social: { id: "social", name: "Social Media Management", short: "Social" },
  ads: { id: "ads", name: "Paid Ads Management", short: "Ads" },
};

/**
 * Plan prices are whole units of the currency (rupees with GST inside, dollars with none). A basket costs the plans added up,
 * with nothing taken off. Every figure here is a whole number.
 */
const PLAN_PRICES: Readonly<Record<Currency, Readonly<Record<PlanId, number>>>> = {
  INR: { website: 2999, social: 2999, ads: 2999 },
  USD: { website: 59, social: 59, ads: 59 },
};

/** What one plan costs a month on its own. */
export function planPrice(id: PlanId, currency: Currency): number {
  return PLAN_PRICES[currency][id];
}

/**
 * The "usually" prices printed struck through beside each plan price and beside the free build (owner, 2026-10-31): the
 * monthly price before the launch offer, and what building a website costs elsewhere. Display only; nothing is billed from them.
 */
const USUAL_PLAN_PRICES: Readonly<Record<Currency, Readonly<Record<PlanId, number>>>> = {
  INR: { website: 4999, social: 4999, ads: 4999 },
  USD: { website: 79, social: 79, ads: 79 },
};
const USUAL_BUILD_PRICES: Readonly<Record<Currency, number>> = { INR: 35000, USD: 1200 };

/** The struck-through "usually" monthly price of one plan. */
export function planUsualPrice(id: PlanId, currency: Currency): number {
  return USUAL_PLAN_PRICES[currency][id];
}

/** The struck-through "usually" price of building a website, beside the free build. */
export function buildUsualPrice(currency: Currency): number {
  return USUAL_BUILD_PRICES[currency];
}

/** GST already inside every rupee price. Only the legal text, the rupee pages and the platform's invoices name the rate; dollar pages never do. */
export const GST_RATE = 0.18;
/** GST as printed in copy, for example "18%". */
export const GST_LABEL = `${Math.round(GST_RATE * 100)}%`;

/**
 * What the plans charge beyond their price, in each currency (owner, 2026-10-26 for rupees, 2026-10-27 for dollars):
 * an extra hour of changes, one reel edited (Social Media Management), and the client's own Meta ad budget that Paid Ads
 * Management manages each month.
 */
export interface Extras {
  readonly hour: number;
  readonly reel: number;
  readonly adBudgetCap: number;
}

const EXTRAS: Readonly<Record<Currency, Extras>> = {
  INR: { hour: 500, reel: 500, adBudgetCap: 10000 },
  USD: { hour: 10, reel: 10, adBudgetCap: 120 },
};

export function extrasFor(currency: Currency): Extras {
  return EXTRAS[currency];
}

/** Which plans are in the basket. The basket store never lets it go empty. */
export type BasketPick = Readonly<Record<PlanId, boolean>>;

export function basketPlans(pick: BasketPick): Plan[] {
  return PLAN_IDS.filter((id) => pick[id]).map((id) => PLANS[id]);
}

/** Whether two baskets hold the same plans. */
export function samePick(a: BasketPick, b: BasketPick): boolean {
  return PLAN_IDS.every((id) => a[id] === b[id]);
}

/** What the basket costs a month: the plans added up (rupees with GST inside, dollars with none). */
export function monthlyTotal(pick: BasketPick, currency: Currency): number {
  return basketPlans(pick).reduce((sum, plan) => sum + planPrice(plan.id, currency), 0);
}

/**
 * Dedicated Expert Monitoring: our team watches, optimises and supports the client's plans (owner, 2026-11-06). It is the
 * "Done For You" of the homepage: included at no extra cost with all three plans, otherwise a monthly add-on at this price
 * (rupees with GST inside, dollars with no tax).
 */
export const MONITORING = { name: "Dedicated Expert Monitoring" } as const;

const MONITORING_PRICES: Readonly<Record<Currency, number>> = { INR: 6000, USD: 99 };

/** What monitoring costs a month as an add-on. */
export function monitoringPrice(currency: Currency): number {
  return MONITORING_PRICES[currency];
}

/** Whether the basket gets monitoring at no extra cost: every plan is in it. */
export function monitoringIncluded(pick: BasketPick): boolean {
  return PLAN_IDS.every((id) => pick[id]);
}
