import type { ReactElement } from "react";
import { BASKET_COPY } from "@/content/basket";
import { BasketCard } from "./BasketCard";

/** Homepage basket panel: its heading, then the Basket Card (mock: #h-plans .addpanel, .ox-card). The plan rows were removed at the owner's request, 2026-10-21. */
export function AddonPanel(): ReactElement {
  return (
    <div className="mt-14 overflow-hidden rounded-[26px] border border-line bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5 px-[26px] pb-3.5 pt-[22px] max-[699px]:px-5">
        <h3 className="font-display text-[22px] font-medium tracking-[-0.03em]">{BASKET_COPY.panelTitle}</h3>
        <span className="text-sm text-ink-2">{BASKET_COPY.panelNote}</span>
      </div>
      <BasketCard />
    </div>
  );
}
