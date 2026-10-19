# Legal and contact usability refresh

Goal: improve navigation and readability across all legal pages, refine the contact form, and remove displayed contact hours.

Architecture: preserve legal content, anchor IDs, site tokens, typography, form validation and submission APIs. Isolate interactive contents navigation in a client component. Keep document content server rendered.

1. Add browser regressions for visible mobile contents, working anchors, desktop current-section indication, no horizontal overflow and no displayed contact hours. Run against the current build to confirm failures.
2. Add LegalContents with bounded sticky desktop navigation, discrete current-section highlighting, and a native mobile disclosure that closes on selection. Align legal header and article, separate sections and improve the shared registered-office card with responsive padding and structured facts.
3. Refine ContactForm presentation with a heading, required-field guidance, a two-column topic selector, grouped contact details and a clear submission footer. Remove hours from ContactChannels and the footer; preserve structured business metadata.
4. Build and run browser regressions, existing contact submissions and axe checks for every legal route and contact. Inspect desktop/mobile screenshots and production card padding. Run npm run lint, npx tsc --noEmit, npm run build and npm test.
5. Review the final diff for accessibility, behavior regressions and scope.
