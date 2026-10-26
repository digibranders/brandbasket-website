import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, Check, Globe, Megaphone, MagnifyingGlass, Minus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { COMPARE, EVERY_PLAN, PLAN_COLUMNS, type PlanColumn } from "@/content/pricing";
import { SERVICE_COPY, servicePageFor } from "@/content/services";
import type { PlanId } from "@/lib/pricing";
import { PlanBasketButton } from "./PlanBasketButton";

const PLAN_ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, growth: Megaphone, search: MagnifyingGlass };
/** The plan colours already used by the plan details and the basket. */
const PLAN_COLOUR: Readonly<Record<PlanId, string>> = { website: "var(--c-site)", growth: "var(--c-growth)", search: "var(--c-search)" };

const LABEL = "mb-3 text-[13px] font-semibold leading-none text-ink-2";

function Plan({ plan }: { readonly plan: PlanColumn }): ReactElement {
  const PlanIcon = PLAN_ICON[plan.id];
  const headingId = `plan-${plan.id}`;
  return (
    <article
      aria-labelledby={headingId}
      style={{ "--c": PLAN_COLOUR[plan.id] } as CSSProperties}
      className="grid overflow-clip rounded-[28px] bg-surface shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)] min-[980px]:row-span-4 min-[980px]:grid-rows-subgrid"
    >
      <header className="grid grid-cols-[auto_1fr] content-start items-center gap-x-3.5 gap-y-1 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c)_11%,var(--surface)),var(--surface))] px-[26px] pb-[22px] pt-[26px]">
        <span aria-hidden="true" className="grid size-[46px] place-items-center rounded-full bg-[var(--c)] text-action-ink"><PlanIcon weight="fill" className="size-6" /></span>
        <div>
          <h3 id={headingId} className="font-display text-[21px] font-semibold leading-[1.15] tracking-[-0.03em]">{plan.name}</h3>
          {plan.tag ? <span className="mt-1 inline-block rounded-full bg-rattan-wash px-2.5 py-[3px] text-xs font-semibold leading-[1.4] text-rattan-ink">{plan.tag}</span> : null}
        </div>
        <p className="num col-span-full mt-3.5 font-display text-[clamp(40px,4vw,52px)] font-medium leading-none tracking-[-0.045em]">
          {plan.price}<small className="ml-1 font-sans text-sm font-medium tracking-normal text-ink-2">{plan.priceNote}</small>
        </p>
        <p className="col-span-full mt-2 max-w-[34ch] text-[15px] leading-normal text-ink-2">{plan.audience}</p>
        <Link href={servicePageFor(plan.id).path} className="group col-span-full mt-3 inline-flex w-fit items-center gap-1.5 text-[15px] font-semibold underline decoration-[var(--c)] decoration-2 underline-offset-4">
          {SERVICE_COPY.exploreMore}<span className="sr-only"> about {plan.name}</span>
          <ArrowRight aria-hidden="true" weight="bold" className="size-4 text-[var(--c)] transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
        </Link>
      </header>
      <div className="border-t border-line px-[26px] py-5">
        <h4 className={LABEL}>{COMPARE.doesLabel}</h4>
        <ul className="grid gap-2.5">
          {plan.does.map((line) => (
            <li key={line} className="grid grid-cols-[20px_1fr] items-start gap-2.5 text-[15px] leading-[1.4]">
              <Check aria-hidden="true" className="mt-px size-[18px] text-sage" />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line bg-sunken px-[26px] py-5">
        <h4 className={LABEL}>{COMPARE.excludesLabel}</h4>
        <ul className="grid gap-2.5">
          {plan.excludes.map((line) => (
            <li key={line} className="grid grid-cols-[20px_1fr] items-start gap-2.5 text-[15px] leading-[1.4] text-ink-2">
              <Minus aria-hidden="true" className="mt-px size-[18px] opacity-70" />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line px-[26px] py-5">
        <PlanBasketButton id={plan.id} />
      </div>
    </article>
  );
}

/**
 * The three plans side by side (docs/design/homepage-v2.html, #cmp-new): price, who it is for, what we do and what is
 * left out, with the rows lined up across plans. Then what every plan shares, and the packages that bundle them.
 * Plans and prices are built from lib/pricing, so nothing here repeats a number.
 */
export function PlanColumns(): ReactElement {
  return (
    <Section id="compare" labelledBy="h-compare" tight className="scroll-mt-24 pt-16!">
      <Reveal>
        <SectionHead id="h-compare" title={COMPARE.heading} lede={COMPARE.lede} />
      </Reveal>
      <Reveal>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 min-[980px]:grid-cols-3 min-[980px]:grid-rows-[repeat(4,auto)] min-[980px]:gap-x-[22px] min-[980px]:gap-y-0">
          {PLAN_COLUMNS.map((plan) => <Plan key={plan.id} plan={plan} />)}
        </div>
        <div className="mt-[22px] flex flex-wrap items-center gap-x-7 gap-y-3 rounded-[22px] bg-[color-mix(in_srgb,var(--sage)_9%,var(--surface))] px-[26px] py-[18px]">
          <b className="font-display text-base font-semibold tracking-[-0.02em]">{EVERY_PLAN.label}</b>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {EVERY_PLAN.items.map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-[14.5px]">
                <Check aria-hidden="true" className="size-[18px] text-sage" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
