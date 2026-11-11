"use client";
import { Check, Plus } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties, ReactElement } from "react";
import { useBasket } from "@/components/basket/useBasket";
import { slotLabel } from "@/content/basket-card";
import { HOW, HOME_SERVICES, type HomeServiceId } from "@/content/platform-home";
import { basket } from "@/lib/basket-store";
import { basketPlans } from "@/lib/pricing";
import { SERVICE_META } from "./service-meta";

/** The deep end of each plan colour, so white type on a chosen tile passes contrast. */
const DEEP: Readonly<Record<HomeServiceId, string>> = {
  website: "var(--rattan-ink)",
  social: "var(--c-growth-2)",
  ads: "var(--c-search-2)",
};

/**
 * Step 1's selector: one tile per service, each adding or removing its plan in the page-wide basket (the last plan
 * cannot be removed, as on Pricing). Off: a white tile with the service's colour on its icon and a plus. On: the tile
 * fills with the service's colour and shows a tick.
 */
export function ServicePicker(): ReactElement {
  const pick = useBasket();
  return (
    <div role="group" aria-label={HOW.pickLabel} className="pick-grid">
      {HOME_SERVICES.map((service) => {
        const on = pick[service.id];
        const onlyOne = on && basketPlans(pick).length === 1;
        const { icon: Icon } = SERVICE_META[service.id];
        return (
          <button
            key={service.id}
            type="button"
            aria-pressed={on}
            aria-label={slotLabel(service.id, on)}
            aria-disabled={onlyOne ? true : undefined}
            onClick={() => basket.set(service.id, !on)}
            style={{ "--deep": DEEP[service.id] } as CSSProperties}
            className="pick-tile"
          >
            <span aria-hidden="true" className="pick-state">{on ? <Check weight="bold" className="size-3" /> : <Plus weight="bold" className="size-3" />}</span>
            <Icon aria-hidden="true" weight={on ? "fill" : "duotone"} className="pick-icon" />
            <span aria-hidden="true" className="pick-name">{service.short}</span>
          </button>
        );
      })}
    </div>
  );
}
