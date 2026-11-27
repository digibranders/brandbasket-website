"use client";

import type { ReactElement } from "react";
import { SiteKindSwitch } from "@/components/basket/SiteKindSwitch";
import { useSiteKind } from "@/components/basket/useSiteKind";
import { OfferLine } from "@/components/ui/OfferLine";
import { websiteOfferFor } from "@/content/home";
import type { Currency } from "@/lib/currency";

/** The Website Management hero's price card with the B2B / ecommerce switch under it (owner, 2026-11-27). The left box shows the build price of the chosen kind. */
export function WebsiteOffer({ currency }: { readonly currency: Currency }): ReactElement {
  const kind = useSiteKind();
  return (
    <div className="grid max-w-full justify-items-start gap-3 max-[520px]:w-full">
      <OfferLine currency={currency} offer={websiteOfferFor(kind, currency)} />
      <SiteKindSwitch />
    </div>
  );
}
