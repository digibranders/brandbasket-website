export interface FaqItem {
  readonly q: string;
  readonly a: string;
}

export interface LinkItem {
  readonly label: string;
  readonly href: string;
}

/** A guide or blog link with the two-line summary shown under its title. */
export interface GuideLink extends LinkItem {
  readonly summary: string;
}
