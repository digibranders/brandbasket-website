// app/llms.txt/route.ts
import { formatInr, PLANS } from "@/lib/pricing";
import { businessDetails, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET(): Response {
  const plans = Object.values(PLANS).map((p) => `- ${p.name}: ${formatInr(p.monthly)} a month before 18% GST${p.requires ? ", added to Managed Website" : ""}`).join("\n");
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a brand of ${businessDetails.legalName} (GSTIN ${businessDetails.gstNumber}), Thane, Maharashtra, India.

## Plans
${plans}

## Pages
- [Pricing](${siteConfig.url}/pricing)
- [Contact](${siteConfig.url}/contact)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
