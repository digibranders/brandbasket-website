import Link from "next/link";
import type { ReactElement } from "react";
import { PRICING_CTA } from "@/content/navigation";

/** Secondary pricing action in the homepage hero, styled like the basket's "Compare all plans" link (owner's request, 2026-10-22). */
export function PricingButton(): ReactElement {
  return (
    <Link href={PRICING_CTA.href} className="inline-flex min-h-11 items-center whitespace-nowrap px-0.5 py-1.5 text-[15px] font-semibold text-ink underline decoration-rattan decoration-2 underline-offset-[5px]">
      {PRICING_CTA.label}
    </Link>
  );
}
