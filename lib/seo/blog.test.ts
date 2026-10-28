import { describe, expect, it } from "vitest";
import authorAndCategory from "../../e2e/fixtures/cms/author-and-category.json";
import post from "../../e2e/fixtures/cms/post.json";
import { authorSchema, categorySchema, postSchema } from "../cms/schema";
import { authorMetadata, categoryMetadata, listingMetadata, postMetadata } from "./blog";

const fixturePost = postSchema.parse(post);

describe("postMetadata", () => {
  it("uses the CMS's title and description, the post's own address and its social image", () => {
    const meta = postMetadata(fixturePost);
    expect(meta.title).toEqual({ absolute: "Website cost in India | Brandbasket" });
    expect(meta.alternates?.canonical).toBe("/blog/website-cost-india");
    expect(meta.openGraph).toMatchObject({
      type: "article",
      url: "https://www.brandbasket.in/blog/website-cost-india",
      publishedTime: "2026-10-05T04:30:00.000Z",
      modifiedTime: "2026-10-12T06:00:00.000Z",
      authors: ["Ananya Kulkarni"],
      section: "Website basics",
      images: [{ url: "https://media.brandbasket.in/blog/cover-1200x630.jpg", width: 1200, height: 630 }],
    });
  });

  it("keeps a noindex post out of search", () => {
    expect(postMetadata({ ...fixturePost, seo: { ...fixturePost.seo, noindex: true } }).robots).toMatchObject({ index: false });
    expect("robots" in postMetadata(fixturePost)).toBe(false);
  });

  it("falls back to the site's share image when the post has no cover", () => {
    expect(postMetadata({ ...fixturePost, ogImage: null }).openGraph).toMatchObject({ images: [{ url: "/opengraph-image" }] });
  });
});

describe("the other blog pages", () => {
  it("gives page 1 the listing's own address and later pages theirs", () => {
    expect(listingMetadata(1).alternates?.canonical).toBe("/blog");
    const later = listingMetadata(3);
    expect(later.alternates?.canonical).toBe("/blog/page/3");
    expect(later.title).toEqual({ absolute: "Blog, page 3: guides for local businesses | Brandbasket" });
  });

  it("titles a category with its search title when it has one", () => {
    const category = categorySchema.parse(authorAndCategory.category);
    expect(categoryMetadata(category).title).toEqual({ absolute: "Website basics for small businesses" });
    expect(categoryMetadata({ ...category, metaTitle: "", metaDescription: "", description: "" }).title).toEqual({ absolute: "Website basics | Brandbasket blog" });
  });

  it("names an author with their role and bio", () => {
    const author = authorSchema.parse(authorAndCategory.author);
    expect(authorMetadata(author)).toMatchObject({ title: { absolute: "Ananya Kulkarni, Local SEO lead | Brandbasket blog" }, description: "Helps neighbourhood shops get found on Google." });
  });
});
