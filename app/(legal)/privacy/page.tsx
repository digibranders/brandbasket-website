// app/(legal)/privacy/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacyPolicy } from "@/content/legal/privacy";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.privacy);

export default function PrivacyPage(): ReactElement {
  return <LegalDocument document={privacyPolicy} path="/privacy" />;
}
