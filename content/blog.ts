// content/blog.ts: the blog's own words (docs/design/blog-mock.html, copy approved 2026-10-23). Post, category and author
// pages take their words from the CMS. The empty state is new: it goes to the owner before it ships.
export const BLOG_COPY = {
  listing: {
    h1Lead: "Guides for",
    h1Pivot: "local businesses.",
    lede: "Websites, Google, social and AI search, explained by the team that runs them for our clients.",
    empty: "No posts yet. Check back soon.",
    allPosts: "All posts",
    allGuides: "All guides",
  },
  post: {
    toc: "On this page",
    faq: "Questions people ask",
    aboutAuthor: "About the author",
    relatedPrefix: "More on",
    relatedFallback: "More from the blog",
  },
  category: { allPosts: "All posts" },
  author: { postsBy: "Posts by" },
  preview: { bar: "Preview. Only people with this link can see it.", expired: "This preview link has expired. Ask for a new one from the CMS." },
  pager: { newer: "Newer posts", older: "Older posts" },
} as const;
