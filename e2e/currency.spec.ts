import { expect, test } from "@playwright/test";
import { CURRENCY_COOKIE } from "@/lib/currency";

const COUNTRY = "x-vercel-ip-country";
/** Words a dollar page must never print. innerText keeps words apart, so "running" then "Start" is not read as "gst". */
const NO_TAX_TALK = /\bgst\b|\btax(es)?\b|incl\./i;
const PRICE_PAGES = ["/", "/pricing", "/services/managed-website", "/services/social-media-and-ads", "/services/local-seo-aeo"] as const;

test.describe("a visitor in the United States", () => {
  test.use({ extraHTTPHeaders: { [COUNTRY]: "US" } });

  for (const path of PRICE_PAGES) {
    test(`${path} shows dollars and never mentions GST or tax`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(path);
      await expect(page.locator("body")).toContainText("$");
      const text = await page.locator("body").innerText();
      expect(text).not.toContain("₹");
      expect(text).not.toMatch(NO_TAX_TALK);
      // The page is prebuilt at /usd/...; anything that reads the path must see the address the browser has, or hydration fails.
      expect(errors).toEqual([]);
    });
  }

  test("the pricing page lists the dollar plans, and the address stays /pricing", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/pricing$/);
    const main = page.locator("main");
    for (const price of ["$65", "$150", "$350"]) await expect(main.getByText(price).first()).toBeVisible();
    await expect(page).toHaveTitle(/^Pricing: a free website and monthly plans/);
    await expect(page).not.toHaveTitle(/[₹$]/);
  });

  test("the basket opens in dollars", async ({ page }) => {
    await page.goto("/pricing");
    await page.locator("main").getByRole("button", { name: "Start my plan" }).first().click();
    const basket = page.getByRole("dialog", { name: "Your basket" });
    await expect(basket).toBeVisible();
    await expect(basket).toContainText("$");
    const text = await basket.innerText();
    expect(text).not.toContain("₹");
    expect(text).not.toMatch(NO_TAX_TALK);
  });

  test("the footer switch moves to rupees and remembers it", async ({ page, context }) => {
    await page.goto("/pricing?plan=growth");
    await page.getByRole("contentinfo").getByRole("link", { name: "INR" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.locator("main").getByText("₹2,999").first()).toBeVisible();
    expect((await context.cookies()).find((c) => c.name === CURRENCY_COOKIE)?.value).toBe("INR");
    await page.goto("/");
    await expect(page.locator("body")).toContainText("₹2,999");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "INR" })).toHaveAttribute("aria-current", "true");
  });

  test("the /usd copy is not an address of its own", async ({ request }) => {
    const response = await request.get("/usd/pricing", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location ?? "", "http://localhost").pathname).toBe("/pricing");
  });

  test("a search engine is shown rupees whatever country it crawls from", async ({ browser }) => {
    const context = await browser.newContext({ userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", extraHTTPHeaders: { [COUNTRY]: "US" } });
    const page = await context.newPage();
    await page.goto("/pricing");
    await expect(page.locator("main").getByText("₹2,999").first()).toBeVisible();
    await context.close();
  });
});

test.describe("a visitor in India, or one we cannot place", () => {
  test("sees rupees with GST included, and the switch marks INR", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("main").getByText("₹2,999").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(/incl\. GST/);
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "INR" })).toHaveAttribute("aria-current", "true");
  });

  test("an Indian visitor can switch to dollars from the footer", async ({ page, context }) => {
    await context.setExtraHTTPHeaders({ [COUNTRY]: "IN" });
    await page.goto("/pricing");
    await page.getByRole("contentinfo").getByRole("link", { name: "USD" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.locator("main").getByText("$65").first()).toBeVisible();
    await expect(page.locator("main")).not.toContainText("₹");
  });
});

test("the terms stay in rupees with GST, whatever the page currency", async ({ browser }) => {
  const context = await browser.newContext({ extraHTTPHeaders: { [COUNTRY]: "US" } });
  const page = await context.newPage();
  await page.goto("/terms");
  await expect(page.locator("main")).toContainText("₹2,999");
  await context.close();
});
