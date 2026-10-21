export type ErrorSceneKind = "spill" | "empty" | "tag" | "locked" | "tangle" | "bridge" | "journey" | "queue" | "offline" | "repair";

interface ErrorState {
  readonly code: string;
  readonly label: string;
  readonly title: string;
  readonly body: string;
  readonly scene: ErrorSceneKind;
  readonly retryable: boolean;
}

export const ERROR_STATES = {
  "not-found": { code: "404", label: "Page not found", title: "This page slipped out.", body: "The page you're looking for isn't here. Let's get you somewhere useful.", scene: "spill", retryable: false },
  gone: { code: "410", label: "Page removed", title: "This page has moved on.", body: "This page is no longer available. There's still plenty to explore back home.", scene: "empty", retryable: false },
  unauthorized: { code: "401", label: "Sign-in required", title: "Let's get you back in.", body: "This page needs an account with access. Head home or contact us for help.", scene: "tag", retryable: false },
  forbidden: { code: "403", label: "Access restricted", title: "This one is tucked away.", body: "You don't have access to this page. Let's take you somewhere you can explore.", scene: "locked", retryable: false },
  server: { code: "500", label: "Server error", title: "A little tangled up.", body: "Something went wrong on our side. Give it another try, or let us help.", scene: "tangle", retryable: true },
  gateway: { code: "502", label: "Connection interrupted", title: "A small gap on our side.", body: "Part of the site couldn't connect. Please try again in a moment.", scene: "bridge", retryable: true },
  timeout: { code: "408 / 504", label: "Request timed out", title: "Taking the scenic route.", body: "That took longer than expected. Try once more, or take a shortcut home.", scene: "journey", retryable: true },
  "rate-limit": { code: "429", label: "Too many requests", title: "One basket at a time.", body: "A few too many requests arrived together. Give it a moment before coming back.", scene: "queue", retryable: false },
  offline: { code: "Offline", label: "Connection unavailable", title: "We lost the thread.", body: "You appear to be offline. Check your connection, then give it another try.", scene: "offline", retryable: true },
  maintenance: { code: "503", label: "Temporarily unavailable", title: "A little care in progress.", body: "The site is temporarily unavailable. Please check again in a little while.", scene: "repair", retryable: true },
  unexpected: { code: "Oops", label: "Something went wrong", title: "A little tangled up.", body: "Something didn't go as planned. Give it another try, or let us help.", scene: "tangle", retryable: true },
} as const satisfies Readonly<Record<string, ErrorState>>;

export type ErrorKind = keyof typeof ERROR_STATES;

export const ERROR_UI = {
  home: "Back to home",
  pricing: "See plans and pricing",
  retry: "Try again",
  pause: "Pause animation",
  resume: "Resume animation",
  previewLabel: "Preview an error scene",
  previewTitle: "Error page preview | Brandbasket",
  previewDescription: "Explore Brandbasket's animated error page designs, with accessible recovery actions and a different woven basket story for each state.",
  previewNote: "Design preview. These scenes do not indicate a live service issue.",
  previewRetry: "Preview replayed. On an error page, this button retries the failed request.",
} as const;

export const NOT_FOUND_COPY = { metaTitle: ERROR_STATES["not-found"].label, title: ERROR_STATES["not-found"].title, home: ERROR_UI.home, pricing: ERROR_UI.pricing } as const;
export const ERROR_COPY = { metaTitle: ERROR_STATES.unexpected.label, title: ERROR_STATES.unexpected.title, body: ERROR_STATES.unexpected.body, retry: ERROR_UI.retry } as const;
