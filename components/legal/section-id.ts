// components/legal/section-id.ts
import type { LegalSection } from "@/content/legal/types";

/** Ids the legal page already uses for its title, contents list and office card; a section anchor must not reuse one. */
export const LEGAL_IDS = { title: "h-legal", contents: "legal-contents", office: "registered-office" } as const;
export const RESERVED_IDS: readonly string[] = Object.values(LEGAL_IDS);

/** "10. Your customers' personal data" becomes "your-customers-personal-data", so anchors survive renumbering. */
export function sectionId(section: LegalSection): string {
  return (
    section.id ??
    section.heading
      .replace(/^\d+\.\s*/, "")
      .replace(/['’]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}
