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
import { urls } from "./urls";

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
    case "product":     return urls.product(node.slug);
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

/**
 * Fase 11.1 — Detecção rica de overlinking visual.
 *
 * Recebe os links contextuais já renderizados (com `type`/cluster opcional)
 * e devolve um veredicto de risco + razões + score 0–100.
 */
export interface OverlinkLink {
  href: string;
  type?: SemanticNode["type"] | string;
  /** identificador opcional de cluster (ex.: slug do tema/segmento dominante) */
  cluster?: string;
  /** profundidade da URL em hops (split por "/") */
  depth?: number;
}

export interface OverlinkVerdict {
  risk: "low" | "medium" | "high";
  reasons: string[];
  score: number;
  total: number;
  duplicates: string[];
}

/**
 * Detecta overlinking. Aceita tanto a forma simples (lista de hrefs)
 * — para retrocompat — quanto a forma rica (lista de OverlinkLink).
 */
export function detectOverlinking(input: string[] | OverlinkLink[]): OverlinkVerdict {
  const items: OverlinkLink[] = (input as unknown[]).map((x) =>
    typeof x === "string" ? { href: x } : (x as OverlinkLink)
  );

  const reasons: string[] = [];
  const total = items.length;

  // Duplicações por href
  const hrefCounts = new Map<string, number>();
  for (const it of items) hrefCounts.set(it.href, (hrefCounts.get(it.href) ?? 0) + 1);
  const duplicates = Array.from(hrefCounts.entries())
    .filter(([, c]) => c > 1)
    .map(([h]) => h);
  if (duplicates.length > 0) reasons.push(`${duplicates.length} duplicações`);

  // Excesso de links totais
  if (total > 12) reasons.push(`>12 links (${total})`);

  // Repetição de mesma "entidade" (mesmo href base)
  const repeated = Array.from(hrefCounts.values()).filter((c) => c > 2).length;
  if (repeated > 0) reasons.push("entidade repetida >2x");

  // Concentração em mesma taxonomia (mesmo prefixo /ocasiao, /categoria, /segmento, /tag)
  const taxBuckets = new Map<string, number>();
  for (const it of items) {
    const m = it.href.match(/^\/(ocasiao|categoria|segmento|tag|tema)\//);
    if (m) taxBuckets.set(m[1], (taxBuckets.get(m[1]) ?? 0) + 1);
  }
  for (const [k, n] of taxBuckets) {
    if (n > 6) reasons.push(`excesso de links para /${k}/ (${n})`);
  }

  // Profundidade > 4 hops
  const deep = items.filter((it) => (it.depth ?? it.href.split("/").filter(Boolean).length) > 4).length;
  if (deep > 0) reasons.push(`${deep} links com profundidade >4`);

  // Concentração >60% em um único cluster
  const clusters = new Map<string, number>();
  for (const it of items) {
    if (!it.cluster) continue;
    clusters.set(it.cluster, (clusters.get(it.cluster) ?? 0) + 1);
  }
  const clusterTotal = Array.from(clusters.values()).reduce((a, b) => a + b, 0);
  if (clusterTotal > 0) {
    const maxCluster = Math.max(...clusters.values());
    if (maxCluster / clusterTotal > 0.6) reasons.push("concentração >60% em um cluster");
  }

  // Score (100 = saudável)
  let score = 100;
  score -= Math.max(0, total - 8) * 4;       // penaliza volume
  score -= duplicates.length * 6;
  score -= repeated * 8;
  score -= deep * 5;
  score -= reasons.filter((r) => r.startsWith("excesso de links")).length * 8;
  score = Math.max(0, Math.min(100, score));

  let risk: OverlinkVerdict["risk"] = "low";
  if (score < 55 || reasons.length >= 3) risk = "high";
  else if (score < 75 || reasons.length >= 1) risk = "medium";

  return { risk, reasons, score, total, duplicates };
}
