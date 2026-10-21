import type { ReactElement } from "react";
import { AddonRows } from "@/components/basket/AddonRows";
import { BasketCta } from "@/components/basket/BasketCta";
import { BasketStage } from "@/components/basket/BasketStage";
import { BasketTotal } from "@/components/basket/BasketTotal";
import { OfferNote } from "@/components/basket/OfferNote";
import { OfferLine } from "@/components/ui/OfferLine";
import { HERO } from "@/content/home";
import { PRICING_HERO } from "@/content/pricing";

/**
 * Pricing hero (mock: .ph-c, CSS "pricing hero"). Desktop: head and actions on the left, the basket on the right.
 * Phones stack head, basket, actions. Copy is locked. No Reveal here: the hero paints at once.
 * The glow spans the full width, as on the homepage hero, so it shows no hard edge on wide screens. The stage shares
 * the homepage label because the mock moves one stage element between the two views.
 */
export function PricingHero(): ReactElement {
  return (
    <section aria-labelledby="h-pricing" className="[background:var(--hero)]">
      <div className="in-wrap grid grid-cols-[minmax(0,1fr)] items-start gap-x-14 gap-y-6 pb-16 pt-32 [grid-template-areas:'head'_'stage'_'act'] min-[1000px]:grid-cols-[1.05fr_0.95fr] min-[1000px]:gap-y-10 min-[1000px]:[grid-template-areas:'head_stage'_'act_stage']">
        <div className="grid min-w-0 justify-items-start gap-7 [grid-area:head]">
          <h1 id="h-pricing" className="font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em] min-[1000px]:text-[clamp(44px,4.4vw,60px)]">
            {PRICING_HERO.title} <em className="font-light not-italic text-rattan-text min-[760px]:block">{PRICING_HERO.accent}</em>
          </h1>
          <OfferLine />
        </div>
        <div className="min-w-0 self-center [grid-area:stage]">
          <BasketStage priority label={HERO.stageLabel} />
        </div>
        <div className="grid min-w-0 gap-6 [grid-area:act]">
          <AddonRows />
          <OfferNote rounded />
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <BasketTotal />
            <BasketCta location="pricing_hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
