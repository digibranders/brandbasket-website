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

/** Homepage plan rows (mock: .ap-row). */
export const HOME_PLANS: Readonly<Record<PlanId, PlanCopy>> = {
  website: {
    name: "Managed Website",
    summary: "We build it free, then host it, secure it and make 2 small edits a month.",
    switchLabel: "Add Managed Website",
  },
  growth: {
    name: "Social Media and Ads",
    summary: "Instagram, Facebook and Google profile posts planned with you each month, and your Meta ads run for you.",
    switchLabel: "Add Social Media and Ads",
  },
  search: {
    name: "Local SEO + AI search",
    summary: "5 pages improved every month, so you are found in Google and ChatGPT answers.",
    switchLabel: "Add Local SEO and AI search",
  },
};

/** The smallest offer on two plans, and the offer on all three, as printed: "20%" and "30%". */
const twoPlanPercents = PACKAGES.filter((p) => basketPlans(p.pick).length === 2).map((p) => p.percent);
const allThree = PACKAGES.find((p) => basketPlans(p.pick).length === PLAN_IDS.length);
if (twoPlanPercents.length === 0 || !allThree) throw new RangeError("PACKAGES needs a two-plan package and an all-three package");
const TWO_PLANS_FROM = `${Math.min(...twoPlanPercents)}%`;
const ALL_THREE = `${allThree.percent}%`;

export const BASKET_COPY = {
  panelTitle: "Build your basket",
  panelNote: `Two plans are ${TWO_PLANS_FROM} off or more. All three are ${ALL_THREE} off.`,
  heroIntro: `Build your basket. Two plans are ${TWO_PLANS_FROM} off or more, all three are ${ALL_THREE} off.`,
  explore: "What is included",
  add: "Add",
  added: "Added",
  perMonth: "a month",
  basketPrefix: "Your basket:",
  /** Read before the struck list price. */
  was: "Usually",
  plusGst: "a month + GST",
  withGstBilled: "a month with GST, billed monthly",
  compare: "Compare all plans",
  totalLabel: "You pay each month, with GST",
  phoneBarCaption: "a month, with GST",
} as const;

/** The strip under the plan rows (mock: offerText()): the invitation for one plan, or what the package earns. */
export function offerNote(pick: BasketPick): string {
  const pkg = packageFor(pick);
  if (!pkg) return `Take two plans and save ${TWO_PLANS_FROM} or more. Take all three and save ${ALL_THREE}.`;
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
