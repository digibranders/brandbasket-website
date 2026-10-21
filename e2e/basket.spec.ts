// e2e/basket.spec.ts
import { expect, test } from "@playwright/test";
import { PRICING_PLANS } from "@/content/basket";
import { type AddonPick, firstPayment, formatInr, signupTotal } from "@/lib/pricing";

const PICKS: readonly AddonPick[] = [
  { growth: false, search: false },
  { growth: true, search: false },
  { growth: false, search: true },
  { growth: true, search: true },
];

for (const pick of PICKS) {
  const total = formatInr(firstPayment(signupTotal(pick)).total);
  test(`pricing total with growth=${pick.growth} search=${pick.search} is ${total}`, async ({ page }) => {
    await page.goto("/pricing");
    const hero = page.locator("section[aria-labelledby='h-pricing']");
    if (pick.growth) await hero.getByRole("switch", { name: PRICING_PLANS.growth.switchLabel }).click();
    if (pick.search) await hero.getByRole("switch", { name: PRICING_PLANS.search.switchLabel }).click();
    await expect(hero.getByText(total, { exact: true })).toBeVisible();
  });
}

test("the expected totals match the owner's figures", () => {
  // Guards the formula itself: if these move, prices changed and the owner signs off on the new figures.
  expect(PICKS.map((pick) => formatInr(firstPayment(signupTotal(pick)).total))).toEqual(["₹3,538.82", "₹11,385.82", "₹31,563.82", "₹39,410.82"]);
});

test("the basket carries from home to pricing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("switch", { name: "Add Digital Growth" }).first().click();
  await page.getByRole("link", { name: "Compare all plans" }).click();
  await expect(page).toHaveURL(/\/pricing/);
  await expect(page.getByRole("switch", { name: PRICING_PLANS.growth.switchLabel }).first()).toHaveAttribute("aria-checked", "true");
});
