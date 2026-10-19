@AGENTS.md

# brandbasket-website

Marketing site for Brandbasket (brandbasket.in), a brand of Digibranders Private Limited. Plan of action and phase plans: `../docs/plans/`. Visual reference: `docs/design/mock.html`.

Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Vitest, OGL for the 3D basket. npm, Node 20 or newer. Dev server: `npm run dev` on port 3130.

## Rules
- Work on `development`. `main` is production and only changes through a PR. Vercel builds `main`.
- Prices live in `lib/pricing.ts` only. Business facts live in `lib/site-config.ts` only. Copy lives in `content/`.
- Pages are Server Components. Client islands only for the basket, plan switches, showcase, menu and theme.
- No em or en dashes anywhere (`lib/copy-check.test.ts` fails the build).
- Every page sets metadata through `pageMetadata()` and any FAQ through `faqJsonLd()`.
- The site is noindex until launch. Turning indexing on is a launch step: set SITE_INDEXING=on in Vercel production only after the owner approves, then submit the sitemap in Search Console.
- The site is light only. Tokens are in `app/globals.css`. Use the tokens, never raw colours.

## Before calling a change done
`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
