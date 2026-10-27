import { describe, expect, it } from "vitest";
import { PLANS } from "@/lib/pricing";
import { SERVICE_PAGES } from "./services";
import { SERVICES_NAV } from "./navigation";

describe("services menu", () => {
  it("lists the three service pages, in the order of the plans, with the plan names", () => {
    expect(SERVICES_NAV.map((link) => link.href)).toEqual(SERVICE_PAGES.map((page) => page.path));
    for (const link of SERVICES_NAV) expect(link.label).toBe(PLANS[link.id].name);
  });
});
