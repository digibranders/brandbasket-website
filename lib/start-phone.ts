// lib/start-phone.ts
import { START_ERRORS } from "@/content/start";
import { readMobile } from "./start-schema";

/**
 * The number as the form sends it: the chosen dial code, a space and the digits typed. A number typed with its own "+code"
 * wins over the dropdown. A leading 0 (the trunk prefix) is dropped, and for India so is a typed "91".
 */
export function composePhone(dial: string, typed: string): string {
  const text = typed.trim();
  if (text.startsWith("+")) return text.replace(/[^\d+]/g, "");
  let digits = text.replace(/\D/g, "");
  if (dial === "+91" && /^91\d{10}$/.test(digits)) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "");
  return digits === "" ? "" : `${dial} ${digits}`;
}

/** The message to show under the mobile field, or "" when the number is fine. India takes a 10-digit Indian mobile; anywhere else, any plausible international number. */
export function phoneError(typed: string, dial: string, iso: string): string {
  const mobile = readMobile(composePhone(dial, typed));
  const indian = iso === "IN" && !typed.trim().startsWith("+");
  if (mobile === null) return indian ? START_ERRORS.phoneIndia : START_ERRORS.phone;
  return indian && mobile.indian === "" ? START_ERRORS.phoneIndia : "";
}
