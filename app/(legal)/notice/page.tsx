// app/(legal)/notice/page.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { dataNotice } from "@/content/legal/notice";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.notice);

export default function NoticePage(): ReactElement {
  return <LegalDocument document={dataNotice} path="/notice" />;
}
