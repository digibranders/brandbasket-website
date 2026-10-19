"use client";
// components/shell/ClosingGate.tsx
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { showsClosing } from "./closing-paths";

/** Renders the server-built closing section on every page except those in closing-paths.ts. */
export function ClosingGate({ children }: { readonly children: ReactNode }): ReactNode {
  return showsClosing(usePathname()) ? children : null;
}
