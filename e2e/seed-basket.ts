import type { Page } from "@playwright/test";
import { BASKET_STORAGE_KEY } from "@/lib/basket-store";
import type { PlanId } from "@/lib/pricing";

/**
 * Opens pages as a returning visitor whose basket already holds `plans`. A new visitor's basket is empty (owner,
 * 2026-11-17), so tests that need a plan in it start here. It runs before every navigation of `page`.
 */
export async function seedBasket(page: Page, plans: readonly PlanId[]): Promise<void> {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: BASKET_STORAGE_KEY, value: JSON.stringify(plans) });
}
