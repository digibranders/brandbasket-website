# brandbasket-website

Marketing site for Brandbasket (brandbasket.in), a brand of Digibranders Private Limited. Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4. Plans live in `../docs/plans/`; repo rules are in `CLAUDE.md`.

## Branches

Work on `development` and push there freely; it does not deploy. Production deploys from `main` only, through a pull request from `development` to `main`. Never push to `main` directly.

## Run

```bash
npm install
npm run dev
```

The dev server listens on http://localhost:3130.

## The blog

The blog at `/blog` is written in the CMS (`brandbasket-cms`, cms.brandbasket.in) and read from its JSON API. Pages render per request from responses cached under the tag `blog`, so a build never needs the CMS. When someone publishes, the CMS calls `POST /api/revalidate` and the new page shows at once.

| Where | What |
|---|---|
| `app/blog/` | The listing, pages, posts, categories, authors, private previews and the RSS feed |
| `components/blog/` | The cards, contents rail, author box and the rest of the blog's pieces |
| `lib/cms/` | The CMS client (bearer token, retries, Zod) and the schema copied from the CMS |
| `content/blog.ts` | The blog's own words; everything else comes from the CMS |
| `e2e/cms-fixture-server.mjs`, `e2e/fixtures/cms/` | A stand-in for the CMS, serving the CMS's own golden JSON, for Playwright and CI |

To run it against a local CMS, add these to `.env.local` (copy `.env.example`) with the same two secrets the CMS has:

```bash
CMS_URL=http://localhost:3140
CMS_SITE_TOKEN=...        # the CMS's CMS_SITE_TOKEN
REVALIDATE_SECRET=...     # the CMS's REVALIDATE_SECRET
BLOG_MEDIA_ORIGIN=http://localhost:3140   # development pictures are served by the CMS
```

When the CMS changes a response, copy its `lib/site/schema.ts` to `lib/cms/schema.ts` and its `test/site-contract/` to `e2e/fixtures/cms/`; a test fails if they drift. Until the owner approves launch the whole site, blog included, is noindex.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run verify:html     # rules for the prerendered pages
npm run e2e             # Playwright; starts the CMS stand-in itself. First time: npx playwright install chromium
```
