// lib/blog/feed.ts: the blog's RSS 2.0 document.
import type { PostCard } from "@/lib/cms/schema";
import { siteConfig } from "@/lib/site-config";

export const escapeXml = (text: string): string => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** `built` is the feed's lastBuildDate, passed in so the output is the same for the same input. */
export function buildFeed(posts: readonly PostCard[], built: Date): string {
  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.slug}`;
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        ...(post.publishedAt === null ? [] : [`<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`]),
        ...(post.category === null ? [] : [`<category>${escapeXml(post.category.name)}</category>`]),
        `<description>${escapeXml(post.excerpt)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>',
    `<title>${escapeXml(`${siteConfig.name} blog`)}</title>`,
    `<link>${siteConfig.url}/blog</link>`,
    `<atom:link href="${siteConfig.url}/blog/feed.xml" rel="self" type="application/rss+xml"/>`,
    "<description>Guides on websites, Google, social and AI search for local businesses.</description>",
    "<language>en-IN</language>",
    `<lastBuildDate>${built.toUTCString()}</lastBuildDate>`,
    items,
    "</channel></rss>",
  ].join("");
}
