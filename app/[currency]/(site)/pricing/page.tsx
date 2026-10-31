// app/[currency]/pricing/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { GuideLinks } from "@/components/guides/GuideLinks";
import { BasketBand } from "@/components/pricing/BasketBand";
import { PlanColumns } from "@/components/pricing/PlanColumns";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";
import { GUIDE_LINKS } from "@/content/guides";
import { currencyParam } from "@/lib/currency";
import { breadcrumbJsonLd, planOffersJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { PRICING_ROUTE } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(PRICING_ROUTE);

/** Sections: the plan columns, the basket band and the FAQ (docs/design/homepage-v2.html, Pricing view). The closing section comes from the layout. */
export default async function PricingPage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  return (
    <>
      <PricingHero currency={currency} />
      <PlanColumns currency={currency} />
      <BasketBand />
      <PricingFaq currency={currency} />
      <GuideLinks links={GUIDE_LINKS.pricing} />
      <JsonLd data={planOffersJsonLd(currency, { packages: true })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
    </>
  );
}
