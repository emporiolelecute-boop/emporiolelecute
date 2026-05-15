import { lazy, ComponentType } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "lovable:lazy-retry";

async function reportFailure(name: string, err: unknown) {
  try {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const route = typeof location !== "undefined" ? location.pathname : "";
    await (supabase as any).from("stale_bundle_logs").insert({
      route,
      message: `dynamic-import-failed:${name}`,
      stack: String((err as any)?.stack || (err as any)?.message || err).slice(0, 8000),
      user_agent: ua.slice(0, 1000),
      reloaded: false,
    });
  } catch {
    /* best-effort */
  }
}

/**
 * lazy() wrapper that retries dynamic imports up to 2 times,
 * logs failures to telemetry, and (once per session) hard-reloads
 * to defeat stale chunk hashes after a deploy.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  name = "unknown",
) {
  return lazy(async () => {
    let lastErr: unknown;
    for (let i = 0; i < 3; i++) {
      try {
        return await factory();
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 250 * (i + 1)));
      }
    }
    void reportFailure(name, lastErr);
    // Hard reload once per session to refresh chunk manifest
    try {
      const already = sessionStorage.getItem(STORAGE_KEY);
      if (!already) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        location.reload();
        // return a never-resolving promise while reload happens
        return await new Promise<{ default: T }>(() => {});
      }
    } catch {
      /* ignore */
    }
    throw lastErr;
  });
}
