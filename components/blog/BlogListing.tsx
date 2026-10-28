// components/blog/BlogListing.tsx: the blog's front page and its later pages (docs/design/blog-mock.html, listing A:
// the newest post large, the rest in two columns). Page 1 is /blog, page n is /blog/page/<n>.
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { BLOG_COPY } from "@/content/blog";
import { getCategories, getPostsPage } from "@/lib/cms/blog";
import { CategoryPills } from "./CategoryPills";
import { Pager } from "./Pager";
import { FeaturedPost, GuideTile } from "./PostCard";

export async function BlogListing({ page }: { readonly page: number }): Promise<ReactElement> {
  const [data, { categories }] = await Promise.all([getPostsPage(page), getCategories()]);
  // Past the last page there is nothing to show. An empty blog still has a page 1.
  if (page > Math.max(data.pages, 1)) notFound();
  const [first, ...rest] = data.posts;
  const featured = page === 1 ? first : undefined;
  const grid = page === 1 ? rest : data.posts;
  return (
    <div className="in-wrap pb-24 pt-32">
      <header className="max-w-[860px]">
        <h1 className="font-display text-[clamp(40px,5.4vw,72px)] font-normal leading-none tracking-[-0.05em]">
          {BLOG_COPY.listing.h1Lead} <em className="pivot">{BLOG_COPY.listing.h1Pivot}</em>
        </h1>
        <p className="mt-4 max-w-[64ch] text-[18.5px] leading-[1.55] text-ink-2">{BLOG_COPY.listing.lede}</p>
      </header>
      <CategoryPills categories={categories} current={null} />
      {data.posts.length === 0 ? <p className="mt-14 text-[17.5px] text-ink-2">{BLOG_COPY.listing.empty}</p> : null}
      {featured === undefined ? null : <FeaturedPost post={featured} />}
      {grid.length === 0 ? null : (
        <section aria-labelledby="h-guides" className="mt-16 border-t border-line pt-12">
          <h2 id="h-guides" className="font-display text-[clamp(26px,2.8vw,34px)] font-medium tracking-[-0.03em]">{BLOG_COPY.listing.allGuides}</h2>
          <div className="mt-8 grid gap-6 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3">
            {grid.map((post) => <GuideTile key={post.slug} post={post} />)}
          </div>
        </section>
      )}
      <Pager page={page} pages={data.pages} />
    </div>
  );
}
