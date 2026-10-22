import type { ReactElement } from "react";
import { BasketCard } from "@/components/basket/BasketCard";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { PLANS_SECTION } from "@/content/home";

/** The plans heading, then the Basket Card and its receipt (mock: #h-plans, .ox-card). The build and run prices, the panel frame and its header were removed at the owner's request, 2026-10-22. */
export function PlansSection(): ReactElement {
  return (
    <Section labelledBy="h-plans" tight>
      <Reveal>
        <SectionHead id="h-plans" title={<>{PLANS_SECTION.heading} <em className="pivot pr-1">{PLANS_SECTION.headingAccent}</em></>} />
      </Reveal>
      <BasketCard />
    </Section>
  );
}
