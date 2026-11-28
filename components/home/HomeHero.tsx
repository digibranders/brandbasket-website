import type { ReactElement } from "react";
import { BasketStage } from "@/components/basket/BasketStage";
import { WebsiteOffer } from "@/components/home/WebsiteOffer";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ECOMMERCE_PATH } from "@/content/ecommerce";
import { ServiceStartButton } from "@/components/services/ServiceStartButton";
import { HERO } from "@/content/home";
import { PRIMARY_CTA } from "@/content/navigation";
import type { Currency } from "@/lib/currency";

/**
 * The B2B Website Management hero. No Reveal here: the hero paints at once. Its main button
 * puts the website plan in the basket before opening it, as the other service pages do: a new visitor's basket is empty.
 * The glow spans the full width (clipped to the 1280px column its right edge showed as a hard line on wide screens) and
 * fades out at the bottom, so it does not end on a hard edge above the facts strip.
 */
export function HomeHero({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <section id="hero" aria-labelledby="h-hero" className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent)]" />
      <div className="in-wrap relative grid grid-cols-[minmax(0,1fr)] items-center pb-7 pt-[100px] min-[1000px]:min-h-[740px] min-[1000px]:grid-cols-[0.98fr_1.02fr] min-[1000px]:gap-2 min-[1000px]:pt-28">
        <div className="relative z-[2] grid min-w-0 justify-items-start gap-[18px]">
          <h1 id="h-hero" className="font-display text-[clamp(40px,5.6vw,82px)] font-medium leading-[0.96] tracking-[-0.052em]">
            {HERO.headline} <em className="font-light not-italic text-rattan-text">{HERO.headlineAccent}</em>
          </h1>
          <WebsiteOffer currency={currency} />
          <div className="cta-pair">
            <ServiceStartButton id="website" location="hero" label={PRIMARY_CTA.label} websiteKind="b2b" />
            <ArrowLink href={ECOMMERCE_PATH}>Explore Ecommerce Website</ArrowLink>
          </div>
        </div>
        <div className="relative mt-2 grid min-w-0 justify-items-center gap-1">
          <BasketStage priority label={HERO.stageLabel} />
        </div>
      </div>
    </section>
  );
}
