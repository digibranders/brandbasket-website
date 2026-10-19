// app/(legal)/privacy/page.tsx
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacyPolicy } from "@/content/legal/privacy";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: privacyPolicy.title, description: "How Brandbasket, a brand of Digibranders Private Limited, collects, uses and protects personal data under the DPDP Act 2023 of India.", path: "/privacy" });

export default function PrivacyPage(): ReactElement {
  return <LegalDocument document={privacyPolicy} path="/privacy" />;
}
