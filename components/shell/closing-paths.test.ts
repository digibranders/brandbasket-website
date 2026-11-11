import { describe, expect, it } from "vitest";
import { LEGAL_NAV } from "@/content/navigation";
import { showsClosing } from "./closing-paths";

describe("showsClosing", () => {
  it("ends marketing pages and the 404 with the closing section", () => {
    for (const path of ["/pricing", "/about", "/no-such-page"]) expect(showsClosing(path)).toBe(true);
  });

  it("leaves it off the homepage, which ends with its own call to action", () => {
    expect(showsClosing("/")).toBe(false);
  });

  it("leaves it off the contact page, every legal page and the data notice", () => {
    for (const path of ["/contact", "/notice", ...LEGAL_NAV.map((l) => l.href)]) expect(showsClosing(path)).toBe(false);
  });
});
