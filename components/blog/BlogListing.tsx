// components/blog/BlogListing.tsx: the blog's front page and its later pages (docs/design/blog-mock.html, redesigned 2026-10-28:
// the newest post large beside a stack of the next three, the rest in three columns). Page 1 is /blog, page n is /blog/page/<n>.
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { BLOG_COPY } from "@/content/blog";
import { getCategories, getPostsPage } from "@/lib/cms/blog";
import { CategoryPills } from "./CategoryPills";
import { Pager } from "./Pager";
import { LatestPost, LeadPost, PostCard } from "./PostCard";

/** The newest posts shown beside the lead post on page 1. */
const LATEST_COUNT = 3;

export async function BlogListing({ page }: { readonly page: number }): Promise<ReactElement> {
  const [data, { categories }] = await Promise.all([getPostsPage(page), getCategories()]);
  // Past the last page there is nothing to show. An empty blog still has a page 1.
  if (page > Math.max(data.pages, 1)) notFound();
  const [first, ...rest] = data.posts;
  const lead = page === 1 ? first : undefined;
  const latest = page === 1 ? rest.slice(0, LATEST_COUNT) : [];
  const grid = page === 1 ? rest.slice(LATEST_COUNT) : data.posts;
  return (
    <>
      <section aria-labelledby="h-blog" className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:var(--hero)] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
        <div className="in-wrap relative pb-10 pt-32">
          <h1 id="h-blog" className="max-w-[18ch] font-display text-[clamp(40px,5.4vw,72px)] font-normal leading-none tracking-[-0.05em]">
            {BLOG_COPY.listing.h1Lead} <em className="pivot">{BLOG_COPY.listing.h1Pivot}</em>
          </h1>
          <p className="mt-4 max-w-[56ch] text-[18.5px] leading-[1.55] text-ink-2">{BLOG_COPY.listing.lede}</p>
          <CategoryPills categories={categories} current={null} />
        </div>
      </section>
      <div className="in-wrap pb-24">
        {data.posts.length === 0 ? <p className="text-[17.5px] text-ink-2">{BLOG_COPY.listing.empty}</p> : null}
        {lead === undefined ? null : (
          <div className="grid gap-12 min-[1000px]:grid-cols-[1.4fr_1fr] min-[1000px]:gap-14">
            <LeadPost post={lead} />
            {latest.length === 0 ? null : (
              <aside aria-labelledby="h-latest" className="min-w-0">
                <h2 id="h-latest" className="mb-5 font-display text-[22px] font-medium tracking-[-0.025em]">{BLOG_COPY.listing.latest}</h2>
                {latest.map((post) => <LatestPost key={post.slug} post={post} />)}
              </aside>
            )}
          </div>
        )}
        {grid.length === 0 ? null : (
          <div className={`grid gap-x-8 gap-y-10 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3 ${lead === undefined ? "" : "mt-16 border-t border-line pt-14"}`}>
            {grid.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        )}
        <Pager page={page} pages={data.pages} />
      </div>
    </>
  );
}
