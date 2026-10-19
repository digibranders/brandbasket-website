"use client";
// app/global-error.tsx
import type { ReactElement } from "react";
import { ERROR_COPY } from "@/content/errors";
import RouteError from "./error";
import "./globals.css";

/** Replaces the root layout when it fails, so it renders its own document and styles (no metadata export allowed). */
export default function GlobalError({ error, retry }: { readonly error: unknown; readonly retry: () => void }): ReactElement {
  return (
    <html lang="en-IN">
      <body>
        <title>{ERROR_COPY.metaTitle}</title>
        <main id="main">
          <RouteError error={error} retry={retry} />
        </main>
      </body>
    </html>
  );
}
