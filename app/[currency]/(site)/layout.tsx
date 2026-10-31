// app/[currency]/(site)/layout.tsx
import type { ReactElement, ReactNode } from "react";
import { BasketDock } from "@/components/basket/BasketDock";
import { BasketPopover } from "@/components/basket/BasketPopover";
import { BasketWall } from "@/components/basket/BasketWall";
import { Closing } from "@/components/shell/Closing";
import { ClosingGate } from "@/components/shell/ClosingGate";
import { Footer } from "@/components/shell/Footer";
import { Nav } from "@/components/shell/Nav";
import { WhatsAppChat } from "@/components/shell/WhatsAppChat";

/** The site's own pages: navigation, closing band, footer, chat and the basket. Landing pages live outside this group. */
export default function SiteLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <>
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
    </>
  );
}
