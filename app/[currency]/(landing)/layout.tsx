// app/[currency]/(landing)/layout.tsx
import type { ReactElement, ReactNode } from "react";
import { StartFooter, StartHeader } from "@/components/start/StartSections";

/** Landing pages for ads: a logo and a way to call, then the page, then the legal links. No navigation, closing band, chat or basket to lead a visitor away. */
export default function LandingLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <>
      <StartHeader />
      <main id="main">{children}</main>
      <StartFooter />
    </>
  );
}
