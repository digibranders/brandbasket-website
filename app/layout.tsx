// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Red_Hat_Display, Red_Hat_Mono, Red_Hat_Text } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/shell/Footer";
import { Nav } from "@/components/shell/Nav";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { isProductionSite, siteConfig } from "@/lib/site-config";
import "./globals.css";

const display = Red_Hat_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-red-hat-display", display: "swap" });
const text = Red_Hat_Text({ subsets: ["latin"], variable: "--font-red-hat-text", display: "swap" });
const mono = Red_Hat_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-red-hat-mono", display: "swap" });

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
    <html lang="en-IN" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
