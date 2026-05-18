/**
 * URL builders centralizados.
 *
 * Fase 0: rota canônica pública continua sendo `/produtos/:slug`.
 * Quando a Fase 2 mover para `/produto/:slug`, basta alterar
 * `PRODUCT_PATH_PREFIX` aqui — todos os consumidores migram juntos.
 *
 * IMPORTANTE: nenhum componente foi migrado ainda. Use este helper
 * em código novo; a migração dos consumidores existentes é Fase 2.
 */

export const PRODUCT_PATH_PREFIX = "/produtos";

export const urls = {
  /** URL relativa de um produto pelo seu slug primário. */
  product(slug: string): string {
    return `${PRODUCT_PATH_PREFIX}/${slug}`;
  },
  /** URL absoluta de um produto (canonical/og:url). */
  productAbsolute(slug: string, origin = "https://emporiolelecute.com.br"): string {
    return `${origin}${PRODUCT_PATH_PREFIX}/${slug}`;
  },
};
