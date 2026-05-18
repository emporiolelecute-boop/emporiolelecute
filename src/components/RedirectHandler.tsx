import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useActiveRedirects } from "@/hooks/useRedirects";
import { supabase } from "@/integrations/supabase/client";
import { logSlugEvent } from "@/lib/slugObservability";
import {
  PRODUCT_PATH_PREFIX,
  LEGACY_PRODUCT_PATH_PREFIX,
} from "@/lib/urls";

/**
 * Checks every navigation against the redirects table. If the current
 * pathname matches an active redirect, navigates (replace) to the target.
 *
 * Fase 2.0 hardening: pathnames pertencentes ao namespace público de produto
 * (`/produtos/*` e `/produto/*`) NÃO são processados aqui. A precedência
 * oficial é: `product_slugs` resolver tem prioridade absoluta sobre
 * `redirects` para ambos os namespaces. Isso evita corrida pós-flip
 * (Fase 2.2) e elimina a dívida arquitetural sinalizada na Fase 1.5.
 */
const PRODUCT_NAMESPACES: ReadonlyArray<string> = [
  `${PRODUCT_PATH_PREFIX}/`,
  `${LEGACY_PRODUCT_PATH_PREFIX}/`,
];

function isProductNamespace(pathname: string): boolean {
  return PRODUCT_NAMESPACES.some((prefix) => pathname.startsWith(prefix));
}

export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: redirects } = useActiveRedirects();

  useEffect(() => {
    if (!redirects?.length) return;
    // Hardening: ignorar namespaces de produto — resolução cabe ao
    // product_slugs runtime. Hoje a tabela `redirects` está vazia para
    // esses paths; este guard previne competição futura.
    if (isProductNamespace(location.pathname)) return;
    const match = redirects.find((r) => r.from_path === location.pathname);
    if (!match) return;
    // Telemetria residual: se algum dia um redirect manual cair em namespace
    // de produto (não deve, mas o guard acima previne ação), registra para
    // auditoria. Mantido por compatibilidade com Fase 1.5.
    if (match.from_path.startsWith(`${PRODUCT_PATH_PREFIX}/`)) {
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
