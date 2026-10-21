import { renderToStaticMarkup } from "react-dom/server";
import { Children, isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ERROR_STATES, type ErrorKind } from "@/content/errors";
import { ErrorExperience } from "./ErrorExperience";

function retryHandler(node: ReactNode): (() => void) | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ readonly children?: ReactNode; readonly onClick?: () => void }>(child)) continue;
    if (child.type === "button" && child.props.onClick) return child.props.onClick;
    const handler = retryHandler(child.props.children);
    if (handler) return handler;
  }
  return undefined;
}

describe("error experiences", () => {
  it("provides a recovery action and explanation for every supported state", () => {
    const kinds: readonly ErrorKind[] = ["not-found", "gone", "unauthorized", "forbidden", "server", "gateway", "timeout", "rate-limit", "offline", "maintenance", "unexpected"];
    for (const kind of kinds) {
      const markup = renderToStaticMarkup(<ErrorExperience kind={kind} underNav={false} />).replaceAll("&#x27;", "'");
      expect(markup).toContain(ERROR_STATES[kind].title);
      expect(markup).toContain(ERROR_STATES[kind].body);
      expect(markup).toContain('href="/"');
      expect(markup).toContain('aria-hidden="true"');
      expect(markup.match(/<h1[ >]/g)).toHaveLength(1);
    }
  });

  it("forwards the boundary callback directly to the retry action without exposing exception data", () => {
    const retry = vi.fn();
    const view = ErrorExperience({ kind: "unexpected", underNav: true, retry });
    const handler = retryHandler(view);
    expect(handler).toBe(retry);
    handler?.();
    expect(retry).toHaveBeenCalledOnce();
    const markup = renderToStaticMarkup(view);
    expect(markup).toContain('type="button"');
    expect(markup).toContain("Try again");
    expect(markup).not.toContain(">500<");
    expect(markup).not.toContain("stack");
  });

  it("does not offer a rate-limit retry without a server-provided retry policy", () => {
    const markup = renderToStaticMarkup(<ErrorExperience kind="rate-limit" underNav retry={vi.fn()} />);
    expect(markup).not.toContain(">Try again");
    expect(markup).toContain("Back to home");
  });
});
