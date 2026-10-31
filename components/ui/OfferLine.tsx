import type { ReactElement } from "react";
import { BASKET_COPY } from "@/content/basket";
import { offerFor } from "@/content/home";
import type { Currency } from "@/lib/currency";

/** The usual price, struck through beside the offer price. */
function Usual({ children }: { readonly children: string }): ReactElement {
  return (
    <s className="num font-display text-[clamp(18px,1.7vw,22px)] leading-none tracking-[-0.02em] text-ink-2 decoration-rattan-text decoration-1">
      <span className="sr-only">{BASKET_COPY.was} </span>
      {children}
    </s>
  );
}

/** The approved offer: ₹0 to build + ₹2,999/month to keep it running, incl. GST (dollars: $0 + $65/month, no tax wording), each with its usual price struck through beside it. Copy is locked and lives in offerFor. */
export function OfferLine({ currency }: { readonly currency: Currency }): ReactElement {
  const offer = offerFor(currency);
  return (
    <div aria-label={offer.ariaLabel} className="inline-flex max-w-full items-stretch rounded-[18px] border border-line bg-surface shadow-[var(--shadow-offer)] max-[520px]:grid max-[520px]:w-full">
      <div className="grid min-w-0 content-center gap-1 px-5 py-3.5 max-[420px]:px-4 max-[420px]:py-3">
        <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <Usual>{offer.build.was}</Usual>
          <b className="num font-display text-[clamp(28px,2.7vw,34px)] font-medium leading-none tracking-[-0.035em] text-rattan-text">{offer.build.price}</b>
        </p>
        <span className="text-[13px] text-ink-2">{offer.build.label}</span>
      </div>
      <div className="grid min-w-0 content-center gap-1 border-l border-dashed border-line px-5 py-3.5 max-[520px]:border-l-0 max-[520px]:border-t max-[420px]:px-4 max-[420px]:py-3">
        <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <Usual>{offer.run.was}</Usual>
          <b className="num font-display text-[clamp(28px,2.7vw,34px)] font-medium leading-none tracking-[-0.035em]">{offer.run.price}</b>
          <small className="-ml-1.5 font-sans text-[13px] font-medium text-ink-2">{offer.run.unit}</small>
        </p>
        <span className="text-[13px] text-ink-2">{offer.run.label}</span>
      </div>
    </div>
  );
}
