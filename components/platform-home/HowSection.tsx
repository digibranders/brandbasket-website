import type { Icon } from "@phosphor-icons/react";
import { ArrowDown, RocketLaunch, SlidersHorizontal, Stack, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement, ReactNode } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { HOW, MODES } from "@/content/platform-home";
import { ServicePicker } from "./ServicePicker";

interface StepLook {
  readonly icon: Icon;
  /** The block's ground and text colour: pale rattan, then caramel, then ink, so the climb reads as progress. */
  readonly ground: string;
  readonly mark: string;
  readonly body: string;
}

const LOOKS: readonly StepLook[] = [
  { icon: Stack, ground: "bg-rattan-wash text-ink", mark: "text-rattan-text/20", body: "text-ink-2" },
  { icon: SlidersHorizontal, ground: "text-ink [background:linear-gradient(160deg,#d9a465,var(--rattan)_50%,#b6793a)]", mark: "text-white/30", body: "text-ink/80" },
  { icon: RocketLaunch, ground: "bg-ink text-action-ink", mark: "text-white/[0.09]", body: "text-action-ink/75" },
];

/** A small picture per step, from the words the step already uses: nothing new is said in them. */
const VISUALS: readonly ReactNode[] = [
  null,
  <div key="two" aria-hidden="true" className="how-two"><span>{MODES.diy.title}</span><span>{MODES.dfy.title}</span></div>,
  <ol key="path" aria-hidden="true" className="how-path">
    {["Create", "Publish", "Improve"].map((word, i) => (
      <li key={word} className={`how-path-step how-path-step-${i}`}>
        {word}
        {i === 2 ? <TrendUp weight="bold" className="size-4" /> : null}
      </li>
    ))}
  </ol>,
];

/** What each step lets the visitor do, in the order of HOW.steps: pick plans, read the two ways, start. */
const ACTIONS: readonly ReactNode[] = [
  <ServicePicker key="pick" />,
  <a key="ways" href="#ways" className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-ink decoration-2 underline-offset-[6px]">
    {HOW.waysLink}
    <ArrowDown aria-hidden="true" weight="bold" className="size-4 transition-transform duration-300 ease-[var(--ease)] group-hover:translate-y-[3px]" />
  </a>,
  <BasketCta key="start" location="how" label={HOW.start} tone="inverse" />,
];

/**
 * "Up and Running in Three Steps.": a staircase. Three blocks rise left to right, pale, caramel, ink, and the heading
 * sits in the space above the low steps. The blocks are also the way in: step 1 adds plans to the basket, step 2 jumps
 * to "Do It Yourself / Done For You", step 3 opens the basket with what was picked. On a phone they stack, equal height.
 */
export function HowSection(): ReactElement {
  return (
    <Section id="how" labelledBy="h-how" className="scroll-mt-24">
      <div className="how-stairs">
        <Reveal className="how-head">
          <h2 id="h-how" className="font-display text-[clamp(40px,5.6vw,88px)] font-semibold leading-[0.98] tracking-[-0.052em]">
            {HOW.heading} <em className="font-light not-italic text-rattan-text">{HOW.headingAccent}</em>
          </h2>
        </Reveal>
        {HOW.steps.map((step, i) => {
          const look = LOOKS[i];
          if (!look) return null;
          const StepIcon = look.icon;
          return (
            <Reveal key={step.title} delay={i * 110} className={`how-step how-step-${i}`}>
              <article className={`how-block ${look.ground}`}>
                <StepIcon aria-hidden="true" weight="thin" className={`how-mark ${look.mark}`} />
                <div className="grid gap-3">
                  <h3 className="max-w-[14ch] font-display text-[clamp(26px,2.6vw,38px)] font-semibold leading-[1.05] tracking-[-0.035em]">{step.title}</h3>
                  <p className={`max-w-[32ch] text-[16.5px] leading-[1.55] ${look.body}`}>{step.body}</p>
                </div>
                <div className="how-visual">{VISUALS[i]}</div>
                <div className="how-action">{ACTIONS[i]}</div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
