/**
 * Fase 10.4 — Semantic Graph Engine.
 *
 * Constrói relações semânticas (pesadas) entre:
 *   tema ↔ ocasião, tema ↔ segmento, post ↔ tema,
 *   produto ↔ tema, combinação ↔ tema.
 *
 * Output é puro (sem efeitos colaterais). Consumido por internalLinking
 * e pelo Authority Center para mostrar clusters dominantes.
 */

export type SemanticNodeType =
  | "theme"
  | "occasion"
  | "segment"
  | "category"
  | "tag"
  | "product"
  | "combination"
  | "post";

export interface SemanticNode {
  id: string;
  type: SemanticNodeType;
  slug: string;
  label: string;
}

export interface SemanticRelation {
  from: string;
  to: string;
  weight: number;     // 0..1
  reason: string;
}

export interface SemanticGraph {
  nodes: Map<string, SemanticNode>;
  relations: SemanticRelation[];
}

export interface BuildInput {
  themes: Array<{
    id: string;
    slug: string;
    title: string;
    tag_id: string | null;
    related_occasions?: string[];
    related_segments?: string[];
    related_posts?: string[];
    related_themes?: string[];
    authority_score?: number;
  }>;
  occasions: Array<{ id: string; slug: string; name: string }>;
  segments: Array<{ id: string; slug: string; name: string }>;
  posts: Array<{
    id: string;
    slug: string;
    title: string;
    related_themes?: string[];
    related_occasions?: string[];
    related_segments?: string[];
  }>;
  combinations?: Array<{
    id: string;
    path: string;
    primary_slug: string;
    secondary_slug: string;
    primary_type: string;
    secondary_type: string;
    is_indexable?: boolean;
  }>;
}

function nid(type: SemanticNodeType, id: string) {
  return `${type}:${id}`;
}

function pushNode(g: SemanticGraph, node: SemanticNode) {
  if (!g.nodes.has(node.id)) g.nodes.set(node.id, node);
}

function pushRel(g: SemanticGraph, rel: SemanticRelation) {
  if (rel.from === rel.to) return;
  g.relations.push(rel);
}

export function buildSemanticGraph(input: BuildInput): SemanticGraph {
  const g: SemanticGraph = { nodes: new Map(), relations: [] };

  for (const o of input.occasions) {
    pushNode(g, { id: nid("occasion", o.id), type: "occasion", slug: o.slug, label: o.name });
  }
  for (const s of input.segments) {
    pushNode(g, { id: nid("segment", s.id), type: "segment", slug: s.slug, label: s.name });
  }
  for (const p of input.posts) {
    pushNode(g, { id: nid("post", p.id), type: "post", slug: p.slug, label: p.title });
  }
  for (const t of input.themes) {
    pushNode(g, { id: nid("theme", t.id), type: "theme", slug: t.slug, label: t.title });

    for (const oid of t.related_occasions ?? []) {
      pushRel(g, {
        from: nid("theme", t.id),
        to: nid("occasion", oid),
        weight: 0.8,
        reason: "theme→occasion (related)",
      });
    }
    for (const sid of t.related_segments ?? []) {
      pushRel(g, {
        from: nid("theme", t.id),
        to: nid("segment", sid),
        weight: 0.7,
        reason: "theme→segment (related)",
      });
    }
    for (const pid of t.related_posts ?? []) {
      pushRel(g, {
        from: nid("theme", t.id),
        to: nid("post", pid),
        weight: 0.6,
        reason: "theme→post (editorial)",
      });
    }
    for (const tid of t.related_themes ?? []) {
      pushRel(g, {
        from: nid("theme", t.id),
        to: nid("theme", tid),
        weight: 0.5,
        reason: "theme↔theme (sibling)",
      });
    }
  }

  for (const p of input.posts) {
    for (const tid of p.related_themes ?? []) {
      pushRel(g, {
        from: nid("post", p.id),
        to: nid("theme", tid),
        weight: 0.7,
        reason: "post→theme (authority contribution)",
      });
    }
  }

  for (const c of input.combinations ?? []) {
    pushNode(g, { id: nid("combination", c.id), type: "combination", slug: c.path, label: c.path });
    // ligar à ocasião quando aplicável
    if (c.secondary_type === "occasion") {
      const occ = input.occasions.find((o) => o.slug === c.secondary_slug);
      if (occ) {
        pushRel(g, {
          from: nid("combination", c.id),
          to: nid("occasion", occ.id),
          weight: 0.5,
          reason: "combination→occasion",
        });
      }
    }
    if (c.primary_type === "segment") {
      const seg = input.segments.find((s) => s.slug === c.primary_slug);
      if (seg) {
        pushRel(g, {
          from: nid("combination", c.id),
          to: nid("segment", seg.id),
          weight: 0.5,
          reason: "combination→segment",
        });
      }
    }
  }

  return g;
}

/** Retorna vizinhos diretos ordenados por peso. */
export function neighbors(g: SemanticGraph, nodeId: string, limit = 8): SemanticRelation[] {
  return g.relations
    .filter((r) => r.from === nodeId || r.to === nodeId)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

/** Identifica clusters dominantes pelo nº de relações por nó. */
export function dominantClusters(g: SemanticGraph, top = 10) {
  const counts = new Map<string, number>();
  for (const r of g.relations) {
    counts.set(r.from, (counts.get(r.from) ?? 0) + 1);
    counts.set(r.to, (counts.get(r.to) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([id, count]) => ({ node: g.nodes.get(id), count }))
    .filter((x) => x.node)
    .sort((a, b) => b.count - a.count)
    .slice(0, top);
}
