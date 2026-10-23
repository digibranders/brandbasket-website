// e2e/contact.spec.ts
import { expect, type Page, test } from "@playwright/test";
import { CONTACT_ERRORS, CONTACT_PAGE, CONTACT_FORM_COPY, CONTACT_LABELS, CONTACT_TOPIC_LABELS } from "@/content/contact";
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
}

test("submitting empty shows the field errors", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: CONTACT_FORM_COPY.submit }).click();
  for (const message of [CONTACT_ERRORS.name, CONTACT_ERRORS.email, CONTACT_ERRORS.business]) {
    await expect(page.getByText(message, { exact: true })).toBeVisible();
  }
  await expect(page.getByLabel(CONTACT_LABELS.name)).toBeFocused();
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

test("?plan=website,search preselects a free website and posts the plans", async ({ page }) => {
  const posted = await mockContactApi(page);
  await page.goto("/contact?plan=website,search#start");
  await expect(page.getByRole("radio", { name: CONTACT_TOPIC_LABELS.website })).toBeChecked();
  await fillRequired(page);
  await page.getByRole("button", { name: CONTACT_FORM_COPY.submit }).click();
  await expect(page.getByRole("status").filter({ hasText: CONTACT_FORM_COPY.doneTitle })).toBeVisible();
  expect(posted()).toMatchObject({ topic: "website", plans: ["website", "search"] });
});

for (const path of ["/", "/pricing"]) {
  test(`every main button on ${path} leads to the app's sign-in`, async ({ page }) => {
    await page.goto(path);
    const hrefs = await page.locator("a", { hasText: PRIMARY_CTA.label }).evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href).toMatch(/^https:\/\/app\.brandbasket\.in\/login\?plan=/);
  });
}

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
