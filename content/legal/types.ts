// content/legal/types.ts
export interface LegalSection {
  /** Anchor for linking straight to this section, e.g. /terms#fees. The renderer derives one from the heading when unset. */
  readonly id?: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  /**
   * The provisions that require this section to exist, such as "DPDP Act s.8(9)". A notice says only what a law or a
   * contract asks it to; content/legal/legal.test.ts fails for a privacy section that names none.
   */
  readonly requiredBy?: readonly string[];
  /** A page on this site the section sends people to, shown as a link after its paragraphs. */
  readonly link?: { readonly href: string; readonly label: string };
}

export interface LegalDocument {
  readonly title: string;
  /** Human-readable "last updated", e.g. "October 2026". */
  readonly updated: string;
  /** The label a record of consent points at (lib/legal-version.ts): shown on the page so a person can say which text they saw. */
  readonly version?: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
  /** The language the text is written in; English when unset. Sets the page's `lang`. */
  readonly language?: LegalLanguage;
}

export type LegalLanguage = "en" | "hi";
