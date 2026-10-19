import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { BasketStage } from "@/components/basket/BasketStage";
import { OfferLine } from "@/components/ui/OfferLine";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { HERO } from "@/content/home";

/**
 * Homepage hero (mock: #hero). Copy is locked. No Reveal here: the hero paints at once.
 * The glow spans the full width; clipped to the 1280px column its right edge showed as a hard line on wide screens.
 */
export function HomeHero(): ReactElement {
  return (
    <section id="hero" aria-labelledby="h-hero" className="[background:var(--hero)]">
      <div className="in-wrap relative grid grid-cols-[minmax(0,1fr)] items-center pb-7 pt-[100px] min-[1000px]:min-h-[740px] min-[1000px]:grid-cols-[0.98fr_1.02fr] min-[1000px]:gap-2 min-[1000px]:pt-28">
        <div className="relative z-[2] grid min-w-0 justify-items-start gap-[18px]">
          <h1 id="h-hero" className="font-display text-[clamp(40px,5.6vw,82px)] font-medium leading-[0.96] tracking-[-0.052em]">
            {HERO.headline} <em className="font-light not-italic text-rattan-text">{HERO.headlineAccent}</em>
          </h1>
          <p className="max-w-[46ch] text-balance text-[clamp(16.5px,1.4vw,18.5px)] text-ink-2">{HERO.subhead}</p>
          <OfferLine />
          <div className="flex flex-wrap items-center gap-2.5">
            <BasketCta location="hero" />
            <WhatsAppButton location="hero" label={HERO.whatsappLabel} />
          </div>
        </div>
        <div className="relative mt-2 grid min-w-0 justify-items-center gap-1">
          <BasketStage priority label={HERO.stageLabel} />
        </div>
      </div>
    </section>
  );
}
