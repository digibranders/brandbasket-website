"use client";
import type { ReactElement } from "react";
import { PRIMARY_CTA } from "@/content/navigation";
import { signupHref } from "@/lib/signup";
import { ArrowButton } from "../ui/ArrowButton";
import { useBasket } from "./useBasket";

interface BasketCtaProps {
  readonly location: string;
  readonly size?: "md" | "sm";
  readonly tone?: "action" | "inverse";
  /** Overrides the approved label; only the Basket Card does, and only once sign-up is live. */
  readonly label?: string;
}

/** The main button inside basket-aware islands: the picked plans travel with the click. */
export function BasketCta({ location, size = "md", tone = "action", label = PRIMARY_CTA.label }: BasketCtaProps): ReactElement {
  return <ArrowButton href={signupHref(useBasket())} location={location} size={size} tone={tone}>{label}</ArrowButton>;
}
