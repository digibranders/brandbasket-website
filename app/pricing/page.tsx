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
import { formatInr, GST_LABEL, PLANS } from "@/lib/pricing";
import { breadcrumbJsonLd, planOffersJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const PRICING_TITLE = `Pricing: free website, plans from ${formatInr(PLANS.website.monthly)} a month`;
const PRICING_DESCRIPTION = `Your website is built free. Managed Website ${formatInr(PLANS.website.monthly)} a month, Digital Growth +${formatInr(PLANS.growth.monthly)}, Local SEO and AEO +${formatInr(PLANS.search.monthly)}. Prices before ${GST_LABEL} GST, billed monthly.`;

// pageMetadata gives the canonical and social tags; the absolute title skips the "%s | Brandbasket" template.
export const metadata: Metadata = {
  ...pageMetadata({ title: PRICING_TITLE, description: PRICING_DESCRIPTION, path: "/pricing" }),
  title: { absolute: PRICING_TITLE },
};

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
