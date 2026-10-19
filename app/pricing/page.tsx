// app/pricing/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { PhoneTotalBar } from "@/components/basket/PhoneTotalBar";
import { CompareTable } from "@/components/pricing/CompareTable";
import { GoodToKnow } from "@/components/pricing/GoodToKnow";
import { PlanDetails } from "@/components/pricing/PlanDetails";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";
import { breadcrumbJsonLd, planOffersJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.pricing);

/** Sections in mock order (docs/design/mock.html, #view-pricing). The closing section comes from the root layout. */
export default function PricingPage(): ReactElement {
  return (
    <>
      <PricingHero />
      <CompareTable />
      <PlanDetails />
      <GoodToKnow />
      <PricingFaq />
      <PhoneTotalBar />
      <JsonLd data={planOffersJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
    </>
  );
}
