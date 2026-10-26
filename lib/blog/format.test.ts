import { describe, expect, it } from "vitest";
import { formatDate, initials, pageNumber, readingTime } from "./format";

describe("formatDate", () => {
  it("writes the day, short month and year in India time", () => {
    expect(formatDate("2026-10-23T04:30:00.000Z")).toBe("23 Oct 2026");
    expect(formatDate("2026-10-22T20:00:00.000Z")).toBe("23 Oct 2026");
  });
});

describe("readingTime", () => {
  it("is at least one minute", () => {
    expect(readingTime(7)).toBe("7 min read");
    expect(readingTime(0)).toBe("1 min read");
  });
});

describe("initials", () => {
  it("takes the first letters of the first and last name", () => {
    expect(initials("Ananya Kulkarni")).toBe("AK");
    expect(initials("Sana")).toBe("S");
    expect(initials("  ")).toBe("?");
  });
});

describe("pageNumber", () => {
  it("accepts whole numbers only", () => {
    expect(pageNumber("2")).toBe(2);
    expect(pageNumber("0")).toBeNull();
    expect(pageNumber("02")).toBeNull();
    expect(pageNumber("1.5")).toBeNull();
    expect(pageNumber("abc")).toBeNull();
    expect(pageNumber("99999")).toBeNull();
  });
});
