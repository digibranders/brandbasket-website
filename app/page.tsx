// app/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { FactsStrip } from "@/components/home/FactsStrip";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { PlansSection } from "@/components/home/PlansSection";
import { Promises } from "@/components/home/Promises";
import { ReportSection } from "@/components/home/ReportSection";
import { Responsibility } from "@/components/home/Responsibility";
import { WhatYouGet } from "@/components/home/WhatYouGet";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { planOffersJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.home);

/** Sections in the approved order (docs/design/homepage-final.html). The closing section comes from the root layout. */
export default function HomePage(): ReactElement {
  return (
    <>
      <HomeHero />
      <FactsStrip />
      <Responsibility />
      <PlansSection />
      <WhatYouGet />
      <Promises />
      <WorkShowcase />
      <ReportSection />
      <HomeFaq />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={planOffersJsonLd()} />
    </>
  );
}
