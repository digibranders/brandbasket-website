// app/pricing/page.tsx
import type { ReactElement } from "react";
import { CompareTable } from "@/components/pricing/CompareTable";
import { GoodToKnow } from "@/components/pricing/GoodToKnow";
import { PlanDetails } from "@/components/pricing/PlanDetails";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";

/** Sections in mock order (docs/design/mock.html, #view-pricing). The closing section comes from the root layout. */
export default function PricingPage(): ReactElement {
  return (
    <>
      <PricingHero />
      <CompareTable />
      <PlanDetails />
      <GoodToKnow />
      <PricingFaq />
    </>
  );
}
