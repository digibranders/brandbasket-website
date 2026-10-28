import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PRIMARY_CTA } from "@/content/navigation";
import { businessDetails } from "@/lib/site-config";


test("hero keeps its pricing CTA and navbar has one Pricing link", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#hero");
  await expect(hero.getByRole("button", { name: PRIMARY_CTA.label })).toBeVisible();
  await expect(hero.getByRole("link", { name: "View pricing" })).toHaveAttribute("href", "/pricing");
  await expect(hero.locator('a[href*="wa.me"]')).toHaveCount(0);
  const nav = page.getByRole("navigation", { name: "Site", exact: true });
  if ((page.viewportSize()?.width ?? 0) < 1000) await page.getByRole("button", { name: "Open menu" }).click();
  // The nav button opens the basket pop-up rather than leaving the page, so it is a button, not a link.
  await expect(nav.getByRole("button", { name: PRIMARY_CTA.label }).filter({ visible: true })).toBeVisible();
  await expect(nav.getByRole("link", { name: "View pricing", includeHidden: true })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Pricing", exact: true })).toHaveCount(1);
  await expect(nav.getByRole("link", { name: "Pricing", exact: true })).toHaveAttribute("href", "/pricing");
  await expect(nav.locator('a[href*="wa.me"]')).toHaveCount(0);
  await nav.getByRole("link", { name: "Pricing", exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);
});

test("the WhatsApp icon opens WhatsApp with a message ready", async ({ page }) => {
  await page.goto("/contact");
  const link = page.getByRole("link", { name: "Chat on WhatsApp" }).first();
  await expect(link).toHaveAttribute("href", new RegExp(`^${businessDetails.whatsappHref}\\?text=Hi%20Brandbasket`));
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const results = await new AxeBuilder({ page }).include("[data-whatsapp-chat]").withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("phone WhatsApp icon clears the basket dock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pricing");
  await page.locator("#compare").scrollIntoViewIfNeeded();
  const bar = page.locator("[data-basket-dock]:not([inert])");
  await expect(bar).toBeVisible();
  const icon = page.locator("[data-whatsapp-chat] a");
  const barBox = await bar.boundingBox();
  const iconBox = await icon.boundingBox();
  if (!barBox || !iconBox) throw new Error("The basket dock or WhatsApp icon is missing");
  expect(iconBox.y + iconBox.height).toBeLessThan(barBox.y);
});
