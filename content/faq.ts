// content/faq.ts
// The FAQ page: the client's managed-website FAQ (2026-11-24), merged from 146 questions to the ones below. Amounts come from lib/pricing.ts;
// cancellation, payment and ownership wording comes from content/legal/cancellation.ts so the page never contradicts the terms. New copy
// goes to the owner first. Rupee pages print GST; dollar pages never do (e2e/currency.spec.ts).
import { CANCEL_ANSWER, CANCELLATION_RULE, HOSTED_SERVICE, PAYMENT_FAILURE, RENEWAL_REMINDER } from "@/content/legal/cancellation";
import { type Currency, formatMoney } from "@/lib/currency";
import { buildUsualPrice, domainCostRange, extrasFor, GST_LABEL, planPrice, sourceTransferFee } from "@/lib/pricing";
import { businessDetails } from "@/lib/site-config";
import type { FaqItem } from "./types";

export type FaqIconKey = "CurrencyInr" | "Palette" | "Timer" | "Globe" | "Wrench" | "ChartLineUp" | "ShieldCheck" | "PuzzlePiece" | "Headset" | "TrendUp";

/** The short verdict shown beside a question, so a long list can be skimmed. */
export type FaqChip = "yes" | "no" | "extra" | "not-included" | "not-guaranteed";

export const FAQ_CHIP_LABEL: Readonly<Record<FaqChip, string>> = {
  yes: "Yes",
  no: "No",
  extra: "Extra cost",
  "not-included": "Not included",
  "not-guaranteed": "Not guaranteed",
};

export interface FaqList {
  readonly lead: string;
  readonly items: readonly string[];
}

export type FaqAnswer = string | FaqList;

interface FaqEntry {
  readonly id: string;
  readonly q: string;
  readonly a: FaqAnswer;
  readonly chip?: FaqChip;
  /** Left out of the dollar pages: the question is about GST. */
  readonly inrOnly?: true;
}

interface FaqGroupDef {
  readonly heading: string;
  readonly entries: readonly FaqEntry[];
}

interface FaqTopicDef {
  readonly slug: string;
  readonly name: string;
  readonly icon: FaqIconKey;
  readonly groups: readonly FaqGroupDef[];
}

export interface FaqQuestion {
  readonly id: string;
  readonly q: string;
  readonly a: FaqAnswer;
  readonly chip?: FaqChip;
}

export interface FaqGroup {
  readonly heading: string;
  readonly questions: readonly FaqQuestion[];
}

export interface FaqTopic {
  readonly slug: string;
  readonly name: string;
  readonly icon: FaqIconKey;
  readonly groups: readonly FaqGroup[];
  readonly count: number;
}

