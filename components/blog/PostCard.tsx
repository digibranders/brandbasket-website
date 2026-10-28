// components/blog/PostCard.tsx: the post as the listings show it. The whole card is one link, so the category is plain
// text here (it is a link on the post page).
import Link from "next/link";
import type { ReactElement } from "react";
import type { PostCard as Card } from "@/lib/cms/schema";
import { Avatar } from "./Avatar";
import { PostMeta } from "./PostMeta";
import { Thumb } from "./Thumb";

const CARD_SIZES = "(min-width: 1280px) 400px, (min-width: 1000px) 30vw, (min-width: 640px) 45vw, 100vw";
const CATEGORY = "text-[13.5px] font-semibold text-rattan-ink";
const TITLE = "font-display font-semibold leading-[1.18] tracking-[-0.025em]";

type Heading = "h2" | "h3";

export function PostCard({ post, heading = "h2", showExcerpt = true, showCategory = true }: { readonly post: Card; readonly heading?: Heading; readonly showExcerpt?: boolean; readonly showCategory?: boolean }): ReactElement {
  const Title = heading;
  return (
    <Link href={`/blog/${post.slug}`} className="group grid content-start gap-3.5">
      <Thumb image={post.cover} sizes={CARD_SIZES} />
      {showCategory && post.category !== null ? <span className={CATEGORY}>{post.category.name}</span> : null}
      <Title className={`${TITLE} ${heading === "h2" ? "text-[23px]" : "text-[19px]"}`}>{post.title}</Title>
      {showExcerpt ? <p className="line-clamp-2 leading-[1.55] text-ink-2">{post.excerpt}</p> : null}
      <PostMeta publishedAt={post.publishedAt} minutes={post.readingMinutes} />
    </Link>
  );
}

/** The newest post: a wide cover with the title, excerpt and byline under it. */
export function LeadPost({ post }: { readonly post: Card }): ReactElement {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid content-start gap-5">
      <Thumb image={post.cover} sizes="(min-width: 1000px) 56vw, 100vw" priority className="rounded-[28px] shadow-[0_0_0_1px_var(--line-2),var(--shadow)]" />
      <div className="grid gap-3.5">
        {post.category === null ? null : <span className={CATEGORY}>{post.category.name}</span>}
        <h2 className={`${TITLE} text-[clamp(28px,3vw,42px)]`}>{post.title}</h2>
        <p className="line-clamp-3 max-w-[60ch] text-[17px] leading-[1.55] text-ink-2">{post.excerpt}</p>
        {post.author === null ? null : (
          <div className="flex items-center gap-3">
            <Avatar name={post.author.name} />
            <div>
              <div className="text-[14.5px] font-semibold">{post.author.name}</div>
              <PostMeta publishedAt={post.publishedAt} minutes={post.readingMinutes} />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

/** A short ruled row for the stack beside the lead post: a small cover, the title and the date. */
export function LatestPost({ post }: { readonly post: Card }): ReactElement {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[112px_1fr] items-start gap-4 border-t border-line py-5 first:border-t-0 first:pt-0 min-[1000px]:grid-cols-[132px_1fr]">
      <Thumb image={post.cover} sizes="132px" className="rounded-[14px]" />
      <div className="grid gap-1.5">
        {post.category === null ? null : <span className={CATEGORY}>{post.category.name}</span>}
        <h3 className={`${TITLE} text-[18px]`}>{post.title}</h3>
        <PostMeta publishedAt={post.publishedAt} minutes={post.readingMinutes} />
      </div>
    </Link>
  );
}

/** A post as a row with its picture on the right (the author page). */
export function PostRow({ post }: { readonly post: Card }): ReactElement {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid items-center gap-4 border-b border-line py-7 min-[760px]:grid-cols-[1fr_300px] min-[760px]:gap-8">
      <div className="grid gap-2.5 min-[760px]:order-none">
        {post.category === null ? null : <span className={CATEGORY}>{post.category.name}</span>}
        <h3 className={`${TITLE} text-[clamp(22px,2.2vw,28px)]`}>{post.title}</h3>
        <PostMeta publishedAt={post.publishedAt} minutes={post.readingMinutes} />
      </div>
      <div className="order-first min-[760px]:order-none"><Thumb image={post.cover} sizes="300px" className="rounded-[18px]" /></div>
    </Link>
  );
}
