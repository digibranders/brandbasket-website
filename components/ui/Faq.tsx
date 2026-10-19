import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import type { FaqItem } from "@/content/types";
import { faqJsonLd } from "@/lib/seo/jsonld";

interface FaqProps {
  readonly items: readonly FaqItem[];
  readonly id: string;
}

/** Plain FAQ list plus its FAQPage JSON-LD. The first item starts open. */
export function Faq({ items, id }: FaqProps): ReactElement {
  return (
    <div className="grid">
      {items.map((item, i) => (
        <details key={item.q} name={id} open={i === 0} className="faq-item group border-t border-line last-of-type:border-b">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-[19px] font-medium tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus aria-hidden="true" className="size-[22px] flex-none text-rattan-text transition-transform duration-[400ms] group-open:rotate-45" />
          </summary>
          <p className="max-w-[62ch] pb-5 text-ink-2">{item.a}</p>
        </details>
      ))}
      <JsonLd data={faqJsonLd(items)} />
    </div>
  );
}
