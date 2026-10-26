// The golden JSON the CMS writes (e2e/fixtures/cms/) must parse with this site's copy of the schema: if the CMS changes
// a shape and this fails, copy lib/site/schema.ts and test/site-contract/ over again.
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { authorSchema, categoriesResponseSchema, categorySchema, postCardSchema, postSchema, sitemapSchema } from "./schema";

const DIR = "e2e/fixtures/cms";
const load = (name: string): unknown => JSON.parse(readFileSync(`${DIR}/${name}.json`, "utf8"));

describe("the CMS fixtures", () => {
  it("parse with the schema, unchanged", () => {
    const post = postSchema.parse(load("post"));
    expect(post).toEqual(load("post"));
    expect(postSchema.parse(load("post-preview-bare"))).toEqual(load("post-preview-bare"));
    expect(postCardSchema.parse(load("post-card"))).toEqual(load("post-card"));
    const pair = load("author-and-category") as { author: unknown; category: unknown };
    expect(authorSchema.parse(pair.author)).toEqual(pair.author);
    expect(categorySchema.parse(pair.category)).toEqual(pair.category);
    const lists = load("categories-and-sitemap") as { categories: unknown; sitemap: unknown };
    expect(categoriesResponseSchema.parse(lists.categories)).toEqual(lists.categories);
    expect(sitemapSchema.parse(lists.sitemap)).toEqual(lists.sitemap);
  });

  it("are all the files there are", () => {
    expect(readdirSync(DIR).filter((name) => name.endsWith(".json")).sort()).toEqual(["author-and-category.json", "categories-and-sitemap.json", "post-card.json", "post-preview-bare.json", "post.json"]);
  });
});
