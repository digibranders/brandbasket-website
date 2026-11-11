// app/[currency]/pricing/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { GuideLinks } from "@/components/guides/GuideLinks";
import { PlansSection } from "@/components/home/PlansSection";
import { BasketBand } from "@/components/pricing/BasketBand";
import { MonitoringBand } from "@/components/pricing/MonitoringBand";
import { PlanColumns } from "@/components/pricing/PlanColumns";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";
import { GUIDE_LINKS } from "@/content/guides";
import { currencyParam } from "@/lib/currency";
import { breadcrumbJsonLd, planOffersJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { PRICING_ROUTE } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(PRICING_ROUTE);

/** Sections: the plan columns, Dedicated Expert Monitoring, the plan picker card (moved from the homepage, 2026-11-06), the basket band and the FAQ (docs/design/homepage-v2.html, Pricing view). The closing section comes from the layout. */
export default async function PricingPage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  return (
    <>
      <PricingHero currency={currency} />
      <PlanColumns currency={currency} />
      <div className="in-wrap pb-16 min-[640px]:pb-24"><MonitoringBand currency={currency} headingId="h-pricing-monitoring" /></div>
      <PlansSection />
      <BasketBand />
      <PricingFaq currency={currency} />
      <GuideLinks links={GUIDE_LINKS.pricing} />
      <JsonLd data={planOffersJsonLd(currency)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
    </>
  );
}
