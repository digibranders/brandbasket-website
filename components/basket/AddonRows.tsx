"use client";
import type { ReactElement } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { BASKET_COPY, PRICING_PLANS } from "@/content/basket";
import { basket } from "@/lib/basket-store";
import { formatMoney } from "@/lib/currency";
import { isPlanPaused, PLAN_IDS, planPrice } from "@/lib/pricing";
import { ComingSoonChip } from "../ui/ComingSoonChip";
import { Switch } from "../ui/Switch";
import { PLAN_COLOUR } from "./basket-view";
import { useBasket } from "./useBasket";

/**
 * Pricing hero plan rows (mock: .phc-act .adds). A click anywhere on a row toggles it; the row is not focusable
 * because keyboard users reach the switch.
 */
export function AddonRows(): ReactElement {
  const pick = useBasket();
  const currency = useCurrency();
  return (
    <div>
      <p className="mb-2 text-sm text-ink-2">{BASKET_COPY.heroIntro}</p>
      {PLAN_IDS.map((id) => {
        const copy = PRICING_PLANS[id];
        const paused = isPlanPaused(id);
        return (
          <div
            key={id}
            onClick={paused ? undefined : () => basket.set(id, !basket.get()[id])}
            className={`grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3.5 border-t border-line py-3.5 last:border-b ${paused ? "" : "cursor-pointer"}`}
          >
            <i aria-hidden="true" className={`size-3 rounded-[4px] ${PLAN_COLOUR[id]}`} />
            <span>
              <b className="block font-display text-[19px] font-medium tracking-[-0.02em]">{copy.name}</b>
              <span className="text-[13.5px] text-ink-2">{copy.summary}</span>
            </span>
            <span className="num whitespace-nowrap font-display text-lg">{formatMoney(planPrice(id, currency), currency)}</span>
            {paused ? <ComingSoonChip /> : <Switch checked={pick[id]} label={copy.switchLabel} onChange={() => basket.set(id, !basket.get()[id])} />}
          </div>
        );
      })}
    </div>
  );
}
