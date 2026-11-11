"use client";
import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { BasketStage } from "@/components/basket/BasketStage";
import { useBasket } from "@/components/basket/useBasket";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { BASKET_COPY, moneyCopy } from "@/content/basket";
import { HOME_PRICING, HOME_SERVICES } from "@/content/platform-home";
import { monitoringNote } from "@/content/pricing";
import { formatMoney } from "@/lib/currency";
import { monitoringIncluded, monthlyTotal } from "@/lib/pricing";

/**
 * The homepage plans section's live basket: the woven 3D basket fills as plans are chosen, with the monthly total, the
 * monitoring line under it. It reads the same basket as the dock and every plan button.
 */
export function BasketPanel(): ReactElement {
  const pick = useBasket();
  const currency = useCurrency();
  // Short names ("Website + Social media") keep the label on one or two lines; the full names are on the plan cards.
  const names = HOME_SERVICES.filter((service) => pick[service.id]).map((service) => service.short).join(" + ");
  return (
    <div className="bp-card basket-weave">
      <div className="bp-stage"><BasketStage label="A woven basket that fills with the plans you choose" /></div>
      <div data-basket-total className="grid gap-1.5">
        <p className="text-[14px] font-medium text-ink-2">{BASKET_COPY.basketPrefix} {names}</p>
        <p aria-live="polite" aria-atomic="true" className="num font-display text-[clamp(34px,3.4vw,48px)] font-bold leading-none tracking-[-0.045em]">
          {formatMoney(monthlyTotal(pick, currency), currency)}
          <small className="ml-2 font-sans text-[14px] font-medium tracking-normal text-ink-2">{moneyCopy(currency).inclGst}</small>
        </p>
      </div>
      <div className="grid gap-1 text-[13.5px] leading-[1.45]">
        <p className="font-medium text-rattan-ink">{monitoringNote(monitoringIncluded(pick), currency)}</p>
      </div>
      <div><BasketCta location="home_pricing" label={HOME_PRICING.start} anchor="dock" /></div>
    </div>
  );
}
