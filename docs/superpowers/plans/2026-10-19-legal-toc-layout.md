# Legal contents layout correction

Goal: place legal contents alongside the page title at initial load, keep it sticky below the navbar, and replace the tan active tile and left border with a plain semibold text state.

Implementation: put header, contents and article into one responsive grid. On desktop the contents occupies the left grid column across both header and article rows; the header and article occupy the right column. Preserve mobile DOM order: header, contents disclosure, article. Keep native anchors, current-section tracking, keyboard focus and card padding.

Verification: browser assertions cover initial alignment, sticky top at 112px after anchor navigation, active text without a background or left border, mobile disclosure, working anchors and card padding across all five legal routes. Run lint, TypeScript, build and scoped desktop/mobile accessibility and legal browser tests.
