/** An ISO calendar date in the visitor's timezone, independent of the machine running the app. */
export function calendarDate(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)?.value).join("-");
}

/** Treat date-only strings as calendar coordinates so the weekday cannot shift with the browser timezone. */
export function dateOf(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

export function calendarMonth(date: string): string {
  return date.slice(0, 7);
}

export function shiftCalendarMonth(month: string, offset: number): string {
  const date = dateOf(`${month}-01`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return calendarMonth(date.toISOString());
}

export function calendarWeeks(month: string): readonly (readonly (string | null)[])[] {
  const first = dateOf(`${month}-01`);
  const leading = (first.getUTCDay() + 6) % 7;
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((leading + last) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, column) => {
      const day = week * 7 + column - leading + 1;
      return day < 1 || day > last ? null : `${month}-${String(day).padStart(2, "0")}`;
    }));
}
