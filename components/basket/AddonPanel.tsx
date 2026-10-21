"use client";
import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, Globe, MagnifyingGlass, TrendUp } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";
import { BASKET_COPY, HOME_PLANS } from "@/content/basket";
import { basket } from "@/lib/basket-store";
import { basketPlans, firstPayment, formatInr, monthlyTotal, PLAN_IDS, PLANS, type PlanId, packageSaving, packageTotal } from "@/lib/pricing";
import { PLAN_COLOUR, basketNames } from "./basket-view";
import { BasketCta } from "./BasketCta";
import { OfferNote } from "./OfferNote";
import { useBasket } from "./useBasket";

const ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, growth: TrendUp, search: MagnifyingGlass };

/** Homepage basket panel (mock: #h-plans .addpanel, .ap-row, .offer-note, .calc). */
export function AddonPanel(): ReactElement {
  const pick = useBasket();
  const monthly = packageTotal(pick);
  const pay = firstPayment(monthly);
  const saving = packageSaving(pick) > 0;
  // The store refuses to empty the basket, so the last switch on says it cannot turn off.
  const onlyOne = basketPlans(pick).length === 1;

  return (
    <div className="mt-14 overflow-hidden rounded-[26px] border border-line bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5 px-[26px] pb-3.5 pt-[22px] max-[699px]:px-5">
        <h3 className="font-display text-[22px] font-medium tracking-[-0.03em]">{BASKET_COPY.panelTitle}</h3>
        <span className="text-sm text-ink-2">{BASKET_COPY.panelNote}</span>
      </div>

      {PLAN_IDS.map((id) => {
        const copy = HOME_PLANS[id];
        const AddonIcon = ICON[id];
        return (
          <div key={id} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-5 gap-y-4 border-t border-line px-[26px] py-[18px] max-[699px]:grid-cols-[minmax(0,1fr)_auto] max-[699px]:px-5">
            <span aria-hidden="true" className={`grid size-[46px] place-items-center self-start rounded-[14px] text-surface max-[699px]:hidden ${PLAN_COLOUR[id]}`}>
              <AddonIcon weight="fill" className="size-[23px]" />
            </span>
            <div className="grid min-w-0 justify-items-start gap-[3px] max-[699px]:col-span-2">
              <b className="font-display text-[19px] font-medium tracking-[-0.02em]">{copy.name}</b>
              <span className="max-w-[56ch] text-[14.5px] text-ink-2">{copy.summary}</span>
              <Link href="/pricing#details" className="group inline-flex items-center gap-1.5 py-0.5 text-[13.5px] font-semibold text-ink">
                <span className="underline decoration-rattan decoration-[1.5px] underline-offset-4">{BASKET_COPY.explore}</span>
                <ArrowRight aria-hidden="true" className="size-4 text-rattan-text transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
              </Link>
            </div>
            <span className="num whitespace-nowrap text-right font-display text-2xl leading-none tracking-[-0.03em] max-[699px]:text-left">
              {formatInr(PLANS[id].monthly)}
              <small className="mt-1 block font-sans text-xs tracking-normal text-ink-2">{BASKET_COPY.perMonth}</small>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={pick[id]}
              aria-label={copy.switchLabel}
              aria-disabled={pick[id] && onlyOne ? true : undefined}
              onClick={() => basket.set(id, !basket.get()[id])}
              className="group inline-flex min-h-11 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-bg py-2 pl-2 pr-4 text-sm font-semibold text-ink transition-colors duration-300 ease-[var(--ease)] aria-checked:border-action aria-checked:bg-action aria-checked:text-action-ink aria-disabled:cursor-not-allowed aria-disabled:opacity-55"
            >
              <span aria-hidden="true" className="relative h-6 w-10 flex-none rounded-full bg-line transition-colors duration-300 ease-[var(--ease)] after:absolute after:left-[3px] after:top-[3px] after:size-[18px] after:rounded-full after:bg-surface after:shadow-[var(--shadow-knob)] after:transition-transform after:duration-[350ms] after:ease-[var(--ease)] group-aria-checked:bg-rattan group-aria-checked:after:translate-x-4" />
              <span>{pick[id] ? BASKET_COPY.added : BASKET_COPY.add}</span>
            </button>
          </div>
        );
      })}

      <OfferNote />

      <div data-basket-total className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-bg px-[26px] py-[18px] max-[699px]:px-5">
        <div className="grid min-w-0 gap-0.5">
          <small className="text-[13px] text-ink-2">{BASKET_COPY.basketPrefix} {basketNames(pick)}</small>
          <b className="num font-display text-[30px] font-medium tracking-[-0.03em]">
            {saving ? (
              <>
                <s className="mr-1 text-lg font-normal tracking-[-0.02em] text-ink-2"><span className="sr-only">{BASKET_COPY.was} </span>{formatInr(monthlyTotal(pick))}</s>{" "}
              </>
            ) : null}
            {formatInr(monthly)}
            <span className="ml-1.5 font-sans text-sm font-medium tracking-normal text-ink-2">{BASKET_COPY.plusGst}</span>
          </b>
          <span aria-live="polite" aria-atomic="true" className="num text-[13.5px] text-ink-2">{formatInr(pay.total)} {BASKET_COPY.withGstBilled}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/pricing#compare" className="px-0.5 py-1.5 text-[15px] font-semibold text-ink underline decoration-rattan decoration-2 underline-offset-[5px]">{BASKET_COPY.compare}</Link>
          <BasketCta location="plans" />
        </div>
      </div>
    </div>
  );
}
