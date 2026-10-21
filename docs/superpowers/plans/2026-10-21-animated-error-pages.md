# Animated error pages implementation plan

**Goal:** Build the approved tactile basket error system for the marketing website.

**Architecture:** A typed content registry supplies state-specific copy and scene variants. One shared error presentation renders standalone, inside boundaries, and in a noindex preview. A local basket image supplies texture; decorative SVG and CSS supply motion. Recovery does not depend on the artwork or its animation.

**Tech stack:** Existing Next.js 16.4, React 19, TypeScript, CSS, Vitest and Playwright.

- [x] Add failing tests for state completeness, safe generic recovery, and rendering accessible recovery links.
- [x] Implement content registry in `content/errors.ts` and shared presentation in `components/errors/`.
- [x] Create local transparent basket, lid and cord assets and animate paper, cord, lid, queue and repair details. The owner requested continuous decorative loops with no replay button; reduced motion is static.
- [x] Connect `app/not-found.tsx` and the existing `ErrorView`, retaining the framework's `retry` callback and standalone global document. Detect offline only as a connectivity hint.
- [x] Add `/error-preview` with noindex metadata, a scene selector, and automatic looping. Exclude it from the sitemap and avoid adding public navigation links.
- [x] Add Playwright coverage for real 404 status, working home navigation, preview states, retry feedback, reduced motion, accessibility and mobile overflow.
- [x] Run lint, typecheck, `npx tsc --noEmit`, tests, build, HTML verification and full E2E. Inspect desktop and mobile screenshots, review the diff, and resolve findings.

The approved direction is in `../../../../docs/design/2026-10-21-error-pages-direction.md`. No platform or Fynix changes are in scope. Existing `.env.example` modifications belong to the user.

## Verification

Lint, typecheck, explicit TypeScript no-emit check, 254 unit tests, production build, and HTML verification passed. The full Playwright suite passed against an isolated snapshot of the final production build: 102 passed, 8 consent tests skipped because no tracking container is configured. All 10 error-page browser checks passed across desktop and phone, including loops, no replay control, accessible artwork pause/resume, reduced motion, and recovery navigation.
