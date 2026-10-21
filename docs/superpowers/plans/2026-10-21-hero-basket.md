# Hero basket refinement

**Goal:** Preserve the interactive woven-basket identity while correcting harsh materials, unfinished joints, flat card edges, and crowded contents.

**Architecture:** Keep the existing isolated OGL scene and basket store. Geometry owns slab bevels; procedural canvases own rattan and printed artwork; materials own shared lighting; scene and tokens own assembly and placement. No new dependencies.

1. Add geometry regression coverage for beveled edges, unit normals, outward triangle winding, and unchanged slab dimensions. Run the test before implementation.
2. Round slab edges with smooth quarter-circle bevels, keeping the printed faces flat and UVs aligned.
3. Refine rattan texture, soft lighting, cavity depth, wrapped rim/handle, and handle attachments. Arrange cards with individual tilts and clear depth separation.
4. Inspect desktop, phone, full rotation, and all add-on states in Playwright; capture the matching AVIF fallback using the existing script and keep its 40 KB budget.
5. Run unit tests, lint, TypeScript, production build, and basket browser tests. Request an independent code review of the final diff and address material findings.

**Acceptance:** No exposed handle ends, card intersections at rest, harsh black weave grid, clipped canvas, or WebGL errors. Existing pricing interaction and poster fallback remain functional.

## Card finish follow-up

Replace solid brown service faces with matte ivory stock, restrained service-color medallions, dark labels, and a fine inset border. Reduce slab depth to 0.09 and use neutral paper-colored edges. Keep existing geometry, positions, interactions, fonts, and website artwork. Verify desktop, mobile, and selected add-on cards visually; recapture the fallback and repeat baseline checks.

## Original website preview

Replace the CurryCook screenshot with a fictional architecture-studio website. Generate an original courtyard-home photo, optimize it as a local AVIF, and draw the browser frame, FORMA wordmark, navigation, green headline, and booking button with the existing brand font in a dedicated canvas module. Preserve a complete composition if the photograph fails to load. First reproduce the missing photo request with a failing browser test; then verify its successful load, photo-failure fallback, desktop/mobile composition, all add-ons, regenerated poster budget, and project baseline checks.

## Restore original service-card styling

User preferred the original screenshot: restore full brown, teal, and blue service-card surfaces with large centered white icons and bold white labels. Remove ivory borders, icon medallions, and compact headers; match slab edges to their card colors. Preserve the refined basket geometry, custom FORMA website preview, drag-only cursor interaction, and independent momentum. Refresh the poster and visually verify the base and fully loaded basket before repeating baseline checks.

## Cast shadows and grounding

The existing gradient ground shadow cannot cast between objects. Add an orthographic shadow pass using OGL's installed Shadow helper, a 1024-square packed depth map with nearest filtering, and a soft nine-sample comparison in the existing material shader. Every basket/card mesh casts and receives shadows; a transparent ground receiver shows the projected silhouette. Tighten the separate contact gradient below the foot. Keep fill light in shadowed areas so colored cards remain readable. Limit depth-map updates to 30 Hz while retaining the existing render and pointer behavior. Verify the shadow pass with a failing-then-passing browser regression, inspect base/full/rotated views, recapture the fallback, and run project baseline checks.
