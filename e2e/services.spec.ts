import { expect, test } from "@playwright/test";
import { BASKET_COPY } from "@/content/basket";
import { PRIMARY_CTA } from "@/content/navigation";
import { SERVICE_PAGES } from "@/content/services";
import { formatMoney } from "@/lib/currency";
import { isPlanPaused, planPrice, PLANS } from "@/lib/pricing";

for (const page of SERVICE_PAGES) {
  const plan = PLANS[page.id];

  test(`${page.path} has one heading and its price`, async ({ page: browser }) => {
    await browser.goto(page.path);
    await expect(browser.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(browser.locator("main").getByText(formatMoney(planPrice(page.id, "INR"), "INR")).first()).toBeVisible();
  });

  test(`the pricing card for ${plan.name} links to ${page.path}`, async ({ page: browser }) => {
    await browser.goto("/pricing");
    await browser.getByRole("link", { name: `Explore more about ${plan.name}` }).click();
    await expect(browser).toHaveURL(new RegExp(`${page.path}$`));
    await expect(browser.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test(`the main button on ${page.path} puts ${plan.name} in the basket and opens it`, async ({ page: browser }) => {
    test.skip(isPlanPaused(page.id), `${plan.name} is paused: its hero offers WhatsApp instead (next test)`);
    await browser.goto(page.path);
    await browser.locator("main").getByRole("button", { name: PRIMARY_CTA.label }).first().click();
    const basket = browser.getByRole("dialog", { name: BASKET_COPY.dockLabel });
    await expect(basket).toBeVisible();
    await expect(basket.getByRole("button", { name: `Remove ${plan.name}` })).toBeVisible();
  });
}

test("the paused Paid Ads page offers WhatsApp, not Start my plan, and says Coming soon", async ({ page }) => {
  test.skip(!isPlanPaused("ads"), "Paid Ads is on sale again");
  await page.goto("/services/paid-ads-management");
  const hero = page.locator("section[aria-labelledby='h-service']");
  await expect(hero.getByRole("button", { name: PRIMARY_CTA.label })).toHaveCount(0);
  await expect(hero.getByRole("link", { name: /Ask (about Paid Ads|us)/ })).toHaveAttribute("href", /wa\.me|whatsapp/);
  await expect(hero.getByText(BASKET_COPY.comingSoon, { exact: true })).toBeVisible();
});

test("an address that is not a service page is a 404", async ({ page }) => {
  const response = await page.goto("/services/nothing");
  expect(response?.status()).toBe(404);
});
