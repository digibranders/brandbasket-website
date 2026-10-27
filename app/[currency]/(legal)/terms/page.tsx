// app/(legal)/terms/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { termsOfService } from "@/content/legal/terms";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.terms);

export default function TermsPage(): ReactElement {
  return <LegalDocument document={termsOfService} path="/terms" />;
}
