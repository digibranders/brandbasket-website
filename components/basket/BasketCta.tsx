"use client";
import type { ReactElement } from "react";
import { PRIMARY_CTA } from "@/content/navigation";
import { signupHref } from "@/lib/signup";
import { ArrowButton } from "../ui/ArrowButton";
import { useBasket } from "./useBasket";

/** The main button inside basket-aware islands: the picked plans travel with the click. */
export function BasketCta({ size = "md" }: { readonly size?: "md" | "sm" }): ReactElement {
  return <ArrowButton href={signupHref(useBasket())} size={size}>{PRIMARY_CTA.label}</ArrowButton>;
}
