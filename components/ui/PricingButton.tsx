import type { ReactElement } from "react";
import { PRICING_CTA } from "@/content/navigation";
import { OutlineButton } from "./OutlineButton";

/** Secondary pricing action in the homepage hero, an outline pill beside the main button. */
export function PricingButton(): ReactElement {
  return <OutlineButton href={PRICING_CTA.href} location="hero_pricing">{PRICING_CTA.label}</OutlineButton>;
}
