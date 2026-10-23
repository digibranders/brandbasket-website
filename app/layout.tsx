// app/layout.tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { BasketDock } from "@/components/basket/BasketDock";
import { BasketPopover } from "@/components/basket/BasketPopover";
import { ConversionTracking } from "@/components/analytics/ConversionTracking";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { Closing } from "@/components/shell/Closing";
import { ClosingGate } from "@/components/shell/ClosingGate";
import { Footer } from "@/components/shell/Footer";
import { WhatsAppChat } from "@/components/shell/WhatsAppChat";
import { Nav } from "@/components/shell/Nav";
import { TOOLS } from "@/lib/consent";
import { fontVariables } from "@/lib/fonts";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { isProductionSite, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Brandbasket | Website and Google marketing for local businesses", template: "%s | Brandbasket" },
  description: siteConfig.description,
  manifest: "/site.webmanifest",
  robots: isProductionSite() ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f6f5f2", colorScheme: "light" };

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>
        <Nav />
        <main id="main">
          {children}
          <ClosingGate><Closing /></ClosingGate>
        </main>
        <Footer />
        <WhatsAppChat />
        <BasketDock />
        <BasketPopover />
        {TOOLS.length > 0 && <ConsentBanner />}
        <JsonLd data={organizationJsonLd()} />
        <ConversionTracking />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
