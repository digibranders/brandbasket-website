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

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
