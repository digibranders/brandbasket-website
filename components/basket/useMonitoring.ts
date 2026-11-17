"use client";
import { useSyncExternalStore } from "react";
import { monitoring } from "@/lib/basket-store";

/** Whether Dedicated Expert Monitoring is in the basket. Off on the server and the first render, like useBasket's default. */
export function useMonitoring(): boolean {
  return useSyncExternalStore(monitoring.subscribe, monitoring.get, () => false);
}
