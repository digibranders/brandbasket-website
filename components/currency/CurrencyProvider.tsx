"use client";
// components/currency/CurrencyProvider.tsx
import { createContext, type ReactElement, type ReactNode, useContext } from "react";
import type { Currency } from "@/lib/currency";

const CurrencyContext = createContext<Currency | null>(null);

/** Hands the page's currency (from the /inr or /usd route segment) to the client components that print prices. */
export function CurrencyProvider({ currency, children }: { readonly currency: Currency; readonly children: ReactNode }): ReactElement {
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): Currency {
  const currency = useContext(CurrencyContext);
  if (currency === null) throw new Error("useCurrency needs a CurrencyProvider above it (app/[currency]/layout.tsx).");
  return currency;
}
