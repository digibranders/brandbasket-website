// content/basket-card.ts
// Copy for the homepage Basket Card and the live stamps strip above the nav (docs/design/mock.html: .ox-card, .bsum,
// .promo .pr-stamps; owner picked both, 2026-10-21). Percents and rupees come from lib/pricing.ts.
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
const twoPlanBest = twoPlanPackages.find((p) => p.percent > TWO_PLAN_PERCENT);
const MAX_AD_CREDIT = Math.max(...PACKAGES.map((p) => p.adCredit));

export const BASKET_CARD = {
  id: "basket-card",
  title: "Basket Card",
  intro: "Every plan you take earns a stamp. More stamps, bigger rewards.",
  tapHint: "Tap to stamp",
  slots: {
    website: "Built free, kept running",
    growth: "Posts and Meta ads, run for you",
    search: "Found on Google and in AI answers",
  } satisfies Readonly<Record<PlanId, string>>,
  trackLabel: "What the stamps unlock",
  inBasket: "In your basket",
  fine: "The package price stays while every plan in it stays. Ad money comes with a package started together and is credited to your Meta ad account every month. Cancel anytime.",
  oneTimeTag: "One-time offer",
  nextLabel: "Next stamp:",
  stripCta: "Fill your Basket Card",
  stripClose: "Close the offer",
} as const;

/** Accessible name of a stamp slot. */
export function slotLabel(id: PlanId, stamped: boolean): string {
  return stamped ? `Remove the ${PLANS[id].name} stamp` : `Stamp ${PLANS[id].name}`;
}

export interface TrackStep {
  readonly count: string;
  readonly reward: string;
}

/** The reward track under the stamps: one step per number of plans. */
export function trackSteps(): TrackStep[] {
  const two = twoPlanBest ? `${TWO_PLAN_PERCENT}% off, or ${twoPlanBest.percent}% for ${twoPlanBest.name}` : `${TWO_PLAN_PERCENT}% off`;
  return [
    { count: "1 stamp", reward: "Each plan at its own price" },
    { count: "2 stamps", reward: two },
    { count: "3 stamps", reward: `${fullCard.percent}% off and ${formatInr(fullCard.adCredit)} a month for ads` },
  ];
}

/** The summary's headline (mock: card() head). */
export function headline(pick: BasketPick): string {
  const pkg = packageFor(pick);
  if (!pkg) {
    const next = nextPlanToAdd(pick);
    const percent = next ? (packageFor(next.pick)?.percent ?? TWO_PLAN_PERCENT) : TWO_PLAN_PERCENT;
    return `Stamp one more plan for ${percent}% off.`;
  }
  const ads = pkg.adCredit > 0 ? ` and ${formatInr(pkg.adCredit)} a month for your ads.` : " on both plans.";
  return `${pkg === fullCard ? "Full card. " : ""}${pkg.percent}% off${ads}`;
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

/** The "Next stamp" nudge: the plan worth adding most, what it costs and what it gains. */
export function nextStamp(pick: BasketPick): NextStampCopy | null {
  const next = nextPlanToAdd(pick);
  if (!next) return null;
  const cost =
    next.extra > 0 ? `Just ${formatInr(next.extra)} more a month.` : next.extra < 0 ? `You pay ${formatInr(-next.extra)} less a month than now.` : "The same price as now.";
  const savingNow = packageSaving(pick);
  const creditNow = adCreditFor(pick);
  const saving = savingNow > 0 ? `Your saving goes from ${formatInr(savingNow)} to ${formatInr(next.saving)} a month` : `You save ${formatInr(next.saving)} a month`;
  const credit =
    next.adCredit <= creditNow
      ? "."
      : creditNow > 0
        ? `, and your ad money from ${formatInr(creditNow)} to ${formatInr(next.adCredit)}.`
        : `, and we add ${formatInr(next.adCredit)} a month to your ads.`;
  return { id: next.id, name: PLANS[next.id].name, body: `${cost} ${saving}${credit}`, button: `Stamp ${PLANS[next.id].short}` };
}

export interface StripLine {
  /** Wide screens, 1180 px and up. */
  readonly long: Rich;
  /** Narrower screens: fits one line beside the stamps on a phone. */
  readonly short: Rich;
}

/** The live stamps strip above the nav (mock: promo()). */
export function stripLine(pick: BasketPick): StripLine {
  const pkg = packageFor(pick);
  if (!pkg) {
    return {
      long: rich("", "Start plans together at checkout:", ` 2 plans are ${TWO_PLAN_PERCENT}% off. All 3 are ${fullCard.percent}% off, plus ${formatInr(fullCard.adCredit)} a month for your ads.`),
      short: rich("", "Plans together:", ` up to ${fullCard.percent}% off`),
    };
  }
  if (pkg.adCredit > 0) {
    return {
      long: rich("", `Your basket gets ${pkg.percent}% off and ${formatInr(pkg.adCredit)} a month for your ads.`, " The ad money is a one-time offer, only when you start these plans together at checkout."),
      short: rich("", `${pkg.percent}% off`, ` + ${formatInr(pkg.adCredit)} for ads`),
    };
  }
  const missing = PLAN_IDS.find((id) => !pick[id]);
  const withMissing = missing ? ` Start ${PLANS[missing].short} with it at checkout and we add ${formatInr(fullCard.adCredit)} a month to your ads.` : "";
  return { long: rich("", `Your basket gets ${pkg.percent}% off.`, withMissing), short: rich("", `${pkg.percent}% off`, " on your plans") };
}
