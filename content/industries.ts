// content/industries.ts
// Copy for /industries and the eight /industries/[slug] pages. DRAFT: waiting for the owner's approval (plan 02, Task 7.1).
// Every claim comes from the plan details in content/pricing.ts and the free build in content/home.ts. Every price is
// built from lib/pricing.ts. Organic social posting is not claimed anywhere: Digital Growth covers it only if the owner
// says so (open input D4).
import { AD_BUDGET_CAP, type AddonPick, EXTRA_HOURLY_RATE, formatInr, GST_LABEL, monthlyTotal, PLANS, SIGNUP_ADDON_DISCOUNT_LABEL } from "@/lib/pricing";
import type { FaqItem } from "./types";

export interface Industry {
  readonly slug: "clinics" | "salons" | "restaurants" | "gyms" | "coaching" | "retail" | "home-services" | "real-estate";
  /** Matches the label in the homepage industries line (content/home.ts INDUSTRIES_LINE). */
  readonly name: string;
  /** The search the page targets. Appears in the title and the h1. */
  readonly searchPhrase: string;
  /** 60 characters or fewer, ends " | Brandbasket". Used as an absolute title. */
  readonly title: string;
  /** 120 to 155 characters. */
  readonly description: string;
  readonly h1: string;
  /** 25 words or fewer. */
  readonly lede: string;
  /** Three short lines: what owners in this trade lose without a site. */
  readonly problems: readonly string[];
  /** Four to six concrete items from the plans. No invented features. */
  readonly whatYouGet: readonly string[];
  /** The basket we suggest for this trade. */
  readonly suggested: AddonPick;
  /** Three or four question-shaped FAQs. Each answer opens with a direct answer. */
  readonly faq: readonly FaqItem[];
  /** ISO date. Feeds the sitemap lastModified. */
  readonly updated: string;
}

const WITH_GROWTH: AddonPick = { growth: true, search: false };
const WITH_SEARCH: AddonPick = { growth: false, search: true };

const HOURLY = formatInr(EXTRA_HOURLY_RATE);
const UPDATED = "2026-10-19";

function costAnswer(pick: AddonPick): string {
  const addon = pick.growth ? PLANS.growth : PLANS.search;
  return `₹0 to build. ${PLANS.website.name} is ${formatInr(PLANS.website.monthly)} a month. With ${addon.name}, the total is ${formatInr(monthlyTotal(pick))} a month, plus ${GST_LABEL} GST. Add ${addon.name} as you start and it is ${SIGNUP_ADDON_DISCOUNT_LABEL} off.`;
}

const SMALL_EDITS = "The plan includes 2 small edits a month, up to 30 minutes each.";

const FAQ_AD_SPEND: FaqItem = {
  q: "Is ad spend included?",
  a: `No. You pay Meta directly for ads. ${PLANS.growth.name} manages budgets up to ${formatInr(AD_BUDGET_CAP)} a month.`,
};

const FAQ_NO_GUARANTEE: FaqItem = {
  q: "Can you guarantee we show up first on Google?",
  a: "No. No one honestly can promise rankings, AI answers or leads. You see the work and the numbers in a report every month.",
};

const FAQ_NO_SHOP: FaqItem = {
  q: "Can people buy or order online through the website?",
  a: "No. E-commerce and online ordering are not part of the plans. Your site shows what you offer and lets people call or send an enquiry.",
};

