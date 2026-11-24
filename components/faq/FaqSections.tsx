import type { Icon } from "@phosphor-icons/react";
import { Check, Globe, Plus, ShieldCheck, Storefront, Timer, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { FAQ_PAGE, faqLeaveFor, faqPlanFor, faqScopeFor } from "@/content/faq";
import type { Currency } from "@/lib/currency";

const FACT_ICON: Readonly<Record<"Timer" | "ShieldCheck" | "Wrench" | "Check" | "Globe" | "Storefront", Icon>> = { Timer, ShieldCheck, Wrench, Check, Globe, Storefront };
const BIG = "block font-display text-[clamp(40px,3.8vw,54px)] font-normal leading-none tracking-[-0.04em] tabular-nums";

/** The plan in one card beside the headline: the two prices, four facts and the extra-work rate. */
export function FaqPlanCard({ currency }: { readonly currency: Currency }): ReactElement {
  const plan = faqPlanFor(currency);
  return (
    <div aria-label="The plan at a glance" role="group" className="overflow-hidden rounded-[32px] bg-surface shadow-[var(--shadow)]">
      <div className="relative grid grid-cols-2 px-[22px] pb-6 pt-7 min-[640px]:px-9 min-[640px]:pb-8 min-[640px]:pt-9">
        <div className="pr-4 min-[640px]:pr-8">
          <span className={BIG}>{plan.build.figure}</span>
          <p className="mt-2.5 text-[14.5px] leading-[1.4] text-ink-2">{plan.build.note}</p>
        </div>
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid size-[30px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-rattan-wash text-rattan-ink">
          <Plus weight="bold" className="size-3.5" />
        </span>
        <div className="border-l border-line pl-5 min-[640px]:pl-8">
          <span className={BIG}>{plan.monthly.figure}</span>
          <p className="mt-2.5 text-[14.5px] leading-[1.4] text-ink-2">{plan.monthly.note}</p>
        </div>
      </div>
      <ul className="grid gap-5 border-t border-line px-[22px] pb-7 pt-6 min-[480px]:grid-cols-2 min-[480px]:gap-x-8 min-[480px]:gap-y-6 min-[640px]:px-9 min-[640px]:pb-8 min-[640px]:pt-7">
        {plan.facts.map((fact) => {
          const FactIcon = FACT_ICON[fact.icon];
          return (
            <li key={fact.title} className="flex items-start gap-3.5">
              <span aria-hidden="true" className="grid size-[38px] flex-none place-items-center rounded-full bg-sunken"><FactIcon className="size-[18px]" /></span>
              <div>
                <b className="block text-[15px] font-semibold leading-[1.3]">{fact.title}</b>
                <span className="mt-0.5 block text-[13.5px] leading-[1.4] text-ink-2">{fact.note}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="bg-sunken px-[22px] py-3.5 text-sm text-ink-2 min-[640px]:px-9">
        {plan.extra.lead} <b className="font-semibold text-ink">{plan.extra.rate}</b>
        {plan.extra.tail}
      </p>
    </div>
  );
}

/** What the plan covers and what is priced on its own, then the three things no website can promise. */
export function FaqScope({ currency }: { readonly currency: Currency }): ReactElement {
  const scope = faqScopeFor(currency);
  return (
    <Section id="scope" labelledBy="h-scope" tight>
      <Reveal>
        <h2 id="h-scope" className="max-w-[18ch] font-display text-[clamp(32px,4vw,54px)] font-normal leading-none tracking-[-0.045em]">{FAQ_PAGE.scopeHeading}</h2>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 min-[1040px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="rounded-[32px] border border-line-2 bg-surface p-[clamp(24px,3vw,36px)] shadow-[var(--shadow-offer)]">
            <h3 className="font-display text-2xl font-medium leading-[1.15] tracking-[-0.03em]">{scope.includedTitle}</h3>
            <p className="mt-1.5 text-[15px] text-ink-2">{scope.includedNote}</p>
            <ul className="mt-6 grid gap-3 min-[640px]:grid-cols-2 min-[640px]:gap-x-8">
              {scope.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15.5px] leading-[1.4]">
                  <Check aria-hidden="true" weight="bold" className="mt-0.5 size-[18px] flex-none text-sage" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[32px] bg-rattan-wash p-[clamp(24px,3vw,36px)]">
            <h3 className="font-display text-2xl font-medium leading-[1.15] tracking-[-0.03em]">{scope.extraTitle}</h3>
            <p className="mt-1.5 text-[15px] text-rattan-ink">{scope.extraNote}</p>
            <ul className="mt-6 grid gap-3">
              {scope.extra.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15.5px] leading-[1.4]">
                  <Plus aria-hidden="true" weight="bold" className="mt-0.5 size-[18px] flex-none text-rattan-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 rounded-[32px] bg-sunken px-[clamp(24px,3vw,36px)] py-7 min-[900px]:flex-row min-[900px]:items-baseline min-[900px]:gap-5">
          <h3 className="whitespace-nowrap font-display text-xl font-medium tracking-[-0.02em]">{scope.promiseTitle}</h3>
          <p className="max-w-[72ch] text-ink-2">{scope.promise}</p>
        </div>
      </Reveal>
    </Section>
  );
}

/** What happens if a customer leaves: three facts and the one fee, set in one panel. */
export function FaqLeave({ currency }: { readonly currency: Currency }): ReactElement {
  const leave = faqLeaveFor(currency);
  return (
    <Section id="leave" labelledBy="h-leave" tight>
      <Reveal>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 rounded-[clamp(28px,4vw,40px)] border border-line-2 bg-surface p-[clamp(26px,5vw,56px)] shadow-[var(--shadow)] min-[1040px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[1040px]:gap-16">
          <div>
            <h2 id="h-leave" className="max-w-[18ch] font-display text-[clamp(32px,4vw,54px)] font-normal leading-none tracking-[-0.045em]">{FAQ_PAGE.leaveHeading}</h2>
            <p className="mt-4 max-w-[40ch] text-[17px] text-ink-2">{FAQ_PAGE.leaveLede}</p>
            <div className="mt-8 rounded-3xl bg-rattan-wash px-[26px] py-6">
              <span className="block font-display text-[clamp(36px,4vw,52px)] font-normal leading-none tracking-[-0.045em] tabular-nums">{leave.fee.figure}</span>
              <p className="mt-2 text-[15px] leading-[1.4] text-rattan-ink">{leave.fee.note}</p>
            </div>
          </div>
          <ul className="self-center">
            {leave.facts.map((fact) => {
              const FactIcon = FACT_ICON[fact.icon];
              return (
                <li key={fact.title} className="flex gap-[18px] py-6 first:pt-0 last:pb-0 not-first:border-t not-first:border-line">
                  <span aria-hidden="true" className="grid size-11 flex-none place-items-center rounded-full bg-sunken"><FactIcon className="size-5" /></span>
                  <div>
                    <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.025em]">{fact.title}</h3>
                    <p className="mt-1.5 max-w-[54ch] text-ink-2">{fact.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
