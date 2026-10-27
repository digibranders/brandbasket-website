// app/(legal)/shipping/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { shippingPolicy } from "@/content/legal/shipping";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.shipping);

export default function ShippingPage(): ReactElement {
  return <LegalDocument document={shippingPolicy} path="/shipping" />;
}
