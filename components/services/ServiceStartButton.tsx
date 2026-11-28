"use client";
import type { ReactElement } from "react";
import { setSiteKind } from "@/components/basket/useSiteKind";
import { basketPanel } from "@/components/basket/basket-panel";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { trackAttrs } from "@/lib/analytics";
import { basket } from "@/lib/basket-store";
import type { PlanId, SiteKind } from "@/lib/pricing";

interface ServiceStartButtonProps {
  readonly id: PlanId;
  readonly location: string;
  readonly label: string;
  readonly websiteKind?: SiteKind;
}

/** The main button of a service page: puts this plan in the basket and opens the basket pop-up, like every main button. */
export function ServiceStartButton({ id, location, label, websiteKind }: ServiceStartButtonProps): ReactElement {
  return (
    <button
      type="button"
      data-basket-trigger
      aria-haspopup="dialog"
      {...trackAttrs("basket_open", location)}
      onClick={(event) => {
        if (websiteKind !== undefined) setSiteKind(websiteKind);
        basket.set(id, true);
        basketPanel.open("nav", event.currentTarget);
      }}
      className={`${pillClasses("md", "action")} cursor-pointer`}
    >
      {label}
      <Arrow size="md" />
    </button>
  );
}
