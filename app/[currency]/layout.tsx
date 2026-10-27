// app/[currency]/layout.tsx
import { notFound } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { BasketDock } from "@/components/basket/BasketDock";
import { BasketPopover } from "@/components/basket/BasketPopover";
import { BasketWall } from "@/components/basket/BasketWall";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { Closing } from "@/components/shell/Closing";
import { ClosingGate } from "@/components/shell/ClosingGate";
import { Footer } from "@/components/shell/Footer";
import { Nav } from "@/components/shell/Nav";
import { WhatsAppChat } from "@/components/shell/WhatsAppChat";
import { CURRENCIES, currencyFromSegment, currencySegment } from "@/lib/currency";

/** Every page is built twice, once per currency. proxy.ts rewrites a visitor to the copy for their currency; the URL they see never carries it. */
export function generateStaticParams(): { currency: string }[] {
  return CURRENCIES.map((currency) => ({ currency: currencySegment(currency) }));
}

export const dynamicParams = false;

export default async function SiteLayout({ children, params }: { readonly children: ReactNode; readonly params: Promise<{ currency: string }> }): Promise<ReactElement> {
  const currency = currencyFromSegment((await params).currency);
  if (currency === null) notFound();
  return (
    <CurrencyProvider currency={currency}>
      <Nav />
      <main id="main">
        {children}
        <ClosingGate><Closing /></ClosingGate>
      </main>
      <Footer />
      <WhatsAppChat />
      <BasketDock />
      <BasketWall />
      <BasketPopover />
    </CurrencyProvider>
  );
}
