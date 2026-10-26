// components/blog/Pager.tsx: "Page 2 of 3" with a link to each neighbour. Page 1 is /blog, every other page /blog/page/<n>.
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement } from "react";
import { BLOG_COPY } from "@/content/blog";

export const blogPagePath = (page: number): string => (page === 1 ? "/blog" : `/blog/page/${page}`);

const BUTTON = "inline-flex h-[46px] items-center gap-2.5 rounded-full border-[1.5px] border-ink/20 px-5 font-display text-[15px] font-semibold transition-colors duration-300 ease-[var(--ease)] hover:border-ink";

export function Pager({ page, pages }: { readonly page: number; readonly pages: number }): ReactElement | null {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-between gap-4 text-sm text-ink-2">
      {page > 1 ? <Link href={blogPagePath(page - 1)} rel="prev" className={BUTTON}><ArrowLeft aria-hidden="true" className="size-[18px]" />{BLOG_COPY.pager.newer}</Link> : <span />}
      <span className="num">Page {page} of {pages}</span>
      {page < pages ? <Link href={blogPagePath(page + 1)} rel="next" className={BUTTON}>{BLOG_COPY.pager.older}<ArrowRight aria-hidden="true" className="size-[18px]" /></Link> : <span />}
    </nav>
  );
}
