// lib/pricing.ts
/**
 * Brandbasket's plans and every sum the site prints. Source: Brandbasket_Service_Plans.docx (October 2026).
 * Prices are monthly, in rupees, before GST. Change a price here and nowhere else.
 */
export type PlanId = "website" | "growth" | "search";
export type AddonId = Exclude<PlanId, "website">;

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly short: string;
  readonly monthly: number;
  readonly requires?: "website";
}

export const PLANS: Readonly<Record<PlanId, Plan>> = {
  website: { id: "website", name: "Managed Website", short: "Website", monthly: 3000 },
  growth: { id: "growth", name: "Digital Growth", short: "Growth", monthly: 7000, requires: "website" },
  search: { id: "search", name: "Local SEO + AEO", short: "Search", monthly: 25000, requires: "website" },
};

export const ADDONS: readonly AddonId[] = ["growth", "search"];
export const GST_RATE = 0.18;
/** Billed monthly: the first payment covers one month (owner decision, 2026-10-19). */
export const UPFRONT_MONTHS = 1;
export const EXTRA_HOURLY_RATE = 500;
export const AD_BUDGET_CAP = 10000;

export type AddonPick = Readonly<Record<AddonId, boolean>>;

export interface Package {
  readonly id: "website-only" | "website-growth" | "website-search" | "everything";
  readonly name: string;
  readonly addons: AddonPick;
}

export const PACKAGES: readonly Package[] = [
  { id: "website-only", name: "Website", addons: { growth: false, search: false } },
  { id: "website-growth", name: "Website + Growth", addons: { growth: true, search: false } },
  { id: "website-search", name: "Website + Search", addons: { growth: false, search: true } },
  { id: "everything", name: "All three", addons: { growth: true, search: true } },
];

export function basketPlans(picked: AddonPick): Plan[] {
  return [PLANS.website, ...ADDONS.filter((id) => picked[id]).map((id) => PLANS[id])];
}

export function monthlyTotal(picked: AddonPick): number {
  return basketPlans(picked).reduce((sum, plan) => sum + plan.monthly, 0);
}

export interface FirstPayment {
  readonly months: number;
  readonly base: number;
  readonly gst: number;
  readonly total: number;
}

export function firstPayment(monthly: number): FirstPayment {
  if (!Number.isFinite(monthly) || monthly < 0) throw new RangeError(`Monthly total must be a positive number, got ${monthly}`);
  const base = monthly * UPFRONT_MONTHS;
  const gst = Math.round(base * GST_RATE);
  return { months: UPFRONT_MONTHS, base, gst, total: base + gst };
}

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatInr(amount: number): string {
  return INR.format(amount);
}
