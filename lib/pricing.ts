// lib/pricing.ts
import type { Currency } from "@/lib/currency";

/**
 * Brandbasket's plans, package offers and every sum the site prints (owner decisions, 2026-10-21, 2026-10-26 and
 * 2026-10-27; docs/plans/15-website-pricing-offers.md, docs/plans/25-money-gst-and-offers.md). Prices are monthly, in
 * rupees or dollars. Rupee prices INCLUDE 18% GST: what a basket costs is what the customer pays, and GST is worked out
 * from inside it only for invoices. Dollar prices have no tax and the site never mentions one beside them.
 * Change a price or an offer here and nowhere else; brandbasket-platform holds the same numbers and is changed in the same release.
 */
/** Every plan, in the order the site lists them. Each can be bought on its own. */
export const PLAN_IDS = ["website", "growth", "search"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly short: string;
}

export const PLANS: Readonly<Record<PlanId, Plan>> = {
  website: { id: "website", name: "Managed Website", short: "Website" },
  // The id stays "growth" because ?plan=growth is what the platform reads.
  growth: { id: "growth", name: "Social Media and Ads", short: "Social" },
  search: { id: "search", name: "Local SEO + AEO", short: "SEO" },
};

/**
 * Plan prices are whole units of the currency (rupees with GST inside, dollars with none). A package takes a whole percent
 * off the combined price and the saving is rounded down to the whole unit (12998 less 10% is a saving of 1299.80, so 1299
 * and the customer pays 11699; owner, 2026-10-26). Every figure here is a whole number.
 */
const PLAN_PRICES: Readonly<Record<Currency, Readonly<Record<PlanId, number>>>> = {
  INR: { website: 2999, growth: 9999, search: 24999 },
  USD: { website: 65, growth: 150, search: 350 },
};

/** What one plan costs a month on its own. */
export function planPrice(id: PlanId, currency: Currency): number {
  return PLAN_PRICES[currency][id];
}

/** GST already inside every rupee price. Only the legal text, the rupee pages and the platform's invoices name the rate; dollar pages never do. */
export const GST_RATE = 0.18;
/** GST as printed in copy, for example "18%". */
export const GST_LABEL = `${Math.round(GST_RATE * 100)}%`;

/**
 * What the plans charge beyond their price, in each currency (owner, 2026-10-26 for rupees, 2026-10-27 for dollars):
 * an extra hour of changes, one reel edited, and the client's own Meta ad budget that Social Media and Ads manages each
 * month (ad credit comes on top of it).
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

export interface Package {
  readonly id: "website-growth" | "website-search" | "growth-search" | "everything";
  readonly name: string;
  readonly pick: BasketPick;
  /** Whole percent off the combined list price, for as long as every plan in it stays. */
  readonly percent: number;
  /** Money a month Brandbasket adds to the client's ad account, only when the package is bought together at the first purchase. */
  readonly adCredit: Readonly<Record<Currency, number>>;
}

export const PACKAGES: readonly Package[] = [
  { id: "website-growth", name: "Website + Social", pick: { website: true, growth: true, search: false }, percent: 10, adCredit: { INR: 1500, USD: 30 } },
  { id: "website-search", name: "Website + SEO", pick: { website: true, growth: false, search: true }, percent: 10, adCredit: { INR: 0, USD: 0 } },
  { id: "growth-search", name: "Social + SEO", pick: { website: false, growth: true, search: true }, percent: 10, adCredit: { INR: 1500, USD: 30 } },
  { id: "everything", name: "All three", pick: { website: true, growth: true, search: true }, percent: 20, adCredit: { INR: 3000, USD: 60 } },
];

export function basketPlans(pick: BasketPick): Plan[] {
  return PLAN_IDS.filter((id) => pick[id]).map((id) => PLANS[id]);
}

/** Whether two baskets hold the same plans. */
export function samePick(a: BasketPick, b: BasketPick): boolean {
  return PLAN_IDS.every((id) => a[id] === b[id]);
}

/** The package this exact basket is, or null for a single plan. */
export function packageFor(pick: BasketPick): Package | null {
  return PACKAGES.find((p) => samePick(p.pick, pick)) ?? null;
}

/** List price of the basket a month: the plans added up, before any package offer. */
export function monthlyTotal(pick: BasketPick, currency: Currency): number {
  return basketPlans(pick).reduce((sum, plan) => sum + planPrice(plan.id, currency), 0);
}

/** What the basket costs a month (rupees with GST inside): the list price less its package saving. */
export function packageTotal(pick: BasketPick, currency: Currency): number {
  return monthlyTotal(pick, currency) - packageSaving(pick, currency);
}

/** Money a month the package offer takes off the list price, rounded down to the whole unit; 0 for a single plan. */
export function packageSaving(pick: BasketPick, currency: Currency): number {
  const pkg = packageFor(pick);
  return pkg ? Math.floor((monthlyTotal(pick, currency) * pkg.percent) / 100) : 0;
}

/** Money a month of ad credit the basket earns when it is bought together at the first purchase. */
export function adCreditFor(pick: BasketPick, currency: Currency): number {
  return packageFor(pick)?.adCredit[currency] ?? 0;
}

export interface NextPlan {
  readonly id: PlanId;
  /** The basket with this plan added. */
  readonly pick: BasketPick;
  /** Money a month more than the basket costs now; negative when the package costs less. */
  readonly extra: number;
  /** What the new basket saves and earns a month. */
  readonly saving: number;
  readonly adCredit: number;
}

/**
 * The missing plan worth adding most (the Basket Card's "Add next"): the one whose saving and ad credit gained, less
 * its extra monthly cost, is largest. Null when every plan is already in the basket.
 */
export function nextPlanToAdd(pick: BasketPick, currency: Currency): NextPlan | null {
  const now = packageTotal(pick, currency);
  const gainedNow = packageSaving(pick, currency) + adCreditFor(pick, currency);
  let best: { readonly plan: NextPlan; readonly value: number } | null = null;
  for (const id of PLAN_IDS) {
    if (pick[id]) continue;
    const next: BasketPick = { ...pick, [id]: true };
    const plan: NextPlan = { id, pick: next, extra: packageTotal(next, currency) - now, saving: packageSaving(next, currency), adCredit: adCreditFor(next, currency) };
    const value = plan.saving + plan.adCredit - gainedNow - plan.extra;
    if (!best || value > best.value) best = { plan, value };
  }
  return best?.plan ?? null;
}
