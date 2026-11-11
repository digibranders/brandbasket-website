import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { PLATFORM_HERO } from "@/content/platform-home";
import { PresenceStage } from "./PresenceStage";

/** Homepage hero: the promise and two actions on the left, the request-to-updates picture on the right. No Reveal: the hero paints at once. */
export function PlatformHero(): ReactElement {
  return (
    <section id="hero" aria-labelledby="h-hero" className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent)]" />
      <div className="in-wrap relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-12 pt-[104px] min-[1000px]:min-h-[760px] min-[1000px]:grid-cols-2 min-[1000px]:gap-14 min-[1000px]:pb-16 min-[1000px]:pt-28">
        <div className="relative z-[2] grid min-w-0 justify-items-start gap-7">
          <h1 id="h-hero" className="font-display text-[clamp(42px,4.5vw,68px)] font-medium leading-[0.98] tracking-[-0.05em]">
            {PLATFORM_HERO.headline} <em className="font-light not-italic text-rattan-text">{PLATFORM_HERO.headlineAccent}</em>
          </h1>
          <p className="max-w-[38ch] text-[clamp(17px,1.35vw,19.5px)] leading-[1.55] text-ink-2">{PLATFORM_HERO.body}</p>
          <div className="cta-pair">
            <BasketCta location="hero" label={PLATFORM_HERO.primary.label} />
            <OutlineButton href={PLATFORM_HERO.secondary.href} location="hero">{PLATFORM_HERO.secondary.label}</OutlineButton>
          </div>
        </div>
        <PresenceStage />
      </div>
    </section>
  );
}
