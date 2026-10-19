// No imports on purpose: next.config.ts loads this file directly.
/**
 * Launch switch for search indexing. The site is noindex everywhere, production included, until the owner approves
 * launch and SITE_INDEXING=on is set in Vercel production. robots.ts, the meta robots tag and the X-Robots-Tag header
 * all use this.
 */
export function isProductionSite(): boolean {
  return process.env.SITE_INDEXING === "on" && process.env.VERCEL_ENV === "production";
}
