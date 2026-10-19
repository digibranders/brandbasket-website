/** Field names shared by the contact form (client) and the honeypot screen (server). No server imports here. */

/** Hidden decoy field names. Any non-empty value flags a bot. */
export const HONEYPOT_FIELDS = ["company_website", "fax_number"] as const;

/** Body key carrying the signed form token. */
export const FORM_TOKEN_FIELD = "formToken";
