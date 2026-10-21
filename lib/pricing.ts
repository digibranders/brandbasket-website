// lib/pricing.ts
/**
 * Brandbasket's plans, package offers and every sum the site prints (owner decisions, 2026-10-21;
 * docs/plans/15-website-pricing-offers.md). Prices are monthly, in rupees, before GST. Change a price or an offer here
 * and nowhere else; brandbasket-platform holds the same numbers and is changed in the same release.
 */
export type PlanId = "website" | "growth" | "search";

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly short: string;
  readonly monthly: number;
}

export const PLANS: Readonly<Record<PlanId, Plan>> = {
  website: { id: "website", name: "Managed Website", short: "Website", monthly: 3000 },
  growth: { id: "growth", name: "Social Media and Ads", short: "Social", monthly: 10000 },
  search: { id: "search", name: "Local SEO + AEO", short: "SEO", monthly: 25000 },
};

/** Every plan, in the order the site lists them. Each can be bought on its own. */
export const PLAN_IDS: readonly PlanId[] = ["website", "growth", "search"];
export const GST_RATE = 0.18;
/** GST as printed in copy, for example "18%". */
export const GST_LABEL = `${Math.round(GST_RATE * 100)}%`;
/** Billed monthly: the first payment covers one month (owner decision, 2026-10-19). */
export const UPFRONT_MONTHS = 1;
export const EXTRA_HOURLY_RATE = 500;
/** The client's own Meta ad budget that Social Media and Ads manages each month. Ad credit comes on top of it. */
export const AD_BUDGET_CAP = 10000;

/** Which plans are in the basket. The basket store never lets it go empty. */
export type BasketPick = Readonly<Record<PlanId, boolean>>;

export interface Package {
  readonly id: "website-growth" | "website-search" | "growth-search" | "everything";
  readonly name: string;
  readonly pick: BasketPick;
  /** Whole percent off the combined list price, for as long as every plan in it stays. */
  readonly percent: number;
  /** Rupees a month Brandbasket adds to the client's ad account, only when the package is bought together at the first purchase. */
  readonly adCredit: number;
}

export const PACKAGES: readonly Package[] = [
  { id: "website-growth", name: "Website + Social", pick: { website: true, growth: true, search: false }, percent: 20, adCredit: 2000 },
  { id: "website-search", name: "Website + SEO", pick: { website: true, growth: false, search: true }, percent: 20, adCredit: 0 },
  { id: "growth-search", name: "Social + SEO", pick: { website: false, growth: true, search: true }, percent: 30, adCredit: 2000 },
  { id: "everything", name: "All three", pick: { website: true, growth: true, search: true }, percent: 30, adCredit: 5000 },
];

// shortcut: kept only for components/basket/scene until plan 15 Task 5 makes the website tiles a group; remove then.
export type AddonId = Exclude<PlanId, "website">;
export type AddonPick = Readonly<Record<AddonId, boolean>>;
export const ADDONS: readonly AddonId[] = ["growth", "search"];

export function basketPlans(pick: BasketPick): Plan[] {
  return PLAN_IDS.filter((id) => pick[id]).map((id) => PLANS[id]);
}

/** The package this exact basket is, or null for a single plan. */
export function packageFor(pick: BasketPick): Package | null {
  return PACKAGES.find((p) => PLAN_IDS.every((id) => p.pick[id] === pick[id])) ?? null;
}

/** List price of the basket a month: the plans added up, before any package offer. */
export function monthlyTotal(pick: BasketPick): number {
  return basketPlans(pick).reduce((sum, plan) => sum + plan.monthly, 0);
}

/** What the basket costs a month: the list price less its package offer. */
export function packageTotal(pick: BasketPick): number {
  const pkg = packageFor(pick);
  // Whole percent points in integer paise: 38000 * 70 has no float drift.
  return pkg ? Math.round(monthlyTotal(pick) * (100 - pkg.percent)) / 100 : monthlyTotal(pick);
}

/** Rupees a month the package offer takes off the list price; 0 for a single plan. */
export function packageSaving(pick: BasketPick): number {
  return monthlyTotal(pick) - packageTotal(pick);
}

/** Rupees a month of ad credit the basket earns when it is bought together at the first purchase. */
export function adCreditFor(pick: BasketPick): number {
  return packageFor(pick)?.adCredit ?? 0;
}

export interface FirstPayment {
  readonly months: number;
  readonly base: number;
  readonly gst: number;
  readonly total: number;
}

export function firstPayment(monthly: number): FirstPayment {
  if (!Number.isFinite(monthly) || monthly < 0) throw new RangeError(`Monthly total must be a non-negative number, got ${monthly}`);
  const base = monthly * UPFRONT_MONTHS;
  // Integer paise maths: exact for whole-rupee bases, no float drift, and no rounding to the rupee (matches checkout).
  const gstPaise = Math.round(base * Math.round(GST_RATE * 100));
  return { months: UPFRONT_MONTHS, base, gst: gstPaise / 100, total: (base * 100 + gstPaise) / 100 };
}

const INR_WHOLE = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const INR_PAISE = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Whole rupees print without decimals; any paise print as exactly two decimals. */
export function formatInr(amount: number): string {
  return (Number.isInteger(amount) ? INR_WHOLE : INR_PAISE).format(amount);
}
