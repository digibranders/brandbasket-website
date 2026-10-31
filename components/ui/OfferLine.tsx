import type { ReactElement } from "react";
import { BASKET_COPY } from "@/content/basket";
import { offerFor } from "@/content/home";
import type { Currency } from "@/lib/currency";

/** The usual price, struck through above the offer price. */
function Usual({ children }: { readonly children: string }): ReactElement {
  return (
    <s className="num font-display text-[15px] leading-none tracking-[-0.02em] text-ink-2 decoration-rattan-text decoration-2">
      <span className="sr-only">{BASKET_COPY.was} </span>
      {children}
    </s>
  );
}

/** The approved offer: ₹0 to build + ₹2,999/month to keep it running, incl. GST (dollars: $0 + $65/month, no tax wording), each with its usual price struck through. Copy is locked and lives in offerFor. */
export function OfferLine({ currency }: { readonly currency: Currency }): ReactElement {
  const offer = offerFor(currency);
  return (
    <div aria-label={offer.ariaLabel} className="inline-flex max-w-full items-stretch rounded-[18px] border border-line bg-surface shadow-[var(--shadow-offer)]">
      <div className="grid min-w-0 content-center gap-0.5 px-[18px] py-3 max-[420px]:px-3 max-[420px]:py-2.5">
        <Usual>{offer.build.was}</Usual>
        <b className="num font-display text-[clamp(26px,2.6vw,32px)] font-medium leading-[1.05] tracking-[-0.03em] text-rattan-text">{offer.build.price}</b>
        <span className="text-[13px] text-ink-2">{offer.build.label}</span>
      </div>
      <span aria-hidden="true" className="grid place-items-center px-0.5 font-display text-[22px] text-ink-2">+</span>
      <div className="grid min-w-0 content-center gap-0.5 border-l border-dashed border-line px-[18px] py-3 max-[420px]:px-3 max-[420px]:py-2.5">
        <Usual>{offer.run.was}</Usual>
        <b className="num font-display text-[clamp(26px,2.6vw,32px)] font-medium leading-[1.05] tracking-[-0.03em]">{offer.run.price}<small className="ml-0.5 font-sans text-[13px] font-medium tracking-normal text-ink-2">{offer.run.unit}</small></b>
        <span className="text-[13px] text-ink-2">{offer.run.label}</span>
      </div>
    </div>
  );
}
