import type { Icon } from "@phosphor-icons/react";
import { Check, Globe, Megaphone, MagnifyingGlass, Minus } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties, ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { BUNDLES, COMPARE, EVERY_PLAN, PLAN_COLUMNS, type PlanColumn } from "@/content/pricing";
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
 * Plans, prices and bundle totals are built from lib/pricing, so nothing here repeats a number.
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
        <div className="mt-[22px] grid gap-[22px] rounded-[28px] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--rattan-wash)_55%,var(--surface)),var(--rattan-wash))] p-[clamp(22px,3vw,34px)] min-[1100px]:grid-cols-[0.7fr_1.6fr] min-[1100px]:items-center min-[1100px]:gap-9">
          <div>
            <h3 className="font-display text-[clamp(22px,2.2vw,28px)] font-semibold leading-[1.1] tracking-[-0.035em]">{BUNDLES.heading}</h3>
            <p className="mt-2.5 max-w-[36ch] text-[15px] leading-[1.55] text-ink-2">{BUNDLES.lede}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 min-[760px]:grid-cols-4">
            {BUNDLES.tiles.map((tile) => (
              <li key={tile.id} className={`relative grid content-start gap-1 rounded-[20px] p-4 ${tile.biggest ? "bg-action pt-[30px] text-action-ink" : "bg-surface shadow-[0_0_0_1px_rgba(21,22,26,0.06)]"}`}>
                {tile.biggest ? <em className="absolute left-4 top-2.5 text-[11.5px] font-semibold not-italic text-rattan">{BUNDLES.biggestFlag}</em> : null}
                <b className="font-display text-[14.5px] font-semibold tracking-[-0.01em]">{tile.name}</b>
                <strong className="num font-display text-2xl font-medium leading-[1.1] tracking-[-0.03em]">
                  {tile.price}<small className={`mt-0.5 block font-sans text-xs font-normal tracking-normal ${tile.biggest ? "text-action-ink/72" : "text-ink-2"}`}>{BUNDLES.priceSuffix}</small>
                </strong>
                <span className={`text-[13px] leading-[1.4] ${tile.biggest ? "text-action-ink/72" : "text-ink-2"}`}>{tile.offer}</span>
                <span className={`text-[13px] leading-[1.4] ${tile.biggest ? "text-action-ink/72" : "text-ink-2"}`}>{tile.adMoney ?? " "}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
