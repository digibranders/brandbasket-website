"use client";
import type { Icon } from "@phosphor-icons/react";
import { CalendarCheck, Check, Globe, Lightning, MagnifyingGlass, Megaphone, PiggyBank, TrendUp } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { BASKET_CARD, type BenefitKind, benefits, headline, nextStamp, oneTimeNote, type Rich, slotLabel } from "@/content/basket-card";
import { BASKET_COPY } from "@/content/basket";
import { basket } from "@/lib/basket-store";
import { basketPlans, type BasketPick, firstPayment, formatInr, monthlyTotal, PLAN_IDS, PLANS, type PlanId, packageSaving, packageTotal } from "@/lib/pricing";
import { PLAN_INK } from "./basket-view";
import { BasketCta } from "./BasketCta";
import { useBasket } from "./useBasket";

const ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, growth: TrendUp, search: MagnifyingGlass };
const BENEFIT_ICON: Readonly<Record<BenefitKind, Icon>> = { saving: PiggyBank, ads: Megaphone, year: CalendarCheck, build: Globe };
/** Each stamp lands at its own slight angle, as a hand stamp would. */
const TILT: Readonly<Record<PlanId, string>> = { website: "-8deg", growth: "6deg", search: "-4deg" };

/** Ink variables for a plan's stamp. */
function inkStyle(id: PlanId): CSSProperties {
  return { "--c": PLAN_INK[id], "--r": TILT[id] } as CSSProperties;
}

export function RichText({ line }: { readonly line: Rich }): ReactElement {
  return <>{line.before}<b className="font-semibold">{line.strong}</b>{line.after}</>;
}

/** One plan slot: tapping it adds or removes the plan. */
function Slot({ id, pick, onlyOne }: { readonly id: PlanId; readonly pick: BasketPick; readonly onlyOne: boolean }): ReactElement {
  const on = pick[id];
  const SlotIcon = ICON[id];
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={slotLabel(id, on)}
      aria-disabled={on && onlyOne ? true : undefined}
      onClick={() => basket.set(id, !on)}
      style={inkStyle(id)}
      className="group grid cursor-pointer content-start justify-items-center gap-1 rounded-[18px] p-1.5 text-center text-ink aria-disabled:cursor-not-allowed"
    >
      <span className="relative grid aspect-square w-[clamp(84px,11vw,116px)] place-items-center rounded-full border-2 border-dashed border-rattan-ink/40 bg-surface/60 transition-colors duration-300 ease-[var(--ease)] group-hover:border-rattan-ink/70 group-hover:bg-surface group-aria-pressed:border-transparent group-aria-pressed:bg-surface">
        <span aria-hidden="true" className="max-w-[9ch] font-mono text-[11px] leading-[1.3] tracking-[0.06em] text-rattan-ink group-aria-pressed:opacity-0">{BASKET_CARD.tapHint}</span>
        {on ? (
          <span aria-hidden="true" className="stamp-in absolute inset-[6%] grid content-center place-items-center gap-0.5 rounded-full border-4 border-double border-[var(--c)] bg-[color-mix(in_srgb,var(--c)_7%,transparent)] text-[var(--c)] mix-blend-multiply">
            <SlotIcon weight="duotone" className="size-[clamp(26px,3vw,34px)]" />
            <i className="font-mono text-[11px] font-medium not-italic uppercase tracking-[0.16em]">{PLANS[id].short}</i>
          </span>
        ) : null}
        {on ? (
          <span aria-hidden="true" className="absolute right-[2%] top-[2%] grid size-7 place-items-center rounded-full bg-[var(--c)] text-surface shadow-[0_0_0_3px_var(--surface)] max-[560px]:size-6">
            <Check weight="bold" className="size-4 max-[560px]:size-3.5" />
          </span>
        ) : null}
      </span>
      <b className="mt-2 font-display text-base font-medium tracking-[-0.015em]">{PLANS[id].name}</b>
      <span className="max-w-[20ch] text-[13px] leading-[1.35] text-ink-2 max-[560px]:hidden">{BASKET_CARD.slots[id]}</span>
      <small className="num text-[13px] text-ink-2">{formatInr(PLANS[id].monthly)} {BASKET_COPY.perMonth}</small>
    </button>
  );
}

