/**
 * Slug normalization & reserved-word helpers (Fase 0).
 *
 * Espelha o comportamento de `public.normalize_slug()` no Postgres
 * (lowercase + unaccent + sanitização). Mantenha em sincronia.
 *
 * NÃO consumido em rotas públicas nesta fase — apenas disponível
 * para admin/validators/futuros resolvers.
 */

/** Lista canônica de slugs reservados (espelha `public.reserved_slugs`). */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  "admin", "api", "produto", "produtos", "categoria", "categorias",
  "ocasiao", "ocasioes", "tag", "tags", "segmento", "segmentos",
  "kit", "kits", "colecao", "colecoes", "login", "logout",
  "checkout", "carrinho", "busca", "buscar", "search", "rastrear",
  "orcamento", "contato", "sobre", "blog", "depoimentos", "loja",
  "sitemap", "robots", "envio", "faq", "acesso-restrito",
]);

/**
 * Normaliza um slug:
 *  - lowercase
 *  - remove acentos / diacríticos (NFD + strip)
 *  - troca qualquer não-[a-z0-9] por `-`
 *  - colapsa hífens múltiplos
 *  - trim de hífens nas pontas
 *
 * Exemplos:
 *   "Coração de Ouro" → "coracao-de-ouro"
 *   "  Lá-lá  "       → "la-la"
 *   "ácido//base"     → "acido-base"
 */
export function normalizeSlug(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** True quando o slug normalizado bate com a lista de reservados. */
export function isReservedSlug(input: string | null | undefined): boolean {
  const n = normalizeSlug(input);
  return n.length > 0 && RESERVED_SLUGS.has(n);
}

/** True quando o slug é válido para uso (não-vazio e não-reservado). */
export function isUsableSlug(input: string | null | undefined): boolean {
  const n = normalizeSlug(input);
  return n.length > 0 && !RESERVED_SLUGS.has(n);
}
