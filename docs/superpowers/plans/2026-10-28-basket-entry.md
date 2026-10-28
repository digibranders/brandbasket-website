# Basket entrance with tile drops

**Goal:** Give the basket itself a calm entrance on home and pricing, while retaining tile drops.

**Design:** Remove the image-to-canvas crossfade. The live canvas is the only visible basket during normal entry. Once rendered, it fades in and rises 18 pixels over 650 ms, with no rotation, scale or overshoot. The canvas animation-end event starts the tile drops. Keep the basket still during its entrance. Start priority scenes promptly rather than waiting for browser idle. A filled image is reserved for reduced motion, no JavaScript and rendering failures, and is decoded before being exposed.

**Files:** `BasketStage.tsx` owns readiness, fallback and the animation-end callback. `stage.css` owns a single canvas entrance. `scene.ts` holds idle movement until entry is complete. Remove the unused empty poster and restore the original filled-poster capture utility.

- [x] Add failing regressions for upward motion, monotonically increasing opacity, no poster overlap and drops after arrival; verify they pass after implementation.
- [x] Implement the single-canvas entrance; retain decoded static fallbacks and cleanup. Recovery bypasses the entrance and restores a fully visible canvas immediately.
- [x] Inspect the rendered entrance and record a local preview. Desktop and phone motion checks pass. In-app browser automation was unavailable during this revision.
- [x] Run lint, TypeScript, all 435 unit tests, production build and all 50 basket browser checks; all pass. Independent review identified the recovery fade replay, now covered by a failing-then-passing regression. Re-review found no further actionable issues.
