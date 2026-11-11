// app/[currency]/page.tsx
import { CursorClick, MapPin, Star } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { WorkColumns } from "@/components/home/WorkColumns";
import { FinalCta } from "@/components/platform-home/FinalCta";
import { HomePricing } from "@/components/platform-home/HomePricing";
import { HowSection } from "@/components/platform-home/HowSection";
import { ModesSection } from "@/components/platform-home/ModesSection";
import { PlatformFaq } from "@/components/platform-home/PlatformFaq";
import { PlatformHero } from "@/components/platform-home/PlatformHero";
import { ServicesShowcase } from "@/components/platform-home/ServicesShowcase";
import { WhoSection } from "@/components/platform-home/WhoSection";
import { WhySection } from "@/components/platform-home/WhySection";
import { Band } from "@/components/ui/Band";
import { DecorIcon } from "@/components/ui/DecorIcon";
import { currencyParam } from "@/lib/currency";
import { planOffersJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { HOME_ROUTE } from "@/lib/seo/routes";

// The page's title, description and structured data are unchanged from the website-first homepage (owner, 2026-11-06).
export const metadata: Metadata = pageMetadata(HOME_ROUTE);

/**
 * The AI-platform homepage (copy: content/platform-home.ts). The real work stays as proof and keeps its #work anchor
 * for the nav. The homepage ends with its own call to action, so the layout's closing band is left off here.
 */
export default async function HomePage({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  const currency = await currencyParam(params);
  return (
    <>
      <PlatformHero />
      <ServicesShowcase />
      <HowSection />
      <ModesSection />
      <HomePricing currency={currency} />
      <WhoSection />
      <WhySection />
      <Band tone="sunken" className="py-[clamp(56px,8vw,112px)]">
        <DecorIcon icon={CursorClick} size={139} rotate={8} faint className="right-[19%] top-[78px] max-[760px]:hidden" />
        <DecorIcon icon={Star} size={109} rotate={-11} faint className="right-[10%] top-[118px] max-[760px]:hidden" />
        <DecorIcon icon={MapPin} size={126} rotate={12} faint className="right-[3%] top-[70px]" />
        <WorkColumns />
      </Band>
      <PlatformFaq />
      <FinalCta />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={planOffersJsonLd(currency)} />
    </>
  );
}
