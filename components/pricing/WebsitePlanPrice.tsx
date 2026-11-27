"use client";

import type { ReactElement } from "react";
import { SiteKindSwitch } from "@/components/basket/SiteKindSwitch";
import { useSiteKind } from "@/components/basket/useSiteKind";
import { BASKET_COPY } from "@/content/basket";
import { SITE_KIND_COPY } from "@/content/home";
import { type Currency, formatMoney } from "@/lib/currency";
import { planPrice, planUsualPrice, siteBuildPrice } from "@/lib/pricing";

/**
 * The Website Management plan card's price: the B2B / ecommerce switch, the monthly price with its usual price struck
 * through, and the build price beside it. It follows the page-wide choice, so the basket and the total agree (owner, 2026-11-27).
 */
export function WebsitePlanPrice({ currency, priceNote }: { readonly currency: Currency; readonly priceNote: string }): ReactElement {
  const kind = useSiteKind();
  return (
    <div className="col-span-full mt-3.5 grid justify-items-start gap-3">
      <SiteKindSwitch />
      <p className="num font-display text-[clamp(40px,4vw,52px)] font-medium leading-none tracking-[-0.045em]">
        <span className="whitespace-nowrap">
          <s className="mr-2 text-[clamp(20px,2vw,24px)] tracking-[-0.02em] text-ink-2 decoration-rattan-text decoration-1"><span className="sr-only">{BASKET_COPY.was} </span>{formatMoney(planUsualPrice("website", currency, kind), currency)}</s>
          {formatMoney(planPrice("website", currency, kind), currency)}
        </span>
        <small className="mt-1 block font-sans text-sm font-medium tracking-normal text-ink-2">{priceNote}</small>
      </p>
      <p className="num text-[15px] font-medium">
        <b className="font-display text-[20px] font-medium tracking-[-0.02em]">{formatMoney(siteBuildPrice(kind, currency), currency)}</b>{" "}
        <span className="text-ink-2">{SITE_KIND_COPY[kind].label}</span>
      </p>
    </div>
  );
}
