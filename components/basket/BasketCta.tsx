"use client";
import type { ReactElement } from "react";
import { PRIMARY_CTA } from "@/content/navigation";
import { signupHref } from "@/lib/signup";
import { ArrowButton } from "../ui/ArrowButton";
import { useBasket } from "./useBasket";

interface BasketCtaProps {
  readonly size?: "md" | "sm";
  readonly tone?: "action" | "inverse";
}

/** The main button inside basket-aware islands: the picked plans travel with the click. */
export function BasketCta({ size = "md", tone = "action" }: BasketCtaProps): ReactElement {
  return <ArrowButton href={signupHref(useBasket())} size={size} tone={tone}>{PRIMARY_CTA.label}</ArrowButton>;
}
