"use client";
import type { ReactElement } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { moneyCopy } from "@/content/basket";
import { formatMoney } from "@/lib/currency";
import { monthlyTotal } from "@/lib/pricing";
import { useBasket } from "./useBasket";

/**
 * The monthly total, the plans added up (GST included on rupee pages; mock: .phc-total p, .pay-row). `data-basket-total` marks the total for tests.
 */
export function BasketTotal({ label }: { readonly label?: string }): ReactElement {
  const pick = useBasket();
  const currency = useCurrency();
  return (
    <p aria-live="polite" aria-atomic="true" data-basket-total className="grid leading-[1.15]">
      <small className="text-[13.5px] text-ink-2">{label ?? moneyCopy(currency).totalLabel}</small>
      <span className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        <b className="num font-display text-[40px] font-medium tracking-[-0.045em]">{formatMoney(monthlyTotal(pick, currency), currency)}</b>
      </span>
    </p>
  );
}
