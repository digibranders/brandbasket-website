// app/llms.txt/route.ts
import { PACKAGE_TERMS } from "@/content/legal/fees";
import { firstPayment, formatInr, GST_LABEL, monthlyTotal, PACKAGES, packageTotal, PLANS } from "@/lib/pricing";
import { indexableRoutes, routeUrl } from "@/lib/seo/routes";
import { businessDetails, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET(): Response {
  const { locality, region } = businessDetails.postalAddress;
  const plans = Object.values(PLANS).map((p) => `- ${p.name}: ${formatInr(p.monthly)} a month before ${GST_LABEL} GST`).join("\n");
  const packages = PACKAGES.map((p) => {
    const credit = p.adCredit > 0 ? ` Bought together as you start: ${formatInr(p.adCredit)} a month of ad credit.` : "";
    return `- ${p.name}: ${formatInr(monthlyTotal(p.pick))} a month at list price; ${formatInr(packageTotal(p.pick))} a month as a package (${p.percent}% off); first payment ${formatInr(firstPayment(packageTotal(p.pick)).total)} with GST.${credit}`;
  }).join("\n");
  const pages = indexableRoutes().map((r) => `- [${r.title}](${routeUrl(r.path)})`).join("\n");
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a brand of ${businessDetails.legalName} (GSTIN ${businessDetails.gstNumber}), ${locality}, ${region}, India.

## Key facts
- Website build: ${formatInr(0)}
- GST: ${GST_LABEL} on top
- Billing: monthly
- Package offer: ${PACKAGE_TERMS}

## Plans
${plans}

## Packages
${packages}

## Pages
${pages}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
