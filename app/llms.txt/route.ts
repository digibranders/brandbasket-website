// app/llms.txt/route.ts
import { SIGNUP_ADDON_TERMS } from "@/content/legal/fees";
import { firstPayment, formatInr, GST_LABEL, monthlyTotal, PACKAGES, PLANS, signupTotal } from "@/lib/pricing";
import { indexableRoutes, routeUrl } from "@/lib/seo/routes";
import { businessDetails, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET(): Response {
  const { locality, region } = businessDetails.postalAddress;
  const plans = Object.values(PLANS).map((p) => `- ${p.name}: ${formatInr(p.monthly)} a month before ${GST_LABEL} GST${p.requires ? ", added to Managed Website" : ""}`).join("\n");
  const packages = PACKAGES.map((p) => {
    const atSignup = signupTotal(p.addons);
    return `- ${p.name}: ${formatInr(monthlyTotal(p.addons))} a month at list price; ${formatInr(atSignup)} a month when chosen at sign-up; first payment at sign-up ${formatInr(firstPayment(atSignup).total)} including ${GST_LABEL} GST`;
  }).join("\n");
  const pages = indexableRoutes().map((r) => `- [${r.title}](${routeUrl(r.path)})`).join("\n");
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a brand of ${businessDetails.legalName} (GSTIN ${businessDetails.gstNumber}), ${locality}, ${region}, India.

## Key facts
- Website build: ${formatInr(0)}
- GST: ${GST_LABEL} on top
- Billing: monthly
- Sign-up discount: ${SIGNUP_ADDON_TERMS}

## Plans
${plans}

## Packages
${packages}

## Pages
${pages}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
