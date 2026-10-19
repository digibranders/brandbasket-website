import { Check } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { AddonPanel } from "@/components/basket/AddonPanel";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { type PlanSide, PLANS_SECTION } from "@/content/home";

interface PlanSideProps {
  readonly side: PlanSide;
  readonly free?: boolean;
  readonly twoColumns?: boolean;
}

/** One side of the open equation (mock: .eq-side). The free side prints its price in rattan. */
function EquationSide({ side, free = false, twoColumns = false }: PlanSideProps): ReactElement {
  return (
    <div className="grid content-start gap-4 border-t-2 border-ink pt-[22px]">
      <span className="font-display text-[17px] font-medium tracking-[-0.01em] text-ink-2">{side.label}</span>
      <div className={`num font-display text-[clamp(56px,6.4vw,92px)] font-normal leading-[0.9] tracking-[-0.055em] ${free ? "text-rattan-text" : ""}`}>
        {side.price}
        <small className="ml-2.5 font-sans text-[15px] font-medium tracking-normal text-ink-2">{side.priceNote}</small>
      </div>
      <ul className={`grid gap-[9px] text-[15px] ${twoColumns ? "min-[560px]:grid-cols-2" : ""}`}>
        {side.ticks.map((tick) => (
          <li key={tick} className="flex items-start gap-2.5">
            <Check aria-hidden="true" className="mt-px size-[19px] flex-none text-sage" />
            {tick}
          </li>
        ))}
      </ul>
      <ArrowLink href={PLANS_SECTION.exploreHref}>{side.explore}</ArrowLink>
    </div>
  );
}

/** Build free + keep it running, then the add-on panel (mock: #h-plans, .eq, .addpanel). Prices are not revealed. */
export function PlansSection(): ReactElement {
  return (
    <Section labelledBy="h-plans" tight>
      <Reveal>
        <SectionHead id="h-plans" title={<>{PLANS_SECTION.heading} <em className="pivot pr-1">{PLANS_SECTION.headingAccent}</em></>} />
      </Reveal>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-7 pb-3 pt-2 min-[900px]:grid-cols-[1fr_auto_1.2fr] min-[900px]:items-start min-[900px]:gap-10">
        <EquationSide side={PLANS_SECTION.build} free />
        <span aria-hidden="true" className="justify-self-center font-display text-[56px] font-light leading-none text-ink-2 min-[900px]:pt-[70px]">+</span>
        <EquationSide side={PLANS_SECTION.run} twoColumns />
      </div>
      <AddonPanel />
    </Section>
  );
}