/** The loyalty card: a stamp per plan, the one-time offer, then the basket actions (mock: .bcard). The reward track and fine print were removed at the owner's request, 2026-10-22. */
function StampCard({ pick }: { readonly pick: BasketPick }): ReactElement {
  const count = basketPlans(pick).length;
  const once = oneTimeNote(pick);
  return (
    <div className="basket-weave relative grid gap-[22px] self-start overflow-hidden rounded-3xl border border-rattan/30 px-[26px] py-[26px] max-[560px]:px-4 max-[560px]:py-[22px]">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h4 className="font-display text-[28px] font-medium leading-none tracking-[-0.035em] text-rattan-ink">{BASKET_CARD.title}</h4>
          <p className="max-w-[40ch] text-[15px] text-ink-2">{BASKET_CARD.intro}</p>
        </div>
        <Image src="/brand/brandbasket-mark-small-rattan.svg" alt="" width={40} height={40} className="size-10 flex-none opacity-85" />
      </div>
      <div className="grid grid-cols-3 gap-3 max-[560px]:gap-1.5">
        {PLAN_IDS.map((id) => <Slot key={id} id={id} pick={pick} onlyOne={count === 1} />)}
      </div>
      {once ? (
        <div className="grid w-full gap-1.5 rounded-2xl border-[1.5px] border-dashed border-rattan-text/55 bg-surface px-4 py-3.5 text-[14.5px] leading-[1.45] [&_b]:text-rattan-ink">
          <span className="inline-flex items-center gap-1 justify-self-start rounded-full bg-rattan-ink py-[3px] pl-1.5 pr-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-surface">
            <Lightning weight="fill" aria-hidden="true" className="size-[15px]" />{BASKET_CARD.oneTimeTag}
          </span>
          <p><RichText line={once} /></p>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-1">
        <BasketCta location="plans" />
        <Link href="/pricing#compare" className="px-0.5 py-1.5 text-[15px] font-semibold text-ink underline decoration-rattan decoration-2 underline-offset-[5px]">{BASKET_COPY.compare}</Link>
      </div>
    </div>
  );
}

/** A receipt: the plans, what they earn and the next plan worth adding, then the total at the foot, level with the Basket Card's actions (mock: .bsum; owner picked the receipt layout, 2026-10-22). */
function Summary({ pick }: { readonly pick: BasketPick }): ReactElement {
  const monthly = packageTotal(pick);
  const saving = packageSaving(pick) > 0;
  const next = nextStamp(pick);
  const gains = benefits(pick);
  return (
    <div className="flex flex-col items-start gap-3.5 rounded-3xl border border-line bg-surface p-[26px] max-[560px]:px-[18px] max-[560px]:py-[22px]">
      <div className="grid gap-2">
        <span className="text-[13px] text-ink-2">{BASKET_CARD.inBasket}</span>
        <ul aria-label={BASKET_CARD.inBasket} className="flex flex-wrap gap-1.5">
          {basketPlans(pick).map((plan) => (
            <li key={plan.id} style={inkStyle(plan.id)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg py-1 pl-1.5 pr-3 text-[13.5px] font-semibold">
              <span aria-hidden="true" className="grid size-[18px] place-items-center rounded-full bg-[var(--c)] text-surface"><Check weight="bold" className="size-3" /></span>
              {plan.name}
            </li>
          ))}
        </ul>
      </div>
      <p aria-live="polite" className="text-balance font-display text-[clamp(24px,2.4vw,30px)] leading-[1.1] tracking-[-0.035em]">{headline(pick)}</p>
      {gains.length > 0 ? (
        <ul className="grid w-full gap-[9px]">
          {gains.map((benefit) => {
            const BenefitIcon = BENEFIT_ICON[benefit.kind];
            return (
              <li key={benefit.kind} className="flex items-center gap-2.5 text-[15px]">
                <BenefitIcon weight="duotone" aria-hidden="true" className="size-5 flex-none text-sage" />
                <span><RichText line={benefit} /></span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {next ? (
        <div className="grid w-full gap-1 rounded-2xl bg-rattan-wash px-4 py-3.5 text-[14.5px] text-rattan-ink">
          <p className="text-[13px]">{BASKET_CARD.nextLabel} <b className="font-display text-base font-medium">{next.name}</b></p>
          <p>{next.body}</p>
          <button type="button" onClick={() => basket.set(next.id, true)} className="cursor-pointer justify-self-start pt-1 font-semibold text-ink underline decoration-rattan decoration-2 underline-offset-[5px]">{next.button}</button>
        </div>
      ) : null}
      <div data-basket-total className="mt-auto grid w-full gap-1 border-t border-line pt-4">
        <span className="text-[13px] text-ink-2">{BASKET_CARD.totalLabel}</span>
        <p className="num flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display">
          {saving ? <s className="text-[22px] tracking-[-0.02em] text-ink-2 decoration-rattan-text/80 decoration-2"><span className="sr-only">{BASKET_COPY.was} </span>{formatInr(monthlyTotal(pick))}</s> : null}
          <span className="text-[clamp(42px,4.6vw,56px)] font-medium leading-none tracking-[-0.05em]">{formatInr(monthly)}</span>
          <small className="font-sans text-sm text-ink-2">{BASKET_COPY.plusGst}</small>
        </p>
        <p className="num text-[13.5px] text-ink-2">
          {saving ? <s className="mr-2"><span className="sr-only">{BASKET_COPY.was} </span>{formatInr(firstPayment(monthlyTotal(pick)).total)}</s> : null}
          {formatInr(firstPayment(monthly).total)} {BASKET_COPY.withGstBilled}
        </p>
      </div>
    </div>
  );
}

/** The homepage receipt and Basket Card, side by side (mock: .ox-card; owner's pick, 2026-10-21). */
export function BasketCard(): ReactElement {
  const pick = useBasket();
  return (
    <div id={BASKET_CARD.id} className="grid scroll-mt-28 gap-7 min-[1000px]:grid-cols-[1fr_1.4fr] min-[1000px]:gap-12">
      <Summary pick={pick} />
      <StampCard pick={pick} />
    </div>
  );
}
