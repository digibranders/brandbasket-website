# Premium footer implementation plan

**Goal:** Adapt Fynix Digital's spacious footer and oversized brand signature to Brandbasket's existing light design system.

**Architecture:** Keep Footer a Server Component. Reuse navigation content, the approved logo asset, and centralized business details. Use a CSS mask for the decorative signature and native sticky positioning for the reveal, with a static reduced-motion fallback. Preserve existing copy and destinations.

**Scope:** Footer.tsx, a scoped footer stylesheet, and responsive footer browser coverage. Fynix is a read-only reference. Existing basket changes are outside this task.

## Implementation

- [x] Add browser coverage for named navigation, contact destinations, legal identity, and layout at desktop and phone widths. Run against the old footer to confirm the missing landmarks.
- [x] Recompose the footer with generous spacing, a two-column mobile navigation grid, a dedicated contact area, and a copyright row using site-config data.
- [x] Add a decorative oversized logo signature using existing assets and tokens. Keep it in document flow, reveal it with sticky CSS, and disable the effect under reduced motion.
- [x] Inspect desktop and mobile screenshots, verify narrow-screen overflow and keyboard focus, and review the final diff.
- [x] Run npm run lint, npm run typecheck, npx tsc --noEmit, npm test, npm run build, npm run verify:html, and npm run e2e.

## Verification notes

The footer uses a directly imported, prefixed stylesheet to follow the existing CSS pipeline without CSS module mapping issues. Desktop and mobile screenshots were inspected. Independent code review found no actionable issues. The full browser run exposed stale contact fixtures: the current schema requires email and allows an omitted phone. The fixtures now reflect that existing contract. All 84 browser checks passed with `npm run e2e -- --workers=2 --timeout=60000`. Lower concurrency and a longer test timeout accommodate local WebGL rendering. Lint, both TypeScript commands, all 202 unit tests, production build, and HTML verification (18 pages) passed. Tablet layout and reduced-motion fallback were also verified in the browser.
