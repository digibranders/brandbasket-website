// e2e/a11y.spec.ts
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const PAGES = ["/", "/pricing", "/about", "/contact", "/privacy", "/terms", "/refund", "/shipping", "/notice"];

/** Frames with no finite animation running before axe runs: entrance transitions start after hydration, not at load. */
const CALM_FRAMES = 30;

/** Lets transitions settle so axe measures the colours a visitor reads, not a half-faded frame. */
async function settle(page: Page, frames: number): Promise<void> {
  await page.evaluate(
    (needed) =>
      new Promise<void>((resolve) => {
        let calm = 0;
        const tick = (): void => {
          const busy = document.getAnimations().some((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity);
          calm = busy ? 0 : calm + 1;
          if (calm >= needed) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    frames,
  );
}

for (const path of PAGES) {
  test(`${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    await settle(page, CALM_FRAMES);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target.join(" ")) }))).toEqual([]);
  });
}
