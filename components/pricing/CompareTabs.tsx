"use client";
import { type ReactElement, type ReactNode, useState } from "react";

interface CompareTabsProps {
  readonly label: string;
  readonly baskets: readonly { readonly name: string; readonly price: string }[];
  /** The server-rendered table. At 760 px and below its cells hide by `group-data-[show=n]/cmp`. */
  readonly children: ReactNode;
}

/**
 * Phone basket picker for the comparison table (mock: .bk-tabs), at 760 px and below as in the mock. The buttons only
 * choose which column shows; from 761 px they are hidden and every column shows.
 */
export function CompareTabs({ label, baskets, children }: CompareTabsProps): ReactElement {
  const [show, setShow] = useState(0);
  return (
    <>
      <div role="group" aria-label={label} className="mb-3.5 hidden grid-cols-2 gap-2 max-[760.98px]:grid">
        {baskets.map((basket, i) => (
          <button
            key={basket.name}
            type="button"
            aria-pressed={show === i}
            onClick={() => setShow(i)}
            className="grid cursor-pointer gap-0.5 rounded-2xl border border-line bg-surface px-3.5 py-3 text-left text-ink transition-[border-color,box-shadow] duration-300 ease-[var(--ease)] aria-pressed:border-ink aria-pressed:shadow-[inset_0_0_0_1px_var(--ink)]"
          >
            <b className="font-display text-[15px] font-medium tracking-[-0.01em]">{basket.name}</b>
            <span className="num text-[13px] text-ink-2">{basket.price}</span>
          </button>
        ))}
      </div>
      <div data-show={show} className="group/cmp overflow-hidden rounded-[26px] border border-line bg-surface">
        {children}
      </div>
    </>
  );
}
