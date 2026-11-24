import type { ReactElement } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { faqCountFor } from "@/content/faq";
import type { Currency } from "@/lib/currency";

/** The way from a short FAQ block to the full FAQ page. The count follows the currency, because the dollar page has no GST questions. */
export function FaqAllLink({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <div className="mt-7 grid">
      <ArrowLink href="/faq">{`See all ${faqCountFor(currency)} questions`}</ArrowLink>
    </div>
  );
}
