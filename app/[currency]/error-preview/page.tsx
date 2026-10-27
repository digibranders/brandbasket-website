import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ErrorPreview } from "@/components/errors/ErrorPreview";
import { ERROR_UI } from "@/content/errors";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({ title: ERROR_UI.previewTitle, description: ERROR_UI.previewDescription, path: "/error-preview", noindex: true });

export default function ErrorPreviewPage(): ReactElement {
  return <ErrorPreview />;
}
