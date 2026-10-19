// app/llms.txt/route.ts
import { SIGNUP_ADDON_TERMS } from "@/content/legal/fees";
import { formatInr, GST_RATE, PLANS } from "@/lib/pricing";
import { businessDetails, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET(): Response {
  const gstPercent = Math.round(GST_RATE * 100);
  const { locality, region } = businessDetails.postalAddress;
  const plans = Object.values(PLANS).map((p) => `- ${p.name}: ${formatInr(p.monthly)} a month before ${gstPercent}% GST${p.requires ? ", added to Managed Website" : ""}`).join("\n");
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a brand of ${businessDetails.legalName} (GSTIN ${businessDetails.gstNumber}), ${locality}, ${region}, India.

## Plans
${plans}

${SIGNUP_ADDON_TERMS}

## Pages
- [Pricing](${siteConfig.url}/pricing)
- [Contact](${siteConfig.url}/contact)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