const TOPICS: readonly FaqTopicDef[] = [
  {
    slug: "pricing",
    name: "Pricing and payment",
    icon: "CurrencyInr",
    groups: [
      {
        heading: "What you pay",
        entries: [
          { id: "10-10", q: "Why should I pay {plan} a month instead of building a website once and maintaining it myself?", a: "Building a website is only one part of keeping a professional online presence. You also need reliable hosting, SSL management, backups, security updates, technical monitoring and ongoing support. With Brandbasket you do not pay around {build} up front for a website build, and you do not have to manage the technical side yourself. For {plan} a month you get a professionally built website with hosting, maintenance and technical support, so you can run your business while we look after the website." },
          { id: "1-1", q: "Is the website genuinely free, or are there any hidden charges?", a: "Yes. Website design and development are completely free for up to 10 pages. You only pay the monthly subscription of {plan}, which covers website hosting, maintenance and ongoing technical management. There are no hidden charges for the services included in your subscription.", chip: "yes" },
          { id: "1-2", q: "Why are you offering website development for free?", a: "Our mission is to help more local businesses establish a professional online presence without the burden of a large upfront investment. We believe every business deserves a quality website, regardless of its size or budget. Our subscription model allows us to make this possible while taking care of your website over the long term." },
          { id: "1-3", q: "Is {plan} a fixed monthly charge, or can it increase?", a: "Your monthly subscription is fixed at {plan}{gstIncl}. Extra charges apply only if you ask for work outside the plan, such as more pages, longer edits or special functionality. We tell you the price and get your approval before we start." },
          { id: "1-4", q: "Does {plan} include GST?", a: "Yes. {plan} already includes {gst} GST, so you do not pay GST on top.", chip: "yes", inrOnly: true },
          { id: "1-12", q: "Will the monthly subscription price remain the same for existing customers?", a: "We aim to maintain consistent pricing for our existing subscribers. Any changes to subscription pricing or service terms will be communicated in advance and handled in accordance with the applicable terms and conditions." },
        ],
      },
      {
        heading: "How you pay",
        entries: [
          { id: "1-5", q: "Do I need to pay anything before website development starts?", a: "Yes. You need to activate your subscription before development begins. Once the subscription is confirmed, our team will schedule an onboarding meeting to understand your business, services, brand identity and target customers.", chip: "yes" },
          { id: "1-7", q: "Do I have to pay for two or three months in advance?", a: "No. You pay month to month.", chip: "no" },
          { id: "1-8", q: "Will I receive a GST invoice every month?", a: "Yes. We provide a GST invoice for your payments.", chip: "yes", inrOnly: true },
          { id: "1-13", q: "Are there any charges for payment processing or automatic renewals?", a: "Brandbasket does not charge any additional payment-processing fees. If a payment gateway or bank imposes a transaction fee, that charge will be governed by the respective provider's terms.", chip: "no" },
          { id: "1-6", q: "Is the first month's payment refundable?", a: "Not once your plan is active and work has started. We do not refund part of a billing month you have already paid for, or work already delivered. We do refund a payment taken twice, taken after your cancellation took effect, or taken in error.", chip: "no" },
        ],
      },
      {
        heading: "Not in the price",
        entries: [
          { id: "1-9", q: "Are there any additional charges for hosting, SSL or security?", a: "No. Website hosting, SSL and the standard maintenance in your plan are covered by the {plan} monthly fee.", chip: "no" },
          { id: "1-10", q: "Do I have to pay separately for domain registration?", a: "Yes. Domain registration and renewal are your responsibility. You retain ownership of your domain, and our team can assist you with connecting it to your website.", chip: "yes" },
        ],
      },
    ],
  },
  {
    slug: "design",
    name: "Design and build",
    icon: "Palette",
    groups: [
      {
        heading: "Your design",
        entries: [
          { id: "2-1", q: "What kind of website will you develop for my business?", a: "We develop modern, professional and mobile-friendly business websites tailored to your business requirements. Our focus is on presenting your services, building customer confidence and making it easy for potential customers to contact you." },
          { id: "2-2", q: "Can I see some websites you have already developed?", a: "Yes. We would be happy to share relevant website examples so you can understand our design quality, functionality and approach before getting started.", chip: "yes" },
          { id: "2-3", q: "Will the website be custom-designed or based on a ready-made template?", a: "Your website is custom-designed from scratch around your business requirements and brand identity. We do not drop your details into a generic, ready-made template, so it will look different from other Brandbasket websites." },
          { id: "2-5", q: "Can I share reference websites that I like?", a: "Yes. You are welcome to share reference websites, design inspirations and examples of features you would like us to consider. Our team will use these references to understand your expectations and develop an appropriate design.", chip: "yes" },
          { id: "2-20", q: "Will the website be mobile-friendly?", a: "Yes. Every website is designed to be responsive and accessible across desktops, laptops, tablets and smartphones.", chip: "yes" },
        ],
      },
      {
        heading: "Your content and images",
        entries: [
          { id: "2-7", q: "Can you use my logo, brand colours, photos and content?", a: "Yes. Share your logo, photographs, business information and website content, and we will follow your existing brand guidelines for colours, typography and overall look. Your materials go into the website wherever they fit.", chip: "yes" },
          { id: "2-8", q: "Who will write the website content?", a: "Our team will prepare the initial website content based on the information you provide about your business, products and services. We will share the content for your review and approval before the website goes live." },
          { id: "2-9", q: "Will you arrange professional images for my website?", a: "Yes. Where required, we can create professional AI-generated images suitable for your website. These visuals will be selected and designed to complement your brand and business presentation.", chip: "yes" },
          { id: "2-10", q: "What happens if I don't have a logo or business photographs?", a: "No problem. We can assist with temporary visual assets and suitable AI-generated images to help your website look professional. If you require a complete brand identity or professional photography, those services can be discussed separately." },
        ],
      },
      {
        heading: "Pages and features",
        entries: [
          { id: "2-11", q: "Can I get more than 10 pages?", a: "Yes. We can build more pages for what you need. The extra work is estimated at {hour} an hour, and we start only after you approve it.", chip: "extra" },
          { id: "2-12", q: "Can you create individual pages for each of my services?", a: "Yes. We can create dedicated service pages to explain your offerings in detail and help visitors understand the value of each service.", chip: "yes" },
          { id: "2-13", q: "Can you create landing pages for specific advertising campaigns?", a: "Yes. Campaign-specific landing pages can be developed as additional work. The scope and applicable charges will be discussed and approved before development.", chip: "extra" },
          { id: "2-14", q: "Can I add a gallery, testimonials, Google Maps, videos or several enquiry forms?", a: "Yes. We can add portfolio showcases, image galleries, testimonials and customer reviews, a Google Maps embed with directions, videos from supported platforms such as YouTube, and multiple enquiry forms across different pages, depending on your needs.", chip: "yes" },
          { id: "2-18", q: "Can I integrate WhatsApp chat and click-to-call functionality?", a: "Yes. We can add WhatsApp contact buttons and click-to-call functionality, making it easier for visitors to contact your business directly.", chip: "yes" },
          { id: "2-19", q: "Can you develop a multilingual website?", a: "Yes. We can develop multilingual websites. Since this requires additional implementation and content configuration, the scope and charges will be discussed separately.", chip: "extra" },
        ],
      },
    ],
  },
  {
    slug: "delivery",
    name: "Delivery and timelines",
    icon: "Timer",
    groups: [
      {
        heading: "The seven working days",
        entries: [
          { id: "3-1", q: "Is the website guaranteed to go live within seven working days?", a: "Our standard delivery target is seven working days. We make every effort to meet this timeline, provided we receive the required business information, content, images and approvals on time. If an unexpected delay occurs, we will keep you informed." },
          { id: "3-2", q: "When does the seven-working-day timeline begin?", a: "The timeline begins once the onboarding meeting is completed and we have received the necessary business information, requirements and materials required to begin development." },
          { id: "3-3", q: "What happens if I take time to provide the required content?", a: "The delivery timeline depends on receiving the necessary information and approvals from your side. Any delay in sharing the required materials may affect the launch date. Your subscription remains active during this period, so we encourage you to provide the information promptly to make the most of your subscription." },
          { id: "3-9", q: "What happens if the website is not delivered within the promised timeline?", a: "If an unexpected delay occurs, we will communicate the reason and prioritise completion. Where possible, we aim to complete the remaining work within an additional two working days." },
        ],
      },
      {
        heading: "Review and changes",
        entries: [
          { id: "3-5", q: "Will I get an opportunity to review the website before it goes live?", a: "Yes. We will share the completed website with you for review and approval. The website will only be published on your domain after you provide your approval.", chip: "yes" },
          { id: "3-4", q: "How many design revisions are included?", a: "Up to two rounds of design revisions are included before the website goes live. Any substantial redesign or additional work beyond the agreed scope may be chargeable." },
          { id: "3-6", q: "What happens if I am not satisfied with the design?", a: "Your satisfaction matters to us. We encourage you to share your expectations, references and feedback clearly during the onboarding process. You will have two opportunities to request design revisions before launch so we can align the website with your expectations." },
        ],
      },
      {
        heading: "Who you deal with",
        entries: [
          { id: "3-8", q: "Who will coordinate with me during development?", a: "A member of our website development team will coordinate with you during the development process, collect your requirements and share progress updates." },
          { id: "3-7", q: "Will I have a dedicated person handling my website?", a: "Our service uses automated monitoring and AI-assisted workflows to manage routine website operations efficiently. For technical assistance and requests requiring human intervention, our support team will be available to help." },
        ],
      },
    ],
  },
  {
    slug: "ownership",
    name: "Domain, hosting and ownership",
    icon: "Globe",
    groups: [
      {
        heading: "Your domain",
        entries: [
          { id: "4-1", q: "Will the domain name be registered in my company's name?", a: "Yes. Your domain should be registered in your own name or your company's name. You will retain complete ownership and control of the domain registration.", chip: "yes" },
          { id: "4-2", q: "Can I use my existing domain?", a: "Yes. If you already own a domain, we can connect it to your new Brandbasket website.", chip: "yes" },
          { id: "4-3", q: "What if I don't have a domain name?", a: "That's perfectly fine. We can temporarily host your website on a Brandbasket-provided subdomain while you arrange your own domain. Our team can also guide you through the domain registration and connection process." },
          { id: "4-4", q: "How much does domain registration cost?", a: "Domain registration costs vary with the domain extension, registrar and availability.{domainRange} The exact price is confirmed by your chosen registrar." },
          { id: "4-7", q: "Will I get access to my domain registrar account?", a: "Yes. Your domain registrar account belongs to you, and you will retain full access and control.", chip: "yes" },
        ],
      },
      {
        heading: "Hosting and access",
        entries: [
          { id: "4-5", q: "Where will my website be hosted?", a: "Your website will be hosted on Vercel, a modern hosting platform well suited to Next.js websites. This provides a reliable infrastructure for delivering your website to visitors." },
          { id: "4-8", q: "Will I get access to the website's backend or admin panel?", a: "Yes. We will provide access to the supported website management functionality, including the ability to manage blog content where applicable.", chip: "yes" },
          { id: "4-9", q: "Can I make changes to the website myself?", a: "You can manage and publish blog content through the available content management functionality. Changes to the main website pages and underlying design or code are managed by Brandbasket to maintain consistency, security and performance." },
        ],
      },
      {
        heading: "Ownership",
        entries: [
          { id: "4-10", q: "Who owns the website design and source code?", a: "You own your brand assets, business information and the content you supply. {hostedService} If you want the source code so you can manage the website yourself, you can request a transfer for {transfer}." },
          { id: "4-12", q: "Can I take my website with me if I leave?", a: "Yes. We can provide the website source code and development files for {transfer}. With the source code you can host the website with another provider or hand it to another developer.", chip: "extra" },
        ],
      },
    ],
  },
  {
    slug: "care",
    name: "Maintenance and edits",
    icon: "Wrench",
    groups: [
      {
        heading: "Monthly care",
        entries: [
          { id: "5-1", q: "What does website maintenance cover?", a: { lead: "Maintenance means looking after the technical side so your website stays available, secure and working. Every month this covers:", items: ["Hosting and SSL certificate management", "Standard security updates and maintenance", "Scheduled backups", "Performance and uptime monitoring", "Monitoring of enquiry forms and contact features", "2 website edits of up to 15 minutes each", "Technical help for website issues"] } },
          { id: "5-13", q: "Will you update plugins, software and security configurations?", a: "Yes. We maintain the website's applicable software and security configurations as part of our technical maintenance responsibilities.", chip: "yes" },
          { id: "5-14", q: "Will you fix broken links and website errors?", a: "Yes. Identifying and addressing technical website issues and broken links is part of our website maintenance responsibilities, subject to the scope of the service.", chip: "yes" },
          { id: "5-15", q: "Will you monitor website downtime?", a: "Yes. We monitor website availability and take appropriate action when downtime or technical issues are detected.", chip: "yes" },
        ],
      },
      {
        heading: "Your two edits",
        entries: [
          { id: "5-3", q: "What counts as one website edit?", a: "One edit refers to a requested website update or change, with a maximum working time of 15 minutes under the complimentary monthly allowance. For example, updating contact information, changing business hours or modifying existing text may count as an edit." },
          { id: "5-4", q: "Are two edits sufficient for my business?", a: "For most small businesses, two monthly edits are sufficient for routine changes such as updating contact information, business hours, service descriptions or promotional content. If you need additional updates, we can accommodate them at the applicable additional-work rate." },
          { id: "5-5", q: "Can I combine the two edits into one larger change?", a: "Yes. You can combine your two monthly edit allowances for a larger update, provided the total work remains within the combined 30-minute allowance.", chip: "yes" },
          { id: "5-7", q: "Do unused edits carry forward?", a: "No. The two complimentary edits are provided on a monthly basis and cannot be carried forward to subsequent months.", chip: "no" },
          { id: "5-12", q: "Will you update business hours, pricing, services and contact details?", a: "Yes. Routine updates to your business information, service details, pricing and contact information are supported within your monthly edit allowance.", chip: "yes" },
        ],
      },
      {
        heading: "Extra work and speed",
        entries: [
          { id: "5-8", q: "Is {hour} an hour charged for every additional change?", a: "Yes. Work beyond your monthly edits is charged at {hour} an hour. We estimate the time and tell you the cost before we start.", chip: "yes" },
          { id: "5-9", q: "Will I be informed before any additional charges are applied?", a: "Yes. We will explain the additional work, estimated time and applicable charges and obtain your approval before starting.", chip: "yes" },
          { id: "5-10", q: "Can I request urgent changes?", a: "Yes. You can request urgent website changes, subject to team availability. Our regular support availability is Monday to Saturday, excluding applicable holidays.", chip: "yes" },
          { id: "5-11", q: "How quickly will you complete requested changes?", a: "Our standard target is to complete routine website edits within 24 hours of receiving a clear request. Complex requests or work requiring additional approvals may take longer." },
        ],
      },
      {
        heading: "Backups and recovery",
        entries: [
          { id: "5-18", q: "How often are backups taken, and how long are they kept?", a: "Backups are scheduled weekly. How long they are kept depends on the hosting and backup configuration, and the retention period is confirmed in the service terms." },
          { id: "5-16", q: "What happens if my website gets hacked?", a: "If a security incident occurs, our team will investigate the issue and take appropriate steps to restore the website using available backups and recovery procedures. The extent of recovery will depend on the nature of the incident and the available backup data." },
        ],
      },
    ],
  },
  {
    slug: "seo",
    name: "Speed and SEO",
    icon: "ChartLineUp",
    groups: [
      {
        heading: "Speed",
        entries: [
          { id: "6-1", q: "Will my website load quickly?", a: "We develop websites using Next.js and follow performance optimisation practices to deliver a fast browsing experience. Actual loading times depend on factors such as the visitor's internet connection, device, content size and third-party integrations. Our target is to keep loading times under four seconds under normal conditions." },
          { id: "6-12", q: "Will the website meet Google's Core Web Vitals requirements?", a: "We follow Google's Core Web Vitals recommendations during development and optimisation. However, actual scores depend on content, third-party scripts, hosting conditions and visitor devices, so specific scores cannot be guaranteed." },
        ],
      },
      {
        heading: "Set up for Google",
        entries: [
          { id: "6-2", q: "Will the website be optimised for Google?", a: "Yes. We follow essential website optimisation practices, including search-engine-friendly URLs, mobile responsiveness, page titles, metadata, sitemap configuration and other foundational technical SEO elements.", chip: "yes" },
          { id: "6-4", q: "Is basic SEO included in the monthly fee?", a: "Yes. One-time foundational SEO configuration is included during website development. This covers essential technical and on-page setup. Ongoing keyword research, content optimisation, link building and ranking improvement are not included.", chip: "yes" },
          { id: "6-5", q: "Will you submit my website to Google Search Console?", a: "Yes. We will assist with setting up Google Search Console and submitting your website's sitemap so that Google can discover and monitor your website.", chip: "yes" },
          { id: "6-6", q: "Will you set up Google Analytics?", a: "Yes. We can configure Google Analytics to help you understand website traffic and visitor behaviour.", chip: "yes" },
          { id: "6-9", q: "Will you create XML sitemaps and robots.txt?", a: "Yes. We configure an XML sitemap and robots.txt file as part of the foundational technical SEO setup.", chip: "yes" },
        ],
      },
      {
        heading: "Results",
        entries: [
          { id: "6-3", q: "Will my website appear on Google's first page?", a: "A website's position on Google depends on several factors, including competition, search demand, content quality, domain authority and ongoing SEO activities. We provide foundational website optimisation, but first-page rankings are not guaranteed and require a dedicated SEO strategy.", chip: "not-guaranteed" },
          { id: "6-16", q: "Will you guarantee website traffic or enquiries?", a: "No. We provide the website infrastructure and functionality to establish your online presence. Website traffic and enquiries depend on your marketing activities, search visibility, advertising and customer demand.", chip: "not-guaranteed" },
        ],
      },
      {
        heading: "Not included",
        entries: [
          { id: "6-7", q: "Will you configure Google Business Profile?", a: "Google Business Profile management is not included in the managed website subscription. However, it can be discussed as a separate service.", chip: "not-included" },
          { id: "6-10", q: "Will you implement schema markup?", a: "Advanced structured data and custom schema implementation are not included in the standard subscription. These can be provided as additional SEO services.", chip: "not-included" },
          { id: "6-13", q: "Will you provide keyword research?", a: "Keyword research is not included in the managed website subscription. It is available through our separate SEO services.", chip: "not-included" },
          { id: "6-14", q: "Will you write blogs for my website?", a: "Initial website content is included. However, ongoing blog writing and publishing are not included in the standard monthly subscription." },
          { id: "6-15", q: "Will you manage SEO every month?", a: "No. The subscription covers website maintenance and foundational SEO setup, not ongoing SEO management. Monthly SEO services can be subscribed to separately.", chip: "no" },
          { id: "6-17", q: "Will my website be optimised for AI search platforms such as ChatGPT and Gemini?", a: "Our standard website setup follows foundational technical and content best practices. However, dedicated AI search optimisation, brand visibility strategies and ongoing AEO services are not included in the subscription." },
        ],
      },
    ],
  },
  {
    slug: "security",
    name: "Security and privacy",
    icon: "ShieldCheck",
    groups: [
      {
        heading: "Protection",
        entries: [
          { id: "7-1", q: "What security measures do you implement?", a: "We follow standard website security practices, including secure hosting configurations, SSL implementation, access management and appropriate protection of website endpoints and forms. We also monitor website availability and address identified technical vulnerabilities within the scope of our service." },
          { id: "7-2", q: "Will my website have an SSL certificate?", a: "Yes. An SSL certificate is included to enable secure HTTPS communication between your website and its visitors.", chip: "yes" },
          { id: "7-3", q: "Will you protect my website from spam and bot submissions?", a: "We implement appropriate anti-spam measures and form-protection mechanisms wherever applicable to reduce unwanted submissions." },
          { id: "7-4", q: "Will you protect my website from hacking attempts?", a: "We follow standard security practices to reduce the risk of unauthorised access and malicious activity. However, no website can be guaranteed to be completely immune to cyberattacks." },
          { id: "7-5", q: "What happens if customer information is compromised?", a: "We take reasonable technical measures to protect website information and investigate any security incidents involving our managed infrastructure. Responsibilities and obligations relating to customer data, incident reporting and regulatory compliance will be governed by our service agreement and applicable law." },
        ],
      },
      {
        heading: "Privacy and the law",
        entries: [
          { id: "7-6", q: "Is my website compliant with India's DPDP Act?", a: "We can implement relevant technical features that support data protection, such as secure forms, privacy notices and cookie-consent mechanisms. However, overall compliance with India's Digital Personal Data Protection Act depends on your business's data collection, processing, consent and privacy practices. You remain responsible for ensuring that your business policies and legal documentation meet applicable requirements." },
          { id: "7-7", q: "Do you configure cookie consent?", a: "Yes. We can configure a cookie-consent mechanism to help communicate applicable cookie usage and allow visitors to manage their preferences.", chip: "yes" },
          { id: "7-8", q: "Will you provide a privacy policy and terms and conditions?", a: "We can add Privacy Policy and Terms and Conditions pages to your website. You provide or approve the content, and you are responsible for making sure it accurately reflects your business and meets the law. We recommend taking legal advice where needed, and we can publish the approved text." },
        ],
      },
      {
        heading: "Your data",
        entries: [
          { id: "7-10", q: "Where is my website data stored?", a: "Your website is hosted on Vercel's infrastructure. The actual location of stored data may depend on the relevant hosting, storage and third-party services configured for your website." },
          { id: "7-11", q: "Who has access to my website and customer information?", a: "Access is restricted to authorised personnel who need it to provide the contracted services. We follow appropriate access-control practices to protect website and customer information." },
          { id: "7-12", q: "Will you share my customer data with any third party?", a: "We do not sell your customer information to third parties. Certain service providers, such as hosting, analytics and communication platforms, may process relevant data to provide their services. Such processing is subject to applicable privacy requirements and the relevant service providers' terms." },
        ],
      },
    ],
  },
  {
    slug: "features",
    name: "Features and integrations",
    icon: "PuzzlePiece",
    groups: [
      {
        heading: "Connect other tools",
        entries: [
          { id: "8-2", q: "Can customers book appointments or reservations on my website?", a: "Yes. We can connect appointment booking through a third-party platform that suits your business, and the cost depends on the platform and the integration. A built-in booking or reservation system is not part of the standard package; third-party options can be evaluated separately.", chip: "extra" },
          { id: "8-4", q: "Can I integrate a CRM?", a: "Yes. We can integrate compatible third-party CRM platforms, subject to their technical capabilities and any additional integration costs.", chip: "extra" },
          { id: "8-6", q: "Can I integrate email marketing tools?", a: "Yes. Supported third-party email marketing platforms can be integrated depending on your requirements. Any external subscription fees will be payable separately.", chip: "extra" },
          { id: "8-7", q: "Can I add a chatbot?", a: "Yes. We can integrate a suitable chatbot solution to help visitors find information and interact with your business. Advanced or AI-powered chatbot functionality may involve additional charges.", chip: "extra" },
          { id: "8-8", q: "Can I integrate Google Reviews?", a: "Yes. We can display supported Google Reviews or review widgets on your website, subject to the available integration method.", chip: "yes" },
          { id: "8-11", q: "Can I integrate third-party applications?", a: "Yes. We can evaluate integrations with supported third-party applications, depending on API availability, compatibility and implementation requirements. Additional charges may apply.", chip: "extra" },
        ],
      },
      {
        heading: "Sell online",
        entries: [
          { id: "8-1", q: "Can I integrate a payment gateway?", a: "Online payment gateway integration is not included in the standard managed website package. If you require payment functionality, we can evaluate the technical requirements and provide a separate quotation where supported.", chip: "not-included" },
          { id: "8-9", q: "Can I sell products directly through my website?", a: "Yes. E-commerce functionality can be developed as an additional service. The scope and charges will depend on the number of products, payment requirements, order management and other features.", chip: "extra" },
          { id: "8-10", q: "Can I add an online ordering system?", a: "Online ordering is not included in the standard package. If you need this functionality, we can assess the requirements and suggest a suitable solution separately.", chip: "not-included" },
        ],
      },
      {
        heading: "Not included",
        entries: [
          { id: "8-12", q: "Can I add a customer login or registration system?", a: "This functionality is not included in the standard package. It can be evaluated as a separate development requirement.", chip: "not-included" },
          { id: "8-13", q: "Can I have a dashboard to manage enquiries?", a: "A dedicated enquiry-management dashboard is not included in the standard subscription. However, we can explore CRM or third-party solutions if you require centralised enquiry management.", chip: "not-included" },
        ],
      },
    ],
  },
  {
    slug: "support",
    name: "Cancelling and support",
    icon: "Headset",
    groups: [
      {
        heading: "Cancelling",
        entries: [
          { id: "9-1", q: "Can I cancel my subscription at any time?", a: "{cancelAnswer}", chip: "yes" },
          { id: "9-2", q: "Is there any minimum subscription period?", a: "There is no minimum period and no lock-in. Your plan is billed month to month." },
          { id: "9-6", q: "How do I request cancellation?", a: "Write to {email}. {cancellationRule}" },
          { id: "9-3", q: "Is there a cancellation fee?", a: "There is no cancellation fee. If you want your website's source code so you can host it elsewhere, there is {transfer}." },
          { id: "9-5", q: "Will I receive a refund for the remaining days of the month?", a: "No. Subscription payments are non-refundable, including unused days within an active billing period.", chip: "no" },
          { id: "9-4", q: "What happens to my website if I cancel or stop paying?", a: "Your plan keeps running until the end of the month you have already paid for. Then hosting stops and your website goes offline. Your domain, logo, photos and the content you supplied stay yours. To keep the website, request the source code for {transfer}." },
          { id: "9-16", q: "What happens if Brandbasket discontinues this service?", a: "If Brandbasket discontinues the managed website service, we will communicate the decision in advance and provide an appropriate transition process, including access to your website files and content, subject to the applicable service agreement. Our objective will be to minimise disruption to your business." },
        ],
      },
      {
        heading: "Billing and late payment",
        entries: [
          { id: "9-7", q: "Will I receive advance notification before renewal?", a: "Yes. {renewalReminder}" },
          { id: "9-8", q: "What happens if my payment fails?", a: "We tell you and ask you to complete the pending payment. If an autopay charge fails, your bank or Razorpay may try it again." },
          { id: "9-9", q: "Will my website go offline if a payment is late?", a: "{paymentFailure}" },
        ],
      },
      {
        heading: "Support",
        entries: [
          { id: "9-11", q: "How can I contact your support team?", a: "Write to {email} or message us on WhatsApp from the Contact page." },
          { id: "9-12", q: "What are your customer support timings?", a: "Our regular support team is available {hours}, excluding holidays. Sunday and holiday support is not part of the standard service." },
          { id: "9-14", q: "How quickly will you respond to a technical issue?", a: "We aim to acknowledge and assess technical issues as quickly as possible during support hours. Resolution time depends on the nature and complexity of the issue." },
          { id: "9-15", q: "Will I have a dedicated account manager?", a: "A dedicated account manager is not included in the standard subscription. However, our support and development teams will assist you with website-related queries and requests.", chip: "not-included" },
        ],
      },
    ],
  },
  {
    slug: "growth",
    name: "Growth and results",
    icon: "TrendUp",
    groups: [
      {
        heading: "What to expect",
        entries: [
          { id: "10-1", q: "How will this website help me get more customers?", a: "Your website acts as your business's digital storefront. It allows potential customers to learn about your business, explore your services, understand what makes you different and contact you directly. A professional website also helps establish credibility when customers search for your business online or discover it through advertising and other marketing channels." },
          { id: "10-2", q: "Will my website generate enquiries?", a: "Your website will include enquiry-generating features such as contact forms, WhatsApp buttons and click-to-call functionality. When potential customers visit your website, they can use these features to contact your business. Actual enquiry volumes depend on the amount and quality of traffic your website receives." },
          { id: "10-9", q: "What happens if my website doesn't generate any enquiries?", a: "A website provides the platform and tools for customers to discover and contact your business, but it cannot independently guarantee enquiries. You need to attract relevant visitors through SEO, paid advertising, social media, referrals and other marketing activities. We can help you explore suitable digital marketing services separately." },
        ],
      },
      {
        heading: "Reports and tracking",
        entries: [
          { id: "10-6", q: "Will I receive a monthly performance report?", a: "Yes. We can provide a monthly website performance report covering relevant traffic and website activity metrics available through the configured analytics tools.", chip: "yes" },
          { id: "10-7", q: "Can I see how many enquiries came through my website?", a: "Yes. We can help track enquiries submitted through configured website forms. Additional tracking may be required for calls, WhatsApp conversations and third-party integrations.", chip: "yes" },
          { id: "10-8", q: "Will you help me improve my website's conversion rate?", a: "Conversion Rate Optimisation (CRO) is not included in the standard managed website subscription. However, we can discuss a separate CRO engagement if you want to improve the percentage of website visitors who become enquiries or customers.", chip: "not-included" },
        ],
      },
    ],
  },
];

