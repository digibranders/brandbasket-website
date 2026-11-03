// app/robots.txt/route.ts
import { isProductionSite, siteConfig } from "@/lib/site-config";

/**
 * Next's robots.ts has no field for Content-Signal, so robots.txt is written by hand.
 * Content Signals (contentsignals.org): search results and AI answers may use the pages, model training may not.
 */
export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=no";

/** Crawlers that collect pages to train models. They are refused; the crawlers that fetch a page to answer a person's question stay allowed. */
export const TRAINING_CRAWLERS = ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "Applebot-Extended", "Bytespider", "meta-externalagent"] as const;

/** Crawlers and agents that read a page to answer a question or to run a search. Named so the policy is explicit. */
export const ANSWER_CRAWLERS = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"] as const;

const PRIVATE_PATHS = ["/api/", "/blog/preview/"] as const;

export function robotsTxt(production: boolean): string {
  if (!production) return "User-Agent: *\nDisallow: /\n";
  const open = ["Allow: /", ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`)].join("\n");
  const groups = [
    `User-Agent: *\nContent-Signal: ${CONTENT_SIGNAL}\n${open}`,
    ...ANSWER_CRAWLERS.map((bot) => `User-Agent: ${bot}\n${open}`),
    ...TRAINING_CRAWLERS.map((bot) => `User-Agent: ${bot}\nDisallow: /`),
  ];
  return `${groups.join("\n\n")}\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`;
}

export function GET(): Response {
  return new Response(robotsTxt(isProductionSite()), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
}
