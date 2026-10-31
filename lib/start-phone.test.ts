import { describe, expect, it } from "vitest";
import { countryByIso, countryFromLocale, PHONE_COUNTRIES } from "@/content/phone-countries";
import { START_ERRORS } from "@/content/start";
import { composePhone, phoneError } from "./start-phone";
import { readMobile } from "./start-schema";

describe("composePhone", () => {
  it.each([
    ["+91", "98765 43210", "+91 9876543210"],
    ["+91", "09876543210", "+91 9876543210"],
    ["+91", "919876543210", "+91 9876543210"],
    ["+971", "50 123 4567", "+971 501234567"],
    ["+44", "07700 900123", "+44 7700900123"],
    ["+91", "+44 7700 900123", "+447700900123"],
    ["+91", "", ""],
    ["+91", "  ", ""],
  ])("%s with %j gives %j", (dial, typed, sent) => {
    expect(composePhone(dial, typed)).toBe(sent);
  });

  it("is something the server reads: an Indian mobile as one, a foreign number as an international one", () => {
    expect(readMobile(composePhone("+91", "98765 43210"))).toEqual({ e164: "+919876543210", indian: "9876543210" });
    expect(readMobile(composePhone("+971", "50 123 4567"))).toEqual({ e164: "+971501234567", indian: "" });
  });
});

describe("phoneError", () => {
  it("asks India for a 10-digit Indian mobile", () => {
    expect(phoneError("98765 43210", "+91", "IN")).toBe("");
    for (const bad of ["", "12345", "5876543210", "987654321"]) expect(phoneError(bad, "+91", "IN"), bad).toBe(START_ERRORS.phoneIndia);
  });

  it("takes any plausible number elsewhere, and says so plainly when it is not", () => {
    expect(phoneError("50 123 4567", "+971", "AE")).toBe("");
    expect(phoneError("7700 900123", "+44", "GB")).toBe("");
    for (const bad of ["", "12", "abc"]) expect(phoneError(bad, "+44", "GB"), bad).toBe(START_ERRORS.phone);
  });

  it("lets a number typed with its own +code through whichever country is chosen", () => {
    expect(phoneError("+44 7700 900123", "+91", "IN")).toBe("");
  });
});

describe("country list", () => {
  it("starts with India and has one entry per country code", () => {
    expect(PHONE_COUNTRIES[0]?.iso).toBe("IN");
    const isos = PHONE_COUNTRIES.map((c) => c.iso);
    expect(new Set(isos).size).toBe(isos.length);
    for (const c of PHONE_COUNTRIES) expect(c.dial, c.name).toMatch(/^\+\d{1,3}$/);
  });

  it("finds a country by its code and by a browser language", () => {
    expect(countryByIso("AE")?.dial).toBe("+971");
    expect(countryFromLocale("en-GB")?.iso).toBe("GB");
    expect(countryFromLocale("en_AE")?.iso).toBe("AE");
    expect(countryFromLocale("en")).toBeUndefined();
    expect(countryFromLocale("fr-ZZ")).toBeUndefined();
  });
});
