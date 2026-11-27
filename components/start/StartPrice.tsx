"use client";

import type { ReactElement } from "react";
import { SiteKindSwitch } from "@/components/basket/SiteKindSwitch";
import { useSiteKind } from "@/components/basket/useSiteKind";
import { websiteOfferFor } from "@/content/home";
import type { Currency } from "@/lib/currency";

/** The two prices inside the start page's dark price card: the build price (plain) and the monthly price (usual price struck), for the chosen kind of website. */
export function StartPrice({ currency }: { readonly currency: Currency }): ReactElement {
  const offer = websiteOfferFor(useSiteKind(), currency);
  return (
    <>
      <SiteKindSwitch className="justify-self-start" />
      <div className="grid gap-1">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <b className="num font-display text-[clamp(40px,4.4vw,56px)] font-medium leading-none tracking-[-0.045em] text-[#e0b277]">{offer.build.price}</b>
        </p>
        <span className="text-sm text-action-ink/78">{offer.build.label}</span>
      </div>
      <div aria-hidden="true" className="border-t border-dashed border-action-ink/30" />
      <div className="grid gap-1">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <s className="num font-display text-[22px] leading-none text-action-ink/60 decoration-rattan"><span className="sr-only">Usually </span>{offer.run.was}</s>
          <b className="num font-display text-[clamp(40px,4.4vw,56px)] font-medium leading-none tracking-[-0.045em]">{offer.run.price}</b>
          <small className="font-sans text-[15px] font-medium text-action-ink/78">{offer.run.unit}</small>
        </p>
        <span className="text-sm text-action-ink/78">{offer.run.label}</span>
      </div>
    </>
  );
}
