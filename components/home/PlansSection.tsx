import type { ReactElement } from "react";
import { BasketCard } from "@/components/basket/BasketCard";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { TwoTierHead } from "@/components/ui/TwoTierHead";
import { PLANS_SECTION } from "@/content/home";

/** The plans heading, then the Basket Card and its receipt (mock: #h-plans, .ox-card). The build and run prices, the panel frame and its header were removed at the owner's request, 2026-10-22. */
export function PlansSection(): ReactElement {
  return (
    <Section labelledBy="h-plans" tight>
      <Reveal>
        <TwoTierHead id="h-plans" small={PLANS_SECTION.small} large={PLANS_SECTION.large} tier="step" className="mb-10" />
      </Reveal>
      <BasketCard />
    </Section>
  );
}
