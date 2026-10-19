import type { ReactElement } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { OfferLine } from "@/components/ui/OfferLine";
import { PageHero } from "@/components/ui/PageHero";
import type { Industry as IndustryCopy } from "@/content/industries";
import { PRIMARY_CTA } from "@/content/navigation";
import { signupHref } from "@/lib/signup";

/**
 * Industry page hero: h1, lede, the locked offer line and the main button. A server page cannot read the basket
 * store, so the button carries the basket we suggest for this trade.
 */
export function IndustryHero({ industry }: { readonly industry: IndustryCopy }): ReactElement {
  return (
    <PageHero id="h-industry" h1={industry.h1} lede={industry.lede} h1ClassName="max-w-[22ch] min-[1000px]:text-[clamp(44px,4.4vw,60px)]">
      <OfferLine />
      <ArrowButton href={signupHref(industry.suggested)} location="industry_hero">{PRIMARY_CTA.label}</ArrowButton>
    </PageHero>
  );
}
