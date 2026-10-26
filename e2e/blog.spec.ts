// e2e/blog.spec.ts: the blog against the CMS fixture server (e2e/cms-fixture-server.mjs).
import { expect, test } from "@playwright/test";

const POST = "/blog/website-cost-india";

test.describe("listing", () => {
  test("shows the newest post large, the rest in a grid, and a link to the next page", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Guides for local businesses.");
    await expect(page.getByRole("link", { name: /What does a website cost in India\?/ }).first()).toHaveAttribute("href", POST);
    await expect(page.getByRole("navigation", { name: "Categories" }).getByRole("link", { name: "Website basics" })).toBeVisible();
    await expect(page.getByText("Page 1 of 2")).toBeVisible();
    await page.getByRole("link", { name: "Older posts" }).click();
    await expect(page).toHaveURL(/\/blog\/page\/2$/);
    await expect(page.getByText("Page 2 of 2")).toBeVisible();
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /\/blog\/page\/2$/);
  });

  test("keeps page 1 at /blog and answers a page past the end with 404", async ({ page, request }) => {
    expect((await request.get("/blog/page/1", { maxRedirects: 0 })).status()).toBe(308);
    await page.goto("/blog/page/1");
    await expect(page).toHaveURL(/\/blog$/);
    expect((await request.get("/blog/page/99")).status()).toBe(404);
    expect((await request.get("/blog/page/abc")).status()).toBe(404);
  });

  test("is linked from the nav and the footer", async ({ page, isMobile }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
    if (!isMobile) await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });
});

test.describe("a post", () => {
  test("has one heading, a cover that loads first, the contents, the FAQ and the author", async ({ page }) => {
    await page.goto(POST);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What does a website cost in India?");
    const cover = page.locator("img[fetchpriority=high]");
    await expect(cover).toHaveAttribute("loading", "eager");
    await expect(cover).toHaveAttribute("alt", "A bakery's website open on a laptop");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", `https://brandbasket.in${POST}`);
    await expect(page.getByRole("heading", { level: 2, name: "What is in the build?" })).toHaveAttribute("id", "what-is-in-the-build");
    await expect(page.getByRole("heading", { name: "Questions people ask" })).toBeVisible();
    await expect(page.getByRole("complementary", { name: "About the author" }).getByRole("link", { name: "Ananya Kulkarni" })).toHaveAttribute("href", "/blog/author/ananya-kulkarni");
    await expect(page.getByRole("heading", { name: "More on website basics" })).toBeVisible();
  });

  test("shows the contents as a rail on a wide screen and a collapsible box on a narrow one", async ({ page, isMobile }) => {
    await page.goto(POST);
    const rail = page.getByRole("complementary", { name: "On this page" });
    const box = page.locator("details", { hasText: "On this page" });
    if (isMobile) {
      await expect(rail).toBeHidden();
      await box.locator("summary").click();
      await expect(box.getByRole("link", { name: "What is in the build?" })).toBeVisible();
    } else {
      await expect(rail.getByRole("link", { name: "What is in the build?" })).toBeVisible();
      await expect(box).toBeHidden();
    }
  });

  test("carries BlogPosting, Person, BreadcrumbList and FAQPage structured data", async ({ page }) => {
    await page.goto(POST);
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => (JSON.parse(node.textContent ?? "{}") as { "@type": string })["@type"]));
    for (const type of ["BlogPosting", "Person", "BreadcrumbList", "FAQPage", "Organization"]) expect(types).toContain(type);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  });

  test("moves an old address to the current one with a 308", async ({ request, page }) => {
    const response = await request.get("/blog/website-price-india", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toMatch(/\/blog\/website-cost-india$/);
    await page.goto("/blog/website-price-india");
    await expect(page).toHaveURL(/\/blog\/website-cost-india$/);
  });

  test("answers an address with no post with a 404", async ({ request }) => {
    expect((await request.get("/blog/no-such-post")).status()).toBe(404);
  });
});

test("an old category or author address moves to the current one with a 308", async ({ request }) => {
  const category = await request.get("/blog/category/basics", { maxRedirects: 0 });
  expect(category.status()).toBe(308);
  expect(category.headers().location).toMatch(/\/blog\/category\/website-basics$/);
  const author = await request.get("/blog/author/ananya-k", { maxRedirects: 0 });
  expect(author.status()).toBe(308);
  expect(author.headers().location).toMatch(/\/blog\/author\/ananya-kulkarni$/);
});

test("a category lists its posts, and an unknown one is a 404", async ({ page, request }) => {
  await page.goto("/blog/category/website-basics");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Website basics");
  await expect(page.getByRole("navigation", { name: "Categories" }).getByRole("link", { name: "Website basics" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: /How to pick a domain name/ })).toBeVisible();
  expect((await request.get("/blog/category/nothing")).status()).toBe(404);
});

test("an author shows their role, links and posts, and an unknown one is a 404", async ({ page, request }) => {
  await page.goto("/blog/author/ananya-kulkarni");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ananya Kulkarni");
  await expect(page.locator("main").getByText("Local SEO lead")).toBeVisible();
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/ananya-kulkarni");
  await expect(page.getByRole("heading", { name: "Posts by Ananya" })).toBeVisible();
  expect((await request.get("/blog/author/nobody")).status()).toBe(404);
});

test.describe("preview", () => {
  test("shows a draft, marked private and never indexed", async ({ page, request }) => {
    const response = await request.get("/blog/preview/good-token");
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    await page.goto("/blog/preview/good-token");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Half written");
    await expect(page.getByText(/Preview\. Only people with this link/)).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("says when a link has expired, and 404s a bad one", async ({ page, request }) => {
    await page.goto("/blog/preview/expired-token");
    await expect(page.getByText(/preview link has expired/)).toBeVisible();
    expect((await request.get("/blog/preview/bad-token")).status()).toBe(404);
  });
});

test("the feed and the sitemap list the blog", async ({ request }) => {
  const feed = await request.get("/blog/feed.xml");
  expect(feed.headers()["content-type"]).toContain("application/rss+xml");
  expect(await feed.text()).toContain("<link>https://brandbasket.in/blog/website-cost-india</link>");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const url of ["/blog", "/blog/website-cost-india", "/blog/category/website-basics", "/blog/author/ananya-kulkarni"]) expect(sitemap).toContain(`<loc>https://brandbasket.in${url}</loc>`);
});
