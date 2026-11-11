"use client";
import { Check, Plus } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties, ReactElement } from "react";
import { useBasket } from "@/components/basket/useBasket";
import { slotLabel } from "@/content/basket-card";
import { HOW, HOME_SERVICES } from "@/content/platform-home";
import { basket } from "@/lib/basket-store";
import { basketPlans } from "@/lib/pricing";
import { SERVICE_META } from "./service-meta";

/** Step 1's chips: each one adds or removes its plan in the page-wide basket. The last plan cannot be removed, as on Pricing. */
export function ServicePicker(): ReactElement {
  const pick = useBasket();
  return (
    <div role="group" aria-label={HOW.pickLabel} className="flex flex-wrap gap-2">
      {HOME_SERVICES.map((service) => {
        const on = pick[service.id];
        const onlyOne = on && basketPlans(pick).length === 1;
        return (
          <button
            key={service.id}
            type="button"
            aria-pressed={on}
            aria-label={slotLabel(service.id, on)}
            aria-disabled={onlyOne ? true : undefined}
            onClick={() => basket.set(service.id, !on)}
            style={{ "--tone": SERVICE_META[service.id].tone } as CSSProperties}
            className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full pl-2.5 pr-3.5 text-[14px] font-semibold transition-[background-color,color,transform] duration-300 ease-[var(--ease)] active:scale-[0.97] aria-disabled:cursor-not-allowed ${on ? "bg-ink text-action-ink" : "border border-ink/15 bg-surface text-ink hover:border-ink/40"}`}
          >
            <span aria-hidden="true" className={`grid size-5 place-items-center rounded-full ${on ? "bg-rattan text-ink" : "bg-[color-mix(in_srgb,var(--tone)_14%,var(--surface))] text-[var(--tone)]"}`}>
              {on ? <Check weight="bold" className="size-3" /> : <Plus weight="bold" className="size-3" />}
            </span>
            {service.short}
          </button>
        );
      })}
    </div>
  );
}
