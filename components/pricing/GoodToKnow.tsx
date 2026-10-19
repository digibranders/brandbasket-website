import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { GOOD_TO_KNOW, GOOD_TO_KNOW_HEADING } from "@/content/pricing";
import { PRICING_ICONS } from "./icons";

/** Billing, cancellation, extras and paid tools in two columns (mock: #h-rules, .rules). */
export function GoodToKnow(): ReactElement {
  return (
    <Section labelledBy="h-rules" tight>
      <Reveal>
        <SectionHead id="h-rules" title={<>{GOOD_TO_KNOW_HEADING.text} <em>{GOOD_TO_KNOW_HEADING.accent}</em></>} />
      </Reveal>
      <Reveal className="grid max-w-[1000px] grid-cols-[minmax(0,1fr)] gap-x-14 gap-y-7 min-[760px]:grid-cols-2">
        {GOOD_TO_KNOW.map((item) => {
          const ItemIcon = PRICING_ICONS[item.icon];
          return (
            <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 border-t border-line pt-5">
              <ItemIcon aria-hidden="true" className="size-6 text-rattan-text" />
              <div>
                <h3 className="font-display text-[19px] font-medium tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-1 text-[15px] text-ink-2">{item.body}</p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
