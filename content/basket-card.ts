// content/basket-card.ts
// Copy for the homepage Basket Card (docs/design/mock.html: .ox-card, .bsum; owner's pick, 2026-10-21). Percents and rupees come from lib/pricing.ts.
import { adCreditFor, type BasketPick, basketPlans, formatInr, nextPlanToAdd, type Package, PACKAGES, PLAN_IDS, PLANS, packageFor, packageSaving, type PlanId } from "@/lib/pricing";

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
  inBasket: "In your basket",
  totalLabel: "Your total",
  oneTimeTag: "One-time offer",
  nextLabel: "Add next:",
  /** The Basket Card button (owner's pick, 2026-10-22). It opens the basket pop-up, like every main button (owner, 2026-10-26). */
  checkoutCta: "Continue to checkout",
  /** The same button on a phone, where two buttons share one row (owner, 2026-10-26; wording still to be approved). */
  checkoutCtaShort: "Checkout",
} as const;

/** Accessible name of a plan slot. */
export function slotLabel(id: PlanId, added: boolean): string {
  return added ? `Remove ${PLANS[id].name}` : `Add ${PLANS[id].name}`;
}

const ALL_PICK: BasketPick = { website: true, growth: true, search: true };

/** The owner's nudge line (docs/plans/24, 2026-10-26): "Add one more plan to get 10% off, save ₹1,299/month." */
function nudge(percent: number, saving: number, plansToAdd: number): string {
  return `Add ${plansToAdd === 1 ? "one more plan" : "two more plans"} to get ${percent}% off, save ${formatInr(saving)}/month.`;
}

/** The summary's headline (mock: card() head). */
export function headline(pick: BasketPick): string {
  const pkg = packageFor(pick);
  if (!pkg) {
    const next = nextPlanToAdd(pick);
    const percent = next ? (packageFor(next.pick)?.percent ?? TWO_PLAN_PERCENT) : TWO_PLAN_PERCENT;
    return next ? nudge(percent, next.saving, 1) : `Add one more plan for ${percent}% off.`;
  }
  const ads = pkg.adCredit > 0 ? ` and ${formatInr(pkg.adCredit)} a month for your ads.` : " on both plans.";
  return `${pkg === fullCard ? "Full basket. " : ""}${pkg.percent}% off${ads}`;
}

export type BenefitKind = "saving" | "ads" | "year";

export interface Benefit extends Rich {
  readonly kind: BenefitKind;
}

/** The ticked lines under the summary price. */
export function benefits(pick: BasketPick): Benefit[] {
  const saving = packageSaving(pick);
  if (saving === 0) return [];
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
    return rich("The ", `${formatInr(credit)} a month for your ads`, " comes only when you start these plans together, here at this checkout.");
  }
  if (basketPlans(pick).length === 1) {
    return rich("Start two or three plans together at this checkout and we add up to ", `${formatInr(MAX_AD_CREDIT)} a month to your ads`, ".");
  }
  return null;
}

export interface NextStampCopy {
  readonly id: PlanId;
  readonly name: string;
  readonly body: string;
}

/** The "Add next" nudge: the plan worth adding most, and the full basket it leads to, in the owner's words. */
export function nextStamp(pick: BasketPick): NextStampCopy | null {
  const next = nextPlanToAdd(pick);
  if (!next) return null;
  const left = PLAN_IDS.length - basketPlans(pick).length;
  return { id: next.id, name: PLANS[next.id].name, body: nudge(fullCard.percent, packageSaving(ALL_PICK), left) };
}
