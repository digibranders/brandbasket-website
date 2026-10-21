import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ERROR_STATES, ERROR_UI } from "../content/errors";

test("missing pages return 404 and offer immediate home navigation", async ({ page }) => {
  const response = await page.goto("/this-page-slipped-out");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(ERROR_STATES["not-found"].title);
  await page.getByRole("link", { name: ERROR_UI.home, exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("all scenes render, stay within the viewport, and retry gives preview feedback", async ({ page }) => {
  await page.goto("/error-preview");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const select = page.getByLabel(ERROR_UI.previewLabel);
  for (const [kind, state] of Object.entries(ERROR_STATES)) {
    await select.selectOption(kind);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(state.title);
    await expect(page.getByRole("link", { name: ERROR_UI.home, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (kind !== "offline") {
      await expect(page.locator(".error-basket__image")).toHaveJSProperty("naturalWidth", 768);
    }
    if (state.retryable) {
      await page.getByRole("button", { name: ERROR_UI.retry, exact: true }).click();
      await expect(page.getByRole("status")).toHaveText(ERROR_UI.previewRetry);
    }
  }
});

test("decorative animations loop automatically without a replay button", async ({ page }) => {
  await page.goto("/error-preview");
  await expect(page.getByRole("button", { name: "Replay animation" })).toHaveCount(0);
  for (const kind of Object.keys(ERROR_STATES)) {
    await page.getByLabel(ERROR_UI.previewLabel).selectOption(kind);
    const loops = await page.locator(".error-scene").evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => animation.effect?.getTiming().iterations === Infinity));
    expect(loops.length).toBeGreaterThan(0);
    expect(loops.every(Boolean)).toBe(true);
  }
});

test("reduced motion keeps every scene static and accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/error-preview");
  for (const kind of ["not-found", "forbidden", "offline", "maintenance"]) {
    await page.getByLabel(ERROR_UI.previewLabel).selectOption(kind);
    await expect(page.getByRole("button", { name: "Replay animation" })).toHaveCount(0);
    expect(await page.locator(".error-scene").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    const results = await new AxeBuilder({ page }).include(".error-preview").analyze();
    expect(results.violations).toEqual([]);
  }
});

test("the artwork can pause and resume motion without a visible replay control", async ({ page }) => {
  await page.goto("/error-preview");
  await page.getByRole("button", { name: "Pause animation", exact: true }).click();
  const resume = page.getByRole("button", { name: "Resume animation", exact: true });
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator(".error-scene").evaluate((element) => element.getAnimations({ subtree: true }).every((animation) => animation.playState === "paused"))).toBe(true);
  await resume.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "Pause animation", exact: true })).toHaveAttribute("aria-pressed", "false");
});
