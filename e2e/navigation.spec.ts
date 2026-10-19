// e2e/navigation.spec.ts
import { expect, test } from "@playwright/test";

test("every link in the nav and footer returns 200", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator("header nav a[href^='/'], footer a[href^='/']").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  const paths = [...new Set(hrefs.map((href) => href.split("#")[0] || "/"))];
  expect(paths.length).toBeGreaterThan(3);
  for (const path of paths) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
});

test.describe("phone menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens and closes with the button and with Escape", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    const pricing = page.locator("header nav").getByRole("link", { name: "Pricing", exact: true });

    await open.click();
    await expect(pricing).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(pricing).toBeHidden();

    await open.click();
    await expect(pricing).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(pricing).toBeHidden();
    await expect(open).toBeFocused();
  });
});

test("an unknown path returns 404", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
});
