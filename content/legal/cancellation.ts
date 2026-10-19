// content/legal/cancellation.ts
import { businessDetails } from "@/lib/site-config";

/**
 * The cancellation, payment and ownership policy (open input D3, answered from the published Fynix policy; owner to
 * confirm in review). Each rule is stated once here and reused by the homepage and pricing FAQs, the pricing Good to
 * know, About, the terms and the refund policy, so they cannot drift apart.
 */
export const RENEWAL_REMINDER = "We remind you before every renewal, so you are never charged by surprise.";
/** Owner-approved answer to "Can I cancel?", used by the homepage and pricing FAQs. */
export const CANCEL_ANSWER = `Yes, anytime, with no notice period. Your website stays online until the end of the month you have already paid for, and your domain stays yours. ${RENEWAL_REMINDER}`;
export const CANCELLATION_RULE = "There is no notice period: your website stays online until the end of the month you have already paid for, and that month is the last one charged.";
export const HOSTED_SERVICE = `The design and the content we write stay with ${businessDetails.tradeName} and are provided as a hosted service while you are subscribed.`;
export const PAYMENT_FAILURE = "Your website is taken offline as soon as a payment is due and unpaid; there is no grace period. Your content is kept safe, and the website comes back as soon as the payment goes through.";
/** Mock pricing FAQ, "Can I add or drop Growth and Search later?". */
export const ADDON_CHANGE = "The change starts from your next monthly bill.";
