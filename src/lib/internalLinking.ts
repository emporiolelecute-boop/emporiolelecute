/**
 * Fase 10.4 — Internal Linking automático (graph-aware).
 *
 * Sugere links internos contextuais a partir do semantic graph.
 * Regras:
 *  - Máximo 12 links por origem.
 *  - Sem loops (não linka para si mesmo).
 *  - Sem duplicações.
 *  - Prioriza hubs/taxonomias/combinações fortes (peso + authority).
 *  - Evita overlinking (penaliza nó com muito grau de saída).
 */

import type { SemanticGraph, SemanticNode } from "./semanticGraph";

export interface LinkSuggestion {
  href: string;
  label: string;
  type: SemanticNode["type"];
  weight: number;
  reason: string;
}

const MAX_LINKS = 12;

function pathFor(node: SemanticNode): string | null {
  switch (node.type) {
    case "theme":       return `/tema/${node.slug}`;
    case "occasion":    return `/ocasiao/${node.slug}`;
    case "segment":     return `/segmento/${node.slug}`;
    case "category":    return `/categoria/${node.slug}`;
    case "tag":         return `/tag/${node.slug}`;
    case "post":        return `/blog/${node.slug}`;
    case "combination": return node.slug.startsWith("/") ? node.slug : `/${node.slug}`;
    case "product":     return `/produtos/${node.slug}`;
    default:            return null;
  }
}

/** Heurística de bonus por tipo: hubs/taxonomias > posts > combinações. */
function typeBonus(t: SemanticNode["type"]): number {
  switch (t) {
    case "theme":    return 0.30;
    case "occasion": return 0.25;
    case "segment":  return 0.25;
    case "category": return 0.20;
    case "post":     return 0.15;
    case "tag":      return 0.10;
    case "combination": return 0.05;
    default: return 0;
  }
}

export function suggestInternalLinks(
  graph: SemanticGraph,
  originId: string,
  opts?: { exclude?: string[]; max?: number; authorityById?: Map<string, number> }
): LinkSuggestion[] {
  const max = Math.max(1, Math.min(MAX_LINKS, opts?.max ?? MAX_LINKS));
  const exclude = new Set(opts?.exclude ?? []);
  const authority = opts?.authorityById ?? new Map<string, number>();

  // Grau de saída por nó (anti-overlinking).
  const outDegree = new Map<string, number>();
  for (const r of graph.relations) {
    outDegree.set(r.from, (outDegree.get(r.from) ?? 0) + 1);
  }

  const seen = new Set<string>();
  const candidates: Array<LinkSuggestion & { _score: number }> = [];

  for (const r of graph.relations) {
    let otherId: string | null = null;
    if (r.from === originId) otherId = r.to;
    else if (r.to === originId) otherId = r.from;
    else continue;

    if (!otherId || otherId === originId || exclude.has(otherId) || seen.has(otherId)) continue;
    const node = graph.nodes.get(otherId);
    if (!node) continue;
    const href = pathFor(node);
    if (!href) continue;

    seen.add(otherId);

    const auth = (authority.get(otherId) ?? 0) / 100;
    const degPenalty = Math.min(0.3, (outDegree.get(otherId) ?? 0) / 100);
    const score = r.weight * 0.5 + auth * 0.3 + typeBonus(node.type) - degPenalty;

    candidates.push({
      href,
      label: node.label,
      type: node.type,
      weight: Number(score.toFixed(3)),
      reason: r.reason,
      _score: score,
    });
  }

  candidates.sort((a, b) => b._score - a._score);
  return candidates.slice(0, max).map(({ _score, ...rest }) => rest);
}

/** Detecta overlinking simples a partir de uma lista crua de hrefs. */
export function detectOverlinking(hrefs: string[]): {
  overlinked: boolean;
  duplicates: string[];
  total: number;
} {
  const counts = new Map<string, number>();
  for (const h of hrefs) counts.set(h, (counts.get(h) ?? 0) + 1);
  const duplicates = Array.from(counts.entries())
    .filter(([, c]) => c > 1)
    .map(([h]) => h);
  return { overlinked: hrefs.length > MAX_LINKS, duplicates, total: hrefs.length };
}
