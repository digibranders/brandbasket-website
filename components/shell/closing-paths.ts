import { ECOMMERCE_PATH } from "@/content/ecommerce";

/** Pages that end without the closing section: the homepage and ecommerce page have their own calls to action, Contact already is the next step (mock: hidden in the Contact view), legal pages end at the registered office. */
const NO_CLOSING: ReadonlySet<string> = new Set(["/", ECOMMERCE_PATH, "/contact", "/privacy", "/terms", "/refund", "/shipping", "/notice"]);

export function showsClosing(pathname: string): boolean {
  return !NO_CLOSING.has(pathname);
}
