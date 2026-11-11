// components/shell/closing-paths.ts

/** Pages that end without the closing section: the homepage ends with its own call to action, Contact already is the next step (mock: hidden in the Contact view), legal pages end at the registered office. */
const NO_CLOSING: ReadonlySet<string> = new Set(["/", "/contact", "/privacy", "/terms", "/refund", "/shipping", "/notice"]);

export function showsClosing(pathname: string): boolean {
  return !NO_CLOSING.has(pathname);
}
