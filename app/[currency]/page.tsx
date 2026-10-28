// app/[currency]/page.tsx
import { ChartLineUp, CursorClick, Envelope, MapPin, Star } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { GuideLinks } from "@/components/guides/GuideLinks";
import { JsonLd } from "@/components/JsonLd";
import { Band } from "@/components/ui/Band";
import { DecorIcon } from "@/components/ui/DecorIcon";
import { FactsStrip } from "@/components/home/FactsStrip";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { PlansSection } from "@/components/home/PlansSection";
import { Promises } from "@/components/home/Promises";
import { ReportSection } from "@/components/home/ReportSection";
import { Responsibility } from "@/components/home/Responsibility";
import { WhatYouGet } from "@/components/home/WhatYouGet";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { GUIDE_LINKS } from "@/content/guides";
import { currencyParam } from "@/lib/currency";
import { planOffersJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { HOME_ROUTE } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(HOME_ROUTE);

/**
 * Sections in the polished order (docs/design/homepage-v2.html, docs/plans/20-homepage-polish.md): value before price,
 * one dark band, a soft glass section, and sunken and plain bands with faint icons behind them. The closing section
 * comes from the layout.
 */
export default async function HomePage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  return (
    <>
      <HomeHero currency={currency} />
      <FactsStrip currency={currency} />
      <Responsibility />
      <WhatYouGet />
      <PlansSection />
      <Promises />
      <Band tone="sunken" className="py-[clamp(56px,8vw,112px)]">
        <DecorIcon icon={CursorClick} size={139} rotate={8} faint className="right-[19%] top-[78px] max-[760px]:hidden" />
        <DecorIcon icon={Star} size={109} rotate={-11} faint className="right-[10%] top-[118px] max-[760px]:hidden" />
        <DecorIcon icon={MapPin} size={126} rotate={12} faint className="right-[3%] top-[70px]" />
        <WorkShowcase />
      </Band>
      <Band>
        <DecorIcon icon={ChartLineUp} size={134} rotate={9} faint className="right-[11%] -top-3.5" />
        <DecorIcon icon={Envelope} size={109} rotate={-9} faint className="right-[3%] top-2 max-[760px]:hidden" />
        <ReportSection currency={currency} />
      </Band>
      <GuideLinks links={GUIDE_LINKS.home} />
      <HomeFaq currency={currency} />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={planOffersJsonLd(currency)} />
    </>
  );
}
