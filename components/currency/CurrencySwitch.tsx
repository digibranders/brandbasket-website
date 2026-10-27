"use client";
// components/currency/CurrencySwitch.tsx
import type { ReactElement } from "react";
import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "./CurrencyProvider";

/**
 * The footer's INR / USD switch. Each option is a plain link to the same page with ?currency=...: proxy.ts keeps the choice in a
 * cookie (read before the visitor's country) and sends them back to the address without the query, in the other currency.
 */
export function CurrencySwitch(): ReactElement {
  const current = useCurrency();
  return (
    <nav aria-label="Currency" className="site-footer-currency">
      <span aria-hidden="true">Prices in</span>
      {CURRENCIES.map((currency) => (
        <a key={currency} href={`?currency=${currency}`} rel="nofollow" className="site-footer-currency-option" aria-current={currency === current ? "true" : undefined}>
          {currency}
        </a>
      ))}
    </nav>
  );
}
