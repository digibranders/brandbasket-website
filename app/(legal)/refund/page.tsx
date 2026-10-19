// app/(legal)/refund/page.tsx
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { refundPolicy } from "@/content/legal/refund";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: refundPolicy.title, description: "How Brandbasket bills its monthly plans, how to cancel, when we refund a payment and how long a refund takes to reach your bank.", path: "/refund" });

export default function RefundPage(): ReactElement {
  return <LegalDocument document={refundPolicy} path="/refund" />;
}
