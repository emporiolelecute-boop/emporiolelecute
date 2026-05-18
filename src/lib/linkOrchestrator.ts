/**
 * Fase 10.5 — Link Orchestrator.
 *
 * Sugestões contextuais de links internos, com cotas por tipo, limites
 * por página e bloqueio de destinos não-indexáveis. Não faz fetch:
 * recebe os datasets já carregados pela página.
 */

import { canBeIndexed, type IndexableEntity } from "./indexationGovernance";
import { urls } from "./urls";

export type LinkKind = "theme" | "occasion" | "segment" | "category" | "blog" | "combination";

export interface ContextualLink {
  label: string;
  path: string;
  type: LinkKind;
  weight?: number;
}

interface Item extends IndexableEntity {
  slug: string;
  name?: string;
  title?: string;
  path?: string;
}

interface BuildContext {
  themes?: Item[];
  occasions?: Item[];
  segments?: Item[];
  categories?: Item[];
  posts?: Item[];
  combinations?: Item[];
}

const PATH = {
  theme:       (s: string) => `/tema/${s}`,
  occasion:    (s: string) => `/ocasiao/${s}`,
  segment:     (s: string) => `/segmento/${s}`,
  category:    (s: string) => `/categoria/${s}`,
  blog:        (s: string) => `/blog/${s}`,
  combination: (s: string) => (s.startsWith("/") ? s : `/${s}`),
} as const;

function safeLabel(it: Item): string {
  return (it.title || it.name || it.slug || "").toString();
}

/** Bloqueia destinos não indexáveis. Itens sem flags continuam permitidos
 *  (entidades simples como categoria/ocasião não têm score). */
function isAllowedDestination(it: Item): boolean {
  const hasFlags =
    typeof it.readiness_score === "number" ||
    typeof it.is_indexed === "boolean" ||
    typeof it.approved === "boolean";
  if (!hasFlags) return true;
  return canBeIndexed(it).allowed;
}

function pickFrom(
  items: Item[] | undefined,
  type: LinkKind,
  max: number,
  used: Set<string>
): ContextualLink[] {
  if (!items?.length || max <= 0) return [];
  const out: ContextualLink[] = [];
  for (const it of items) {
    if (out.length >= max) break;
    if (!it.slug) continue;
    if (!isAllowedDestination(it)) continue;
    const path = type === "combination" && it.path ? PATH.combination(it.path) : PATH[type](it.slug);
    if (used.has(path)) continue;
    used.add(path);
    out.push({ label: safeLabel(it), path, type });
  }
  return out;
}

function dedupAndCap(links: ContextualLink[], cap: number, selfPath?: string): ContextualLink[] {
  const seen = new Set<string>();
  const out: ContextualLink[] = [];
  for (const l of links) {
    if (selfPath && l.path === selfPath) continue;
    if (seen.has(l.path)) continue;
    seen.add(l.path);
    out.push(l);
    if (out.length >= cap) break;
  }
  return out;
}

// ----- Product page (cap 10) -----

export function buildContextualLinksForProduct(
  product: { slug: string },
  ctx: BuildContext
): ContextualLink[] {
  const used = new Set<string>();
  const selfPath = urls.product(product.slug);
  const links = [
    ...pickFrom(ctx.occasions, "occasion", 2, used),
    ...pickFrom(ctx.segments,  "segment",  1, used),
    ...pickFrom(ctx.categories, "category", 1, used),
    ...pickFrom(ctx.themes,    "theme",    3, used),
    ...pickFrom(ctx.posts,     "blog",     2, used),
  ];
  // spec: máximo 9 sugestões, limite de página 10.
  return dedupAndCap(links, Math.min(9, 10), selfPath);
}

// ----- Theme page (cap 12) -----

export function buildContextualLinksForTheme(
  theme: { slug: string },
  ctx: BuildContext
): ContextualLink[] {
  const used = new Set<string>();
  const selfPath = `/tema/${theme.slug}`;
  const links = [
    ...pickFrom(ctx.themes,       "theme",       3, used),
    ...pickFrom(ctx.occasions,    "occasion",    3, used),
    ...pickFrom(ctx.segments,     "segment",     2, used),
    ...pickFrom(ctx.posts,        "blog",        2, used),
    ...pickFrom(ctx.combinations, "combination", 2, used),
  ];
  return dedupAndCap(links, 12, selfPath);
}

// ----- Combination page (cap 12) -----

export function buildContextualLinksForCombination(
  combination: { path: string },
  ctx: BuildContext
): ContextualLink[] {
  const used = new Set<string>();
  const selfPath = combination.path.startsWith("/") ? combination.path : `/${combination.path}`;
  const links = [
    ...pickFrom(ctx.themes,     "theme",    3, used),
    ...pickFrom(ctx.occasions,  "occasion", 2, used),
    ...pickFrom(ctx.segments,   "segment",  2, used),
    ...pickFrom(ctx.categories, "category", 2, used),
    ...pickFrom(ctx.posts,      "blog",     3, used),
  ];
  return dedupAndCap(links, 12, selfPath);
}

// ----- Taxonomy page (cap 10) -----

export function buildContextualLinksForTaxonomy(
  taxonomy: { slug: string; kind: "occasion" | "segment" | "category" | "tag" },
  ctx: BuildContext
): ContextualLink[] {
  const used = new Set<string>();
  const selfPath = `/${taxonomy.kind === "tag" ? "tag" : taxonomy.kind === "occasion" ? "ocasiao" : taxonomy.kind === "segment" ? "segmento" : "categoria"}/${taxonomy.slug}`;
  const links = [
    ...pickFrom(ctx.themes,       "theme",       3, used),
    ...pickFrom(ctx.occasions,    "occasion",    2, used),
    ...pickFrom(ctx.segments,     "segment",    2, used),
    ...pickFrom(ctx.categories,   "category",   1, used),
    ...pickFrom(ctx.posts,        "blog",       2, used),
    ...pickFrom(ctx.combinations, "combination",1, used),
  ];
  return dedupAndCap(links, 10, selfPath);
}
