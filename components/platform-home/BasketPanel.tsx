"use client";
import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { BasketStage } from "@/components/basket/BasketStage";
import { useBasket } from "@/components/basket/useBasket";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { BASKET_COPY, moneyCopy, offerNote } from "@/content/basket";
import { HOME_PRICING } from "@/content/platform-home";
import { monitoringNote } from "@/content/pricing";
import { formatMoney } from "@/lib/currency";
import { basketPlans, monitoringIncluded, packageTotal } from "@/lib/pricing";

/**
 * The homepage plans section's live basket: the woven 3D basket fills as plans are chosen, with the monthly total, the
 * package offer and the monitoring line under it. It reads the same basket as the dock and every plan button.
 */
export function BasketPanel(): ReactElement {
  const pick = useBasket();
  const currency = useCurrency();
  const names = basketPlans(pick).map((plan) => plan.name).join(" + ");
  return (
    <div className="basket-weave grid gap-5 overflow-hidden rounded-[32px] px-[clamp(18px,2.4vw,30px)] pb-[clamp(20px,2.4vw,30px)] pt-2">
      <BasketStage label="A woven basket that fills with the plans you choose" />
      <div data-basket-total className="grid gap-2">
        <p className="text-[15px] font-medium text-ink-2">{BASKET_COPY.basketPrefix} {names}</p>
        <p aria-live="polite" aria-atomic="true" className="num font-display text-[clamp(40px,4vw,56px)] font-bold leading-none tracking-[-0.045em]">
          {formatMoney(packageTotal(pick, currency), currency)}
          <small className="ml-2 font-sans text-[15px] font-medium tracking-normal text-ink-2">{moneyCopy(currency).inclGst}</small>
        </p>
        <p className="text-[14.5px] leading-[1.5] text-ink-2">{offerNote(pick, currency)}</p>
        <p className="text-[14.5px] font-medium leading-[1.5] text-rattan-ink">{monitoringNote(monitoringIncluded(pick), currency)}</p>
      </div>
      <div><BasketCta location="home_pricing" label={HOME_PRICING.start} anchor="dock" /></div>
    </div>
  );
}
