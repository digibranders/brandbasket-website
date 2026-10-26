// e2e/contact.spec.ts
import { expect, type Page, test } from "@playwright/test";
import { BASKET_COPY } from "@/content/basket";
import { BASKET_CARD } from "@/content/basket-card";
import { CONTACT_ERRORS, CONTACT_PAGE, CONTACT_FORM_COPY, CONTACT_LABELS, CONTACT_PLACEHOLDERS } from "@/content/contact";
import { PRIMARY_CTA } from "@/content/navigation";

/** Mocks the token and contact endpoints; resolves with the JSON body the form posted. */
async function mockContactApi(page: Page): Promise<() => unknown> {
  let posted: unknown = null;
  await page.route("**/api/form-token", (route) => route.fulfill({ json: { token: "e2e-token" } }));
  await page.route("**/api/contact", (route) => {
    posted = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true } });
  });
  return () => posted;
}

async function fillRequired(page: Page): Promise<void> {
  await page.getByLabel(CONTACT_LABELS.name).fill("Asha Rao");
  await page.getByLabel(CONTACT_LABELS.phone).fill("98765 43210");
  await page.getByLabel(CONTACT_LABELS.email).fill("asha@example.com");
  await page.getByLabel(CONTACT_LABELS.business).fill("Asha Dental Clinic");
  await page.getByRole("textbox", { name: CONTACT_LABELS.message }).fill("Please call me this week");
  await page.getByRole("checkbox", { name: /privacy policy/ }).check();
}

test("submitting empty shows the field errors", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: CONTACT_FORM_COPY.submit }).click();
  for (const message of [CONTACT_ERRORS.name, CONTACT_ERRORS.email, CONTACT_ERRORS.business, CONTACT_ERRORS.message, CONTACT_ERRORS.consent]) {
    await expect(page.getByText(message, { exact: true })).toBeVisible();
  }
  await expect(page.getByLabel(CONTACT_LABELS.name)).toBeFocused();
});

test("the form shows an example in each text field and an unticked privacy checkbox", async ({ page }) => {
  await page.goto("/contact");
  for (const [name, text] of Object.entries(CONTACT_PLACEHOLDERS)) {
    await expect(page.locator(`[name="${name}"]`)).toHaveAttribute("placeholder", text);
  }
  const box = page.getByRole("checkbox", { name: /privacy policy/ });
  await expect(box).not.toBeChecked();
  const link = page.locator("#start").getByRole("link", { name: "privacy policy" });
  await expect(link).toHaveAttribute("href", "/privacy");
  await expect(link).toHaveAttribute("target", "_blank");
});

test("required fields carry a red asterisk and optional ones say optional", async ({ page }) => {
  await page.goto("/contact");
  for (const name of ["name", "business", "email", "message"]) await expect(page.locator(`label[for="ct-${name}"]`)).toContainText("*");
  for (const name of ["phone", "city"]) {
    const label = page.locator(`label[for="ct-${name}"]`);
    await expect(label).not.toContainText("*");
    await expect(label).toContainText(CONTACT_LABELS.optional);
  }
});

test("an unticked privacy checkbox blocks the send and says why", async ({ page }) => {
  const posted = await mockContactApi(page);
  await page.goto("/contact");
  await fillRequired(page);
  await page.getByRole("checkbox", { name: /privacy policy/ }).uncheck();
  await page.getByRole("button", { name: CONTACT_FORM_COPY.submit }).click();
  await expect(page.getByText(CONTACT_ERRORS.consent, { exact: true })).toBeVisible();
  expect(posted()).toBeNull();
});

test("a valid submission shows the thank-you message and focuses it", async ({ page }) => {
  await mockContactApi(page);
  await page.goto("/contact");
  await fillRequired(page);
  await page.getByRole("button", { name: CONTACT_FORM_COPY.submit }).click();
  const done = page.getByRole("status").filter({ hasText: CONTACT_FORM_COPY.doneTitle });
  await expect(done).toBeVisible();
  await expect(done).toBeFocused();
});

test("?plan=website,search posts the plans and no topic", async ({ page }) => {
  const posted = await mockContactApi(page);
  await page.goto("/contact?plan=website,search#start");
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: CONTACT_LABELS.message })).toBeVisible();
  await fillRequired(page);
  await page.getByRole("button", { name: CONTACT_FORM_COPY.submit }).click();
  await expect(page.getByRole("status").filter({ hasText: CONTACT_FORM_COPY.doneTitle })).toBeVisible();
  expect(posted()).toMatchObject({ plans: ["website", "search"], message: "Please call me this week", consent: true });
  expect(posted()).not.toHaveProperty("topic");
});

for (const path of ["/", "/pricing"]) {
  test(`every main button on ${path} opens the basket, and the basket leads to the app's sign-in`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("link", { name: PRIMARY_CTA.label })).toHaveCount(0);
    const buttons = page.locator("main").getByRole("button", { name: PRIMARY_CTA.label });
    expect(await buttons.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await buttons.count()); i += 1) {
      await buttons.nth(i).scrollIntoViewIfNeeded();
      await buttons.nth(i).click();
      const basket = page.getByRole("dialog", { name: BASKET_COPY.dockLabel });
      await expect(basket).toBeVisible();
      await expect(basket.getByRole("link", { name: BASKET_COPY.proceed })).toHaveAttribute("href", /^https:\/\/app\.brandbasket\.in\/login\?plan=/);
      await page.keyboard.press("Escape");
      await expect(basket).toHaveCount(0);
    }
  });
}

test("the Basket Card's checkout button opens the basket, and the basket leads to the app's sign-in", async ({ page }) => {
  await page.goto("/");
  await page.locator("#basket-card").getByRole("button", { name: new RegExp(`^(${BASKET_CARD.checkoutCta}|${BASKET_CARD.checkoutCtaShort})$`) }).click();
  const basket = page.getByRole("dialog", { name: BASKET_COPY.dockLabel });
  await expect(basket).toBeVisible();
  await expect(basket.getByRole("link", { name: BASKET_COPY.proceed })).toHaveAttribute("href", /^https:\/\/app\.brandbasket\.in\/login\?plan=/);
});

test.describe("on a 390 px phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the form starts above the channel rows", async ({ page }) => {
    await page.goto("/contact");
    const form = await page.locator("#start form").boundingBox();
    const channels = await page.getByRole("link", { name: new RegExp(CONTACT_PAGE.whatsappNote) }).boundingBox();
    if (!form || !channels) throw new Error("The form or the channel rows did not render");
    expect(form.y).toBeLessThan(channels.y);
  });
});
