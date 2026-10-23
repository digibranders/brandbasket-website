import { CaretDown, Check, Minus } from "@phosphor-icons/react/dist/ssr";
import { Fragment, type ReactElement } from "react";
import { PLAN_COLOUR } from "@/components/basket/basket-view";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { type DetailColumn, PLAN_DETAILS, PLAN_DETAILS_INTRO } from "@/content/pricing";
import { PRICING_ICONS } from "./icons";

export function Column({ column }: { readonly column: DetailColumn }): ReactElement {
  const Mark = column.kind === "included" ? Check : Minus;
  return (
    <div>
      {[column, ...(column.more ?? [])].map((list, i) => (
        <Fragment key={list.heading}>
          <h3 className={`mb-3 text-[13px] font-semibold text-ink-2 ${i > 0 ? "mt-[22px]" : ""}`}>{list.heading}</h3>
          <ul className="grid gap-2 text-[14.5px]">
            {list.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Mark aria-hidden="true" className={`mt-px size-[19px] flex-none ${column.kind === "included" ? "text-sage" : "text-ink-2"}`} />
                {item}
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
      {column.note ? <p className="mt-3.5 rounded-[14px] bg-bg px-3.5 py-3 text-[13.5px] text-ink-2">{column.note}</p> : null}
    </div>
  );
}

/** Every monthly task per plan, closed by default (mock: #h-detail, .detail). */
export function PlanDetails(): ReactElement {
  return (
    <Section id="details" labelledBy="h-detail" tight className="scroll-mt-24">
      <Reveal>
        <SectionHead id="h-detail" title={PLAN_DETAILS_INTRO.heading} lede={PLAN_DETAILS_INTRO.lede} />
      </Reveal>
      <Reveal className="grid">
        {PLAN_DETAILS.map((plan) => {
          const PlanIcon = PRICING_ICONS[plan.icon];
          return (
            <details key={plan.id} className="group/plan border-t border-line last-of-type:border-b">
              <summary className="group/sum grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-[22px] [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className={`grid size-[42px] place-items-center rounded-[13px] text-surface ${PLAN_COLOUR[plan.id]}`}>
                  <PlanIcon className="size-[22px]" />
                </span>
                <span>
                  <b className="block font-display text-xl font-medium tracking-[-0.02em] transition-colors duration-300 ease-[var(--ease)] group-hover/sum:text-rattan-ink">{plan.name}</b>
                  <span className="text-sm text-ink-2">{plan.summary}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-rattan-ink">
                  <span className="max-[640.98px]:sr-only">{PLAN_DETAILS_INTRO.toggle}</span>
                  <CaretDown aria-hidden="true" className="size-5 transition-transform duration-[400ms] ease-[var(--ease)] group-open/plan:rotate-180" />
                </span>
              </summary>
              <div className="grid gap-6 pb-7 pl-[58px] max-[640.98px]:pl-0 min-[900px]:grid-cols-[1fr_1fr_0.9fr]">
                {plan.columns.map((column) => <Column key={column.heading} column={column} />)}
              </div>
            </details>
          );
        })}
      </Reveal>
    </Section>
  );
}
