"use client";
// components/blog/TocRail.tsx: the one client island on a post page. It marks the section being read.
import { useEffect, useState, type ReactElement } from "react";

interface Entry {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3 | 4;
}

/** The heading that last crossed the top fifth of the screen. */
export function TocRail({ toc }: { readonly toc: readonly Entry[] }): ReactElement {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target.id);
          else seen.delete(entry.target.id);
        }
        const first = toc.find((item) => seen.has(item.id));
        if (first !== undefined) setCurrent(first.id);
      },
      { rootMargin: "0px 0px -80% 0px" },
    );
    for (const item of toc) {
      const heading = document.getElementById(item.id);
      if (heading !== null) observer.observe(heading);
    }
    return () => observer.disconnect();
  }, [toc]);
  return (
    <ol className="m-0 list-none border-l border-line p-0">
      {toc.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            aria-current={current === entry.id ? "true" : undefined}
            className={`-ml-px block border-l-2 py-[7px] pr-0 text-sm leading-[1.4] hover:text-ink ${entry.level > 2 ? "pl-7" : "pl-4"} ${current === entry.id ? "border-rattan font-semibold text-ink" : "border-transparent text-ink-2"}`}
          >
            {entry.text}
          </a>
        </li>
      ))}
    </ol>
  );
}
