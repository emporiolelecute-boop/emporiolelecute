/**
 * URL builders para edge functions (Deno) — espelho de `src/lib/urls.ts`.
 *
 * ⚠️  Manter SEMPRE em sincronia com `src/lib/urls.ts`. Drift entre os dois
 *     quebra canonical, sitemap e merchant feed. Há QA de grep para detectar
 *     hardcodes residuais em ambos os lados.
 *
 * Fase 2.0: SAFE MODE — nenhuma mudança de prefixo. Apenas centralização
 * para que a Fase 2.2 possa fazer o flip alterando esta única constante
 * em ambos os arquivos (frontend + edge).
 */

export const CANONICAL_ORIGIN = "https://emporiolelecute.com.br";

/** Prefixo público canônico (Fase 2.2 FLIPPED: singular). Espelha frontend. */
export const PRODUCT_PATH_PREFIX = "/produto";

export const LEGACY_PRODUCT_PATH_PREFIX = "/produtos";

/** URL relativa de produto pelo slug primário. */
export function productPath(slug: string): string {
  return `${PRODUCT_PATH_PREFIX}/${slug}`;
}

/**
 * URL absoluta de produto. Aceita `origin` opcional para casos onde a edge
 * function recebe `site_url` configurável; default é a origem canônica oficial.
 */
export function productAbsolute(
  slug: string,
  origin: string = CANONICAL_ORIGIN,
): string {
  return `${origin}${PRODUCT_PATH_PREFIX}/${slug}`;
}
