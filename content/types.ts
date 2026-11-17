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

/** A KPI tile in an example report on a service page. */
export interface ReportKpi {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
}

export interface ExampleReportContent {
  readonly heading: string;
  readonly lede: string;
  readonly ariaLabel: string;
  /** "Example report": marks the numbers as a sample. It must stay. */
  readonly chip: string;
  readonly title: string;
  readonly subtitle: string;
  readonly kpis: readonly ReportKpi[];
}
