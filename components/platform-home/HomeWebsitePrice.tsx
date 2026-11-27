"use client";

import type { ReactElement } from "react";
import { useSiteKind } from "@/components/basket/useSiteKind";
import { BASKET_COPY } from "@/content/basket";
import { SITE_KIND_COPY } from "@/content/home";
import { type Currency, formatMoney } from "@/lib/currency";
import { planPrice, planUsualPrice, siteBuildPrice } from "@/lib/pricing";

/** The homepage Website Management card's price: the monthly price for the chosen kind of website, its build price, (owner, 2026-11-27). The switch sits under the plan name (HomePricing), so the card stays short. */
export function HomeWebsitePrice({ currency, priceNote }: { readonly currency: Currency; readonly priceNote: string }): ReactElement {
  const kind = useSiteKind();
  return (
    <div className="grid justify-items-end gap-1.5 max-[560px]:justify-items-start">
      <p className="num text-right font-display text-[clamp(32px,3vw,42px)] font-semibold leading-none tracking-[-0.045em] max-[560px]:text-left">
        <s className="mr-2 text-[17px] font-medium tracking-[-0.01em] text-ink-2 decoration-rattan-text decoration-1"><span className="sr-only">{BASKET_COPY.was} </span>{formatMoney(planUsualPrice("website", currency, kind), currency)}</s>
        {formatMoney(planPrice("website", currency, kind), currency)}
        <small className="mt-1.5 block font-sans text-[13.5px] font-medium tracking-normal text-ink-2">{priceNote}</small>
      </p>
      <p className="num text-[14px] text-ink-2"><b className="font-display text-[17px] font-medium text-ink">{formatMoney(siteBuildPrice(kind, currency), currency)}</b> {SITE_KIND_COPY[kind].label}</p>
    </div>
  );
}
