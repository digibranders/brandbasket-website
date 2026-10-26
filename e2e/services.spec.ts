import { expect, test } from "@playwright/test";
import { BASKET_COPY } from "@/content/basket";
import { PRIMARY_CTA } from "@/content/navigation";
import { SERVICE_PAGES } from "@/content/services";
import { formatInr, PLANS } from "@/lib/pricing";

for (const page of SERVICE_PAGES) {
  const plan = PLANS[page.id];

  test(`${page.path} has one heading and its price`, async ({ page: browser }) => {
    await browser.goto(page.path);
    await expect(browser.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(browser.locator("main").getByText(formatInr(plan.monthly)).first()).toBeVisible();
  });

  test(`the pricing card for ${plan.name} links to ${page.path}`, async ({ page: browser }) => {
    await browser.goto("/pricing");
    await browser.getByRole("link", { name: `Explore more about ${plan.name}` }).click();
    await expect(browser).toHaveURL(new RegExp(`${page.path}$`));
    await expect(browser.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test(`the main button on ${page.path} puts ${plan.name} in the basket and opens it`, async ({ page: browser }) => {
    await browser.goto(page.path);
    await browser.locator("main").getByRole("button", { name: PRIMARY_CTA.label }).first().click();
    const basket = browser.getByRole("dialog", { name: BASKET_COPY.dockLabel });
    await expect(basket).toBeVisible();
    await expect(basket.getByRole("button", { name: `Remove ${plan.name}` })).toBeVisible();
  });
}

test("an address that is not a service page is a 404", async ({ page }) => {
  const response = await page.goto("/services/nothing");
  expect(response?.status()).toBe(404);
});
