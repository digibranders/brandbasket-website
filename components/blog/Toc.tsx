// components/blog/Toc.tsx: "On this page". A collapsible box under 960px; from 960px the rail beside the article, whose
// current section TocRail marks.
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { BLOG_COPY } from "@/content/blog";
import type { Post } from "@/lib/cms/schema";
import { TocRail } from "./TocRail";

type Entry = Post["toc"][number];

export function TocBox({ toc }: { readonly toc: readonly Entry[] }): ReactElement | null {
  if (toc.length === 0) return null;
  return (
    <details className="group mb-9 rounded-[22px] bg-surface shadow-[0_0_0_1px_var(--line-2)] min-[960px]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-display text-base font-semibold [&::-webkit-details-marker]:hidden">
        {BLOG_COPY.post.toc}
        <CaretDown aria-hidden="true" className="size-4 transition-transform duration-[400ms] group-open:rotate-180" />
      </summary>
      <ol className="grid list-none gap-1 px-5 pb-[18px]">
        {toc.map((entry) => <li key={entry.id}><a href={`#${entry.id}`} className={`block py-1.5 text-[15px] leading-[1.4] text-ink-2 hover:text-ink ${entry.level > 2 ? "pl-4" : ""}`}>{entry.text}</a></li>)}
      </ol>
    </details>
  );
}

export function TocAside({ toc }: { readonly toc: readonly Entry[] }): ReactElement | null {
  if (toc.length === 0) return null;
  return (
    <aside aria-label={BLOG_COPY.post.toc} className="sticky top-28 hidden self-start min-[960px]:block">
      <h2 className="mb-2.5 font-display text-sm font-bold">{BLOG_COPY.post.toc}</h2>
      <TocRail toc={toc} />
    </aside>
  );
}
