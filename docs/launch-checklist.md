# Launch checklist

Kept current during the build (plan 02, Task 11.4). Nothing here is visible on the site as "TBD": every open item ships with the mock's wording until the owner confirms or replaces it.

Status key: **Open** (needs the owner), **Placeholder** (mock wording in use), **Done**.

## Open inputs from the plan

| # | Input | Status | Where it lives |
|---|---|---|---|
| D3 | Cancellation and refund terms for monthly billing | Placeholder: 30 days' notice; cancellation takes effect at the end of the billing month in which the notice ends; add-on changes start from the next monthly bill; website, domain and content stay yours | `content/legal/cancellation.ts` (used by terms, refund, pricing "Good to know" and FAQ) |
| D4 | Does Digital Growth include organic social posting? | Placeholder: "8 Google profile posts a month", photo updates, reels and video editing at ₹500 an hour | `content/basket.ts`, `content/pricing.ts` |
| D5 | Real proof: client sites for the showcase, Google rating, quotes | Placeholder: Curry Cook, GKR Hospitality and PayWeek sample sites and screenshots; heading "Real websites, live today." | `content/home.ts` `WORK`, `public/work/` |
| D9 | Grievance Officer name and email | Placeholder: Siddique Ahmed (named for Digibranders in FirstFold), grievance@brandbasket.in, "Grievance Officer". Confirm the person and that the mailbox receives mail | `lib/site-config.ts` `grievanceOfficer` |
| D10 | Plan parameter format the platform reads from the sign-up link | Placeholder: `?plan=website,growth`. Main buttons go to `/contact#start` until `NEXT_PUBLIC_SIGNUP_URL` is set | `lib/signup.ts` |
| D11 | Phone, WhatsApp number and hours | Placeholder: +91 789 789 6607 (Fynix's), Mon to Sat, 10 am to 7 pm IST | `lib/site-config.ts` |

## Owner review of new copy

| Item | Status |
|---|---|
| Legal set: privacy, terms, refund, shipping, data notice | Open: review on the preview, ideally with a lawyer. Version label `LEGAL_TEXT_VERSION` must be bumped to the real publish date |
| Terms: "Add-ons chosen at sign-up are 5% off for as long as they run; add-ons added later are charged at the listed price." | Open |
| Contact page meta description | Open |
| Error page lines ("Sorry, something went wrong." and the retry line) and 404 link labels | Open |
| Industries hub copy: lede "Pick your trade to see what we build, what we run every month and the basket we suggest.", title "Websites for local businesses, built free \| Brandbasket" and its meta description | Open |
| Industry page labels: "Compare all plans" link, OG image alt "Brandbasket logo and the page headline" | Open |
| Default share image: "Your Business Has a Name. Give It a Place on the Internet." over the offer line | Open |
| FAQ answers that do not open with a direct answer: Home and Pricing "Do you guarantee rankings?" open with "No one honestly can." Suggested: start with "No." | Open |
| Unselected work showcase tab names are 45% ink (2.9:1 contrast, fails WCAG AA; matches the mock). 60% would pass | Open |
| Pricing page has no in-page link to `/industries` (footer only); add one only with owner copy | Open |

## Legal statements the owner must confirm

- Billing method: Razorpay autopay (e-mandate) or monthly invoices. The refund policy is worded to be true either way.
- Mailbox provider behind hello@, grievance@ and the contact inbox: not yet in the processor list.
- DNS on Cloudflare (Cloudflare is listed as a processor).
- DPDP Rules 2025 r.8(3) log retention of one year is cited; the site keeps no logs beyond Vercel's window. Add a log drain or drop the citation after legal advice.
- Retention: leads 12 months, client records 8 years, support email 3 years. Customer data deleted within 30 days of a plan ending.
- Grievances acknowledged within 48 hours and resolved within 30 days. Services may pause on an unpaid invoice.
- Liability capped at 12 months of fees; confidentiality for 3 years.
- Shipping: site live within about a week of receiving content; monthly report by email.
- Where client account and billing data live before the platform launches; the platform must show its own cookie notice.
- `requiredBy` citations were adapted, not checked by a lawyer.

## Claims on Home and Pricing to confirm

- "Live in about a week" (facts strip) and "Week 1: We set everything up" (steps).
- "A free 15-minute call" (steps and closing).
- Scope: up to 5 pages, 2 small edits a month of up to 30 minutes, Local SEO "5 pages improved every month", "AI visibility tracking where measurable", "A/B tests where budget allows".
- The example report (marked "Example report"): Pune dental clinic, KPIs and chart are sample data.
- "Do you guarantee rankings? No one honestly can." and the ad budget cap of ₹10,000 a month.
- Home FAQ "Just your first month, plus 18% GST" is written for one month up front.

## Pages and links held back

- Nav "Industries" points to the homepage section `/#industries`.
- The pricing page copy has no natural place for an `/industries` link (plan 10.3); it reaches the hub through the footer only. Add an in-page link only with owner-approved copy.

## Deferred engineering

- Phase 9: Playwright end to end, axe accessibility and Lighthouse CI budgets.
- Phase 10: route registry, sitemap entries for every page, OG images, llms.txt route list, internal linking and AEO pass.
- First-load JavaScript on `/` is about 192 KB gzipped against the 120 KB budget. Investigate before launch.
- Phase 11 launch steps (Brevo sender, Vercel production env, domain, Search Console, Razorpay website approval).
- Turning indexing on is a launch step: set SITE_INDEXING=on in Vercel production only after the owner approves, then submit the sitemap in Search Console.

## Owner approvals received

| Item | Date |
|---|---|
| Managed Website price ₹2,999 a month and the matching offer line | 2026-10-19 |
| GST shown to the paisa to match checkout | 2026-10-19 |
| 5% off add-ons chosen at sign-up; no Premium discount | 2026-10-19 |
| Legal review happens on the preview, not before building | 2026-10-19 |
| Industries copy: the eight industry pages (`content/industries.ts` `INDUSTRIES`) | 2026-10-19 |
| About copy (`content/about.ts`) | 2026-10-19 |
