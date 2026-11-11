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

  test("closes when the page outside it is pressed", async ({ page }) => {
    await page.goto("/");
    const pricing = page.locator("header nav").getByRole("link", { name: "Pricing", exact: true });

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(pricing).toBeVisible();
    // Below the sheet, on the page behind it.
    await page.mouse.click(60, 790);
    await expect(pricing).toBeHidden();
  });
});

test.describe("Services menu", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("opens on a press, lists the three service pages and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Site", exact: true });
    const toggle = nav.getByRole("button", { name: "Services", exact: true });
    const names = ["Website Management", "Social Media Management", "Paid Ads Management"];

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    for (const name of names) await expect(nav.getByRole("link", { name, exact: true })).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    for (const name of names) await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Social Media Management", exact: true })).toHaveAttribute("href", "/services/social-media-management");

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("opens on hover and a link goes to its page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Site", exact: true });
    await nav.getByRole("button", { name: "Services", exact: true }).hover();
    await nav.getByRole("link", { name: "Paid Ads Management", exact: true }).click();
    await expect(page).toHaveURL(/\/services\/paid-ads-management$/);
  });
});

test("the phone menu lists the three service pages under Services", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const link = page.getByRole("link", { name: "Website Management", exact: true });
  await expect(link).toBeHidden();
  await page.getByRole("button", { name: "Services", exact: true }).click();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/services\/managed-website$/);
});

test("an unknown path returns 404", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
});