function tokensFor(currency: Currency): Readonly<Record<string, string>> {
  const inr = currency === "INR";
  const fee = sourceTransferFee(currency);
  const domain = domainCostRange(currency);
  return {
    plan: `${formatMoney(planPrice("website", currency), currency)}`,
    hour: formatMoney(extrasFor(currency).hour, currency),
    build: formatMoney(buildUsualPrice(currency), currency),
    gst: GST_LABEL,
    gstIncl: inr ? ", inclusive of GST" : "",
    transfer: fee === null ? "a one-time transfer fee that we confirm before we start" : `a one-time transfer fee of ${formatMoney(fee, currency)}`,
    domainRange: domain === null ? "" : ` As a general estimate, a standard domain costs about ${formatMoney(domain.low, currency)} to ${formatMoney(domain.high, currency)} a year.`,
    cancelAnswer: CANCEL_ANSWER,
    cancellationRule: `You can cancel any time. ${CANCELLATION_RULE}`,
    renewalReminder: RENEWAL_REMINDER,
    paymentFailure: PAYMENT_FAILURE,
    hostedService: HOSTED_SERVICE,
    email: businessDetails.email,
    hours: businessDetails.hours.replace("Mon to Sat", "Monday to Saturday"),
  };
}

function fill(text: string, tokens: Readonly<Record<string, string>>): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = tokens[key];
    if (value === undefined) throw new RangeError(`The FAQ copy uses {${key}}, which has no value.`);
    return value;
  });
}

