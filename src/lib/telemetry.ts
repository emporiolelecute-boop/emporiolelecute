// Lightweight client-side telemetry. Captures runtime errors with as much
// context as we can collect (source, route, component stack, user agent,
// breadcrumbs) and persists them to `stale_bundle_logs` so admins can
// diagnose production issues without needing the user's devtools.
import { supabase } from "@/integrations/supabase/client";

type ErrorSource =
  | "react-boundary"
  | "window-error"
  | "unhandled-rejection"
  | "manual";

interface LogParams {
  source: ErrorSource;
  message: string;
  stack?: string;
  componentStack?: string;
  extra?: Record<string, unknown>;
}

// Rolling breadcrumb log for last user actions before the crash.
const breadcrumbs: Array<{ t: number; type: string; detail: string }> = [];
const MAX_BREADCRUMBS = 25;

export function pushBreadcrumb(type: string, detail: string) {
  breadcrumbs.push({ t: Date.now(), type, detail: detail.slice(0, 200) });
  if (breadcrumbs.length > MAX_BREADCRUMBS) breadcrumbs.shift();
}

// Throttle: avoid flooding when an error fires in a render loop.
const recentKeys = new Map<string, number>();
const THROTTLE_MS = 10_000;

function shouldThrottle(key: string) {
  const now = Date.now();
  const last = recentKeys.get(key) || 0;
  if (now - last < THROTTLE_MS) return true;
  recentKeys.set(key, now);
  // prune
  if (recentKeys.size > 50) {
    for (const [k, ts] of recentKeys) {
      if (now - ts > THROTTLE_MS) recentKeys.delete(k);
    }
  }
  return false;
}

export async function logClientError(params: LogParams) {
  const { source, message, stack, componentStack, extra } = params;
  const route = typeof location !== "undefined" ? location.pathname + location.search : "";
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const viewport =
    typeof window !== "undefined"
      ? `${window.innerWidth}x${window.innerHeight}`
      : "";

  const payloadKey = `${source}|${(message || "").slice(0, 120)}`;
  if (shouldThrottle(payloadKey)) return;

  // Try to extract the failing component from the React component stack.
  const componentName = componentStack
    ? (componentStack.trim().split("\n")[0] || "").replace(/^\s*(in|at)\s+/, "").trim()
    : undefined;

  const enrichedStack = [
    componentStack ? `--- componentStack ---\n${componentStack}` : "",
    stack ? `--- errorStack ---\n${stack}` : "",
    `--- breadcrumbs ---\n${JSON.stringify(breadcrumbs.slice(-15))}`,
    `--- context ---\n${JSON.stringify({ viewport, extra: extra || {} })}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const tagged = `[${source}]${componentName ? `[${componentName}]` : ""} ${message}`;

  // Always log locally so devs see it in console.
  // eslint-disable-next-line no-console
  console.error("[telemetry]", tagged, { route, componentName, extra, stack, componentStack });

  try {
    await (supabase as any).from("stale_bundle_logs").insert({
      route,
      message: tagged.slice(0, 2000),
      stack: enrichedStack.slice(0, 8000),
      user_agent: ua.slice(0, 1000),
      reloaded: false,
    });
  } catch {
    /* best-effort, never throw from telemetry */
  }
}

let installed = false;

export function installTelemetry() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  // Track route changes as breadcrumbs.
  const origPush = history.pushState;
  history.pushState = function (...args) {
    pushBreadcrumb("navigate", String(args[2] ?? location.pathname));
    return origPush.apply(this, args as any);
  };
  window.addEventListener("popstate", () =>
    pushBreadcrumb("popstate", location.pathname)
  );
  // Track clicks on actionable elements.
  window.addEventListener(
    "click",
    (e) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const el = t.closest("button,a,[role=button]") as HTMLElement | null;
      if (!el) return;
      const label =
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        (el.textContent || "").trim().slice(0, 60) ||
        el.tagName.toLowerCase();
      pushBreadcrumb("click", `${el.tagName.toLowerCase()}:${label}`);
    },
    { capture: true }
  );

  window.addEventListener("error", (e) => {
    // Skip resource load errors (img/script) without an Error object.
    if (!e.error && !e.message) return;
    const err = e.error as Error | undefined;
    void logClientError({
      source: "window-error",
      message: e.message || err?.message || "Unknown error",
      stack: err?.stack,
      extra: {
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      },
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    const message =
      typeof reason === "string"
        ? reason
        : reason?.message || JSON.stringify(reason)?.slice(0, 500) || "Unhandled rejection";
    const stack = typeof reason === "object" ? reason?.stack : undefined;
    void logClientError({
      source: "unhandled-rejection",
      message,
      stack,
    });
  });
}
