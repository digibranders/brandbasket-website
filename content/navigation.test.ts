import { describe, expect, it } from "vitest";
import { PLANS } from "@/lib/pricing";
import { SERVICE_PAGES } from "./services";
import { SERVICES_NAV } from "./navigation";

describe("services menu", () => {
  it("lists separate B2B and ecommerce service pages", () => {
    expect(SERVICES_NAV.map((link) => link.href)).toEqual([
      SERVICE_PAGES[0].path, "/services/ecommerce-website", ...SERVICE_PAGES.slice(1).map((page) => page.path),
    ]);
    for (const link of SERVICES_NAV) {
      expect(link.label).toBe(link.id === "ecommerce" ? "Ecommerce Website" : PLANS[link.id].name);
    }
  });
});
