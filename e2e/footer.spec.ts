import { expect, test } from "@playwright/test";
import { FOOTER_NAV, LEGAL_NAV } from "../content/navigation";
import { businessDetails } from "../lib/site-config";

test("footer keeps navigation and contact details accessible at every size", async ({ page }) => {
  await page.goto("/about");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();

  for (const [name, links] of [["Brandbasket", FOOTER_NAV], ["Legal", LEGAL_NAV]] as const) {
    const navigation = footer.getByRole("navigation", { name, exact: true });
    for (const link of links) {
      await expect(navigation.getByRole("link", { name: link.label, exact: true })).toHaveAttribute("href", link.href);
    }
  }

  await expect(footer.getByRole("link", { name: businessDetails.email })).toHaveAttribute("href", `mailto:${businessDetails.email}`);
  await expect(footer.getByRole("link", { name: businessDetails.phone })).toHaveAttribute("href", `tel:${businessDetails.phoneHref}`);
  // The legal entity is named on the Contact, About, Privacy and Terms pages, not in the footer (owner, 2026-10-26).
  await expect(footer.getByText(businessDetails.legalName, { exact: false })).toHaveCount(0);
  await expect(footer.getByText(`© ${new Date().getFullYear()} ${businessDetails.tradeName}`)).toBeVisible();

  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await footer.evaluate((element) => element.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const contact = footer.getByRole("link", { name: businessDetails.email });
    await contact.focus();
    await expect(contact).toBeFocused();
    await expect(contact).toHaveCSS("outline-style", "solid");
  }
});
