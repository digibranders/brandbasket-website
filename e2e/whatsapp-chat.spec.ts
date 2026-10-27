import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PRIMARY_CTA } from "@/content/navigation";
import { businessDetails } from "@/lib/site-config";

// Keep failures focused when testing a widget that has not been implemented yet.
test.use({ actionTimeout: 5_000 });

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

test("chat opens accessibly, links to WhatsApp and supports dismissal", async ({ page }) => {
  await page.goto("/contact");
  const toggle = page.getByRole("button", { name: "Open WhatsApp chat" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  const panel = page.getByRole("region", { name: "Chat with Brandbasket" });
  const link = panel.getByRole("link", { name: "Continue on WhatsApp" });
  await expect(link).toBeFocused();
  await expect(link).toHaveAttribute("href", businessDetails.whatsappHref);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("button", { name: "Close WhatsApp chat", exact: true })).toHaveAttribute("aria-expanded", "true");
  const results = await new AxeBuilder({ page }).include("[data-whatsapp-chat]").withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("button", { name: "Dismiss chat" }).click();
  await expect(panel).toHaveCount(0);
  await toggle.click();
  await page.locator("#h-contact").click();
  await expect(panel).toHaveCount(0);
});

test("chat resets on navigation and fits the viewport", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open WhatsApp chat" }).click();
  const panel = page.getByRole("region", { name: "Chat with Brandbasket" });
  const box = await panel.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) throw new Error("Chat panel or viewport is unavailable");
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y).toBeGreaterThanOrEqual(0);
  if ((page.viewportSize()?.width ?? 0) < 1000) await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Site", exact: true }).getByRole("link", { name: "Pricing", exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole("button", { name: "Open WhatsApp chat" })).toHaveAttribute("aria-expanded", "false");
});

test("phone chat clears the basket dock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pricing");
  await page.locator("#compare").scrollIntoViewIfNeeded();
  const bar = page.locator("[data-basket-dock]:not([inert])");
  await expect(bar).toBeVisible();
  const toggle = page.getByRole("button", { name: "Open WhatsApp chat" });
  const barBox = await bar.boundingBox();
  const toggleBox = await toggle.boundingBox();
  if (!barBox || !toggleBox) throw new Error("The basket dock or chat launcher is missing");
  expect(toggleBox.y + toggleBox.height).toBeLessThan(barBox.y);
});
