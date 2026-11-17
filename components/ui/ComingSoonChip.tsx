import type { ReactElement } from "react";
import { BASKET_COPY } from "@/content/basket";

/** Marks a plan that is shown but not sold yet. The same chip as "Free build" on the service page's plan card. */
export function ComingSoonChip({ className = "" }: { readonly className?: string }): ReactElement {
  return <span className={`inline-block whitespace-nowrap rounded-full bg-rattan-wash px-2.5 py-[3px] text-xs font-semibold leading-[1.4] text-rattan-ink ${className}`}>{BASKET_COPY.comingSoon}</span>;
}
