"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { LEGAL_LABELS } from "@/content/legal/labels";

interface ContentsItem {
  readonly id: string;
  readonly heading: string;
}

interface LegalContentsProps {
  readonly items: readonly ContentsItem[];
}

/** Native anchors remain usable before hydration; only the reading position needs client state. */
export function LegalContents({ items }: LegalContentsProps): ReactElement {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const disclosureRef = useRef<HTMLDetailsElement>(null);
  const desktopRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = (): void => {
      frame = 0;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= 144) current = item.id;
      }
      setActiveId(current);
    };
    const schedule = (): void => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  useEffect(() => {
    const list = desktopRef.current;
    const link = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !link) return;
    // Scroll only the contents list, never the article or the browser viewport.
    if (link.offsetTop < list.scrollTop) list.scrollTop = link.offsetTop;
    else if (link.offsetTop + link.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = link.offsetTop + link.offsetHeight - list.clientHeight;
    }
  }, [activeId]);

  const links = (mobile: boolean): ReactElement => (
    <ol ref={mobile ? undefined : desktopRef} className="relative grid gap-1 overflow-y-auto overscroll-contain p-1 lg:max-h-[calc(100dvh-15rem)]">
      {items.map(({ id, heading }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            aria-current={activeId === id ? "location" : undefined}
            onClick={() => {
              if (mobile && disclosureRef.current) {
                // Collapse before the native anchor jump so it uses the final layout.
                disclosureRef.current.open = false;
                document.getElementById(id)?.focus({ preventScroll: true });
              }
              setActiveId(id);
            }}
            className="block rounded-[10px] border-l-2 border-transparent px-3 py-3 text-sm leading-relaxed text-ink-2 transition-colors hover:bg-sunken hover:text-ink aria-[current=location]:border-rattan aria-[current=location]:bg-rattan-wash aria-[current=location]:font-semibold aria-[current=location]:text-ink lg:py-2"
          >
            {heading}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <aside className="min-w-0 lg:sticky lg:top-28">
      <div className="hidden rounded-[18px] border border-line bg-surface p-4 lg:block">
        <h2 className="px-4 pb-3 pt-1 text-[13px] font-semibold text-ink">{LEGAL_LABELS.contents}</h2>
        <nav aria-label={LEGAL_LABELS.contents}>{links(false)}</nav>
      </div>
      <details ref={disclosureRef} className="group rounded-[18px] border border-line bg-surface lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          {LEGAL_LABELS.contents}
          <CaretDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label={LEGAL_LABELS.contents} className="border-t border-line p-2">{links(true)}</nav>
      </details>
    </aside>
  );
}