function fillAnswer(answer: FaqAnswer, tokens: Readonly<Record<string, string>>): FaqAnswer {
  return typeof answer === "string" ? fill(answer, tokens) : { lead: fill(answer.lead, tokens), items: answer.items.map((item) => fill(item, tokens)) };
}

/** Every topic with its questions worded for one currency. */
export function faqTopicsFor(currency: Currency): readonly FaqTopic[] {
  const tokens = tokensFor(currency);
  return TOPICS.map((topic) => {
    const groups = topic.groups
      .map((group) => ({
        heading: group.heading,
        questions: group.entries
          .filter((entry) => currency === "INR" || entry.inrOnly !== true)
          .map((entry): FaqQuestion => ({ id: entry.id, q: fill(entry.q, tokens), a: fillAnswer(entry.a, tokens), ...(entry.chip === undefined ? {} : { chip: entry.chip }) })),
      }))
      .filter((group) => group.questions.length > 0);
    return { slug: topic.slug, name: topic.name, icon: topic.icon, groups, count: groups.reduce((sum, group) => sum + group.questions.length, 0) };
  });
}

/** The answer as plain text, for search and the FAQPage JSON-LD. */
export function answerText(answer: FaqAnswer): string {
  return typeof answer === "string" ? answer : `${answer.lead} ${answer.items.join(", ")}.`;
}

