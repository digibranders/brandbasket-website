import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import type { FaqItem } from "@/content/types";
import { faqJsonLd } from "@/lib/seo/jsonld";

interface FaqProps {
  readonly items: readonly FaqItem[];
  readonly id: string;
}

/**
 * The FAQ list plus its FAQPage JSON-LD, used by every page that has questions. One soft card per question; the open one
 * takes the rattan wash and its plus turns into a close mark. The first item starts open.
 */
export function Faq({ items, id }: FaqProps): ReactElement {
  return (
    <div className="grid gap-3">
      {items.map((item, i) => (
        <details
          key={item.q}
          name={id}
          open={i === 0}
          className="faq-item group overflow-hidden rounded-[20px] border border-line bg-surface transition-[border-color,background-color,box-shadow] duration-300 ease-[var(--ease)] hover:border-rattan/50 open:border-rattan/40 open:bg-[linear-gradient(180deg,var(--rattan-wash),var(--surface)_72%)] open:shadow-[var(--shadow-offer)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-[18px] font-display text-[18px] font-medium leading-[1.3] tracking-[-0.02em] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink min-[640px]:px-7 min-[640px]:py-5 min-[640px]:text-[19px] [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden="true" className="grid size-9 flex-none place-items-center rounded-full bg-sunken text-ink transition-[background-color,color,rotate] duration-[400ms] ease-[var(--ease)] group-hover:bg-rattan-wash group-open:rotate-45 group-open:bg-ink group-open:text-action-ink">
              <Plus weight="bold" className="size-[18px]" />
            </span>
          </summary>
          <p className="max-w-[62ch] px-5 pb-6 text-[16px] leading-[1.65] text-ink-2 min-[640px]:px-7">{item.a}</p>
        </details>
      ))}
      <JsonLd data={faqJsonLd(items)} />
    </div>
  );
}
