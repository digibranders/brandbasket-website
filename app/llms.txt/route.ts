// app/llms.txt/route.ts
import { PACKAGE_TERMS } from "@/content/legal/fees";
import { formatMoney } from "@/lib/currency";
import { GST_LABEL, monthlyTotal, PACKAGES, packageSaving, packageTotal, planPrice, PLANS } from "@/lib/pricing";
import { indexableRoutes, routeUrl } from "@/lib/seo/routes";
import { businessDetails, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

/** This file describes the rupee offer, the one search engines and assistants are shown (proxy.ts gives bots rupees too). */
const inr = (amount: number): string => formatMoney(amount, "INR");

export function GET(): Response {
  const { locality, region } = businessDetails.postalAddress;
  const plans = Object.values(PLANS).map((p) => `- ${p.name}: ${inr(planPrice(p.id, "INR"))} a month, GST included`).join("\n");
  const packages = PACKAGES.map((p) => {
    const credit = p.adCredit.INR > 0 ? ` Bought together as you start: ${inr(p.adCredit.INR)} a month of ad credit.` : "";
    return `- ${p.name}: ${inr(monthlyTotal(p.pick, "INR"))} a month at list price; ${inr(packageTotal(p.pick, "INR"))} a month as a package (${p.percent}% off, you save ${inr(packageSaving(p.pick, "INR"))}).${credit}`;
  }).join("\n");
  const pages = indexableRoutes().map((r) => `- [${r.title}](${routeUrl(r.path)})`).join("\n");
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a brand of ${businessDetails.legalName} (GSTIN ${businessDetails.gstNumber}), ${locality}, ${region}, India.

## Key facts
- Website build: ${inr(0)}
- GST: ${GST_LABEL}, included in every price
- Billing: monthly
- Package offer: ${PACKAGE_TERMS}

## Plans
${plans}

## Packages
${packages}

## Pages
${pages}

## Blog
- [Guides for local businesses](${routeUrl("/blog")}), with an RSS feed at ${routeUrl("/blog/feed.xml")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
