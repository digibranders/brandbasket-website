// content/basket.test.ts
import { describe, expect, it } from "vitest";
import { SIGNUP_ADDON_DISCOUNT_LABEL } from "@/lib/pricing";
import { BASKET_COPY } from "./basket";

describe("basket copy", () => {
  it("states the sign-up discount word for word from the mock", () => {
    expect(SIGNUP_ADDON_DISCOUNT_LABEL).toBe("5%");
    expect(BASKET_COPY.panelNote).toBe("Optional. Add them as you start and they are 5% off for as long as they run.");
    expect(BASKET_COPY.rowsTitle).toBe("Add to your basket. 5% off when you add them as you start.");
  });
});
