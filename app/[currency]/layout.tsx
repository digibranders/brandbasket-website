// app/[currency]/layout.tsx
import { notFound } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { CURRENCIES, currencyFromSegment, currencySegment } from "@/lib/currency";

/** Every page is built twice, once per currency. proxy.ts rewrites a visitor to the copy for their currency; the URL they see never carries it. The site's navigation and footer are in (site)/layout.tsx, so a landing page can leave them out. */
export function generateStaticParams(): { currency: string }[] {
  return CURRENCIES.map((currency) => ({ currency: currencySegment(currency) }));
}

export const dynamicParams = false;

export default async function CurrencyLayout({ children, params }: { readonly children: ReactNode; readonly params: Promise<{ currency: string }> }): Promise<ReactElement> {
  const currency = currencyFromSegment((await params).currency);
  if (currency === null) notFound();
  return <CurrencyProvider currency={currency}>{children}</CurrencyProvider>;
}
