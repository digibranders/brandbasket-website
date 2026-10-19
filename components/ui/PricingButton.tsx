import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";
import { PRICING_CTA } from "@/content/navigation";

/** Secondary action shared by the homepage hero and desktop navigation. */
export function PricingButton({ compact = false }: { readonly compact?: boolean }): ReactElement {
  return (
    <Link href={PRICING_CTA.href} className={`group inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface font-semibold text-ink transition-colors hover:border-rattan hover:bg-rattan-wash ${compact ? "px-4 text-sm" : "px-5 py-3 text-[15px]"}`}>
      {PRICING_CTA.label}
      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
