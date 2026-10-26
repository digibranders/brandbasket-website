"use client";
import type { ReactElement } from "react";
import { trackAttrs } from "@/lib/analytics";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { PhoneLabel } from "@/components/ui/OutlineButton";
import { basketPanel, type PanelAnchor } from "./basket-panel";
import { useBasketPanel } from "./useBasketPanel";

interface BasketTriggerProps {
  readonly anchor: PanelAnchor;
  readonly location: string;
  readonly label: string;
  readonly size?: "md" | "sm";
  readonly tone?: "action" | "inverse";
  /** What to say instead of the label on a phone. */
  readonly short?: string;
}

/** A main button that opens the basket pop-up instead of leaving the page. Opening is reported as basket_open; closing is not. */
export function BasketTrigger({ anchor, location, label, size = "sm", tone = "action", short }: BasketTriggerProps): ReactElement {
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
      className={`${pillClasses(size, tone)} cursor-pointer`}
    >
      <PhoneLabel full={label} short={short} />
      <Arrow size={size} />
    </button>
  );
}
