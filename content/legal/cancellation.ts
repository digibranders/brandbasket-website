// content/legal/cancellation.ts
import { businessDetails } from "@/lib/site-config";

/**
 * The cancellation, payment and ownership policy (open input D3, answered from the published Fynix policy; owner to
 * confirm in review). Each rule is stated once here and reused by the homepage and pricing FAQs, the pricing Good to
 * know, About, the terms and the refund policy, so they cannot drift apart.
 */
export const RENEWAL_REMINDER = "We remind you before every renewal, so you are never charged by surprise.";
/** Owner-approved answer to "Can I cancel?", used by the homepage and pricing FAQs. */
export const CANCEL_ANSWER = `Yes, anytime, with no notice period. Your plans keep running until the end of the month you have already paid for, and your domain stays yours. ${RENEWAL_REMINDER}`;
export const CANCELLATION_RULE = "There is no notice period: your plans keep running until the end of the month you have already paid for, and that month is the last one charged.";
export const HOSTED_SERVICE = `The design and the content we write stay with ${businessDetails.tradeName} and are provided as a hosted service while you are subscribed.`;
export const PAYMENT_FAILURE = "Your plans pause as soon as a payment is due and unpaid; there is no grace period. A website we host goes offline with its content kept safe, and everything comes back as soon as the payment goes through. Your package price and ad credit stay.";
/** When adding or dropping a plan takes effect. Shared by the terms and the refund policy. */
export const PLAN_CHANGE = "The change starts from your next monthly bill.";
/** Owner-approved answer to "Can I add or drop a plan later?", used by the pricing FAQ. */
export const PLAN_CHANGE_ANSWER = "Yes. Add a plan any time and your basket moves to the package price from your next bill. Drop one from a package and the plans you keep go back to their own prices from your next bill, and package prices never apply to your account again.";
