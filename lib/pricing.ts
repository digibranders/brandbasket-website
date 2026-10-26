// lib/pricing.ts
/**
 * Brandbasket's plans, package offers and every sum the site prints (owner decisions, 2026-10-21 and 2026-10-26;
 * docs/plans/15-website-pricing-offers.md, docs/plans/25-money-gst-and-offers.md). Prices are monthly, in rupees, and
 * INCLUDE 18% GST: what a basket costs is what the customer pays, and GST is worked out from inside it only for invoices.
 * Change a price or an offer here and nowhere else; brandbasket-platform holds the same numbers and is changed in the same release.
 */
/** Every plan, in the order the site lists them. Each can be bought on its own. */
export const PLAN_IDS = ["website", "growth", "search"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/**
 * Plan prices are whole rupees, GST included. A package takes a whole percent off the combined price and the saving is
 * rounded down to the whole rupee (12998 less 10% is a saving of 1299.80, so 1299 and the customer pays 11699; owner,
 * 2026-10-26). Every figure here is a whole rupee.
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

/** GST already inside every price. Only the legal text and the platform's invoices name the rate. */
export const GST_RATE = 0.18;
/** GST as printed in copy, for example "18%". */
export const GST_LABEL = `${Math.round(GST_RATE * 100)}%`;
export const EXTRA_HOURLY_RATE = 500;
/** What Social Media and Ads charges to edit one reel (the doc of 2026-10-26: "500 per reel"). */
export const REEL_RATE = 500;
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
  { id: "website-growth", name: "Website + Social", pick: { website: true, growth: true, search: false }, percent: 10, adCredit: 1500 },
  { id: "website-search", name: "Website + SEO", pick: { website: true, growth: false, search: true }, percent: 10, adCredit: 0 },
  { id: "growth-search", name: "Social + SEO", pick: { website: false, growth: true, search: true }, percent: 10, adCredit: 1500 },
  { id: "everything", name: "All three", pick: { website: true, growth: true, search: true }, percent: 20, adCredit: 3000 },
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

/** What the basket costs a month, GST included: the list price less its package saving. */
export function packageTotal(pick: BasketPick): number {
  return monthlyTotal(pick) - packageSaving(pick);
}

/** Rupees a month the package offer takes off the list price, rounded down to the whole rupee; 0 for a single plan. */
export function packageSaving(pick: BasketPick): number {
  const pkg = packageFor(pick);
  return pkg ? Math.floor((monthlyTotal(pick) * pkg.percent) / 100) : 0;
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
 * The missing plan worth adding most (the Basket Card's "Add next"): the one whose saving and ad credit gained, less
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

const INR_WHOLE = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const INR_PAISE = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Whole rupees print without decimals; any paise print as exactly two decimals (the site prints none now that prices include GST). */
export function formatInr(amount: number): string {
  return (Number.isInteger(amount) ? INR_WHOLE : INR_PAISE).format(amount);
}
