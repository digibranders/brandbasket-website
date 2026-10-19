import { describe, expect, it, vi } from "vitest";
import { createBasketStore, EMPTY_BASKET } from "./basket-store";

describe("basket store", () => {
  it("starts with only the website plan", () => {
    expect(createBasketStore().get()).toEqual(EMPTY_BASKET);
  });

  it("notifies once per real change and keeps snapshots immutable", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.get();
    store.set("growth", true);
    store.set("growth", true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(before).toEqual(EMPTY_BASKET);
    expect(store.get()).toEqual({ growth: true, search: false });
  });

  it("replaces the whole pick for a package", () => {
    const store = createBasketStore();
    store.setAll({ growth: true, search: true });
    expect(store.get()).toEqual({ growth: true, search: true });
  });

  it("stops notifying after unsubscribe", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    const off = store.subscribe(listener);
    off();
    store.set("search", true);
    expect(listener).not.toHaveBeenCalled();
  });
});
