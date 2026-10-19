// components/JsonLd.tsx
import type { ReactElement } from "react";

/** Renders structured data. `<` is escaped so a string in the data can never close the script tag. */
export function JsonLd({ data }: { readonly data: object }): ReactElement {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
