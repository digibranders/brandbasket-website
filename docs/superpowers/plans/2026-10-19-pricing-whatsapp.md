# Pricing CTA and WhatsApp chat toggle

Goal: replace the homepage hero and navbar WhatsApp shortcuts with pricing links, and offer a floating WhatsApp contact panel throughout the site.

Design: preserve the free-website CTA and existing brand tokens. Use a restrained outlined pricing CTA. The chat launcher opens a small nonmodal panel containing an introduction and a link to the existing business WhatsApp number. It starts closed and supports keyboard focus, Escape, outside dismissal, route reset, reduced motion and phone safe areas. Keep the widget above the pricing page's visible mobile total bar.

1. Add browser regressions for hero/navbar pricing links and widget open/close, WhatsApp destination, keyboard dismissal, route reset and mobile total-bar clearance; run to confirm failures.
2. Add a reusable pricing button and shared pricing CTA copy; update HomeHero and Nav while preserving the primary signup CTA and mobile navigation.
3. Add a client WhatsAppChat leaf in the root layout and content copy. Add a data marker to the mobile total bar so CSS can reserve space only while it is active.
4. Run lint, TypeScript, build, unit tests and desktop/mobile browser tests. Inspect desktop, narrow phone and open-panel screenshots; review the diff.
