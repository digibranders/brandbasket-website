import type { ReactElement } from "react";
import { OfferLine } from "@/components/ui/OfferLine";
import { websiteOfferFor } from "@/content/home";
import type { Currency } from "@/lib/currency";

export function WebsiteOffer({ currency }: { readonly currency: Currency }): ReactElement {
  return <OfferLine currency={currency} offer={websiteOfferFor("b2b", currency)} />;
}
