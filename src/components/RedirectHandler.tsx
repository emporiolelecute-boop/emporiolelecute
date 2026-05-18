import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useActiveRedirects } from "@/hooks/useRedirects";
import { supabase } from "@/integrations/supabase/client";
import { logSlugEvent } from "@/lib/slugObservability";

/**
 * Checks every navigation against the redirects table. If the current
 * pathname matches an active redirect, navigates (replace) to the target.
 */
export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: redirects } = useActiveRedirects();

  useEffect(() => {
    if (!redirects?.length) return;
    const match = redirects.find((r) => r.from_path === location.pathname);
    if (!match) return;
    // Fase 1.5 — alerta de dívida arquitetural: redirect em /produtos/% pode
    // colidir com product_slugs resolver. Hoje o trigger mantém ambos
    // consistentes, mas a precedência precisa ser unificada na Fase 2.
    if (match.from_path.startsWith("/produtos/")) {
      logSlugEvent({
        event: "redirect_chain_detected",
        hopFrom: match.from_path,
        hopTo: match.to_path,
        pathname: location.pathname,
      });
    }
    // Fire-and-forget hit counter
    supabase
      .from("redirects")
      .select("id, hits")
      .eq("from_path", match.from_path)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          supabase
            .from("redirects")
            .update({ hits: (data.hits ?? 0) + 1 })
            .eq("id", data.id);
        }
      });
    navigate(match.to_path + location.search, { replace: true });
  }, [location.pathname, redirects, navigate, location.search]);

  return null;
};

export default RedirectHandler;
