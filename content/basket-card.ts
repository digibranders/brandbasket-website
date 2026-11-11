// content/basket-card.ts
// Copy for the Basket Card (docs/design/mock.html: .ox-card, .bsum; owner's pick, 2026-10-21). Money comes from lib/pricing.ts, in the page's currency. No package discounts or ad money (owner, 2026-11-11).
import type { Currency } from "@/lib/currency";
import { type BasketPick, monitoringIncluded, PLANS, type PlanId } from "@/lib/pricing";
import { monitoringNote } from "./pricing";

/** A line with one bold run, rendered as before<b>strong</b>after. */
export interface Rich {
  readonly before: string;
  readonly strong: string;
  readonly after: string;
}

export const BASKET_CARD = {
  id: "basket-card",
  title: "Basket Card",
  intro: "Pick the plans you need.",
  tapHint: "Tap to add",
  inBasket: "In your basket",
  totalLabel: "Your total",
  /** The Basket Card button (owner's pick, 2026-10-22). It opens the basket pop-up, like every main button (owner, 2026-10-26). */
  checkoutCta: "Continue to checkout",
  /** The same button on a phone, where two buttons share one row (owner, 2026-10-26; wording still to be approved). */
  checkoutCtaShort: "Checkout",
} as const;

/** Accessible name of a plan slot. */
export function slotLabel(id: PlanId, added: boolean): string {
  return added ? `Remove ${PLANS[id].name}` : `Add ${PLANS[id].name}`;
}

/** The summary's headline: the one offer, Dedicated Expert Monitoring free with all three plans. */
export function headline(pick: BasketPick, currency: Currency): string {
  return monitoringNote(monitoringIncluded(pick), currency);
}
