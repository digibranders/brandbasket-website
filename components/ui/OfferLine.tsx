import type { ReactElement } from "react";
import { formatInr, PLANS } from "@/lib/pricing";

/** The approved offer: ₹0 to build + ₹2,999/month to keep it running, + GST. Copy is locked. */
export function OfferLine(): ReactElement {
  const monthly = formatInr(PLANS.website.monthly);
  return (
    <div aria-label={`₹0 to build your website, plus ${monthly} a month plus GST to keep it running`} className="inline-flex max-w-full items-stretch rounded-[18px] border border-line bg-surface shadow-[0_14px_30px_-24px_rgba(40,28,14,0.35)]">
      <div className="grid min-w-0 gap-0.5 px-[18px] py-3 max-[420px]:px-3 max-[420px]:py-2.5">
        <b className="num font-display text-[clamp(26px,2.6vw,32px)] font-medium leading-[1.05] tracking-[-0.03em] text-rattan-text">₹0</b>
        <span className="text-[13px] text-ink-2">to build your website</span>
      </div>
      <span aria-hidden="true" className="grid place-items-center px-0.5 font-display text-[22px] text-ink-2">+</span>
      <div className="grid min-w-0 gap-0.5 border-l border-dashed border-line px-[18px] py-3 max-[420px]:px-3 max-[420px]:py-2.5">
        <b className="num font-display text-[clamp(26px,2.6vw,32px)] font-medium leading-[1.05] tracking-[-0.03em]">{monthly}<small className="ml-0.5 font-sans text-[13px] font-medium tracking-normal text-ink-2">/month</small></b>
        <span className="text-[13px] text-ink-2">to keep it running, + GST</span>
      </div>
    </div>
  );
}
