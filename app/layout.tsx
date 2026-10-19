// app/layout.tsx
import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/shell/Footer";
import { Nav } from "@/components/shell/Nav";
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
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
