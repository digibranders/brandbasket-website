"use client";
import type { ReactElement } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { BasketCta } from "@/components/basket/BasketCta";
import { useBasket } from "@/components/basket/useBasket";
import { Band } from "@/components/ui/Band";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BASKET_COPY, moneyCopy, offerNote } from "@/content/basket";
import { formatMoney } from "@/lib/currency";
import { basketPlans, packageTotal } from "@/lib/pricing";

/**
 * A dark band in the middle of the long pricing page: the basket as it stands (plans, monthly total, what it saves) and
 * the way to start. It reads the same basket as the hero card and the "Add to basket" buttons, so it updates as they change.
 * The band carries data-dock-hide, so the basket dock steps aside while this dark band is on screen.
 */
export function BasketBand(): ReactElement {
  const pick = useBasket();
  const currency = useCurrency();
  const names = basketPlans(pick).map((plan) => plan.name).join(" + ");
  return (
    <Band tone="ink" className="mb-[clamp(56px,7vw,96px)]">
      <section data-dock-hide aria-labelledby="h-basket-band" className="in-wrap py-[clamp(48px,6vw,80px)]">
        <div className="grid items-center gap-8 min-[1000px]:grid-cols-[1fr_auto] min-[1000px]:gap-16">
          <div data-basket-total>
            <h2 id="h-basket-band" className="font-display text-[clamp(18px,1.7vw,24px)] font-medium leading-[1.2] tracking-[-0.02em] text-action-ink/68">
              {BASKET_COPY.basketPrefix} {names}
            </h2>
            <p aria-live="polite" aria-atomic="true" className="num mt-2.5 font-display text-[clamp(40px,5vw,72px)] font-bold leading-none tracking-[-0.045em]">
              {formatMoney(packageTotal(pick, currency), currency)}
              <small className="ml-2 font-sans text-[clamp(15px,1.4vw,18px)] font-medium tracking-normal text-action-ink/68">{moneyCopy(currency).inclGst}</small>
            </p>
            <p className="mt-4 max-w-[52ch] text-[15.5px] leading-[1.55] text-action-ink/74">{offerNote(pick, currency)}</p>
          </div>
          <div className="cta-pair">
            <BasketCta location="pricing_band" tone="inverse" label={BASKET_COPY.startPlan} anchor="dock" />
            <WhatsAppButton location="pricing_band" tone="inverse" />
          </div>
        </div>
      </section>
    </Band>
  );
}
