"use client";
import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import { planTokenUse } from "@/lib/security/form-fields";

const tokenResponse = z.object({ token: z.string().min(1) });

interface FormToken {
  readonly value: string;
  /** Client clock when the token arrived. The server stamped it earlier, so ages measured from here never overstate. */
  readonly receivedAt: number;
}

async function requestToken(): Promise<FormToken | null> {
  try {
    const res = await fetch("/api/form-token", { cache: "no-store" });
    const parsed = tokenResponse.safeParse(res.ok ? await res.json() : null);
    return parsed.success ? { value: parsed.data.token, receivedAt: Date.now() } : null;
  } catch {
    return null;
  }
}

/**
 * Fetches the signed form token when the form mounts and returns a function that hands over one the server will accept as
 * human: it fetches again when the token is near expiry and waits out the minimum fill time. Null only when a fresh fetch fails.
 */
export function useFormToken(): () => Promise<string | null> {
  // The in-flight or settled token request, so a submit can await it, refresh it or wait out its minimum age.
  const tokenRef = useRef<Promise<FormToken | null> | null>(null);
  useEffect(() => {
    tokenRef.current = requestToken();
  }, []);
  return useCallback(async () => {
    let token = await (tokenRef.current ??= requestToken());
    let plan = planTokenUse(token?.receivedAt ?? null, Date.now());
    if (plan.kind === "refresh") {
      tokenRef.current = requestToken();
      token = await tokenRef.current;
      plan = planTokenUse(token?.receivedAt ?? null, Date.now());
    }
    if (!token || plan.kind === "refresh") return null;
    if (plan.kind === "wait") {
      const { ms } = plan;
      await new Promise<void>((resolve) => setTimeout(resolve, ms));
    }
    return token.value;
  }, []);
}
