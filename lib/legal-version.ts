/**
 * Version label of the published legal text. Every form sends it, so a lead or consent can be matched to the exact
 * notice the person saw. Rule: publish new text and a new dated label in the same commit; never reuse a label.
 *
 * Changelog
 * 2026-10-19.1  First Brandbasket privacy, terms, refund, shipping and data notice.
 * 2026-10-19.2  Terms section 5: add-ons chosen at sign-up are 5% off for as long as they run.
 * 2026-10-19.3  Terms and refund policy: cancel anytime with no notice period, a reminder before every renewal, a
 *               failed payment takes the website offline at once, and design and content are a hosted service.
 * 2026-10-21.1  Terms and refund policy: every plan can be bought on its own, package prices replace the 5% sign-up
 *               offer, monthly ad credit for packages taken at the first purchase, and dropping a plan ends the
 *               package price.
 * 2026-10-21.2  Terms and refund policy: cancellation and a failed payment are stated for every plan, so they read
 *               right for a client without the website plan.
 * 2026-10-21.3  Privacy policy: Cookies, sharing and use describe the tools in the Google Tag Manager container (Google
 *               Analytics and Microsoft Clarity), loaded only with consent. With no container configured the text
 *               is unchanged. Not yet published, so the label was kept when Google Ads and Meta Pixel were dropped.
 * 2026-10-22.1  Terms: Social + SEO is 20% off, like the other two-plan packages (was 30%).
 * 2026-10-26.3  Terms: the website plan's 2 edits a month are up to 15 minutes each (was 30).
 * 2026-10-26.2  Terms and refund policy: every price includes GST (it is no longer added on top).
 * 2026-10-26.1  Terms: the website plan includes 2 edits a month of up to 30 minutes each (was worded "small edits").
 *               Privacy: the contact form no longer asks for a topic, so only the plans picked are collected, and it records
 *               that the person agreed to the policy.
 * 2026-10-28.2  Shipping policy: a website is usually live within 7 working days (was "about a week").
 * 2026-10-28.3  Privacy: names OyeChats as the provider of the chat on the contact page, when that chat is switched on.
 */
export const LEGAL_TEXT_VERSION = "2026-10-28.3";
