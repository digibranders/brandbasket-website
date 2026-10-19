// app/(legal)/shipping/page.tsx
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { shippingPolicy } from "@/content/legal/shipping";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: shippingPolicy.title, description: "Brandbasket sells digital services and ships nothing physical. How and when your website and monthly services are delivered online.", path: "/shipping" });

export default function ShippingPage(): ReactElement {
  return <LegalDocument document={shippingPolicy} path="/shipping" />;
}
