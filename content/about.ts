// content/about.ts
// Copy for /about, taken from the owner's "About BrandBasket" text, from "Who We Are" to "Our Vision" (brandbasket (2).docx, 2026-10-28).
// Every section is kept and trimmed. "What we do" was rewritten on 2026-11-17: one card per plan, each linking to its service
// page, with Local SEO removed. It goes back to the owner before it ships.

import type { PlanId } from "@/lib/pricing";

export type AboutIconKey = "Globe" | "Wrench" | "ShareNetwork" | "Megaphone" | "Storefront" | "Buildings" | "Rocket" | "Package" | "Stack" | "ListChecks";

/** Which colour tints a service tile on About: the website plan, or the social and ads plans. */
export type AboutTone = "site" | "growth";

export interface AboutItem {
  readonly icon: AboutIconKey;
  readonly title: string;
  readonly body: string;
}

export interface AboutService extends AboutItem {
  readonly tone: AboutTone;
  /** The plan whose service page the card links to. */
  readonly plan: PlanId;
  /** The words of that link. */
  readonly link: string;
}

/** The page title and description live in lib/seo/routes.ts with every other page's. */
export interface About {
  readonly h1: string;
  readonly lede: string;
  readonly who: {
    readonly heading: string;
    readonly lead: string;
    readonly body: string;
  };
  readonly what: { readonly heading: string; readonly lede: string; readonly items: readonly AboutService[] };
  readonly serve: { readonly heading: string; readonly lede: string; readonly items: readonly AboutItem[] };
  readonly why: { readonly heading: string; readonly items: readonly AboutItem[] };
  readonly mission: { readonly heading: string; readonly body: string };
  readonly vision: { readonly heading: string; readonly body: string };
}

export const ABOUT: About = {
  h1: "About BrandBasket",
  lede: "BrandBasket helps local businesses and small and medium-sized enterprises (SMEs) in India and the USA build, manage and strengthen their online presence.",
  who: {
    heading: "Who we are",
    lead: "Managing your website, social media and advertising. BrandBasket brings everything together under one roof, so you can focus on growing your business.",
    body: "We focus on the practical digital services businesses need to establish their presence online, maintain their websites, connect with customers and improve their visibility across digital channels, without having to manage every part of it themselves.",
  },
  what: {
    heading: "What we do",
    lede: "Website and digital marketing services designed for the online needs of local businesses and growing companies.",
    items: [
      { icon: "Globe", tone: "site", plan: "website", title: "Website build and management", body: "We design up to 10 pages for free and put them live within 7 working days. Then we host, secure and update the site every month, so it stays correct and you never deal with the technical side.", link: "See Website Management" },
      { icon: "ShareNetwork", tone: "growth", plan: "social", title: "Social media management", body: "AI drafts your posts, captions and images, you approve them, and they go out on schedule on up to 4 platforms. A monthly report shows what went out and how people responded.", link: "See Social Media Management" },
      { icon: "Megaphone", tone: "growth", plan: "ads", title: "Paid ads management", body: "We set up and run your Facebook and Instagram ads with AI copy and creatives, and manage spend so your budget lasts the month. Your ad budget is paid separately. Results depend on your offer, competition and budget.", link: "See Paid Ads Management" },
    ],
  },
  serve: {
    heading: "Who we serve",
    lede: "Businesses that need practical help with their digital presence.",
    items: [
      { icon: "Storefront", title: "Local businesses", body: "If your customers live in a specific area, a coordinated online presence makes you easier to find. A website lays the foundation, and social media and ads add engagement and promotion." },
      { icon: "Buildings", title: "Small and medium-sized enterprises", body: "An in-house team for every digital job is not always practical. Fixed packages let you buy defined services instead of coordinating each one yourself." },
      { icon: "Rocket", title: "Businesses building or improving online", body: "Starting out, or tidying up what you already run? We begin by working out which services you need and how they fit your goals." },
    ],
  },
  why: {
    heading: "Why businesses choose us",
    items: [
      { icon: "Stack", title: "Multiple digital services through one provider", body: "Website development, website management, social media and paid advertising from one team, in packages that work together." },
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
