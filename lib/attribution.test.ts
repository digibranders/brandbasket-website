import { describe, expect, it } from "vitest";
import { readAttribution } from "./attribution";

const NOW = 1_800_000_000_000;
const BASE = { search: "", cookie: "", consent: { measurement: false, advertising: false }, path: "/start", referrer: "", host: "www.brandbasket.in", now: NOW };

describe("readAttribution", () => {
  it("reads the campaign and click ids from the address whatever was consented to", () => {
    const read = readAttribution({ ...BASE, search: "?utm_source=meta&utm_medium=paid_social&utm_campaign=Diwali&utm_content=ad1&utm_term=set2&fbclid=IwAR0&gclid=g1&other=x" });
    expect(read?.values).toEqual({
      utm_source: "meta", utm_medium: "paid_social", utm_campaign: "Diwali", utm_content: "ad1", utm_term: "set2", fbclid: "IwAR0", gclid: "g1", landing_path: "/start",
    });
  });

  it("is null for a visitor who did not come from an ad", () => {
    expect(readAttribution(BASE)).toBeNull();
    expect(readAttribution({ ...BASE, referrer: "https://www.google.com/", cookie: "_ga=GA1.1.1.2" })).toBeNull();
  });

  it("reads the Meta cookies only with advertising consent, and builds fbc from the click id when the cookie is missing", () => {
    const ad = { ...BASE, search: "?fbclid=IwAR0", cookie: "_fbp=fb.1.1700000000000.123; other=1" };
    expect(readAttribution(ad)?.values).not.toHaveProperty("fbp");
    expect(readAttribution(ad)?.values).not.toHaveProperty("fbc");
    const granted = readAttribution({ ...ad, consent: { measurement: false, advertising: true } });
    expect(granted?.values).toMatchObject({ fbp: "fb.1.1700000000000.123", fbc: `fb.1.${NOW}.IwAR0` });
    expect(granted?.consentAdvertising).toBe(true);
    const cookie = readAttribution({ ...ad, cookie: `${ad.cookie}; _fbc=fb.1.1700000005000.IwAR0`, consent: { measurement: false, advertising: true } });
    expect(cookie?.values.fbc).toBe("fb.1.1700000005000.IwAR0");
  });

  it("reads the Google Analytics ids only with measurement consent, from either session cookie format", () => {
    const ad = { ...BASE, search: "?utm_source=google", cookie: "_ga=GA1.1.123456789.1700000000; _ga_ABC123=GS1.1.1700000001.1.1.1700000002.0.0.0" };
    expect(readAttribution(ad)?.values).not.toHaveProperty("ga_client_id");
    const granted = readAttribution({ ...ad, consent: { measurement: true, advertising: false } });
    expect(granted?.values).toMatchObject({ ga_client_id: "123456789.1700000000", ga_session_id: "1700000001" });
    const v2 = readAttribution({ ...ad, cookie: "_ga=GA1.1.5.6; _ga_ABC123=GS2.1.s1700000009$o1$g1$t1700000010", consent: { measurement: true, advertising: false } });
    expect(v2?.values).toMatchObject({ ga_client_id: "5.6", ga_session_id: "1700000009" });
  });

  it("keeps the referring site only when it is another site", () => {
    const ad = { ...BASE, search: "?utm_source=meta" };
    expect(readAttribution({ ...ad, referrer: "https://l.facebook.com/l.php?u=x" })?.values.referrer_host).toBe("l.facebook.com");
    expect(readAttribution({ ...ad, referrer: "https://www.brandbasket.in/en" })?.values).not.toHaveProperty("referrer_host");
    expect(readAttribution({ ...ad, referrer: "not a url" })?.values).not.toHaveProperty("referrer_host");
  });
});
