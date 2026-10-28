// components/blog/PostCard.tsx: the post as the listings show it. The whole card is one link, so the category is plain
// text here (it is a link on the post page).
import Link from "next/link";
import type { ReactElement } from "react";
import type { PostCard as Card } from "@/lib/cms/schema";
import { Avatar } from "./Avatar";
import { PostMeta } from "./PostMeta";
import { Thumb } from "./Thumb";

const TILE_SIZES = "(min-width: 1280px) 380px, (min-width: 860px) 30vw, (min-width: 640px) 45vw, 100vw";
const CARD_SIZES = "(min-width: 1280px) 600px, (min-width: 860px) 45vw, 100vw";
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

/** The newest post, large, with its byline (listing option A). */
export function FeaturedPost({ post }: { readonly post: Card }): ReactElement {
  return (
    <Link href={`/blog/${post.slug}`} className="group mt-11 grid items-center gap-5 rounded-[30px] bg-surface p-3.5 shadow-[0_0_0_1px_var(--line-2),var(--shadow)] min-[860px]:grid-cols-[1.35fr_1fr] min-[860px]:gap-11">
      <Thumb image={post.cover} sizes="(min-width: 860px) 60vw, 100vw" priority className="rounded-[20px]" />
      <div className="grid gap-3.5 px-1.5 pb-2.5 min-[860px]:py-3 min-[860px]:pl-0 min-[860px]:pr-[18px]">
        {post.category === null ? null : <span className={CATEGORY}>{post.category.name}</span>}
        <h2 className={`${TITLE} text-[clamp(26px,2.6vw,36px)]`}>{post.title}</h2>
        <p className="line-clamp-3 leading-[1.55] text-ink-2">{post.excerpt}</p>
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

/**
 * One guide on the listing, boxed so each reads as its own post: cover, topic, title, a short summary and the date. The boxes in a
 * row stretch to one height and the date sits at the foot of each.
 */
export function GuideTile({ post }: { readonly post: Card }): ReactElement {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid grid-rows-[auto_1fr] gap-4 rounded-[26px] bg-surface p-3 shadow-[0_0_0_1px_var(--line-2),var(--shadow)] transition-transform duration-[400ms] ease-[var(--ease)] hover:-translate-y-1 active:translate-y-0">
      <Thumb image={post.cover} sizes={TILE_SIZES} className="rounded-[18px]" />
      <div className="flex flex-col gap-2.5 px-2 pb-2">
        {post.category === null ? null : <span className={CATEGORY}>{post.category.name}</span>}
        <h3 className={`${TITLE} text-[21px]`}>{post.title}</h3>
        <p className="line-clamp-3 text-[15.5px] leading-[1.55] text-ink-2">{post.excerpt}</p>
        <PostMeta publishedAt={post.publishedAt} minutes={post.readingMinutes} className="mt-auto pt-2" />
      </div>
    </Link>
  );
}
