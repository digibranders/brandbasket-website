// app/(legal)/layout.tsx
import type { ReactNode } from "react";

/** Groups the legal pages. The root layout leaves the closing section off them (components/shell/closing-paths.ts). */
export default function LegalLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return children;
}
