"use client";
// app/global-error.tsx
import type { ReactElement } from "react";
import { ErrorView } from "@/components/ErrorView";
import { ERROR_COPY } from "@/content/errors";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

interface GlobalErrorProps {
  readonly error: unknown;
  readonly retry: () => void;
}

/** Replaces the root layout when it fails, so it renders its own document, fonts and styles (no metadata export allowed). */
export default function GlobalError({ retry }: GlobalErrorProps): ReactElement {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>
        <title>{`${ERROR_COPY.metaTitle} | ${siteConfig.name}`}</title>
        <main id="main">
          <ErrorView retry={retry} underNav={false} />
        </main>
      </body>
    </html>
  );
}
