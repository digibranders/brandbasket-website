// e2e/cms-fixture-server.mjs: stands in for the CMS during e2e tests and CI. It serves the golden JSON the CMS's own
// tests write (e2e/fixtures/cms/), so the blog is tested against the real contract without a database.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const PORT = Number(process.env.CMS_FIXTURE_PORT ?? 4010);
const TOKEN = process.env.CMS_SITE_TOKEN;
const load = (name) => JSON.parse(readFileSync(new URL(`./fixtures/cms/${name}.json`, import.meta.url), "utf8"));

const post = load("post");
const bare = load("post-preview-bare");
const { author, category } = load("author-and-category");
const { categories, sitemap } = load("categories-and-sitemap");
const card = load("post-card");
const second = post.related[0];
/** An address the post used to have: the CMS answers it with where the post lives now. */
const OLD_SLUG = "website-price-india";

// Fourteen posts, so the list has a second page at twelve to a page. The first two are the real fixtures.
const cards = [card, second, ...Array.from({ length: 12 }, (_, i) => ({ ...card, slug: `more-guide-${i + 1}`, title: `More guide ${i + 1}`, publishedAt: `2026-09-${String(28 - i).padStart(2, "0")}T04:30:00.000Z`, modifiedAt: `2026-09-${String(28 - i).padStart(2, "0")}T04:30:00.000Z` }))];
const bySlug = { [post.slug]: post, [second.slug]: { ...post, slug: second.slug, title: second.title, excerpt: second.excerpt, related: [] } };

const send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
};

createServer((req, res) => {
  const url = new URL(req.url, "http://fixture");
  if (req.headers.authorization !== `Bearer ${TOKEN}`) return send(res, 401, { error: "Unauthorized" });
  const path = url.pathname.replace(/^\/api\/site/, "");
  if (path === "/posts") {
    const perPage = Number(url.searchParams.get("perPage") ?? 12);
    const page = Number(url.searchParams.get("page") ?? 1);
    return send(res, 200, { posts: cards.slice((page - 1) * perPage, page * perPage), page, pages: Math.ceil(cards.length / perPage), total: cards.length });
  }
  const slug = decodeURIComponent(path.split("/")[2] ?? "");
  if (path.startsWith("/posts/")) {
    if (slug === OLD_SLUG) return send(res, 200, { redirect: post.slug });
    return bySlug[slug] ? send(res, 200, { post: bySlug[slug] }) : send(res, 404, { error: "Not found" });
  }
  if (path === "/categories") return send(res, 200, categories);
  if (path.startsWith("/categories/")) return slug === category.slug ? send(res, 200, { category, posts: [card, second] }) : send(res, 404, { error: "Not found" });
  if (path.startsWith("/authors/")) return slug === author.slug ? send(res, 200, { author, posts: [card, second] }) : send(res, 404, { error: "Not found" });
  if (path === "/sitemap") return send(res, 200, sitemap);
  if (path === "/preview") {
    const token = url.searchParams.get("token");
    if (token === "expired-token") return send(res, 410, { error: "This preview link has expired." });
    return token === "good-token" ? send(res, 200, { post: bare }) : send(res, 404, { error: "Not found" });
  }
  return send(res, 404, { error: "Not found" });
}).listen(PORT, () => console.log(`CMS fixture server on ${PORT}`));