/** Every question as a plain pair, for the FAQPage JSON-LD. */
export function faqItemsFor(currency: Currency): readonly FaqItem[] {
  return faqTopicsFor(currency).flatMap((topic) => topic.groups.flatMap((group) => group.questions.map((item) => ({ q: item.q, a: answerText(item.a) }))));
}

export function faqCountFor(currency: Currency): number {
  return faqTopicsFor(currency).reduce((sum, topic) => sum + topic.count, 0);
}

/** The questions the hero's quick links open (ids without the q- the page adds). */
export const FAQ_QUICK: readonly { readonly id: string; readonly label: string }[] = [
  { id: "1-1", label: "Is it really free?" },
  { id: "9-1", label: "Can I cancel any time?" },
  { id: "4-10", label: "Who owns the website?" },
];

export const FAQ_PAGE = {
  h1: "Your questions, answered plainly.",
  ledeAfterCount: "answers on price, delivery, ownership and support.",
  searchLabel: "Search the questions",
  searchPlaceholder: "Try refund, domain, edits or SEO",
  clear: "Clear",
  topicsLabel: "Topics",
  emptyHeading: "No answer for that yet.",
  emptyBody: "Try a shorter word, like refund, domain or edits. Or ask us, and we will answer it and add it here.",
  emptyLink: "Message us",
  scopeHeading: "What the plan includes, and what costs extra",
  leaveHeading: "If you ever leave",
  leaveLede: "There is no lock-in and no cancellation fee. Here is what happens next.",
} as const;

