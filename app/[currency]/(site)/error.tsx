"use client";
// app/error.tsx
import type { ReactElement } from "react";
import { ErrorView } from "@/components/ErrorView";

interface ErrorProps {
  readonly error: unknown;
  readonly retry: () => void;
}

/** Route error boundary. Production error messages are generic and may still leak details, so none is shown. */
export default function RouteError({ retry }: ErrorProps): ReactElement {
  return <ErrorView retry={retry} underNav />;
}
