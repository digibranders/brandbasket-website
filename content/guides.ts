// content/guides.ts
// Copy for the pages that answer one buyer question each: three "for your kind of business" pages, one comparison and the
// glossary (plan: SEO and AEO pass, 2026-10-28). New copy: the owner reads it before it ships. It states only what the plans, the
// FAQs and the blog already say, and carries no price, so one set of words serves rupees and dollars.
import { CANCEL_ANSWER } from "./legal/cancellation";
import type { FaqItem, GuideLink } from "./types";

export interface GuideSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

export interface GuideTable {
  readonly heading: string;
  readonly lede: string;
  readonly head: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export interface GuidePageContent {
  /** The last part of the address. */
  readonly slug: string;
  readonly path: `/for/${string}` | `/compare/${string}`;
  /** Complete page title and description for search results (lib/seo/routes.ts). */
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  /** A direct answer of about 50 words: what search engines and AI answers quote. */
  readonly answer: string;
  readonly sections: readonly GuideSection[];
  readonly table?: GuideTable;
  readonly faq: readonly FaqItem[];
  /** Posts and pages to read next. */
  readonly next: readonly GuideLink[];
}

export const GUIDE_COPY = {
  faqHeading: "Common questions.",
  nextHeading: "Read next.",
  planLink: { label: "See the Website Management plan", href: "/services/managed-website" },
} as const;

const HOW_IT_GOES = {
  heading: "How it works",
  paragraphs: [
    "You send your details and photos. We build the site and you check it. Once you have sent your details and made your first payment, your website goes live within 7 working days. It can take a little longer if we are waiting on feedback or content from you, or on your domain being connected.",
    "After that it is kept hosted, secure and up to date every month, with 2 edits a month of 15 minutes each and a monthly website health report.",
  ],
} as const satisfies GuideSection;

const DOMAIN_FAQ: FaqItem = {
  q: "Who owns the domain?",
  a: "You do. You register and pay for your own domain, so it stays in your name. No domain yet? We will set your website up on a temporary domain for free until you have one.",
};

const COST_FAQ: FaqItem = {
  q: "Is the website really free?",
  a: "The build is free. You pay a monthly plan that keeps the site hosted, secure and up to date. The plans and their prices are on the pricing page.",
};

export const GUIDE_PAGES: readonly GuidePageContent[] = [
  {
    slug: "clinics-and-dentists",
    path: "/for/clinics-and-dentists",
    metaTitle: "Websites for clinics and dentists in India | Brandbasket",
    metaDescription: "A website for your clinic or dental practice, built free: treatments, doctors, timings, map and a way to call or message. We run it every month.",
    h1: "A website for your clinic or dental practice.",
    answer:
      "Patients search for a clinic by treatment and by area, then look at the website before they call. Brandbasket builds your clinic website free, with your treatments, doctors, timings, map and a way to call or message you. You pay a monthly plan that keeps it hosted, secure and up to date.",
    sections: [
      {
        heading: "What a patient looks for first",
        paragraphs: ["A new patient is checking three things: what you treat, whether you are nearby and open, and how to reach you. A clinic website should answer all three without a scroll."],
        bullets: [
          "Each treatment on its own page, within the 10 pages the plan includes",
          "Doctor names and qualifications, as you give them to us",
          "Timings, address and a map",
          "Click to call, WhatsApp and an enquiry form",
          "Hosting, SSL, backups and security updates, so the site stays up",
        ],
      },
      {
        heading: "Be careful what you publish",
        paragraphs: [
          "Doctors and dentists in India follow advertising rules set by their medical or dental council, and those rules cover testimonials and treatment claims. Check your own council's rules before you publish either. Our guide to local SEO for clinics and dentists explains what to look at.",
        ],
      },
      {
        heading: "Showing up when someone searches nearby",
        paragraphs: [
          "The website is the base. Social Media Management keeps your pages active with posts made with AI, and Paid Ads Management puts Facebook and Instagram ads in front of people nearby.",
        ],
      },
      HOW_IT_GOES,
    ],
    faq: [
      COST_FAQ,
      DOMAIN_FAQ,
      { q: "Can the site show our doctors and timings?", a: "Yes. You send us the names, qualifications and timings you want shown, and we put them on the site. Changes after launch use your 2 edits a month." },
      { q: "Can we take bookings online?", a: "The site has an enquiry form, click to call and WhatsApp. Online booking systems are a new feature, which we quote for first." },
      { q: "Can I cancel?", a: CANCEL_ANSWER },
    ],
    next: [
      { label: "Local SEO for clinics and dentists in India", href: "/blog/local-seo-for-clinics-and-dentists-india", summary: "Why clinics and dentists need local SEO, and how to get found on Google Maps." },
      { label: "How to set up and verify your Google Business Profile in India", href: "/blog/set-up-verify-google-business-profile-india", summary: "Set up and verify your Google Business Profile so your listing shows in local search." },
      { label: "Website Management plan", href: "/services/managed-website", summary: "Our website plan: built free, then hosted, secured and kept up to date every month." },
    ],
  },
  {
    slug: "restaurants",
    path: "/for/restaurants",
    metaTitle: "Websites for restaurants and cafes in India | Brandbasket",
    metaDescription: "A restaurant website built free: menu, timings, location and a direct call or WhatsApp button. We host and update it for you every month.",
    h1: "A website for your restaurant or cafe.",
    answer:
      "A restaurant website gives guests your menu, timings, location and a direct way to call or message you, on an address you own. Brandbasket builds it free and runs it for a monthly plan. It works alongside Zomato and Swiggy, it does not replace them.",
    sections: [
      {
        heading: "What guests check before they come",
        paragraphs: ["People look up the menu, the opening hours and the way there before they choose where to eat. Those answers should be on your own page, not only on someone else's listing."],
        bullets: [
          "Your menu and what you are known for",
          "Opening hours, address and a map",
          "Click to call and WhatsApp for table and order questions",
          "An enquiry form for events and bulk orders",
          "Up to 10 pages, built for you",
        ],
      },
      {
        heading: "Your website and the delivery apps",
        paragraphs: [
          "Delivery apps bring orders from people already using them. Your own website is the place you control: your details, your photos and your phone number, which stay yours whatever happens to a listing. Our guide compares the two for a restaurant.",
        ],
      },
      {
        heading: "Posts, photos and reviews",
        paragraphs: [
          "Social Media Management covers posts, captions and images made with AI and scheduled on up to 4 platforms, so your pages and your website say the same thing.",
        ],
      },
      HOW_IT_GOES,
    ],
    faq: [
      COST_FAQ,
      DOMAIN_FAQ,
      { q: "Can customers order food on the website?", a: "The site takes enquiries, calls and WhatsApp messages. An online ordering system is a new feature, which we quote for first." },
      { q: "Can we change the menu?", a: "Yes. Send us the change and we make it. Small changes use your 2 edits a month. We always tell you the cost before we start anything that costs extra." },
      { q: "Can I cancel?", a: CANCEL_ANSWER },
    ],
    next: [
      { label: "Restaurants: your own website or Zomato and Swiggy?", href: "/blog/restaurant-own-website-or-zomato-swiggy", summary: "Your own website or Zomato and Swiggy: what each offers a restaurant, and how to choose." },
      { label: "How to get more Google reviews and reply to them", href: "/blog/get-more-google-reviews-and-reply", summary: "Simple ways to get more Google reviews, and how to reply to each one well." },
      { label: "Social Media Management plan", href: "/services/social-media-management", summary: "Our social media plan: AI posts, captions and images, scheduled on up to 4 platforms." },
    ],
  },
  {
    slug: "salons-gyms-and-coaching",
    path: "/for/salons-gyms-and-coaching",
    metaTitle: "Websites for salons, gyms and coaching classes | Brandbasket",
    metaDescription: "A website for your salon, gym or coaching institute, built free: services, batches, trainers, timings and an enquiry form. We run it every month.",
    h1: "A website for your salon, gym or coaching institute.",
    answer:
      "Customers of a salon, gym or coaching class choose by what you offer, when you are open and whether the place looks trustworthy. Brandbasket builds your website free with services, batches, timings and an enquiry form, then runs it for a monthly plan.",
    sections: [
      {
        heading: "What the site should hold",
        paragraphs: ["Our guide lists the pages these businesses need. The short version is below."],
        bullets: [
          "Services, classes or courses, each clear about who it is for",
          "Batch and class timings, and the address with a map",
          "Your trainers, stylists or teachers, as you describe them",
          "An enquiry form, click to call and WhatsApp",
          "Up to 10 pages, built for you",
        ],
      },
      {
        heading: "Why not only Instagram or WhatsApp",
        paragraphs: [
          "Instagram and WhatsApp are good for people who already know you. A website is what appears when someone searches for a salon, gym or class in your area, and it is the address you own. Our guides compare each.",
        ],
      },
      HOW_IT_GOES,
    ],
    faq: [
      COST_FAQ,
      DOMAIN_FAQ,
      { q: "Can the site show our class timetable?", a: "Yes. You send us the timetable and we put it on the site. Changes after launch use your 2 edits a month." },
      { q: "Can we also get Instagram posts and ads?", a: "Yes. Social Media Management covers posts, and Paid Ads Management covers Facebook and Instagram ads. Either can be added to the website plan." },
      { q: "Can I cancel?", a: CANCEL_ANSWER },
    ],
    next: [
      { label: "What a salon, gym or coaching institute website should contain", href: "/blog/salon-gym-coaching-website-pages", summary: "The pages a salon, gym or coaching institute website needs, and what each is for." },
      { label: "Do I need a website if I already have Instagram?", href: "/blog/do-i-need-a-website-if-i-have-instagram", summary: "Why an Instagram profile is not a website, and what a site does that social cannot." },
      { label: "WhatsApp Business or a website: which does a small shop need?", href: "/blog/whatsapp-business-or-website", summary: "WhatsApp Business or a website: which a small shop needs first, and when to have both." },
    ],
  },
  {
    slug: "website-options",
    path: "/compare/website-options",
    metaTitle: "Free website, freelancer, agency or DIY? | Brandbasket",
    metaDescription: "How a free website with a monthly plan compares with a freelancer, an agency and a do-it-yourself builder: cost shape, upkeep, ownership and lock-in.",
    h1: "Free website, freelancer, agency or DIY builder?",
    answer:
      "The four routes differ in who pays for the build, who looks after the site afterwards, and what you own if you leave. Brandbasket builds the site free and charges a monthly plan that covers upkeep, with the domain in your name. Here is how it compares.",
    sections: [
      {
        heading: "Questions to ask any of them",
        paragraphs: ["Put these to every option, ours included. The answers matter more than the first price."],
        bullets: [
          "What do I pay at the start, and what do I pay every month after?",
          "Who looks after hosting, security, backups and updates, and is it written down?",
          "Is the domain registered in my name?",
          "Who owns the design and the content, and can I take them with me?",
          "What happens to the site if I stop paying or want to leave?",
          "What costs extra, and will you tell me the price before you start?",
        ],
      },
      {
        heading: "What you give up with ours",
        paragraphs: [
          "The design and the content we write stay with Brandbasket and are provided as a hosted service while you are subscribed. Your domain is yours either way. If that matters to you, choose an option where you own the files, and expect to pay for the build and the upkeep yourself.",
        ],
      },
    ],
    table: {
      heading: "The four routes side by side",
      lede: "General patterns, not quotes. Any one freelancer, agency or builder may work differently, so check each point.",
      head: ["", "Free build with a monthly plan", "Freelancer", "Agency", "DIY builder"],
      rows: [
        ["Cost at the start", "No build fee", "Usually a one-time fee", "Usually a project fee", "Usually low, plus your own time"],
        ["Cost afterwards", "A monthly plan", "Often agreed separately, or not at all", "Often a separate monthly agreement", "The builder's subscription"],
        ["Hosting, security and updates", "Included in the plan", "Check what is covered", "Check what is covered", "Handled by the builder, in its own limits"],
        ["Who builds it", "We do, from your details", "The freelancer", "The agency team", "You do"],
        ["Domain", "In your name", "Check", "Check", "Check"],
        ["Leaving", "Cancel anytime, no notice period", "Usually you keep what was delivered", "Depends on the contract", "Depends on the builder's export options"],
      ],
    },
    faq: [
      { q: "Is a free website a trap?", a: "It is free to build because the money comes from the monthly plan. The questions above, and our guide to what to ask an agency, show what to check before you sign anything." },
      { q: "Is a monthly plan cheaper than paying once?", a: "It depends on what you need and for how long. A one-time fee often leaves hosting, security and updates to you. A monthly plan covers them. Compare the full cost over a year or two, not the first payment." },
      { q: "Can I move my site later?", a: "Your domain moves with you. The design and the content we write are provided as a hosted service while you are subscribed, so they stay with Brandbasket." },
    ],
    next: [
      { label: "Is a free website really free? What to ask an agency", href: "/blog/is-a-free-website-really-free", summary: "Where a free website fits, its catch, and what to ask an agency before you agree." },
      { label: "How much does a website cost for a small business in India?", href: "/blog/website-cost-small-business-india", summary: "What a small business website should cost in India, and what the price must include." },
      { label: "Pricing", href: "/pricing", summary: "Our three monthly plans, what each includes, and how the package discounts work." },
    ],
  },
];

export function guidePageBySlug(slug: string): GuidePageContent | undefined {
  return GUIDE_PAGES.find((page) => page.slug === slug);
}

/** The pages shown under "for your kind of business", in order. */
export const INDUSTRY_PAGES: readonly GuidePageContent[] = GUIDE_PAGES.filter((page) => page.path.startsWith("/for/"));
/** The comparison page. */
export const COMPARE_PAGE: GuidePageContent = GUIDE_PAGES.filter((page) => page.path.startsWith("/compare/"))[0]!;

export interface GlossaryTerm {
  readonly term: string;
  readonly definition: string;
}

export const GLOSSARY = {
  metaTitle: "Glossary of local business website terms | Brandbasket",
  metaDescription: "Plain-language meanings of the terms local businesses meet: AEO, Google Business Profile, local SEO, schema markup, SSL, hosting, domain and more.",
  h1: "Website and search terms, in plain words.",
  lede: "The words agencies use, and what they mean for a local business.",
  terms: [
    { term: "AEO (answer engine optimisation)", definition: "Shaping your pages so that AI assistants and search answers can quote them: a clear question, then a direct answer. It sits beside local SEO, it does not replace it." },
    { term: "Local SEO", definition: "Improving how your business shows up on Google Search and Maps when people search for something in your area." },
    { term: "Google Business Profile", definition: "The free listing that shows your business on Google Search and Maps: name, address, hours, photos, posts and reviews." },
    { term: "NAP (name, address, phone)", definition: "Your business name, address and phone number. They should read the same on your website, your profile and every directory." },
    { term: "Citation", definition: "A mention of your business name, address and phone number on another website or directory." },
    { term: "Schema markup", definition: "Code on a page that tells search engines what the page is about, such as your business details or a list of questions and answers." },
    { term: "Meta title and meta description", definition: "The headline and the short summary that can appear for your page in search results." },
    { term: "SSL certificate", definition: "What makes a site load over https and shows the padlock. It encrypts the connection between a visitor and your site." },
    { term: "Hosting", definition: "The computer service that keeps your website online and available to visitors." },
    { term: "Domain name", definition: "Your web address, such as yourbusiness.in. You register it and pay for it, so it stays in your name." },
    { term: "Backup", definition: "A saved copy of your website, so it can be restored if something breaks." },
    { term: "Ad spend", definition: "The money you pay Meta or Google to show your ads. It is separate from what you pay someone to set up and manage them." },
    { term: "DPDP Act", definition: "India's Digital Personal Data Protection Act, 2023. It sets rules for how businesses collect and use personal data, such as a name and phone number from an enquiry form." },
  ],
  next: [
    { label: "Local SEO and AEO: what is the difference, and which first?", href: "/blog/local-seo-vs-aeo-which-first", summary: "Local SEO and AEO solve different problems. Here is which one to start with." },
    { label: "How to set up and verify your Google Business Profile in India", href: "/blog/set-up-verify-google-business-profile-india", summary: "Set up and verify your Google Business Profile so your listing shows in local search." },
    { label: "Website Management plan", href: "/services/managed-website", summary: "Our website plan: built free, then hosted, secured and kept up to date every month." },
  ],
} as const;

/** Guides shown under a page: the posts and pages worth reading from where the visitor is. */
export const GUIDE_LINKS = {
  pricing: [
    { label: "How much does a website cost for a small business in India?", href: "/blog/website-cost-small-business-india", summary: "What a small business website should cost in India, and what the price must include." },
    { label: "Is a free website really free? What to ask an agency", href: "/blog/is-a-free-website-really-free", summary: "Where a free website fits, its catch, and what to ask an agency before you agree." },
    { label: "Free website, freelancer, agency or DIY builder?", href: "/compare/website-options", summary: "Free website, freelancer, agency or DIY builder: what each gives you and who it suits." },
  ],
  website: [
    { label: "Is a free website really free? What to ask an agency", href: "/blog/is-a-free-website-really-free", summary: "Where a free website fits, its catch, and what to ask an agency before you agree." },
    { label: "How much does a website cost for a small business in India?", href: "/blog/website-cost-small-business-india", summary: "What a small business website should cost in India, and what the price must include." },
    { label: "Free website, freelancer, agency or DIY builder?", href: "/compare/website-options", summary: "Free website, freelancer, agency or DIY builder: what each gives you and who it suits." },
  ],
  // No guide is about social media posting yet; the page shows no guides until one is written.
  social: [],
  ads: [
    { label: "How much should a local business spend on Facebook and Instagram ads?", href: "/blog/facebook-instagram-ads-budget-local-business", summary: "How much to spend on Facebook and Instagram ads, and how to tell if they bring enquiries." },
  ],
} as const satisfies Record<string, readonly GuideLink[]>;

export const GUIDE_LINKS_HEADING = "Guides worth reading.";
