// app/(legal)/terms/page.tsx
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { termsOfService } from "@/content/legal/terms";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: termsOfService.title, description: "The terms for the free Brandbasket website build and monthly plans: fees, GST, ownership, cancellation, liability and governing law.", path: "/terms" });

export default function TermsPage(): ReactElement {
  return <LegalDocument document={termsOfService} path="/terms" />;
}
