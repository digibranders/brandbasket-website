// content/social-page.ts
// Copy for the sections only the Social Media Management page has (/services/social-media-management): how the AI works,
// the weekly plan, what the owner controls and an example report. Hero, who it is for, the explainer, limits and questions
// stay in content/services.ts. Every claim matches what the customer app does today (2026-11-17): posts are written from the
// customer's public website, a week is three single posts and a carousel, plus one reel a week (owner, 2026-11-17; reels are
// not made by the app's posting service), the customer approves or sends back each post,
// one own topic a week, optional automatic posting, 4 platforms (Instagram, Facebook, LinkedIn and Google Business Profile; owner, 2026-11-17), daily post numbers
// and a monthly report. New copy: it goes to the owner before it ships.
import type { Fact } from "./home";

/**
 * The hero's picture: one post on a phone, with the cards around it that show the week's work (a post waiting for the owner,
 * what the AI learned from, where it posts). The account is "your business", not a named client: the page is for any
 * local business, so no one trade leads (owner, 2026-11-17). The photo is public/services/social-salon-post.jpg.
 */
export const SOCIAL_HERO_SCENE = {
  post: { handle: "your.business", caption: "New season, new look. Book your slot this week.", photo: "/services/social-salon-post.jpg" },
  approval: { state: "Needs your OK", title: "3 looks for the wedding season", approve: "Approve", back: "Send back" },
  learned: { label: "Learned from your website", site: "yourwebsite.com" },
  scheduled: { label: "Scheduled", when: "Saturday, 10:00" },
  channels: "Posting to",
} as const;

export const SOCIAL_FACTS: readonly Fact[] = [
  { icon: "CalendarCheck", text: "3 posts, a carousel and a reel a week" },
  { icon: "ShareNetwork", text: "Instagram, Facebook, LinkedIn and Google" },
  { icon: "ThumbsUp", text: "You approve what goes out" },
  { icon: "ChartBar", text: "One report a month" },
];

export interface SocialStep {
  /** The verb that names the step. No numbers: the order on the page is the order. */
  readonly title: string;
  readonly body: string;
}

/** The dark band: how the AI runs a week of social media. */
export const SOCIAL_HOW = {
  small: "How AI runs your social media.",
  large: "It learns your business first.",
  body: "Posts start from your own website, so they talk about what you actually sell, the way you already talk to customers.",
  steps: [
    { title: "Learn", body: "AI reads your website once and learns what you sell and how you sound. It only reads public pages." },
    { title: "Plan", body: "Each week gets fresh topics for every channel, on the days you choose." },
    { title: "Write and draw", body: "A caption and a picture are made for each network, with hashtags where they help." },
    { title: "You check", body: "Keep or drop a topic, change a headline, then approve each post or send it back." },
    { title: "Post", body: "Approved posts go out on schedule. Nothing to remember, nothing to log in to." },
    { title: "Improve", body: "Reach, saves and clicks update every day, and a report in plain words comes each month." },
  ] satisfies readonly SocialStep[],
} as const;

export type WeekPostKind = "post" | "carousel" | "reel";
export type WeekPostState = "posted" | "approved" | "waiting";

export interface WeekPost {
  readonly day: string;
  readonly kind: WeekPostKind;
  readonly title: string;
  readonly state: WeekPostState;
  /** The owner's own topic for the week. */
  readonly own?: boolean;
}

/** "Your week, planned": an example week for a salon. The "Example week" chip marks it as such and must stay. */
export const SOCIAL_WEEK = {
  heading: "Your week, planned.",
  lede: "Three posts, a carousel and a reel go out every week, on the days you pick. Once a week, you can add a topic of your own.",
  chip: "Example week",
  ariaLabel: "An example week of posts for a salon",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  kind: { post: "Post", carousel: "Carousel", reel: "Reel" } satisfies Readonly<Record<WeekPostKind, string>>,
  state: { posted: "Posted", approved: "Approved", waiting: "Needs your OK" } satisfies Readonly<Record<WeekPostState, string>>,
  own: "Your topic",
  posts: [
    { day: "Mon", kind: "post", title: "Meet Priya, our senior stylist", state: "posted" },
    { day: "Tue", kind: "reel", title: "A bridal look in 30 seconds", state: "posted" },
    { day: "Wed", kind: "post", title: "How to keep colour fresh for longer", state: "approved" },
    { day: "Fri", kind: "carousel", title: "3 looks for the wedding season", state: "waiting" },
    { day: "Sat", kind: "post", title: "Diwali offer: 20% off facials", state: "waiting", own: true },
  ] satisfies readonly WeekPost[],
} as const;

export interface ControlItem {
  readonly icon: "Trash" | "PencilSimple" | "CalendarDots" | "Lightbulb" | "ArrowCounterClockwise" | "Lightning";
  readonly title: string;
  readonly body: string;
}

export const SOCIAL_CONTROL = {
  heading: "You stay in control.",
  lede: "AI does the writing and drawing. Every decision stays with you.",
  items: [
    { icon: "Trash", title: "Keep or drop any topic", body: "Do not like an idea? Drop it before anything is made for it." },
    { icon: "PencilSimple", title: "Change the headline", body: "Edit the words on a post before its picture is drawn." },
    { icon: "CalendarDots", title: "Pick your posting days", body: "Choose the days each channel posts, and move a post to another day." },
    { icon: "Lightbulb", title: "Add your own topic", body: "Once a week, tell us what to post about: an offer, a new arrival or a festival." },
    { icon: "ArrowCounterClockwise", title: "Send it back", body: "Say what is wrong and send a post back, or ask for a new picture." },
    { icon: "Lightning", title: "Or let it post itself", body: "Turn on automatic posting if you would rather not check each one. You can still stop a post before it goes out." },
  ] satisfies readonly ControlItem[],
} as const;

export interface SocialKpi {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
}

/** Sample numbers. The "Example report" chip marks them as such and must stay. */
export const SOCIAL_REPORT = {
  heading: "See what is working.",
  lede: "Numbers for every post update daily in your dashboard. Each month, a short report says what worked and what comes next.",
  ariaLabel: "Example monthly social media report",
  chip: "Example report",
  title: "October report",
  subtitle: "A fitness studio in Pune · 4 platforms",
  kpis: [
    { label: "People reached", value: "18,420", delta: "+22% on Sept" },
    { label: "Saves", value: "612", delta: "+41 on Sept" },
    { label: "Link clicks", value: "389", delta: "+17% on Sept" },
    { label: "Calls from Google", value: "54", delta: "+11 on Sept" },
  ] satisfies readonly SocialKpi[],
  best: { label: "Best post", value: "5 stretches for desk workers", note: "Most saves this month" },
} as const;
