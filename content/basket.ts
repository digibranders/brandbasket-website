// content/basket.ts
// Copy for the basket controls, word for word from the mock (docs/design/mock.html: .phc-act .adds, #h-plans .addpanel,
// .offer-note, .pbar). Percents and rupees come from lib/pricing.ts.
import { adCreditFor, type BasketPick, basketPlans, formatInr, PACKAGES, PLAN_IDS, packageFor, packageSaving, type PlanId } from "@/lib/pricing";

export interface PlanCopy {
  readonly name: string;
  readonly summary: string;
  /** Accessible name of the switch. */
  readonly switchLabel: string;
}

/** Pricing hero rows (mock: .add). Names match `PLANS`. */
export const PRICING_PLANS: Readonly<Record<PlanId, PlanCopy>> = {
  website: { name: "Managed Website", summary: "Built free, hosted and kept up to date", switchLabel: "Add Managed Website" },
  growth: { name: "Social Media and Ads", summary: "Instagram, Facebook, Google profile and Meta ads", switchLabel: "Add Social Media and Ads" },
  search: { name: "Local SEO + AEO", summary: "Google search and AI answers", switchLabel: "Add Local SEO + AEO" },
};

/** The smallest offer on two plans, and the offer on all three, as printed: "20%" and "30%". */
const twoPlanPercents = PACKAGES.filter((p) => basketPlans(p.pick).length === 2).map((p) => p.percent);
const allThree = PACKAGES.find((p) => basketPlans(p.pick).length === PLAN_IDS.length);
if (twoPlanPercents.length === 0 || !allThree) throw new RangeError("PACKAGES needs a two-plan package and an all-three package");
const TWO_PLANS_FROM = `${Math.min(...twoPlanPercents)}%`;
const ALL_THREE = `${allThree.percent}%`;

export const BASKET_COPY = {
  heroIntro: `Build your basket. Two plans are ${TWO_PLANS_FROM} off, all three are ${ALL_THREE} off.`,
  perMonth: "a month",
  basketPrefix: "Your basket:",
  /** Read before the struck list price. */
  was: "Usually",
  /** Every price includes GST (owner, 2026-10-26), so the total is the one figure and the note says so. */
  inclGst: "a month, incl. GST",
  compare: "Compare all plans",
  /** On a phone, where two buttons share one row. */
  compareShort: "Compare plans",
  totalLabel: "You pay each month, incl. GST",
  phoneBarCaption: "a month, incl. GST",
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

/** The basket card's count beside its title, e.g. "2 of 3 plans" (docs/design/nav-cart-options.html). */
export function planCount(pick: BasketPick): string {
  return `${basketPlans(pick).length} of ${PLAN_IDS.length} plans`;
}

/** The strip under the plan rows (mock: offerText()): the invitation for one plan, or what the package earns. */
export function offerNote(pick: BasketPick): string {
  const pkg = packageFor(pick);
  if (!pkg) return `Take two plans and save ${TWO_PLANS_FROM}. Take all three and save ${ALL_THREE}.`;
  const line = `${pkg.name}: ${pkg.percent}% off, so you save ${formatInr(packageSaving(pick))} a month.`;
  const credit = adCreditFor(pick);
  if (credit === 0) return line;
  return `${line} Start with ${basketPlans(pick).length === PLAN_IDS.length ? "all three" : "both"} and we add ${formatInr(credit)} a month to your ads.`;
}

/** The line under the pricing hero total (mock: .was-line); empty when the basket saves nothing. */
export function saveLine(pick: BasketPick): string {
  const saving = packageSaving(pick);
  return saving > 0 ? `You save ${formatInr(saving)} a month` : "";
}
