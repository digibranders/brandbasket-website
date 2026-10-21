/**
 * Version label of the published legal text. Every form sends it, so a lead or consent can be matched to the exact
 * notice the person saw. Rule: publish new text and a new dated label in the same commit; never reuse a label.
 *
 * Changelog
 * 2026-10-19.1  First Brandbasket privacy, terms, refund, shipping and data notice.
 * 2026-10-19.2  Terms section 5: add-ons chosen at sign-up are 5% off for as long as they run.
 * 2026-10-19.3  Terms and refund policy: cancel anytime with no notice period, a reminder before every renewal, a
 *               failed payment takes the website offline at once, and design and content are a hosted service.
 * 2026-10-21.1  Privacy policy: Cookies, sharing and use describe the tools in the Google Tag Manager container (Google
 *               Analytics, Microsoft Clarity, Google Ads, Meta Pixel), loaded only with consent. With no container
 *               configured the text is unchanged.
 */
export const LEGAL_TEXT_VERSION = "2026-10-21.1";
