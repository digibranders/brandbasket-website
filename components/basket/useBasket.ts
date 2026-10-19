"use client";
import { useSyncExternalStore } from "react";
import { basket, EMPTY_BASKET } from "@/lib/basket-store";
import type { AddonPick } from "@/lib/pricing";

export function useBasket(): AddonPick {
  return useSyncExternalStore(basket.subscribe, basket.get, () => EMPTY_BASKET);
}
