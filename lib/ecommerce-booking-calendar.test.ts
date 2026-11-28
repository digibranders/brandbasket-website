import { describe, expect, it } from "vitest";
import { calendarDate, calendarWeeks, shiftCalendarMonth } from "./ecommerce-booking-calendar";

describe("booking month view", () => {
  it("puts each date in a Monday-first week and pads the month edges", () => {
    const weeks = calendarWeeks("2026-12");
    expect(weeks[0]).toEqual([null, "2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04", "2026-12-05", "2026-12-06"]);
    expect(weeks.at(-1)).toEqual(["2026-12-28", "2026-12-29", "2026-12-30", "2026-12-31", null, null, null]);
  });

  it("shows a leap day and navigates across year boundaries", () => {
    expect(calendarWeeks("2028-02").flat()).toContain("2028-02-29");
    expect(calendarWeeks("2027-02").flat()).not.toContain("2027-02-29");
    expect(shiftCalendarMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftCalendarMonth("2027-01", -1)).toBe("2026-12");
  });

  it("uses the visitor's date when the clock crosses midnight in their timezone", () => {
    const instant = new Date("2026-11-30T19:00:00Z");
    expect(calendarDate(instant, "Asia/Kolkata")).toBe("2026-12-01");
    expect(calendarDate(instant, "America/New_York")).toBe("2026-11-30");
  });
});
