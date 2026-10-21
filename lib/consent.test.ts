import { describe, expect, it } from "vitest";
import {
  allowedVendors,
  consentSignals,
  cookiesToClear,
  decodeRecord,
  encodeRecord,
  NO_CONSENT,
  parseGtmId,
  purposesOf,
  toolsOf,
  withdrawn,
} from "./consent";

const NOW = new Date("2026-10-21T10:00:00Z");
// Every known tool, so the advertising rules stay covered while the container runs measurement only.
const ALL = toolsOf("GTM-ABC1234", ["ga4", "clarity", "googleAds", "metaPixel"]);

describe("parseGtmId", () => {
  it("treats unset and blank ids as not configured", () => {
    expect(parseGtmId({})).toBeNull();
    expect(parseGtmId({ NEXT_PUBLIC_GTM_ID: "  " })).toBeNull();
  });

  it("accepts a container id", () => {
    expect(parseGtmId({ NEXT_PUBLIC_GTM_ID: "GTM-ABC1234" })).toBe("GTM-ABC1234");
  });

  it("names the variable when the id is malformed", () => {
    expect(() => parseGtmId({ NEXT_PUBLIC_GTM_ID: "G-ABC1234" })).toThrow("NEXT_PUBLIC_GTM_ID");
    expect(() => parseGtmId({ NEXT_PUBLIC_GTM_ID: "gtm-abc1234" })).toThrow("NEXT_PUBLIC_GTM_ID");
  });
});

describe("tools and purposes", () => {
  it("loads no tool without a container", () => {
    expect(toolsOf(null)).toEqual([]);
  });

  it("runs Google Analytics and Clarity only, as the owner decided on 2026-10-21", () => {
    expect(toolsOf("GTM-ABC1234")).toEqual(["ga4", "clarity"]);
    expect(purposesOf(toolsOf("GTM-ABC1234"))).toEqual(["measurement"]);
  });

  it("lists the container's tools in display order", () => {
    expect(ALL).toEqual(["ga4", "clarity", "googleAds", "metaPixel"]);
    expect(toolsOf("GTM-ABC1234", ["metaPixel", "ga4"])).toEqual(["ga4", "metaPixel"]);
  });

  it("asks only about purposes that have a tool", () => {
    expect(purposesOf(ALL)).toEqual(["measurement", "advertising"]);
    expect(purposesOf(["clarity"])).toEqual(["measurement"]);
  });

  it("names only tools whose purpose is allowed", () => {
    expect(allowedVendors(NO_CONSENT, ALL, false)).toEqual([]);
    expect(allowedVendors({ measurement: true, advertising: false }, ALL, false)).toEqual(["ga4", "clarity"]);
    expect(allowedVendors({ measurement: true, advertising: true }, ALL, false)).toEqual(ALL);
  });

  it("treats Global Privacy Control as a no to advertising", () => {
    expect(allowedVendors({ measurement: true, advertising: true }, ALL, true)).toEqual(["ga4", "clarity"]);
  });
});

describe("consentSignals", () => {
  it("denies everything by default", () => {
    expect(consentSignals(NO_CONSENT, false)).toEqual({ analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  });

  it("grants each purpose's signals separately", () => {
    expect(consentSignals({ measurement: true, advertising: false }, false)).toEqual({ analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    expect(consentSignals({ measurement: false, advertising: true }, false)).toEqual({ analytics_storage: "denied", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
  });

  it("keeps advertising denied under Global Privacy Control", () => {
    expect(consentSignals({ measurement: true, advertising: true }, true).ad_storage).toBe("denied");
  });
});

describe("consent record", () => {
  const choice = { measurement: true, advertising: false };

  it("round-trips a choice", () => {
    expect(decodeRecord(encodeRecord(choice, ALL, NOW), ALL, NOW)).toEqual({ ...choice, vendors: ALL, at: NOW.toISOString() });
  });

  it("ignores missing, malformed and tampered records", () => {
    expect(decodeRecord(null, ALL, NOW)).toBeNull();
    expect(decodeRecord("{not json", ALL, NOW)).toBeNull();
    expect(decodeRecord(JSON.stringify({ measurement: "yes", advertising: false, vendors: ALL, at: NOW.toISOString() }), ALL, NOW)).toBeNull();
    expect(decodeRecord(JSON.stringify({ ...choice, vendors: ALL, at: "yesterday" }), ALL, NOW)).toBeNull();
  });

  it("asks again after 12 months", () => {
    const raw = encodeRecord(choice, ALL, NOW);
    expect(decodeRecord(raw, ALL, new Date("2027-10-20T10:00:00Z"))).not.toBeNull();
    expect(decodeRecord(raw, ALL, new Date("2027-10-22T10:00:00Z"))).toBeNull();
  });

  it("asks again when the container's tools change", () => {
    expect(decodeRecord(encodeRecord(choice, ["ga4"], NOW), ALL, NOW)).toBeNull();
  });
});

describe("withdrawal", () => {
  it("reports purposes switched from on to off", () => {
    expect(withdrawn(null, NO_CONSENT)).toEqual([]);
    expect(withdrawn({ measurement: true, advertising: true }, { measurement: true, advertising: false })).toEqual(["advertising"]);
    expect(withdrawn(NO_CONSENT, { measurement: true, advertising: true })).toEqual([]);
  });

  it("picks each purpose's cookies and leaves the rest", () => {
    const names = ["_ga", "_ga_ABC123", "_clck", "_clsk", "_gcl_au", "_fbp", "_fbc", "theme"];
    expect(cookiesToClear(names, ["measurement"])).toEqual(["_ga", "_ga_ABC123", "_clck", "_clsk"]);
    expect(cookiesToClear(names, ["advertising"])).toEqual(["_gcl_au", "_fbp", "_fbc"]);
    expect(cookiesToClear(names, [])).toEqual([]);
  });
});