export interface FaqFact {
  readonly icon: "Timer" | "ShieldCheck" | "Wrench" | "Check";
  readonly title: string;
  readonly note: string;
}

/** The plan card in the hero: two prices, four facts and the extra-work rate. */
export function faqPlanFor(currency: Currency): {
  readonly build: { readonly figure: string; readonly note: string };
  readonly monthly: { readonly figure: string; readonly note: string };
  readonly facts: readonly FaqFact[];
  readonly extra: { readonly lead: string; readonly rate: string; readonly tail: string };
} {
  const inr = currency === "INR";
  return {
    build: { figure: formatMoney(0, currency), note: "to design and build your website, up to 10 pages" },
    monthly: { figure: formatMoney(planPrice("website", currency), currency), note: inr ? "a month to keep it running, GST included" : "a month to keep it running" },
    facts: [
      { icon: "Timer", title: "Live in 7 working days", note: "Once we have your content" },
      { icon: "ShieldCheck", title: "Care is included", note: "Hosting, SSL, backups and monitoring" },
      { icon: "Wrench", title: "2 edits a month", note: "Up to 15 minutes each" },
      { icon: "Check", title: "Cancel any time", note: "No lock-in" },
    ],
    extra: { lead: "Extra work is", rate: `${formatMoney(extrasFor(currency).hour, currency)} an hour`, tail: ", and only after you approve it." },
  };
}

