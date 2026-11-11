// app/llms.txt/route.ts
import { formatMoney } from "@/lib/currency";
import { getPostsPage } from "@/lib/cms/blog";
import { extrasFor, GST_LABEL, MONITORING, monitoringPrice, planPrice, PLANS } from "@/lib/pricing";
import { indexableRoutes, routeUrl } from "@/lib/seo/routes";
import { businessDetails, siteConfig } from "@/lib/site-config";

// Rendered per request: the newest posts come from the CMS. If the CMS cannot answer, the file is still served without the post list.
export const dynamic = "force-dynamic";

/** This file describes the rupee offer, the one search engines and assistants are shown (proxy.ts gives bots rupees too). */
const inr = (amount: number): string => formatMoney(amount, "INR");

/** The newest posts as list lines, or nothing when the CMS cannot answer. */
async function latestPosts(): Promise<string> {
  try {
    const { posts } = await getPostsPage(1);
    return posts.map((post) => `- [${post.title}](${routeUrl(`/blog/${post.slug}`)}): ${post.excerpt}`).join("\n");
  } catch {
    return "";
  }
}

export async function GET(): Promise<Response> {
  const { locality, region } = businessDetails.postalAddress;
  const plans = Object.values(PLANS).map((p) => `- ${p.name}: ${inr(planPrice(p.id, "INR"))} a month, GST included`).join("\n");
  const pages = indexableRoutes().map((r) => `- [${r.title}](${routeUrl(r.path)}): ${r.description}`).join("\n");
  const { hour, adBudgetCap } = extrasFor("INR");
  const posts = await latestPosts();
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a brand of ${businessDetails.legalName} (GSTIN ${businessDetails.gstNumber}), ${locality}, ${region}, India.

## Key facts
- Website build: ${inr(0)}
- GST: ${GST_LABEL}, included in every price
- Billing: monthly, cancel anytime with no notice period
- Website Management: up to 10 pages built for you; live within 7 working days of your details and first payment; 2 edits a month of 15 minutes each; extra work is quoted first (${inr(hour)} an hour)
- Social Media Management: AI content, captions and images; automated posting and scheduling on up to 4 platforms
- Paid Ads Management: Meta ads with AI ad copy and creatives; covers up to ${inr(adBudgetCap)} a month of your ad budget; ad spend is paid to Meta by you
- ${MONITORING.name}: included with all three plans, otherwise ${inr(monitoringPrice("INR"))} a month
- The domain is registered in your name; the design and content we write are provided as a hosted service while you are subscribed
- Offers: none. Every plan costs the same and is billed at its own price. The only offer is ${MONITORING.name}, included with all three plans

## Plans
${plans}

## Pages
${pages}

## Blog
- [Guides for local businesses](${routeUrl("/blog")}), with an RSS feed at ${routeUrl("/blog/feed.xml")}
${posts}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
