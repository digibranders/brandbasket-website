// app/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FactsStrip } from "@/components/home/FactsStrip";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { IndustriesLine } from "@/components/home/IndustriesLine";
import { PlansSection } from "@/components/home/PlansSection";
import { ReportSection } from "@/components/home/ReportSection";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { planOffersJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.home);

/** Sections in mock order (docs/design/mock.html, #view-home). The closing section comes from the root layout. */
export default function HomePage(): ReactElement {
  return (
    <>
      <HomeHero />
      <FactsStrip />
      <IndustriesLine />
      <PlansSection />
      <WorkShowcase />
      <ReportSection />
      <HomeFaq />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={planOffersJsonLd()} />
    </>
  );
}
