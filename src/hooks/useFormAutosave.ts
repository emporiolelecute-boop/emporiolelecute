// Sprint final — autosave leve de rascunho no admin.
//
// Persiste o estado do formulário em localStorage com debounce e oferece
// API para detectar rascunho salvo e restaurar/descartar.
//
// Uso:
//   const autosave = useFormAutosave('product:novo', formData, setFormData);
//   {autosave.hasDraft && <Banner onRestore={autosave.restore} onDiscard={autosave.discard} />}
//
// Após salvar com sucesso no backend chame `autosave.clear()` para limpar o draft.
import { useCallback, useEffect, useRef, useState } from "react";

interface AutosaveOptions {
  /** Debounce em ms. Default 800. */
  debounceMs?: number;
  /** Desliga autosave (ex.: enquanto carrega dados existentes). */
  enabled?: boolean;
}

interface AutosaveAPI<T> {
  /** Existe um rascunho diferente do estado atual e mais recente que o load? */
  hasDraft: boolean;
  /** Restaura o rascunho no estado do formulário. */
  restore: () => void;
  /** Descarta o rascunho mantendo o estado atual. */
  discard: () => void;
  /** Limpa qualquer rascunho. Chamar após salvar com sucesso. */
  clear: () => void;
  /** Timestamp do último autosave (ms). */
  savedAt: number | null;
  /** Estado interno: rascunho carregado do storage (se houver). */
  draft: T | null;
}

const PREFIX = "lc:admin:draft:";

export function useFormAutosave<T>(
  key: string,
  state: T,
  setState: (next: T) => void,
  options: AutosaveOptions = {},
): AutosaveAPI<T> {
  const { debounceMs = 800, enabled = true } = options;
  const storageKey = PREFIX + key;
  const timerRef = useRef<number | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Lê rascunho existente uma vez.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { ts: number; data: T };
      if (parsed?.data) {
        setDraft(parsed.data);
        setHasDraft(true);
        setSavedAt(parsed.ts);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Autosave com debounce.
  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        const payload = JSON.stringify({ ts: Date.now(), data: state });
        localStorage.setItem(storageKey, payload);
        setSavedAt(Date.now());
      } catch {
        /* quota / disabled — ignorar */
      }
    }, debounceMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [state, enabled, debounceMs, storageKey]);

  const restore = useCallback(() => {
    if (draft) {
      setState(draft);
      setHasDraft(false);
    }
  }, [draft, setState]);

  const discard = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    setDraft(null);
    setHasDraft(false);
  }, [storageKey]);

  const clear = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    setDraft(null);
    setHasDraft(false);
    setSavedAt(null);
  }, [storageKey]);

  return { hasDraft, restore, discard, clear, savedAt, draft };
}

/**
 * Aviso nativo do navegador ao tentar sair com alterações não salvas.
 * Cobre fechar aba / reload. Para bloquear navegação SPA use react-router
 * useBlocker no consumidor.
 */
export function useUnsavedChangesPrompt(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
