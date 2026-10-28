// content/about.ts
// Copy for /about, taken from the owner's "About BrandBasket" text, from "Who We Are" to "Our Vision" (brandbasket (2).docx, 2026-10-28).
// Every section is kept and trimmed; nothing is added. It goes back to the owner before it ships.

export type AboutIconKey = "Globe" | "Wrench" | "ShareNetwork" | "Megaphone" | "MapPin" | "Storefront" | "Buildings" | "Rocket" | "Package" | "Stack" | "ListChecks";

/** Which plan colour tints a service tile: the website plan, Social Media and Ads, or Local SEO. */
export type AboutTone = "site" | "growth" | "search";

export interface AboutItem {
  readonly icon: AboutIconKey;
  readonly title: string;
  readonly body: string;
}

export interface AboutService extends AboutItem {
  readonly tone: AboutTone;
}

export interface AboutReceiptLine {
  readonly label: string;
  readonly value: string;
}

/** The page title and description live in lib/seo/routes.ts with every other page's. */
export interface About {
  readonly h1: string;
  readonly lede: string;
  /** The five services floating around the mark in the hero picture, in the order the page lists them. */
  readonly heroTiles: readonly { readonly icon: AboutIconKey; readonly label: string; readonly tone: AboutTone }[];
  readonly who: {
    readonly heading: string;
    readonly lead: string;
    readonly body: string;
  };
  readonly what: { readonly heading: string; readonly lede: string; readonly items: readonly AboutService[] };
  readonly serve: { readonly heading: string; readonly lede: string; readonly items: readonly AboutItem[] };
  readonly earn: {
    readonly heading: string;
    readonly lede: string;
    readonly points: readonly { readonly title: string; readonly body: string }[];
    readonly receipt: {
      readonly title: string;
      readonly lines: readonly AboutReceiptLine[];
      readonly apart: AboutReceiptLine;
    };
    readonly pricingLink: string;
  };
  readonly why: { readonly heading: string; readonly items: readonly AboutItem[] };
  readonly mission: { readonly heading: string; readonly body: string };
  readonly vision: { readonly heading: string; readonly body: string };
}

export const ABOUT: About = {
  h1: "About BrandBasket",
  lede: "BrandBasket helps local businesses and small and medium-sized enterprises (SMEs) in India and the USA build, manage and strengthen their online presence.",
  heroTiles: [
    { icon: "Globe", label: "Website", tone: "site" },
    { icon: "ShareNetwork", label: "Social media", tone: "growth" },
    { icon: "Wrench", label: "Website care", tone: "site" },
    { icon: "Megaphone", label: "Ads", tone: "growth" },
    { icon: "MapPin", label: "Local SEO", tone: "search" },
  ],
  who: {
    heading: "Who we are",
    lead: "Managing a website, social media, ad campaigns and local search takes time, technical knowledge and ongoing effort. BrandBasket brings these services together.",
    body: "We focus on the practical digital services businesses need to establish their presence online, maintain their websites, connect with customers and improve their visibility across digital channels, without having to manage every part of it themselves.",
  },
  what: {
    heading: "What we do",
    lede: "Website and digital marketing services designed for the online needs of local businesses and growing companies.",
    items: [
      { icon: "Globe", tone: "site", title: "Website development", body: "A website is where customers look for your services and contact details. We build a 10 page website for free, giving you credibility and a base for everything else you do online." },
      { icon: "Wrench", tone: "site", title: "Website management", body: "Launching is only the start. For a monthly fee we keep your site maintained, updated and supported. Your package sets exactly what is included." },
      { icon: "ShareNetwork", tone: "growth", title: "Social media management", body: "We manage your presence on the platforms your customers use, so updates and offers go out regularly. Results depend on your audience, content and consistency." },
      { icon: "Megaphone", tone: "growth", title: "Paid advertising management", body: "We help you structure ad campaigns around your goals, target the right audience and review performance. Our management fee is separate from your ad budget. Results depend on strategy, competition, creative and budget." },
      { icon: "MapPin", tone: "search", title: "Local SEO", body: "We help you appear in searches for your city, locality or service area, with accurate business details and site content that match local search. Rankings and customers cannot be guaranteed." },
    ],
  },
  serve: {
    heading: "Who we serve",
    lede: "Businesses that need practical help with their digital presence.",
    items: [
      { icon: "Storefront", title: "Local businesses", body: "If your customers live in a specific area, a coordinated online presence makes you easier to find. A website and local SEO lay the foundation, and social media and ads add engagement and promotion." },
      { icon: "Buildings", title: "Small and medium-sized enterprises", body: "An in-house team for every digital job is not always practical. Fixed packages let you buy defined services instead of coordinating each one yourself." },
      { icon: "Rocket", title: "Businesses building or improving online", body: "Starting out, or tidying up what you already run? We begin by working out which services you need and how they fit your goals." },
    ],
  },
  earn: {
    heading: "How we earn",
    lede: "BrandBasket runs on a service-based model, with fixed packages and published prices.",
    points: [
      { title: "The website is free, the care is monthly", body: "We design and build your website at no charge. We earn from the monthly website management fee, so you get ongoing support, not just a one-off project." },
      { title: "Social media, ads and local SEO", body: "Each service has its own fee, set by the package you choose. The ad fee pays us to manage your campaigns. The ad budget is a separate amount paid to the advertising platforms, and the billing arrangement is confirmed in your service agreement." },
      { title: "Fixed packages, published prices", body: "You can compare options and see what each package includes before you buy." },
    ],
    receipt: {
      title: "How a plan adds up",
      lines: [
        { label: "Website design and build", value: "Free" },
        { label: "Website management", value: "Monthly fee" },
        { label: "Social media management", value: "Monthly fee" },
        { label: "Ad campaign management", value: "Monthly fee" },
        { label: "Local SEO", value: "Monthly fee" },
      ],
      apart: { label: "Ad budget", value: "Separate from our fee" },
    },
    pricingLink: "See the plans and prices",
  },
  why: {
    heading: "Why businesses choose us",
    items: [
      { icon: "Stack", title: "Multiple digital services through one provider", body: "Website development, website management, social media, paid advertising and local SEO from one team, in packages that work together." },
      { icon: "Package", title: "Defined service packages", body: "Published prices give you a structured way to compare options. The value of a package depends on its inclusions, its scope and how well it suits your needs." },
      { icon: "Wrench", title: "Ongoing website management", body: "For businesses that need attention beyond the launch, website management on a recurring fee means the site is looked after once it is live." },
      { icon: "ListChecks", title: "Services relevant to local businesses and SMEs", body: "Choose services by your objectives instead of assuming every digital marketing activity is needed by every company." },
    ],
  },
  mission: {
    heading: "Our mission",
    body: "To help local businesses and small and medium-sized enterprises in India and the USA set up, manage and improve their digital presence through practical website and marketing services.",
  },
  vision: {
    heading: "Our vision",
    body: "A business world where companies of every size can build and keep a meaningful online presence, and use it to be found, to communicate and to grow.",
  },
};
