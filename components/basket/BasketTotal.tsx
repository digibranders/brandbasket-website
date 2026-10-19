"use client";
import type { ReactElement } from "react";
import { BASKET_COPY } from "@/content/basket";
import { firstPayment, formatInr, signupTotal } from "@/lib/pricing";
import { useBasket } from "./useBasket";

/** The monthly total with GST (mock: .phc-total p). `data-basket-total` hides the phone bar while it is on screen. */
export function BasketTotal({ label = BASKET_COPY.totalLabel }: { readonly label?: string }): ReactElement {
  const pay = firstPayment(signupTotal(useBasket()));
  return (
    <p aria-live="polite" aria-atomic="true" data-basket-total className="grid leading-[1.15]">
      <small className="text-[13.5px] text-ink-2">{label}</small>
      <b className="num font-display text-[40px] font-medium tracking-[-0.045em]">{formatInr(pay.total)}</b>
    </p>
  );
}
