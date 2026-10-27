"use client";
import type { ReactElement } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { BASKET_COPY, moneyCopy, saveLine } from "@/content/basket";
import { formatMoney } from "@/lib/currency";
import { monthlyTotal, packageTotal } from "@/lib/pricing";
import { useBasket } from "./useBasket";

/**
 * The monthly total (GST included on rupee pages) and, for a package, the plans' own price struck through beside it and the monthly
 * saving (mock: .phc-total p, .pay-row, .was-line). `data-basket-total` marks the total for tests.
 */
export function BasketTotal({ label }: { readonly label?: string }): ReactElement {
  const pick = useBasket();
  const currency = useCurrency();
  const save = saveLine(pick, currency);
  return (
    <p aria-live="polite" aria-atomic="true" data-basket-total className="grid leading-[1.15]">
      <small className="text-[13.5px] text-ink-2">{label ?? moneyCopy(currency).totalLabel}</small>
      <span className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        {save ? (
          <s className="num font-display text-[22px] tracking-[-0.02em] text-ink-2 decoration-rattan-text decoration-2"><span className="sr-only">{BASKET_COPY.was} </span>{formatMoney(monthlyTotal(pick, currency), currency)}</s>
        ) : null}
        <b className="num font-display text-[40px] font-medium tracking-[-0.045em]">{formatMoney(packageTotal(pick, currency), currency)}</b>
      </span>
      {save ? <span className="mt-1 text-sm font-semibold text-rattan-text">{save}</span> : null}
    </p>
  );
}
