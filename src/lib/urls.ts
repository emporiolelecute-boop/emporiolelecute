/**
 * URL builders centralizados — fonte única para URLs públicas de produto.
 *
 * Fase 2.0: TODOS os call-sites públicos passaram a consumir este módulo.
 * Migração pública (`/produtos` → `/produto`) é feita alterando apenas
 * `PRODUCT_PATH_PREFIX` aqui — frontend e edge functions migram juntos
 * (edge usa `supabase/functions/_shared/urls.ts` com a MESMA constante).
 *
 * SAFE MODE: nenhum prefixo foi alterado nesta fase. Apenas centralização.
 *
 * ⚠️  Mantenha SEMPRE em sincronia com `supabase/functions/_shared/urls.ts`.
 *     Drift entre os dois quebra canonical, sitemap e merchant feed.
 */

/** Origem canônica oficial do site (sem trailing slash). */
export const CANONICAL_ORIGIN = "https://emporiolelecute.com.br";

/**
 * Prefixo público canônico de URL de produto.
 *
 * Fase 2.2 (FLIPPED): `/produto` (singular) é o canônico.
 * `/produtos` (plural) virou legado — preservado indefinidamente via
 * `LegacyProductRedirect` (replace client-side para o novo namespace).
 */
export const PRODUCT_PATH_PREFIX = "/produto";

/**
 * Prefixo legado pós-flip Fase 2.2. Continua respondendo (coexistência
 * longa) mas o `LegacyProductRedirect` faz replace para o canônico.
 * Observabilidade emite `legacy_namespace_hit` em cada acesso.
 */
export const LEGACY_PRODUCT_PATH_PREFIX = "/produtos";

export const urls = {
  /** URL relativa de um produto pelo seu slug primário. */
  product(slug: string): string {
    return `${PRODUCT_PATH_PREFIX}/${slug}`;
  },

  /**
   * URL absoluta de um produto.
   *
   * - `productAbsolute(slug)` — usa origem canônica oficial (use para
   *   canonical, og:url, JSON-LD, sitemap, merchant feed, e-mails).
   * - `productAbsolute(slug, window.location.origin)` — usa origem do
   *   browser (use apenas para share dinâmico, WhatsApp links).
   */
  productAbsolute(slug: string, origin: string = CANONICAL_ORIGIN): string {
    return `${origin}${PRODUCT_PATH_PREFIX}/${slug}`;
  },

  /** Alias semântico: canonical sempre usa a origem oficial. */
  productCanonical(slug: string): string {
    return `${CANONICAL_ORIGIN}${PRODUCT_PATH_PREFIX}/${slug}`;
  },

  /** URL absoluta de share — preserva origem do browser quando disponível. */
  productShare(slug: string): string {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : CANONICAL_ORIGIN;
    return `${origin}${PRODUCT_PATH_PREFIX}/${slug}`;
  },
};

/** True se o pathname pertence ao namespace público de produto (atual). */
export function isProductPath(pathname: string): boolean {
  return (
    pathname === PRODUCT_PATH_PREFIX ||
    pathname.startsWith(`${PRODUCT_PATH_PREFIX}/`)
  );
}

/** True se o pathname pertence ao namespace legado (futuro pós-flip). */
export function isLegacyProductPath(pathname: string): boolean {
  return (
    pathname === LEGACY_PRODUCT_PATH_PREFIX ||
    pathname.startsWith(`${LEGACY_PRODUCT_PATH_PREFIX}/`)
  );
}
