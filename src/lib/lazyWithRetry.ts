import { lazy, ComponentType } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "lovable:lazy-retry";

// Configurable via Vite env vars (build-time): VITE_LAZY_RETRIES / VITE_LAZY_BACKOFF_MS
const RETRIES = Math.max(
  1,
  Math.min(10, Number((import.meta as any).env?.VITE_LAZY_RETRIES) || 3),
);
const BACKOFF_MS = Math.max(
  50,
  Math.min(5000, Number((import.meta as any).env?.VITE_LAZY_BACKOFF_MS) || 250),
);

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
 * lazy() wrapper that retries dynamic imports (count + backoff configurable
 * via VITE_LAZY_RETRIES / VITE_LAZY_BACKOFF_MS), logs failures, and (once
 * per session) hard-reloads to refresh stale chunk hashes after a deploy.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  name = "unknown",
) {
  return lazy(async () => {
    let lastErr: unknown;
    for (let i = 0; i < RETRIES; i++) {
      try {
        return await factory();
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, BACKOFF_MS * (i + 1)));
      }
    }
    void reportFailure(name, lastErr);
    try {
      const already = sessionStorage.getItem(STORAGE_KEY);
      if (!already) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        location.reload();
        return await new Promise<{ default: T }>(() => {});
      }
    } catch {
      /* ignore */
    }
    throw lastErr;
  });
}
