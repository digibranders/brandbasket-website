import { expect, test } from "@playwright/test";

// The phone dock (owner, 2026-10-26): hidden over the hero and the dark sections, there everywhere else, including over
// the Basket Card and the closing band. From 1000px up the Woven wall does the job, so these run at phone width.
test.use({ viewport: { width: 390, height: 844 } });

const dockHidden = (page: import("@playwright/test").Page): Promise<boolean> => page.locator("[data-basket-dock]").evaluate((el) => (el as HTMLElement).inert);

async function scrollTo(page: import("@playwright/test").Page, selector: string, block: "start" | "center"): Promise<void> {
  await page.locator(selector).first().evaluate((el, where) => el.scrollIntoView({ block: where as ScrollLogicalPosition }), block);
}

test("on the homepage it hides over the hero only and shows down to the closing call, plans included", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => dockHidden(page)).toBe(true);

  await scrollTo(page, "#services", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);

  // A phone has no basket card in the plans, so the floating cart is what shows the basket there.
  await scrollTo(page, "#plans", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);
  await expect(page.locator("#plans .bp-card")).toHaveCount(0);

  await scrollTo(page, "#faq", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);

  await scrollTo(page, "#h-final", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);
});

test("on the website page it hides over the hero and the dark care section, and shows over the closing band", async ({ page }) => {
  await page.goto("/services/managed-website");
  await expect.poll(() => dockHidden(page)).toBe(true);

  await scrollTo(page, "#responsibility", "center");
  await expect.poll(() => dockHidden(page)).toBe(true);

  await scrollTo(page, "#faq", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);

  await scrollTo(page, "#closing", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);
});

test("on the pricing page it hides over the hero and the dark basket band, and shows over the plans", async ({ page }) => {
  await page.goto("/pricing");
  await expect.poll(() => dockHidden(page)).toBe(true);

  await scrollTo(page, "#compare", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);

  await scrollTo(page, "#h-basket-band", "center");
  await expect.poll(() => dockHidden(page)).toBe(true);

  await scrollTo(page, "#closing", "center");
  await expect.poll(() => dockHidden(page)).toBe(false);
});

test.describe("the hanging basket on a laptop", () => {
  test.use({ viewport: { width: 1440, height: 803 } });
  const wallHidden = (page: import("@playwright/test").Page): Promise<boolean> => page.locator("[data-basket-wall]").evaluate((el) => (el as HTMLElement).inert);

  test("on the homepage it hides over the hero and the plans and shows between them", async ({ page }) => {
    await page.goto("/");
    await expect.poll(() => wallHidden(page)).toBe(true);

    await scrollTo(page, "#services", "center");
    await expect.poll(() => wallHidden(page)).toBe(false);

    await scrollTo(page, "#plans", "center");
    await expect.poll(() => wallHidden(page)).toBe(true);

    await scrollTo(page, "#faq", "center");
    await expect.poll(() => wallHidden(page)).toBe(false);
  });
});
