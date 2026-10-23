// app/pricing/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { BasketBand } from "@/components/pricing/BasketBand";
import { EverythingIncluded } from "@/components/pricing/EverythingIncluded";
import { GoodToKnow } from "@/components/pricing/GoodToKnow";
import { PlanColumns } from "@/components/pricing/PlanColumns";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";
import { breadcrumbJsonLd, planOffersJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.pricing);

/** Sections: the plan columns, the basket band, Everything included, Good to know and the FAQ (docs/design/homepage-v2.html, Pricing view). The closing section comes from the root layout. */
export default function PricingPage(): ReactElement {
  return (
    <>
      <PricingHero />
      <PlanColumns />
      <BasketBand />
      <EverythingIncluded />
      <GoodToKnow />
      <PricingFaq />
      <JsonLd data={planOffersJsonLd({ packages: true })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
    </>
  );
}
