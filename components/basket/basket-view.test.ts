import { describe, expect, it } from "vitest";
import { basketNames } from "./basket-view";

describe("basketNames", () => {
  it("always starts with the website", () => expect(basketNames({ growth: false, search: false })).toBe("Website"));
  it("lists picked add-ons in plan order", () => expect(basketNames({ growth: true, search: true })).toBe("Website + Growth + Search"));
  it("skips add-ons that are not picked", () => expect(basketNames({ growth: false, search: true })).toBe("Website + Search"));
});
