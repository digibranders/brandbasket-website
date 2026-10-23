import { describe, expect, it } from "vitest";
import { clickEvent, planList, submitEvent, trackAttrs } from "./analytics";

describe("trackAttrs", () => {
  it("marks a link for the delegated click listener", () => {
    expect(trackAttrs("cta_click", "hero")).toEqual({ "data-track": "cta_click", "data-location": "hero" });
  });
});

describe("clickEvent", () => {
  it("reads a main button's plans from the link it sends the visitor to", () => {
    expect(clickEvent({ track: "cta_click", location: "closing" }, "https://brandbasket.in/contact?plan=website%2Csearch#start")).toEqual({
      name: "cta_click",
      properties: { location: "closing", plans: "website,search" },
    });
    expect(clickEvent({ track: "cta_click", location: "nav" }, "https://app.brandbasket.in/login?plan=website,growth")).toEqual({
      name: "cta_click",
      properties: { location: "nav", plans: "website,growth" },
    });
  });

  it("drops unknown plan ids and keeps the plans in the link", () => {
    expect(clickEvent({ track: "cta_click", location: "hero" }, "/contact?plan=growth#start")?.properties).toEqual({ location: "hero", plans: "growth" });
    expect(clickEvent({ track: "cta_click", location: "hero" }, "/contact?plan=website,phone-9876543210,search#start")?.properties).toEqual({ location: "hero", plans: "website,search" });
    expect(clickEvent({ track: "cta_click", location: "hero" }, "/contact#start")?.properties).toEqual({ location: "hero", plans: "none" });
  });

  it("sends only the location for WhatsApp", () => {
    expect(clickEvent({ track: "whatsapp_click", location: "nav" }, "https://wa.me/917897896607")).toEqual({ name: "whatsapp_click", properties: { location: "nav" } });
  });

  it("reports opening the basket pop-up with its location only", () => {
    expect(clickEvent({ track: "basket_open", location: "nav" }, "")).toEqual({ name: "basket_open", properties: { location: "nav" } });
    expect(trackAttrs("basket_open", "dock")).toEqual({ "data-track": "basket_open", "data-location": "dock" });
  });

  it("ignores links without a known event or a location", () => {
    expect(clickEvent({ track: "signup", location: "hero" }, "/")).toBeNull();
    expect(clickEvent({ track: "cta_click" }, "/contact")).toBeNull();
    expect(clickEvent({}, "/")).toBeNull();
  });
});

describe("submitEvent", () => {
  it("names the plans a contact message was about, or none", () => {
    expect(submitEvent(["website", "growth"])).toEqual({ name: "contact_submit", properties: { plans: "website,growth" } });
    expect(submitEvent([])).toEqual({ name: "contact_submit", properties: { plans: "none" } });
  });
});

describe("planList", () => {
  it("keeps the order the sign-up link uses", () => {
    expect(planList(["search", "website", "growth"])).toBe("website,growth,search");
  });
});
