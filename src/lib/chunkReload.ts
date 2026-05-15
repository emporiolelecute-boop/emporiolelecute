/**
 * Detecta erros de carregamento de chunks dinâmicos (stale-bundle após deploy)
 * e dispara um hard-reload único. Persiste cada ocorrência no banco para
 * análise posterior. Respeita configuração administrativa (toggle + intervalo).
 */
import { supabase } from "@/integrations/supabase/client";

const RELOAD_FLAG = "lov_chunk_reload_at";
const DEFAULT_RELOAD_WINDOW_MS = 30_000;

type StaleConfig = { auto_reload?: boolean; min_interval_ms?: number };
let cachedConfig: StaleConfig | null = null;

const fetchConfig = async (): Promise<StaleConfig> => {
  if (cachedConfig) return cachedConfig;
  try {
    const { data } = await supabase
      .from("store_settings")
      .select("value")
      .eq("key", "stale_bundle_config")
      .maybeSingle();
    cachedConfig = (data?.value as StaleConfig) || {};
  } catch {
    cachedConfig = {};
  }
  return cachedConfig;
};

const isChunkError = (msg: string | undefined) => {
  if (!msg) return false;
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg) ||
    /Loading chunk \d+ failed/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg)
  );
};

const logToDb = async (payload: {
  message: string;
  stack?: string;
  reloaded: boolean;
}) => {
  try {
    await supabase.from("stale_bundle_logs").insert({
      route: location.pathname,
      message: payload.message.slice(0, 1000),
      stack: payload.stack?.slice(0, 4000) ?? null,
      user_agent: navigator.userAgent.slice(0, 500),
      reloaded: payload.reloaded,
    });
  } catch {
    /* ignore */
  }
};

const handleStale = async (message: string, stack?: string) => {
  const cfg = await fetchConfig();
  const autoReload = cfg.auto_reload !== false; // default true
  const windowMs = Math.max(5_000, cfg.min_interval_ms ?? DEFAULT_RELOAD_WINDOW_MS);

  let canReload = autoReload;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_FLAG) || "0");
    const now = Date.now();
    if (canReload && now - last < windowMs) {
      canReload = false;
      window.dispatchEvent(new CustomEvent("lov:stale-bundle"));
    } else if (canReload) {
      sessionStorage.setItem(RELOAD_FLAG, String(now));
    } else {
      window.dispatchEvent(new CustomEvent("lov:stale-bundle"));
    }
  } catch {
    /* sessionStorage indisponível */
  }

  await logToDb({ message, stack, reloaded: canReload });

  if (canReload) {
    // eslint-disable-next-line no-console
    console.warn("[stale-bundle] hard-reloading", { route: location.pathname });
    location.reload();
  }
};

export const installChunkReloadHandler = () => {
  window.addEventListener("error", (e) => {
    const err = e?.error as Error | undefined;
    const msg = e?.message || err?.message;
    if (isChunkError(msg)) {
      e.preventDefault();
      void handleStale(msg!, err?.stack);
    }
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason as Error | string | undefined;
    const msg = typeof reason === "string" ? reason : reason?.message;
    const stack = typeof reason === "string" ? undefined : reason?.stack;
    if (isChunkError(msg)) {
      e.preventDefault();
      void handleStale(msg!, stack);
    }
  });
};
