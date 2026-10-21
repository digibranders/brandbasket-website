// e2e/basket.spec.ts
import { expect, test } from "@playwright/test";
import { PRICING_PLANS } from "@/content/basket";
import { type BasketPick, firstPayment, formatInr, packageTotal, PLAN_IDS } from "@/lib/pricing";

const PICKS: readonly BasketPick[] = [
  { website: true, growth: false, search: false },
  { website: true, growth: true, search: false },
  { website: true, growth: false, search: true },
  { website: true, growth: true, search: true },
];

const pickTotal = (pick: BasketPick): string => formatInr(firstPayment(packageTotal(pick)).total);

for (const pick of PICKS) {
  const total = pickTotal(pick);
  test(`pricing total with ${PLAN_IDS.filter((id) => pick[id]).join(" + ")} is ${total}`, async ({ page }) => {
    await page.goto("/pricing");
    const hero = page.locator("section[aria-labelledby='h-pricing']");
    for (const id of PLAN_IDS) {
      // The website starts on; flip every plan that differs from the pick.
      if (pick[id] !== (id === "website")) await hero.getByRole("switch", { name: PRICING_PLANS[id].switchLabel }).click();
    }
    await expect(hero.getByText(total, { exact: true })).toBeVisible();
  });
}

test("the expected totals match the owner's figures", () => {
  // Guards the formula itself: if these move, prices changed and the owner signs off on the new figures.
  expect(PICKS.map(pickTotal)).toEqual(["₹3,540", "₹12,272", "₹26,432", "₹31,388"]);
});

test("Social and SEO without the website is the 30% package", async ({ page }) => {
  await page.goto("/pricing");
  const hero = page.locator("section[aria-labelledby='h-pricing']");
  await hero.getByRole("switch", { name: PRICING_PLANS.growth.switchLabel }).click();
  await hero.getByRole("switch", { name: PRICING_PLANS.search.switchLabel }).click();
  await hero.getByRole("switch", { name: PRICING_PLANS.website.switchLabel }).click();
  await expect(hero.getByText("₹28,910", { exact: true })).toBeVisible();
});

test("the last switch on cannot be turned off", async ({ page }) => {
  await page.goto("/pricing");
  const hero = page.locator("section[aria-labelledby='h-pricing']");
  const website = hero.getByRole("switch", { name: PRICING_PLANS.website.switchLabel });
  const total = pickTotal(PICKS[0]);
  await expect(website).toHaveAttribute("aria-disabled", "true");
  // Keyboard activation: Playwright will not click aria-disabled, and a forced click can land on the phone total bar.
  await website.focus();
  await page.keyboard.press("Space");
  await expect(website).toHaveAttribute("aria-checked", "true");
  await expect(hero.getByText(total, { exact: true })).toBeVisible();
  await expect(website).toBeFocused();
});

test("the basket carries from home to pricing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("switch", { name: PRICING_PLANS.growth.switchLabel }).first().click();
  await page.getByRole("link", { name: "Compare all plans" }).click();
  await expect(page).toHaveURL(/\/pricing/);
  await expect(page.getByRole("switch", { name: PRICING_PLANS.growth.switchLabel }).first()).toHaveAttribute("aria-checked", "true");
});
