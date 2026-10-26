// components/blog/CategoryPills.tsx: "All posts" and one pill per category that has a published post.
import Link from "next/link";
import type { ReactElement } from "react";
import { BLOG_COPY } from "@/content/blog";
import type { CategoriesResponse } from "@/lib/cms/schema";

const PILL = "inline-flex h-[38px] flex-none items-center rounded-full border px-4 text-sm transition-colors duration-300 ease-[var(--ease)]";
const IDLE = "border-line bg-surface text-ink-2 hover:border-ink hover:text-ink";
const CURRENT = "border-ink bg-ink font-semibold text-action-ink";

/** `current` is a category slug, or null for the listing. */
export function CategoryPills({ categories, current }: { readonly categories: CategoriesResponse["categories"]; readonly current: string | null }): ReactElement | null {
  if (categories.length === 0) return null;
  return (
    <nav aria-label="Categories" className="mt-[30px] flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      <Link href="/blog" aria-current={current === null ? "page" : undefined} className={`${PILL} ${current === null ? CURRENT : IDLE}`}>{BLOG_COPY.listing.allPosts}</Link>
      {categories.map((category) => (
        <Link key={category.slug} href={`/blog/category/${category.slug}`} aria-current={current === category.slug ? "page" : undefined} className={`${PILL} ${current === category.slug ? CURRENT : IDLE}`}>{category.name}</Link>
      ))}
    </nav>
  );
}
