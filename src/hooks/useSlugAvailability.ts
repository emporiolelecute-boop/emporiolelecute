import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";

export type SlugCheckTable = "products" | "categories" | "occasions" | "tags" | "pages" | "segments";

export type SlugCheckState = {
  status: "idle" | "checking" | "available" | "taken" | "invalid" | "empty" | "error";
  message: string;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Lightweight slug availability check. Debounced, single query per pause,
 * never blocks typing. Pure read — no writes, no backend changes.
 *
 * Usage:
 *   const state = useSlugAvailability("categories", slug, editingId);
 *   {state.status === "taken" && <p>{state.message}</p>}
 */
export function useSlugAvailability(
  table: SlugCheckTable,
  slug: string,
  ignoreId?: string | null,
  delay = 400
): SlugCheckState {
  const debounced = useDebounce(slug.trim().toLowerCase(), delay);
  const [state, setState] = useState<SlugCheckState>({ status: "idle", message: "" });

  useEffect(() => {
    let cancelled = false;
    const value = debounced;

    if (!value) {
      setState({ status: "empty", message: "Slug obrigatório." });
      return;
    }
    if (!SLUG_RE.test(value)) {
      setState({
        status: "invalid",
        message: "Use minúsculas, números e hífens — sem acentos ou espaços.",
      });
      return;
    }

    setState({ status: "checking", message: "Verificando disponibilidade..." });

    (async () => {
      try {
        let q = supabase.from(table as any).select("id", { head: true, count: "exact" }).eq("slug", value);
        if (ignoreId) q = q.neq("id", ignoreId);
        const { count, error } = await q;
        if (cancelled) return;
        if (error) {
          setState({ status: "error", message: "Não foi possível verificar agora." });
          return;
        }
        if ((count ?? 0) > 0) {
          setState({ status: "taken", message: "Este slug já existe — escolha outro." });
        } else {
          setState({ status: "available", message: "Disponível ✓" });
        }
      } catch {
        if (!cancelled) setState({ status: "error", message: "Não foi possível verificar agora." });
      }
    })();

    return () => { cancelled = true; };
  }, [table, debounced, ignoreId]);

  return state;
}
