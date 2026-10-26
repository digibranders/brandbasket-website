"use client";
import type { ReactElement } from "react";
import { PRIMARY_CTA } from "@/content/navigation";
import type { PanelAnchor } from "./basket-panel";
import { BasketTrigger } from "./BasketTrigger";

interface BasketCtaProps {
  readonly location: string;
  readonly size?: "md" | "sm";
  readonly tone?: "action" | "inverse";
  readonly label?: string;
  /** What to say instead of the label on a phone. */
  readonly short?: string;
  /** Where the basket pop-up opens: under the nav (top of the page) or above the dock (the foot of the page). */
  readonly anchor?: PanelAnchor;
}

/**
 * The main button of a page section: it opens the basket pop-up (owner, 2026-10-26), and the pop-up's own button is the
 * one that leaves for the app with the picked plans (signupHref in BasketSummary).
 */
export function BasketCta({ location, size = "md", tone = "action", label = PRIMARY_CTA.label, short, anchor = "nav" }: BasketCtaProps): ReactElement {
  return <BasketTrigger anchor={anchor} location={location} label={label} size={size} tone={tone} short={short} />;
}
