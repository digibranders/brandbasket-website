// app/(legal)/notice/page.tsx
import type { ReactElement } from "react";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { dataNotice } from "@/content/legal/notice";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: dataNotice.title, description: "Notices from Brandbasket about the personal data we hold, such as a data breach notice, and who to contact about them.", path: "/notice", noindex: true });

export default function NoticePage(): ReactElement {
  return <LegalDocument document={dataNotice} path="/notice" />;
}
