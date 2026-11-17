"use client";
import { Check, Plus } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { useBasket } from "@/components/basket/useBasket";
import { useMonitoring } from "@/components/basket/useMonitoring";
import { monitoringSlotLabel } from "@/content/basket-card";
import { MONITORING_BUTTON } from "@/content/pricing";
import { monitoring } from "@/lib/basket-store";
import { monitoringIncluded } from "@/lib/pricing";

const PILL = "inline-flex h-[52px] items-center gap-2.5 rounded-full px-6 font-display text-[15.5px] font-semibold tracking-[-0.01em]";

/**
 * Adds Dedicated Expert Monitoring to the page-wide basket, or takes it out, like a plan's "Add to basket". With all three
 * plans in the basket it is already included, so the button gives way to a plain line saying so: nothing to click.
 */
export function MonitoringBasketButton(): ReactElement {
  const pick = useBasket();
  const added = useMonitoring();
  if (monitoringIncluded(pick)) {
    return (
      <p className={`${PILL} bg-action-ink/[0.08] text-action-ink`}>
        <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-rattan text-ink"><Check weight="bold" className="size-3.5" /></span>
        {MONITORING_BUTTON.included}
      </p>
    );
  }
  return (
    <button
      type="button"
      aria-pressed={added}
      aria-label={monitoringSlotLabel(added)}
      onClick={() => monitoring.set(!added)}
      className={`${PILL} cursor-pointer border-[1.5px] transition-[colors,transform] duration-300 ease-[var(--ease)] active:scale-[0.98] ${added ? "border-transparent bg-rattan text-ink" : "border-action-ink/30 text-action-ink hover:border-action-ink"}`}
    >
      <span aria-hidden="true" className={`grid size-6 place-items-center rounded-full ${added ? "bg-ink text-rattan" : "bg-rattan text-ink"}`}>
        {added ? <Check weight="bold" className="size-3.5" /> : <Plus weight="bold" className="size-3.5" />}
      </span>
      {added ? MONITORING_BUTTON.added : MONITORING_BUTTON.add}
    </button>
  );
}
