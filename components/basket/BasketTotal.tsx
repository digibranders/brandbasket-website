"use client";
import type { ReactElement } from "react";
import { BASKET_COPY, saveLine } from "@/content/basket";
import { firstPayment, formatInr, monthlyTotal, packageTotal } from "@/lib/pricing";
import { useBasket } from "./useBasket";

/**
 * The monthly total with GST and, for a package, the plans' own price with GST struck through beside it and the monthly
 * saving (mock: .phc-total p, .pay-row, .was-line). `data-basket-total` hides the basket dock while it is on screen.
 */
export function BasketTotal({ label = BASKET_COPY.totalLabel }: { readonly label?: string }): ReactElement {
  const pick = useBasket();
  const pay = firstPayment(packageTotal(pick));
  const save = saveLine(pick);
  const list = firstPayment(monthlyTotal(pick));
  return (
    <p aria-live="polite" aria-atomic="true" data-basket-total className="grid leading-[1.15]">
      <small className="text-[13.5px] text-ink-2">{label}</small>
      <span className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        {save ? (
          <s className="num font-display text-[22px] tracking-[-0.02em] text-ink-2 decoration-rattan-text decoration-2"><span className="sr-only">{BASKET_COPY.was} </span>{formatInr(list.total)}</s>
        ) : null}
        <b className="num font-display text-[40px] font-medium tracking-[-0.045em]">{formatInr(pay.total)}</b>
      </span>
      {save ? <span className="mt-1 text-sm font-semibold text-rattan-text">{save}</span> : null}
    </p>
  );
}
