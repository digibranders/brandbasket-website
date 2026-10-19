// content/legal/cancellation.ts
/**
 * Open input D3: the owner has not yet set the cancellation and refund terms. Until then the legal text uses the
 * mock's wording ("Cancel any month" rule and the pricing FAQ), held here so each rule is stated once and changes in
 * one place.
 */
export const CANCELLATION_NOTICE = "30 days' notice";
export const CANCELLATION_RULE = `Cancellation takes effect at the end of the billing month in which your ${CANCELLATION_NOTICE} ends; that month is the last one charged.`;
export const OWNERSHIP_ON_CANCEL = "Your website, domain and content stay yours.";
/** Mock pricing FAQ, "Can I add or drop Growth and Search later?". */
export const ADDON_CHANGE = "The change starts from your next monthly bill.";
