import { ArrowDown, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement, ReactNode } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { HOW } from "@/content/platform-home";
import { ServicePicker } from "./ServicePicker";

/** What each step lets the visitor do, in the order of HOW.steps: pick plans, read the two ways, start. */
const ACTIONS: readonly ReactNode[] = [
  <ServicePicker key="pick" />,
  <a key="ways" href="#ways" className="group inline-flex items-center gap-1.5 text-[15px] font-semibold underline decoration-rattan decoration-2 underline-offset-[6px]">
    {HOW.waysLink}
    <ArrowDown aria-hidden="true" weight="bold" className="size-4 text-rattan-text transition-transform duration-300 ease-[var(--ease)] group-hover:translate-y-[3px]" />
  </a>,
  <BasketCta key="start" location="how" label={HOW.start} />,
];

/**
 * "Up and Running in Three Steps.": three cards that are also the way in. Step 1 adds plans to the basket, step 2 jumps
 * to "Do It Yourself / Done For You", step 3 opens the basket with what was picked. It sits right after the services,
 * so the sections below it follow the same order.
 */
export function HowSection(): ReactElement {
  return (
    <Section id="how" labelledBy="h-how">
      <Reveal>
        <SectionHead id="h-how" step title={<>{HOW.heading} <em className="font-light not-italic text-rattan-text">{HOW.headingAccent}</em></>} />
      </Reveal>
      <ol className="grid grid-cols-[minmax(0,1fr)] gap-4 min-[900px]:grid-cols-3">
        {HOW.steps.map((step, i) => (
          <li key={step.title} className="relative grid">
            <Reveal delay={i * 90} className="grid">
              <article className="grid grid-rows-[auto_auto_1fr_auto] gap-3 rounded-[28px] bg-surface p-[clamp(22px,2.4vw,30px)] shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)]">
                <span aria-hidden="true" className="num grid size-11 place-items-center rounded-full bg-rattan-wash font-display text-[19px] font-semibold text-rattan-ink">{i + 1}</span>
                <h3 className="mt-2 font-display text-[clamp(22px,2vw,26px)] font-medium leading-[1.15] tracking-[-0.025em]">{step.title}</h3>
                <p className="max-w-[34ch] text-[16px] leading-[1.55] text-ink-2">{step.body}</p>
                <div className="mt-4 self-end">{ACTIONS[i]}</div>
              </article>
            </Reveal>
            {i < HOW.steps.length - 1 ? (
              <span aria-hidden="true" className="absolute -right-6 top-[38px] z-[1] hidden size-8 place-items-center rounded-full border border-line bg-bg text-rattan-text min-[900px]:grid">
                <ArrowRight weight="bold" className="size-4" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
