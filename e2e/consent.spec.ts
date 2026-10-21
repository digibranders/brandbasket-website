import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { CONSENT } from "../content/consent";
import { PRIMARY_CTA } from "../content/navigation";
import { CONSENT_KEY, TOOLS } from "../lib/consent";

// Runs against a build made with NEXT_PUBLIC_GTM_ID set (pass the same value to Playwright). Without one there is no
// banner to test, which the last test checks instead.
const configured = TOOLS.length > 0;

// A first visit: drop the answered consent playwright.config.ts gives every other spec.
test.use({ storageState: { cookies: [], origins: [] } });

/** Answers Tag Manager with an empty script and counts the requests; every other third-party request fails the test. */
async function stubThirdParties(page: Page): Promise<{ gtm: number; other: string[] }> {
  const seen = { gtm: 0, other: [] as string[] };
  await page.route(/^https:\/\/(?!localhost)/, async (route) => {
    const url = route.request().url();
    if (url.startsWith("https://www.googletagmanager.com/gtm.js")) {
      seen.gtm += 1;
      await route.fulfill({ contentType: "text/javascript", body: "" });
    } else {
      seen.other.push(url);
      await route.abort();
    }
  });
  return seen;
}

/** The dataLayer with gtag's Arguments objects turned into arrays. */
function dataLayer(page: Page): Promise<unknown[]> {
  return page.evaluate(() => (window.dataLayer ?? []).map((entry) => (entry && typeof entry === "object" && "length" in entry ? Array.from(entry as ArrayLike<unknown>) : entry)));
}

const banner = (page: Page) => page.getByRole("region", { name: CONSENT.title });

test.describe("consent banner", () => {
  test.skip(!configured, "NEXT_PUBLIC_GTM_ID is not set for this build");

  test("asks first, loads nothing, and keeps the hero button clear", async ({ page }) => {
    const seen = await stubThirdParties(page);
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    await expect(banner(page).getByText(CONSENT.nothing, { exact: true })).toBeVisible();
    await expect(banner(page).getByRole("switch")).toHaveCount(0);

    const hero = await page.locator("#hero").getByRole("link", { name: PRIMARY_CTA.label }).boundingBox();
    const card = await banner(page).boundingBox();
    if ((page.viewportSize()?.width ?? 0) >= 1000 && hero && card) {
      expect(hero.x + hero.width <= card.x || hero.y + hero.height <= card.y).toBe(true);
    }

    await page.waitForTimeout(500);
    expect(seen.gtm).toBe(0);
    expect(seen.other).toEqual([]);
    const results = await new AxeBuilder({ page }).include("[aria-labelledby]").withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations.map(({ id }) => id)).toEqual([]);
  });

  test("Reject all stores the no and never starts Tag Manager", async ({ page }) => {
    const seen = await stubThirdParties(page);
    await page.goto("/");
    await banner(page).getByRole("button", { name: CONSENT.reject }).click();
    await expect(banner(page)).toHaveCount(0);
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null"), CONSENT_KEY);
    expect(stored).toMatchObject({ measurement: false, advertising: false });

    await page.reload();
    await page.waitForTimeout(500);
    await expect(banner(page)).toHaveCount(0);
    expect(seen.gtm).toBe(0);
    expect(await page.evaluate(() => document.cookie)).toBe("");
  });

  test("line by line starts off, and saving measurement only grants analytics", async ({ page }) => {
    const seen = await stubThirdParties(page);
    await page.goto("/");
    await banner(page).getByRole("button", { name: CONSENT.choose }).click();
    const switches = banner(page).getByRole("switch");
    for (const sw of await switches.all()) await expect(sw).toHaveAttribute("aria-checked", "false");

    await switches.first().click();
    await expect(banner(page).getByText(CONSENT.loadsAfterSave)).toBeVisible();
    await banner(page).getByRole("button", { name: CONSENT.save }).click();
    await expect(banner(page)).toHaveCount(0);

    await expect.poll(() => seen.gtm).toBe(1);
    const layer = await dataLayer(page);
    expect(layer).toContainEqual(["consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }]);
    expect(layer).toContainEqual({ event: "bb_consent", consent_measurement: true, consent_advertising: false });

    // Conversions reach Tag Manager once it has started.
    await page.locator("#hero").getByRole("link", { name: PRIMARY_CTA.label }).click();
    await expect.poll(async () => (await dataLayer(page)).some((entry) => (entry as { event?: string }).event === "cta_click")).toBe(true);
  });

  test("Cookie settings reopens the choices, and withdrawing deletes the cookies", async ({ page, context }) => {
    await stubThirdParties(page);
    await page.goto("/");
    await banner(page).getByRole("button", { name: CONSENT.accept }).click();
    await context.addCookies([{ name: "_ga", value: "GA1.1.1", url: page.url() }]);

    await page.getByRole("contentinfo").getByRole("link", { name: "Cookie settings" }).click();
    await expect(page).not.toHaveURL(/\/privacy/);
    await expect(banner(page).getByRole("heading", { name: CONSENT.title })).toBeFocused();
    for (const sw of await banner(page).getByRole("switch").all()) await expect(sw).toHaveAttribute("aria-checked", "true");

    await Promise.all([page.waitForEvent("load"), banner(page).getByRole("button", { name: CONSENT.reject }).click()]);
    expect((await context.cookies()).map((cookie) => cookie.name)).not.toContain("_ga");
    await expect(banner(page)).toHaveCount(0);
  });
});

test("without a container there is no banner and no Cookie settings link", async ({ page }) => {
  test.skip(configured, "this build has a container");
  await page.goto("/");
  await expect(banner(page)).toHaveCount(0);
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Cookie settings" })).toHaveCount(0);
});
