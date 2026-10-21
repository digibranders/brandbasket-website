"use client";

import { useSyncExternalStore, type ReactElement } from "react";
import { ErrorExperience } from "@/components/errors/ErrorExperience";

interface ErrorViewProps {
  readonly retry: () => void;
  readonly underNav: boolean;
}

function subscribeConnectivity(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function isOffline(): boolean {
  return !navigator.onLine;
}

function serverOffline(): boolean {
  return false;
}

/** Connectivity is a hint; arbitrary thrown values never become a claimed HTTP status. */
export function ErrorView({ retry, underNav }: ErrorViewProps): ReactElement {
  const offline = useSyncExternalStore(subscribeConnectivity, isOffline, serverOffline);
  return <ErrorExperience kind={offline ? "offline" : "unexpected"} retry={retry} underNav={underNav} />;
}
