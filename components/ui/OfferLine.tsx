import type { ReactElement } from "react";
import { offerFor } from "@/content/home";
import type { Currency } from "@/lib/currency";

/** The approved offer: ₹0 to build + ₹2,999/month to keep it running, incl. GST (dollars: $0 + $65/month, no tax wording). Copy is locked and lives in offerFor. */
export function OfferLine({ currency }: { readonly currency: Currency }): ReactElement {
  const offer = offerFor(currency);
  return (
    <div aria-label={offer.ariaLabel} className="inline-flex max-w-full items-stretch rounded-[18px] border border-line bg-surface shadow-[var(--shadow-offer)]">
      <div className="grid min-w-0 gap-0.5 px-[18px] py-3 max-[420px]:px-3 max-[420px]:py-2.5">
        <b className="num font-display text-[clamp(26px,2.6vw,32px)] font-medium leading-[1.05] tracking-[-0.03em] text-rattan-text">{offer.build.price}</b>
        <span className="text-[13px] text-ink-2">{offer.build.label}</span>
      </div>
      <span aria-hidden="true" className="grid place-items-center px-0.5 font-display text-[22px] text-ink-2">+</span>
      <div className="grid min-w-0 gap-0.5 border-l border-dashed border-line px-[18px] py-3 max-[420px]:px-3 max-[420px]:py-2.5">
        <b className="num font-display text-[clamp(26px,2.6vw,32px)] font-medium leading-[1.05] tracking-[-0.03em]">{offer.run.price}<small className="ml-0.5 font-sans text-[13px] font-medium tracking-normal text-ink-2">{offer.run.unit}</small></b>
        <span className="text-[13px] text-ink-2">{offer.run.label}</span>
      </div>
    </div>
  );
}
