"use client";
import { Check, Plus } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { useBasket } from "@/components/basket/useBasket";
import { slotLabel } from "@/content/basket-card";
import { basket } from "@/lib/basket-store";
import { basketPlans, type PlanId } from "@/lib/pricing";

const LABEL = { add: "Add to basket", added: "In your basket" } as const;

/** Adds or removes a plan in the page-wide basket, the same one the hero card and the basket dock read. The last plan cannot be removed. */
export function PlanBasketButton({ id }: { readonly id: PlanId }): ReactElement {
  const pick = useBasket();
  const on = pick[id];
  const onlyOne = on && basketPlans(pick).length === 1;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={slotLabel(id, on)}
      aria-disabled={onlyOne ? true : undefined}
      onClick={() => basket.set(id, !on)}
      className={`group inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-[1.5px] px-6 font-display text-[15.5px] font-semibold tracking-[-0.01em] transition-[colors,transform] duration-300 ease-[var(--ease)] active:scale-[0.98] aria-disabled:cursor-not-allowed ${on ? "border-transparent bg-action text-action-ink" : "border-ink/20 text-ink hover:border-ink"}`}
    >
      <span aria-hidden="true" className={`grid size-6 place-items-center rounded-full ${on ? "bg-rattan text-ink" : "bg-rattan-wash text-rattan-ink"}`}>
        {on ? <Check weight="bold" className="size-3.5" /> : <Plus weight="bold" className="size-3.5" />}
      </span>
      {on ? LABEL.added : LABEL.add}
    </button>
  );
}
