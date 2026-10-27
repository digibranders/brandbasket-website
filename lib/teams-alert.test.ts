// lib/teams-alert.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ContactInput } from "@/lib/contact-schema";
import { enquiryCard, postEnquiryToTeams, teamsEnquiryUrl } from "./teams-alert";

const LEAD: ContactInput = { name: "Asha Rao", phone: "+91 98200 12345", email: "asha@example.in", business: "Rao Dental Care", city: "", message: "Please call me this week", consent: true, noticeVersion: "2026-10-19.1" };
const URL_OK = "https://prod-12.centralindia.logic.azure.com:443/workflows/abc/triggers/manual/paths/invoke?sig=secret";

afterEach(() => vi.restoreAllMocks());

describe("teamsEnquiryUrl", () => {
  it("accepts a https Teams address and nothing else", () => {
    expect(teamsEnquiryUrl({ TEAMS_ENQUIRIES_WEBHOOK_URL: URL_OK })).toContain("logic.azure.com");
    for (const bad of [undefined, "", "  ", "http://x.logic.azure.com/a", "https://evil.example/a", "https://user:pw@x.logic.azure.com/a", "not a url", "https://logic.azure.com.evil.example/a"]) {
      expect(teamsEnquiryUrl({ TEAMS_ENQUIRIES_WEBHOOK_URL: bad })).toBeNull();
    }
  });
});

describe("enquiryCard", () => {
  it("names the business, lists who wrote and carries the message, leaving empty fields out", () => {
    const card = JSON.stringify(enquiryCard(LEAD));
    for (const part of ["New website enquiry: Rao Dental Care", "Asha Rao", "asha@example.in", "+91 98200 12345", "Please call me this week"]) expect(card).toContain(part);
    expect(card).not.toContain("City");
  });
});

describe("postEnquiryToTeams", () => {
  it("posts the card to the address", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    await postEnquiryToTeams(LEAD, URL_OK);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [target, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(target).toBe(URL_OK);
    expect(init.method).toBe("POST");
    vi.unstubAllGlobals();
  });

  it("does nothing without an address, and never throws or logs the address when Teams fails", async () => {
    const fetchMock = vi.fn(async () => { throw new Error(`down ${URL_OK}`); });
    vi.stubGlobal("fetch", fetchMock);
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await postEnquiryToTeams(LEAD, null);
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(postEnquiryToTeams(LEAD, URL_OK)).resolves.toBeUndefined();
    expect(JSON.stringify(logged.mock.calls)).not.toContain("secret");
    vi.unstubAllGlobals();
  });
});
