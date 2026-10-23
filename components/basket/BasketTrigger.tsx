"use client";
import type { ReactElement } from "react";
import { trackAttrs } from "@/lib/analytics";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { basketPanel, type PanelAnchor } from "./basket-panel";
import { useBasketPanel } from "./useBasketPanel";

interface BasketTriggerProps {
  readonly anchor: PanelAnchor;
  readonly location: string;
  readonly label: string;
  readonly size?: "md" | "sm";
}

/** A main button that opens the basket pop-up instead of leaving the page. Opening is reported as basket_open; closing is not. */
export function BasketTrigger({ anchor, location, label, size = "sm" }: BasketTriggerProps): ReactElement {
  const panel = useBasketPanel();
  const expanded = panel.open && panel.anchor === anchor;
  return (
    <button
      type="button"
      data-basket-trigger
      aria-haspopup="dialog"
      aria-expanded={expanded}
      {...(expanded ? {} : trackAttrs("basket_open", location))}
      onClick={(event) => basketPanel.toggle(anchor, event.currentTarget)}
      className={`${pillClasses(size, "action")} cursor-pointer`}
    >
      {label}
      <Arrow size={size} />
    </button>
  );
}
