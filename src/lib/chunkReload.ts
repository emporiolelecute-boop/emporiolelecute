/**
 * Detecta erros de carregamento de chunks dinâmicos (stale-bundle após deploy)
 * e dispara um hard-reload único. Se reincidir, emite evento para UI de fallback.
 */
const RELOAD_FLAG = "lov_chunk_reload_at";
const RELOAD_WINDOW_MS = 30_000;

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

const tryReload = () => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_FLAG) || "0");
    const now = Date.now();
    if (now - last < RELOAD_WINDOW_MS) {
      // Já tentamos recarregar há pouco — mostrar fallback
      window.dispatchEvent(new CustomEvent("lov:stale-bundle"));
      return;
    }
    sessionStorage.setItem(RELOAD_FLAG, String(now));
  } catch {
    /* sessionStorage indisponível */
  }
  // Reportar antes do reload
  // eslint-disable-next-line no-console
  console.warn("[stale-bundle] hard-reloading", { route: location.pathname });
  location.reload();
};

export const installChunkReloadHandler = () => {
  window.addEventListener("error", (e) => {
    if (isChunkError(e?.message) || isChunkError((e?.error as Error)?.message)) {
      e.preventDefault();
      tryReload();
    }
  });
  window.addEventListener("unhandledrejection", (e) => {
    const msg =
      typeof e.reason === "string" ? e.reason : (e.reason as Error | undefined)?.message;
    if (isChunkError(msg)) {
      e.preventDefault();
      tryReload();
    }
  });
};
