// lib/blog/format.ts: how a post's date and reading time are written.
const DATE = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** "23 Oct 2026", in India time. */
export const formatDate = (iso: string): string => DATE.format(new Date(iso));

export const readingTime = (minutes: number): string => `${Math.max(1, minutes)} min read`;

/** First letters of the first and last name: "Ananya Kulkarni" is "AK". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter((word) => word !== "");
  const first = words[0]?.[0];
  if (first === undefined) return "?";
  const last = words.length > 1 ? words[words.length - 1]?.[0] : undefined;
  return `${first}${last ?? ""}`.toUpperCase();
}

/** The page number in "/blog/page/<n>": a whole number of 2 or more, or null. Page 1 lives at /blog. */
export function pageNumber(raw: string): number | null {
  return /^[1-9][0-9]{0,3}$/.test(raw) ? Number(raw) : null;
}
