// lib/teams-alert.ts
import type { ContactInput } from "@/lib/contact-schema";

/*
 * Tells the team's Microsoft Teams channel about a new website enquiry. The address is a Teams "Workflows" webhook, one per channel;
 * the platform's console keeps the same kind of address for its own alerts. It is a secret, so it is never logged. Optional: with no
 * address set nothing is posted. Best effort: the enquiry has already reached the inbox, so a failure here is logged and never shown.
 */

const TEAMS_HOST_SUFFIXES = [".logic.azure.com", ".api.powerplatform.com", ".webhook.office.com"] as const;
const POST_TIMEOUT_MS = 8_000;

/** The webhook address from the environment, or null when it is unset or is not a https Teams address (so the server never posts anywhere else). */
export function teamsEnquiryUrl(source: Record<string, string | undefined> = process.env): string | null {
  const text = source.TEAMS_ENQUIRIES_WEBHOOK_URL?.trim();
  if (!text) return null;
  try {
    const url = new URL(text);
    const host = url.hostname.toLowerCase();
    const allowed = url.protocol === "https:" && url.username === "" && url.password === "" && TEAMS_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}

const clip = (value: string, max: number): string => (value.length <= max ? value : `${value.slice(0, max - 1)}…`);

/** An Adaptive Card inside a Teams message, the shape a Workflows webhook accepts. */
export function enquiryCard(lead: ContactInput): Record<string, unknown> {
  const facts = [
    { title: "Name", value: lead.name },
    { title: "Email", value: lead.email },
    { title: "Phone", value: lead.phone ?? "" },
    { title: "Business", value: lead.business },
    { title: "City", value: lead.city ?? "" },
  ].filter((fact) => fact.value.trim() !== "");
  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            { type: "TextBlock", text: clip(`New website enquiry: ${lead.business}`, 200), weight: "Bolder", size: "Medium", wrap: true },
            { type: "FactSet", facts },
            { type: "TextBlock", text: clip(lead.message, 1_500), wrap: true },
          ],
        },
      },
    ],
  };
}

export async function postEnquiryToTeams(lead: ContactInput, url: string | null = teamsEnquiryUrl()): Promise<void> {
  if (url === null) return;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(enquiryCard(lead)),
      redirect: "error",
      signal: AbortSignal.timeout(POST_TIMEOUT_MS),
    });
    if (!response.ok) console.error("contact: Teams alert refused", `status ${response.status}`);
  } catch (error) {
    console.error("contact: Teams alert failed", error instanceof Error ? error.name : "unknown");
  }
}
