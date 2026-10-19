import { expect, test } from "@playwright/test";

const legalPages = ["/privacy", "/terms", "/refund", "/shipping", "/notice"];

for (const path of legalPages) {
  test(`${path} contents navigate on desktop and phone`, async ({ page }, testInfo) => {
    await page.goto(path);
    const mobile = testInfo.project.name === "phone";
    if (mobile) await page.getByText("On this page", { exact: true }).filter({ visible: true }).click();
    const contents = page.getByRole("navigation", { name: "On this page" }).filter({ visible: true });
    await expect(contents).toBeVisible();
    const link = contents.getByRole("link").nth(1);
    const href = await link.getAttribute("href");
    if (!href) throw new Error("A contents link is missing its anchor");
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator(href)).toBeInViewport();
    const top = await page.locator(href).evaluate((element) => element.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(100);
    if (mobile) {
      await expect(page.locator("details[open]")).toHaveCount(0);
    } else {
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(link).toHaveCSS("font-weight", "600");
      await expect(link).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const office = page.locator("section[aria-labelledby=registered-office]");
    const padding = await office.evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft));
    expect(padding).toBeGreaterThanOrEqual(20);
  });
}

test("contact presents a named form without published hours", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByText("Hours", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Mon to Sat, 10 am to 7 pm IST", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("form", { name: "Send us a message" })).toBeVisible();
  await expect(page.getByText("Fields marked optional can be left blank.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
