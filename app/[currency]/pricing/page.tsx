// app/[currency]/pricing/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { BasketBand } from "@/components/pricing/BasketBand";
import { PlanColumns } from "@/components/pricing/PlanColumns";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";
import { currencyParam } from "@/lib/currency";
import { breadcrumbJsonLd, planOffersJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { pricingRoute } from "@/lib/seo/routes";

export async function generateMetadata({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<Metadata> {
  return pageMetadata(pricingRoute(await currencyParam(params)));
}

/** Sections: the plan columns, the basket band and the FAQ (docs/design/homepage-v2.html, Pricing view). The closing section comes from the layout. */
export default async function PricingPage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  return (
    <>
      <PricingHero currency={currency} />
      <PlanColumns currency={currency} />
      <BasketBand />
      <PricingFaq currency={currency} />
      <JsonLd data={planOffersJsonLd(currency, { packages: true })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
    </>
  );
}
