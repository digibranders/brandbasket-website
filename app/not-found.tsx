// app/not-found.tsx
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ErrorExperience } from "@/components/errors/ErrorExperience";
import { NOT_FOUND_COPY } from "@/content/errors";

export const metadata: Metadata = { title: NOT_FOUND_COPY.metaTitle, robots: { index: false } };

export default function NotFound(): ReactElement {
  return <ErrorExperience kind="not-found" underNav />;
}
