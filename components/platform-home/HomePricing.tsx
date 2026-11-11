import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, Check, Globe, InstagramLogo, Megaphone } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { MonitoringBand } from "@/components/pricing/MonitoringBand";
import { PlanBasketButton } from "@/components/pricing/PlanBasketButton";
import { Section } from "@/components/ui/Section";
import { BASKET_COPY } from "@/content/basket";
import { HOME_PRICING } from "@/content/platform-home";
import { type PlanColumn, planColumns } from "@/content/pricing";
import { servicePageRefFor } from "@/content/services";
import type { Currency } from "@/lib/currency";
import type { PlanId } from "@/lib/pricing";
import { BasketPanel } from "./BasketPanel";

const PLAN_ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, social: InstagramLogo, ads: Megaphone };
/** The plan colours the pricing page and the basket already use. */
const PLAN_COLOUR: Readonly<Record<PlanId, string>> = { website: "var(--c-site)", social: "var(--c-growth)", ads: "var(--c-search)" };

function PlanCard({ plan }: { readonly plan: PlanColumn }): ReactElement {
  const PlanIcon = PLAN_ICON[plan.id];
  const headingId = `home-plan-${plan.id}`;
  return (
    <article
      aria-labelledby={headingId}
      style={{ "--c": PLAN_COLOUR[plan.id] } as CSSProperties}
      className="grid gap-5 rounded-[28px] bg-surface p-[clamp(20px,2.4vw,30px)] shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)]"
    >
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="flex items-center gap-3.5">
          <span aria-hidden="true" className="grid size-12 flex-none place-items-center rounded-2xl bg-[var(--c)] text-action-ink"><PlanIcon weight="fill" className="size-6" /></span>
          <div>
            <p className="text-[13px] font-semibold text-[var(--c)]">{HOME_PRICING.planPrefix}</p>
            <h3 id={headingId} className="font-display text-[clamp(21px,1.9vw,25px)] font-semibold leading-[1.15] tracking-[-0.03em]">{plan.name}</h3>
          </div>
        </div>
        <p className="num text-right font-display text-[clamp(32px,3vw,42px)] font-semibold leading-none tracking-[-0.045em] max-[560px]:text-left">
          <s className="mr-2 text-[17px] font-medium tracking-[-0.01em] text-ink-2 decoration-rattan-text decoration-1"><span className="sr-only">{BASKET_COPY.was} </span>{plan.was}</s>
          {plan.price}
          <small className="mt-1.5 block font-sans text-[13.5px] font-medium tracking-normal text-ink-2">{plan.priceNote}</small>
        </p>
      </header>
      <ul className="grid gap-x-6 gap-y-2.5 border-t border-line pt-5 min-[640px]:grid-cols-2">
        {plan.does.map((line) => (
          <li key={line} className="grid grid-cols-[20px_1fr] items-start gap-2.5 text-[15px] leading-[1.4]">
            <Check aria-hidden="true" weight="bold" className="mt-px size-[17px] text-[var(--c)]" />
            {line}
          </li>
        ))}
      </ul>
      <div className="grid items-center gap-3 min-[640px]:grid-cols-[minmax(0,320px)_auto] min-[640px]:gap-6">
        <PlanBasketButton id={plan.id} label={HOME_PRICING.choose[plan.id]} />
        <Link href={servicePageRefFor(plan.id).path} className="group inline-flex w-fit items-center gap-1.5 text-[15px] font-semibold underline decoration-[var(--c)] decoration-2 underline-offset-4">
          See what is included<span className="sr-only"> in {plan.name}</span>
          <ArrowRight aria-hidden="true" weight="bold" className="size-4 text-[var(--c)] transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
        </Link>
      </div>
    </article>
  );
}

/**
 * "Grow Your Business with AI-Powered Management.": the three plans, each dropping into the woven basket beside them,
 * which keeps the running total and the monitoring line. The heading and the basket are one column that pins together
 * while the plans scroll past; Dedicated Expert Monitoring sits under the plans.
 */
export function HomePricing({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <Section id="plans" labelledBy="h-plans" dockHide className="scroll-mt-24">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 min-[1000px]:grid-cols-[0.82fr_1.18fr] min-[1000px]:items-start min-[1000px]:gap-8">
        <Reveal className="min-w-0 min-[1000px]:sticky min-[1000px]:top-24">
          <div className="grid gap-5 min-[1000px]:gap-4">
            <h2 id="h-plans" className="font-display text-[clamp(32px,2.9vw,40px)] font-semibold leading-[1.04] tracking-[-0.042em]">
              {HOME_PRICING.heading} <em className="font-light not-italic text-rattan-text">{HOME_PRICING.headingAccent}</em>
            </h2>
            <BasketPanel />
          </div>
        </Reveal>
        <div className="grid min-w-0 gap-4">
          {planColumns(currency).map((plan, i) => (
            <Reveal key={plan.id} delay={i * 90}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="mt-6">
        <MonitoringBand currency={currency} headingId="h-home-monitoring" />
      </Reveal>
    </Section>
  );
}
