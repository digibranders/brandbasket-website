// app/(legal)/refund/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { refundPolicy } from "@/content/legal/refund";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.refund);

export default function RefundPage(): ReactElement {
  return <LegalDocument document={refundPolicy} path="/refund" />;
}