export const INDUSTRIES: readonly Industry[] = [
  {
    slug: "clinics",
    name: "Clinics",
    searchPhrase: "website for clinics",
    title: "Website for Clinics, Built Free | Brandbasket",
    description: `A website for clinics and dentists, built for ₹0. Timings, doctors and click to call, kept running for ${formatInr(PLANS.website.monthly)} a month plus GST.`,
    h1: "A website for clinics, so patients can find you and call",
    lede: "Patients look you up before they book. We build your clinic website free and keep it running, with your timings and click to call.",
    problems: [
      "Patients searching for a clinic nearby call the one they can find.",
      "Your front desk answers the same questions about timings and doctors all day.",
      "Old listings show the wrong timings or an old phone number.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: services, doctors, timings and how to reach you",
      "Click to call and an enquiry form for appointment requests",
      "Hosting, SSL, backups and security checks every month",
      "2 small edits a month for new timings or a holiday notice",
      "Local keyword research and up to 5 pages a month improved for search",
      "Name, address and phone checked for consistency across listings",
    ],
    suggested: WITH_SEARCH,
    faq: [
      { q: "How much does a website for a clinic cost?", a: costAnswer(WITH_SEARCH) },
      { q: "Can patients call the clinic from the website?", a: "Yes. Every site has click to call and an enquiry form, and it works on every phone." },
      { q: "Can you change our timings when a doctor is on leave?", a: `Yes. Send us the change and we make it. ${SMALL_EDITS}` },
      FAQ_NO_GUARANTEE,
    ],
    updated: UPDATED,
  },
  {
    slug: "salons",
    name: "Salons",
    searchPhrase: "website for salons",
    title: "Website for Salons, Built Free | Brandbasket",
    description: "A website for salons and beauty parlours, built for ₹0. Services, prices and photos online, plus your Google profile and Meta ads, run every month.",
    h1: "A website for salons that shows your work and your prices",
    lede: "Clients pick a salon by its photos, prices and reviews. We build your site free, then run your Google profile and Instagram ads.",
    problems: [
      "New clients choose the salon whose photos and price list they can see.",
      "A Google profile with old photos and wrong hours sends people elsewhere.",
      "Instagram alone does not show your prices, timings and location in one place.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: services, prices, photos and how to reach you",
      "Click to call and an enquiry form, on a site that works on every phone",
      "Up to 8 Google Business Profile posts a month for offers and services",
      "Photo updates on your Google profile from your own pictures",
      "Review monitoring and suggested replies",
      "Facebook and Instagram ads planned, set up and watched every month",
    ],
    suggested: WITH_GROWTH,
    faq: [
      { q: "How much does a website for a salon cost?", a: costAnswer(WITH_GROWTH) },
      { q: "Can you use our own photos?", a: "Yes. Google profile photo updates use your images or creatives we agree with you." },
      FAQ_AD_SPEND,
      { q: "Can I get Digital Growth without the website plan?", a: `No. ${PLANS.growth.name} needs the ${PLANS.website.name} plan.` },
    ],
    updated: UPDATED,
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    searchPhrase: "website for restaurants",
    title: "Website for Restaurants, Built Free | Brandbasket",
    description: "A website for restaurants and cafes, built for ₹0. Your menu, timings and location online, plus Google profile posts and Meta ads, run every month.",
    h1: "A website for restaurants, with your menu one tap away",
    lede: "Hungry people check the menu, timings and location before they choose. We build your restaurant website free and keep it running.",
    problems: [
      "People who cannot find your menu online eat somewhere they can.",
      "Old hours on Google send customers to a closed door.",
      "Without your own site, a delivery app listing is the only menu people see.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: menu, timings, location and photos",
      "Click to call and an enquiry form for group and party bookings",
      "2 small edits a month for menu and price changes",
      "Up to 8 Google Business Profile posts a month for specials and offers",
      "Review monitoring and suggested replies",
      "Facebook and Instagram ads for offers and new dishes, with a monthly ads report",
    ],
    suggested: WITH_GROWTH,
    faq: [
      { q: "How much does a website for a restaurant cost?", a: costAnswer(WITH_GROWTH) },
      { q: "Can you update the menu when prices change?", a: `Yes. ${SMALL_EDITS} Bigger changes cost ${HOURLY} an hour, quoted before we start.` },
      FAQ_NO_SHOP,
      FAQ_AD_SPEND,
    ],
    updated: UPDATED,
  },
  {
    slug: "gyms",
    name: "Gyms",
    searchPhrase: "website for gyms",
    title: "Website for Gyms, Built Free | Brandbasket",
    description: "A website for gyms and fitness studios, built for ₹0. Plans, timings and trial class enquiries online, plus Google profile posts and Meta ads.",
    h1: "A website for gyms, ready for trial class enquiries",
    lede: "People compare gyms on timings, fees and trainers before they walk in. We build your site free and run your Google profile and ads.",
    problems: [
      "People who want a trial class cannot find your timings or fees, so they ask elsewhere.",
      "Trial enquiries get lost in DMs and missed calls.",
      "New batches and offers reach only the members you already have.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: memberships, timings, trainers and location",
      "An enquiry form for trial classes, and click to call",
      "Facebook and Instagram ads for new batches and offers, set up and watched for you",
      "Up to 8 Google Business Profile posts a month",
      "Review monitoring and suggested replies",
      "A monthly report on your site, your ads and your Google profile",
    ],
    suggested: WITH_GROWTH,
    faq: [
      { q: "How much does a website for a gym cost?", a: costAnswer(WITH_GROWTH) },
      { q: "Can people ask for a trial class on the website?", a: "Yes. Your site has an enquiry form and click to call, so people can ask for a trial in one step." },
      FAQ_AD_SPEND,
      { q: "Do you make reels or videos for the ads?", a: `Yes, at ${HOURLY} an hour. Ad copy and basic creatives are included; reels and video editing are billed by the hour.` },
    ],
    updated: UPDATED,
  },
  {
    slug: "coaching",
    name: "Coaching",
    searchPhrase: "website for coaching classes",
    title: "Website for Coaching Classes, Built Free | Brandbasket",
    description: "A website for coaching classes and tutors, built for ₹0. Courses, batches and admission enquiries online, plus local search and AI answer work.",
    h1: "A website for coaching classes that parents and students can find",
    lede: "Parents and students search for courses, batches and fees before they visit. We build your site free and work on your local search.",
    problems: [
      "Parents searching for classes nearby find the institute that shows up first.",
      "Questions about batches, fees and timings fill your phone every admission season.",
      "Course details sent on WhatsApp get lost, and new parents never see them.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: courses, batches, faculty and contact",
      "An enquiry form for admissions, and click to call",
      "Research into the courses parents search for in your area",
      "Titles, descriptions and headings improved on up to 5 pages a month",
      "FAQs and structured data for the questions parents ask",
      "Ranking, traffic and enquiry tracking in your monthly report",
    ],
    suggested: WITH_SEARCH,
    faq: [
      { q: "How much does a website for a coaching class cost?", a: costAnswer(WITH_SEARCH) },
      { q: "Can we update batch timings every term?", a: `Yes. ${SMALL_EDITS}` },
      {
        q: "Can you promise we will appear in ChatGPT answers?",
        a: "No. No one can promise AI citations. We shape your pages into direct answers, add FAQ structured data and track AI visibility where it can be measured.",
      },
      FAQ_NO_GUARANTEE,
    ],
    updated: UPDATED,
  },
  {
    slug: "retail",
    name: "Shops",
    searchPhrase: "website for shops",
    title: "Website for Shops, Built Free | Brandbasket",
    description: "A website for shops and local stores, built for ₹0. What you stock, timings and location online, plus Google profile posts and Meta ads each month.",
    h1: "A website for shops, so nearby buyers know what you stock",
    lede: "Shoppers check what you sell, your timings and your location before they leave home. We build your shop website free and keep it running.",
    problems: [
      "Buyers who cannot see what you stock go to the store that shows it.",
      "Festive offers and new arrivals reach only the people who walk past.",
      "Wrong hours on Google cost you walk-ins.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: what you stock, brands, timings and location",
      "Click to call and an enquiry form for stock questions",
      "Up to 8 Google Business Profile posts a month for offers and new arrivals",
      "Hours, contact and website link checks on your Google profile",
      "Review monitoring and suggested replies",
      "Facebook and Instagram ads for sales and festive offers, with a monthly ads report",
    ],
    suggested: WITH_GROWTH,
    faq: [
      { q: "How much does a website for a shop cost?", a: costAnswer(WITH_GROWTH) },
      FAQ_NO_SHOP,
      { q: "Can you add new arrivals to the site?", a: `Yes. ${SMALL_EDITS}` },
      FAQ_AD_SPEND,
    ],
    updated: UPDATED,
  },
  {
    slug: "home-services",
    name: "Home services",
    searchPhrase: "website for home services",
    title: "Website for Home Services, Built Free | Brandbasket",
    description: "A website for plumbers, electricians, AC repair and other home services, built for ₹0. Click to call, service areas and local search work.",
    h1: "A website for home services, built around the areas you cover",
    lede: "When a tap leaks or the AC stops, people search and call someone nearby. We build your site free and work on your local search.",
    problems: [
      "People search for a plumber or electrician near them and call whoever shows up first.",
      "Different phone numbers across listings send calls to the wrong place.",
      "Customers in the next area over never learn that you cover it.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: services, areas covered and contact",
      "Click to call and an enquiry form, on a site that works on every phone",
      "Service area pages optimised for the localities you cover",
      "Name, address and phone checked for consistency across listings",
      "Local keyword and competitor research",
      "Ranking, traffic and enquiry tracking in your monthly report",
    ],
    suggested: WITH_SEARCH,
    faq: [
      { q: "How much does a website for a home services business cost?", a: costAnswer(WITH_SEARCH) },
      { q: "Can customers call us straight from the website?", a: "Yes. Click to call is on the site, and it works on every phone." },
      { q: "How long until the website is live?", a: "About a week. Day 1 is a free 15-minute call, and in week 1 we set everything up." },
      FAQ_NO_GUARANTEE,
    ],
    updated: UPDATED,
  },
  {
    slug: "real-estate",
    name: "Real estate",
    searchPhrase: "website for real estate agents",
    title: "Website for Real Estate Agents, Built Free | Brandbasket",
    description: "A website for real estate agents and brokers, built for ₹0. Projects, localities and site visit enquiries online, plus local search work.",
    h1: "A website for real estate agents, built for site visit enquiries",
    lede: "Buyers look up the agent and the project before a site visit. We build your site free and work on your local search.",
    problems: [
      "Buyers who cannot check you out online call an agent they can look up.",
      "On property portals, your listing sits next to every other agent's.",
      "Searches for property agents in your locality show your competitors first.",
    ],
    whatYouGet: [
      "A free website of up to 5 pages: projects, localities, services and contact",
      "An enquiry form for site visits, and click to call",
      "Local keyword and competitor research for the localities you sell in",
      "Titles, descriptions and headings improved on up to 5 pages a month",
      "FAQs and structured data for the questions buyers ask",
      "Ranking, traffic and enquiry tracking in your monthly report",
    ],
    suggested: WITH_SEARCH,
    faq: [
      { q: "How much does a website for a real estate agent cost?", a: costAnswer(WITH_SEARCH) },
      { q: "Can buyers ask for a site visit on the website?", a: "Yes. Your site has an enquiry form for site visits and click to call." },
      { q: "Can I add new projects to the website?", a: `Yes. Small changes use the 2 small edits a month. A new page costs ${HOURLY} an hour, quoted before we start.` },
      FAQ_NO_GUARANTEE,
    ],
    updated: UPDATED,
  },
];
