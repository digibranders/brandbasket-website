// lib/pricing.ts
/**
 * Brandbasket's plans, package offers and every sum the site prints (owner decisions, 2026-10-21;
 * docs/plans/15-website-pricing-offers.md). Prices are monthly, in rupees, before GST. Change a price or an offer here
 * and nowhere else; brandbasket-platform holds the same numbers and is changed in the same release.
 */
/** Every plan, in the order the site lists them. Each can be bought on its own. */
export const PLAN_IDS = ["website", "growth", "search"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/**
 * Plan prices are whole rupees. A package takes a whole percent off the combined price and rounds down to the whole
 * rupee (12998 less 20% is 10398.40, so 10398; owner, 2026-10-21). GST can still leave paise, so every sum below is
 * worked in whole paise and divided by 100 once at the end.
 */
export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly short: string;
  readonly monthly: number;
}

export const PLANS: Readonly<Record<PlanId, Plan>> = {
  website: { id: "website", name: "Managed Website", short: "Website", monthly: 2999 },
  // The id stays "growth" because ?plan=growth is what the platform reads.
  growth: { id: "growth", name: "Social Media and Ads", short: "Social", monthly: 9999 },
  search: { id: "search", name: "Local SEO + AEO", short: "SEO", monthly: 24999 },
};

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
export function monthlyTotal(pick: BasketPick): number {
  return basketPlans(pick).reduce((sum, plan) => sum + plan.monthly, 0);
}

const PAISE_PER_RUPEE = 100;

function monthlyTotalPaise(pick: BasketPick): number {
  return Math.round(monthlyTotal(pick) * PAISE_PER_RUPEE);
}

function packageTotalPaise(pick: BasketPick): number {
  const pkg = packageFor(pick);
  if (!pkg) return monthlyTotalPaise(pick);
  const exact = (monthlyTotalPaise(pick) * (100 - pkg.percent)) / 100;
  return Math.floor(exact / PAISE_PER_RUPEE) * PAISE_PER_RUPEE;
}

/** What the basket costs a month: the list price less its package offer, rounded down to the whole rupee. */
export function packageTotal(pick: BasketPick): number {
  return packageTotalPaise(pick) / PAISE_PER_RUPEE;
}

/** Rupees a month the package offer takes off the list price; 0 for a single plan. */
export function packageSaving(pick: BasketPick): number {
  return (monthlyTotalPaise(pick) - packageTotalPaise(pick)) / PAISE_PER_RUPEE;
}

/** Rupees a month of ad credit the basket earns when it is bought together at the first purchase. */
export function adCreditFor(pick: BasketPick): number {
  return packageFor(pick)?.adCredit ?? 0;
}

export interface NextPlan {
  readonly id: PlanId;
  /** The basket with this plan added. */
  readonly pick: BasketPick;
  /** Rupees a month more than the basket costs now; negative when the package costs less. */
  readonly extra: number;
  /** What the new basket saves and earns a month. */
  readonly saving: number;
  readonly adCredit: number;
}

/**
 * The missing plan worth adding most (the Basket Card's "Next stamp"): the one whose saving and ad credit gained, less
 * its extra monthly cost, is largest. Null when every plan is already in the basket.
 */
export function nextPlanToAdd(pick: BasketPick): NextPlan | null {
  const now = packageTotal(pick);
  const gainedNow = packageSaving(pick) + adCreditFor(pick);
  let best: { readonly plan: NextPlan; readonly value: number } | null = null;
  for (const id of PLAN_IDS) {
    if (pick[id]) continue;
    const next: BasketPick = { ...pick, [id]: true };
    const plan: NextPlan = { id, pick: next, extra: packageTotal(next) - now, saving: packageSaving(next), adCredit: adCreditFor(next) };
    const value = plan.saving + plan.adCredit - gainedNow - plan.extra;
    if (!best || value > best.value) best = { plan, value };
  }
  return best?.plan ?? null;
}

export interface FirstPayment {
  readonly months: number;
  readonly base: number;
  readonly gst: number;
  readonly total: number;
}

export function firstPayment(monthly: number): FirstPayment {
  if (!Number.isFinite(monthly) || monthly < 0) throw new RangeError(`Monthly total must be a non-negative number, got ${monthly}`);
  const basePaise = Math.round(monthly * UPFRONT_MONTHS * PAISE_PER_RUPEE);
  // GST on the whole base, half a paisa rounding up, as the platform checkout and the GST invoice do.
  const gstPaise = Math.round((basePaise * Math.round(GST_RATE * 100)) / 100);
  return { months: UPFRONT_MONTHS, base: basePaise / PAISE_PER_RUPEE, gst: gstPaise / PAISE_PER_RUPEE, total: (basePaise + gstPaise) / PAISE_PER_RUPEE };
}

const INR_WHOLE = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const INR_PAISE = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Whole rupees print without decimals; any paise print as exactly two decimals. */
export function formatInr(amount: number): string {
  return (Number.isInteger(amount) ? INR_WHOLE : INR_PAISE).format(amount);
}
