// content/basket-card.ts
// Copy for the homepage Basket Card (docs/design/mock.html: .ox-card, .bsum; owner's pick, 2026-10-21). Percents and rupees come from lib/pricing.ts.
import { adCreditFor, type BasketPick, basketPlans, formatInr, nextPlanToAdd, type Package, PACKAGES, PLAN_IDS, PLANS, packageFor, packageSaving, packageTotal, type PlanId } from "@/lib/pricing";

/** A line with one bold run, rendered as before<b>strong</b>after. */
export interface Rich {
  readonly before: string;
  readonly strong: string;
  readonly after: string;
}

const rich = (before: string, strong: string, after: string): Rich => ({ before, strong, after });

const MONTHS_IN_YEAR = 12;

const twoPlanPackages = PACKAGES.filter((p) => basketPlans(p.pick).length === 2);
const found = PACKAGES.find((p) => basketPlans(p.pick).length === PLAN_IDS.length);
if (twoPlanPackages.length === 0 || !found) throw new RangeError("PACKAGES needs two-plan packages and an all-three package");
const fullCard: Package = found;
const TWO_PLAN_PERCENT = Math.min(...twoPlanPackages.map((p) => p.percent));
const MAX_AD_CREDIT = Math.max(...PACKAGES.map((p) => p.adCredit));

export const BASKET_CARD = {
  id: "basket-card",
  title: "Basket Card",
  intro: "Pick the plans you need. Each one you add saves you more.",
  tapHint: "Tap to add",
  slots: {
    website: "Built free, kept running",
    growth: "Posts and Meta ads, run for you",
    search: "Found on Google and in AI answers",
  } satisfies Readonly<Record<PlanId, string>>,
  inBasket: "In your basket",
  totalLabel: "Your total",
  oneTimeTag: "One-time offer",
  nextLabel: "Add next:",
  /** The Basket Card button once sign-up leads to checkout (owner's pick, 2026-10-22). Until then it keeps "Start my plan". */
  checkoutCta: "Continue to checkout",
} as const;

/** Accessible name of a plan slot. */
export function slotLabel(id: PlanId, added: boolean): string {
  return added ? `Remove ${PLANS[id].name}` : `Add ${PLANS[id].name}`;
}

/** The summary's headline (mock: card() head). */
export function headline(pick: BasketPick): string {
  const pkg = packageFor(pick);
  if (!pkg) {
    const next = nextPlanToAdd(pick);
    const percent = next ? (packageFor(next.pick)?.percent ?? TWO_PLAN_PERCENT) : TWO_PLAN_PERCENT;
    return `Add one more plan for ${percent}% off.`;
  }
  const ads = pkg.adCredit > 0 ? ` and ${formatInr(pkg.adCredit)} a month for your ads.` : " on both plans.";
  return `${pkg === fullCard ? "Full basket. " : ""}${pkg.percent}% off${ads}`;
}

export type BenefitKind = "saving" | "ads" | "year" | "build";

export interface Benefit extends Rich {
  readonly kind: BenefitKind;
}

/** The ticked lines under the summary price. */
export function benefits(pick: BasketPick): Benefit[] {
  const saving = packageSaving(pick);
  if (saving === 0) return pick.website ? [{ kind: "build", ...rich("Your website is ", "built free", "") }] : [];
  const credit = adCreditFor(pick);
  const list: Benefit[] = [{ kind: "saving", ...rich("You save ", formatInr(saving), " every month") }];
  if (credit > 0) list.push({ kind: "ads", ...rich("We add ", formatInr(credit), " a month to your ads") });
  list.push({ kind: "year", ...rich("", formatInr((saving + credit) * MONTHS_IN_YEAR), " back in your first year") });
  return list;
}

/** The "One-time offer" note: ad money only comes with plans started together at this checkout. */
export function oneTimeNote(pick: BasketPick): Rich | null {
  const credit = adCreditFor(pick);
  if (credit > 0) {
    return rich("The ", `${formatInr(credit)} a month for your ads`, " comes only when you start these plans together, here at this checkout. Add a plan later and you get the package price, but no ad money.");
  }
  if (basketPlans(pick).length === 1) {
    return rich("Start two or three plans together at this checkout and we add up to ", `${formatInr(MAX_AD_CREDIT)} a month to your ads`, ". Add a plan later and the ad money is gone.");
  }
  return null;
}

export interface NextStampCopy {
  readonly id: PlanId;
  readonly name: string;
  readonly body: string;
  readonly button: string;
}

/** The "Add next" nudge: the plan worth adding most, what it costs and what it gains. */
export function nextStamp(pick: BasketPick): NextStampCopy | null {
  const next = nextPlanToAdd(pick);
  if (!next) return null;
  // Name the new total, not the difference: "₹7,399 more" next to a plan priced ₹9,999 read as a wrong price.
  const now = formatInr(packageTotal(pick));
  const after = formatInr(packageTotal(next.pick));
  const change = next.extra > 0 ? `goes from ${now} to ${after}` : next.extra < 0 ? `drops from ${now} to ${after}` : `stays at ${now}`;
  const pkg = packageFor(next.pick);
  const plans = basketPlans(next.pick).length === PLAN_IDS.length ? "all three plans" : "both plans";
  const cost = pkg ? `With ${pkg.percent}% off ${plans}, your total ${change} a month.` : `Your total ${change} a month.`;
  const savingNow = packageSaving(pick);
  const creditNow = adCreditFor(pick);
  const saving = savingNow > 0 ? `Your saving goes from ${formatInr(savingNow)} to ${formatInr(next.saving)} a month` : `You save ${formatInr(next.saving)} a month`;
  const credit =
    next.adCredit <= creditNow
      ? "."
      : creditNow > 0
        ? `, and your ad money from ${formatInr(creditNow)} to ${formatInr(next.adCredit)}.`
        : `, and we add ${formatInr(next.adCredit)} a month to your ads.`;
  return { id: next.id, name: PLANS[next.id].name, body: `${cost} ${saving}${credit}`, button: `Add ${PLANS[next.id].short}` };
}
