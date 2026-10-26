@AGENTS.md

# brandbasket-website

Marketing site for Brandbasket (brandbasket.in), a brand of Digibranders Private Limited. Plan of action and phase plans: `../docs/plans/`. Visual reference: `docs/design/mock.html`.

Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Vitest, OGL for the 3D basket. npm, Node 20 or newer. Dev server: `npm run dev` on port 3130.

## Rules
- Work on `development` and push there freely: it does not deploy. `main` is production: it changes only through a PR from `development` to `main`, and merging that PR deploys production on Vercel. Never push to `main` directly, and open the release PR only when the owner asks for a release.
- Prices live in `lib/pricing.ts` only. Business facts live in `lib/site-config.ts` only. Copy lives in `content/`.
- Pages are Server Components. Client islands only for the basket, plan switches, showcase, menu and theme.
- No em or en dashes anywhere (`lib/copy-check.test.ts` fails the build).
- Every page sets metadata through `pageMetadata()` and any FAQ through `faqJsonLd()`.
- The site is noindex until launch. Turning indexing on is a launch step: set SITE_INDEXING=on in Vercel production only after the owner approves, then submit the sitemap in Search Console.
- The site is light only. Tokens are in `app/globals.css`. Use the tokens, never raw colours.

## The blog
- Content comes from the CMS (`../brandbasket-cms`, plan `../docs/plans/22-cms.md`). Blog pages are Server Components that read `lib/cms/` (`client.ts` sends the bearer token, caches under the tag `blog` for an hour, retries 5xx, checks the JSON with Zod, and throws on failure) and render per request, so a build never needs the CMS.
- The CMS purges the cache through `POST /api/revalidate` (bearer `REVALIDATE_SECRET`, the tag `blog` only). Settings: `CMS_URL`, `CMS_SITE_TOKEN`, `REVALIDATE_SECRET`, optional `BLOG_MEDIA_ORIGIN` (see `.env.example`).
- `lib/cms/schema.ts` is a copy of the CMS's `lib/site/schema.ts`, and `e2e/fixtures/cms/` is a copy of its `test/site-contract/`. When the CMS changes a response, copy both over; `lib/cms/schema.test.ts` fails if they drift.
- `e2e/cms-fixture-server.mjs` stands in for the CMS in Playwright and CI, serving those fixtures.
- Blog words that are not the CMS's live in `content/blog.ts`; new copy goes to the owner first.

## Before calling a change done
`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
