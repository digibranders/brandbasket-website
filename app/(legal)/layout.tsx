// app/(legal)/layout.tsx
import type { ReactNode } from "react";

/**
 * Groups the legal pages. A plain pass-through for now: the closing section does not exist yet, and when it is added to
 * the root layout it will skip this group so legal pages end at the registered office.
 */
export default function LegalLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return children;
}
