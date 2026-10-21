"use client";
import type { ReactElement } from "react";
import { BASKET_COPY, saveLine } from "@/content/basket";
import { firstPayment, formatInr, packageTotal } from "@/lib/pricing";
import { useBasket } from "./useBasket";

/** The monthly total with GST and, for a package, the monthly saving (mock: .phc-total p, .was-line). `data-basket-total` hides the phone bar while it is on screen. */
export function BasketTotal({ label = BASKET_COPY.totalLabel }: { readonly label?: string }): ReactElement {
  const pick = useBasket();
  const pay = firstPayment(packageTotal(pick));
  const save = saveLine(pick);
  return (
    <p aria-live="polite" aria-atomic="true" data-basket-total className="grid leading-[1.15]">
      <small className="text-[13.5px] text-ink-2">{label}</small>
      <b className="num font-display text-[40px] font-medium tracking-[-0.045em]">{formatInr(pay.total)}</b>
      {save ? <span className="mt-1 text-sm font-semibold text-rattan-text">{save}</span> : null}
    </p>
  );
}
