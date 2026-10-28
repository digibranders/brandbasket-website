// app/layout.tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ConversionTracking } from "@/components/analytics/ConversionTracking";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
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
  // Search Console's "HTML tag" ownership check. GA4 and Clarity come through the Tag Manager container (lib/consent.ts).
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = { themeColor: "#f6f5f2", colorScheme: "light" };

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>
        {children}
        {TOOLS.length > 0 && <ConsentBanner />}
        <JsonLd data={organizationJsonLd()} />
        <ConversionTracking />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
