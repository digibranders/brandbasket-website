import type { ReactElement } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { OfferLine } from "@/components/ui/OfferLine";
import type { Industry as IndustryCopy } from "@/content/industries";
import { PRIMARY_CTA } from "@/content/navigation";
import { signupHref } from "@/lib/signup";

/**
 * Industry page hero: h1, lede, the locked offer line and the main button. A server page cannot read the basket
 * store, so the button carries the basket we suggest for this trade. No Reveal here: the hero paints at once.
 */
export function IndustryHero({ industry }: { readonly industry: IndustryCopy }): ReactElement {
  return (
    <section aria-labelledby="h-industry" className="[background:var(--hero)]">
      <div className="in-wrap grid justify-items-start gap-7 pb-16 pt-32">
        <div className="grid gap-[18px]">
          <h1 id="h-industry" className="max-w-[22ch] font-display text-[clamp(40px,5.2vw,72px)] font-normal leading-none tracking-[-0.05em] min-[1000px]:text-[clamp(44px,4.4vw,60px)]">
            {industry.h1}
          </h1>
          <p className="max-w-[46ch] text-lg text-ink-2">{industry.lede}</p>
        </div>
        <OfferLine />
        <ArrowButton href={signupHref(industry.suggested)} location="industry_hero">{PRIMARY_CTA.label}</ArrowButton>
      </div>
    </section>
  );
}