/** The "included" and "quoted separately" lists. */
export function faqScopeFor(currency: Currency): {
  readonly includedTitle: string;
  readonly includedNote: string;
  readonly included: readonly string[];
  readonly extraTitle: string;
  readonly extraNote: string;
  readonly extra: readonly string[];
  readonly promiseTitle: string;
  readonly promise: string;
} {
  const tokens = tokensFor(currency);
  const domain = domainCostRange(currency);
  return {
    includedTitle: "Included in your plan",
    includedNote: `The build is free. ${tokens.plan} a month keeps it running.`,
    included: [
      "Design and build of up to 10 pages",
      "Custom design with two rounds of revisions",
      "Hosting on Vercel and an SSL certificate",
      "Security updates and uptime monitoring",
      "Weekly backups",
      "2 edits a month, 15 minutes each",
      "Enquiry forms, WhatsApp button and click-to-call",
      "Foundational SEO, sitemap and robots.txt",
      "Google Search Console and Analytics set up",
      "A monthly performance report",
      "Cookie consent",
      "Support Monday to Saturday",
    ],
    extraTitle: "Quoted separately",
    extraNote: "We give you the price and the time first. Nothing starts until you approve.",
    extra: [
      `Pages beyond 10, at ${tokens.hour} an hour`,
      "Landing pages for ad campaigns",
      "A multilingual website",
      "Online payments, a shop or ordering",
      "Booking, CRM, email and chatbot tools",
      "Customer logins and an enquiry dashboard",
      "Ongoing SEO, keyword research and blog writing",
      "Google Business Profile and conversion work",
      domain === null ? "Your domain, paid to your registrar" : `Your domain, about ${formatMoney(domain.low, currency)} to ${formatMoney(domain.high, currency)} a year`,
    ],
    promiseTitle: "What no website can promise",
    promise: "A first-page Google ranking, a set amount of traffic or a set number of enquiries. Visitors arrive through SEO, ads, social media and referrals, and we can talk through those as separate services.",
  };
}

/** The "If you ever leave" panel. The fee tile prints the amount where one is set, and otherwise says we confirm it first. */
export function faqLeaveFor(currency: Currency): {
  readonly fee: { readonly figure: string; readonly note: string };
  readonly facts: readonly { readonly icon: "Check" | "Globe" | "Storefront"; readonly title: string; readonly body: string }[];
} {
  const amount = sourceTransferFee(currency);
  return {
    fee:
      amount === null
        ? { figure: "One-time fee", note: "to take your website's source code and host it anywhere. We confirm the amount before we start." }
        : { figure: formatMoney(amount, currency), note: "one-time fee to take your website's source code and host it anywhere" },
    facts: [
      { icon: "Check", title: "Cancel any time", body: "There is no minimum period and no notice period. Your plan keeps running until the end of the month you have paid for, and that month is the last one charged." },
      { icon: "Globe", title: "The hosted website goes offline", body: "Hosting and management stop when the plan ends. Your domain, logo, photos and written content stay yours." },
      { icon: "Storefront", title: "Keep the website if you want it", body: "Request the source code and host it with another provider, or hand it to another developer." },
    ],
  };
}
