/**
 * Fase 12 — Knowledge Graph Engine.
 *
 * Constrói um grafo semântico in-memory a partir das entidades já carregadas.
 * NÃO escreve, NÃO publica, NÃO indexa. Apenas observa.
 */

export type KGNodeType =
  | "product" | "category" | "occasion" | "segment"
  | "tag" | "theme" | "combination" | "blog_post";

export type KGEdgeType =
  | "belongs_to" | "related_to" | "supports" | "overlaps"
  | "competes_with" | "linked_to" | "derived_from" | "semantically_close";

export interface KGNode {
  id: string;
  type: KGNodeType;
  slug?: string;
  name: string;
  authority: number;       // 0..100
  topicalCoverage: number; // 0..100
  thinContent?: boolean;
  approved?: boolean;
  metadata?: Record<string, any>;
}

export interface KGEdge {
  from: string;
  to: string;
  type: KGEdgeType;
  weight: number; // 0..1
}

export interface KGCluster {
  id: string;
  label: string;
  nodeIds: string[];
  authorityAvg: number;
}

export interface AuthorityFlow {
  fromCluster: string;
  toNode: string;
  estimatedFlow: number;
}

export interface KnowledgeGraph {
  nodes: KGNode[];
  edges: KGEdge[];
  clusters: KGCluster[];
  orphanNodes: KGNode[];
  weakAreas: { clusterId: string; reason: string; score: number }[];
  authorityFlows: AuthorityFlow[];
}

export interface KGInputs {
  products?: { id: string; name: string; slug: string; category_id?: string | null; authority?: number; thin?: boolean }[];
  categories?: { id: string; name: string; slug: string; authority?: number; topical?: number }[];
  occasions?: { id: string; name: string; slug: string; authority?: number; topical?: number }[];
  segments?: { id: string; name: string; slug: string; authority?: number; topical?: number }[];
  tags?: { id: string; name: string; slug: string }[];
  themes?: { id: string; name: string; slug: string; authority?: number; topical?: number; is_approved?: boolean; thin?: boolean }[];
  combinations?: { id: string; path: string; primary_slug: string; secondary_slug: string; authority?: number; readiness?: number; approved?: boolean }[];
  blogPosts?: { id: string; title: string; slug: string; related_categories?: string[]; related_occasions?: string[]; related_segments?: string[]; related_themes?: string[]; related_tags?: string[]; related_products?: string[] }[];
  productOccasions?: { product_id: string; occasion_id: string }[];
  productSegments?: { product_id: string; segment_id: string }[];
  productTags?: { product_id: string; tag_id: string }[];
}

function nid(type: KGNodeType, id: string) { return `${type}:${id}`; }

export function buildEntityNode(type: KGNodeType, raw: any): KGNode {
  return {
    id: nid(type, raw.id),
    type,
    slug: raw.slug || raw.path,
    name: raw.name || raw.title || raw.path || raw.slug,
    authority: Math.round(raw.authority ?? raw.authority_score ?? 0),
    topicalCoverage: Math.round(raw.topical ?? raw.topical_coverage ?? 0),
    thinContent: !!(raw.thin ?? raw.thin_content_risk),
    approved: raw.approved ?? raw.is_approved ?? true,
  };
}

export function buildSemanticEdges(inputs: KGInputs, nodeIndex: Set<string>): KGEdge[] {
  const edges: KGEdge[] = [];
  const push = (e: KGEdge) => {
    if (nodeIndex.has(e.from) && nodeIndex.has(e.to)) edges.push(e);
  };

  inputs.products?.forEach((p) => {
    if (p.category_id) push({ from: nid("product", p.id), to: nid("category", p.category_id), type: "belongs_to", weight: 1 });
  });
  inputs.productOccasions?.forEach((r) =>
    push({ from: nid("product", r.product_id), to: nid("occasion", r.occasion_id), type: "belongs_to", weight: 0.9 }),
  );
  inputs.productSegments?.forEach((r) =>
    push({ from: nid("product", r.product_id), to: nid("segment", r.segment_id), type: "belongs_to", weight: 0.9 }),
  );
  inputs.productTags?.forEach((r) =>
    push({ from: nid("product", r.product_id), to: nid("tag", r.tag_id), type: "related_to", weight: 0.5 }),
  );

  inputs.combinations?.forEach((c) => {
    const cnid = nid("combination", c.id);
    push({ from: cnid, to: nid("segment", c.primary_slug), type: "derived_from", weight: 0.8 });
    push({ from: cnid, to: nid("occasion", c.secondary_slug), type: "derived_from", weight: 0.8 });
  });

  inputs.blogPosts?.forEach((b) => {
    const bn = nid("blog_post", b.id);
    (b.related_categories || []).forEach((id) => push({ from: bn, to: nid("category", id), type: "supports", weight: 0.7 }));
    (b.related_occasions  || []).forEach((id) => push({ from: bn, to: nid("occasion", id),  type: "supports", weight: 0.7 }));
    (b.related_segments   || []).forEach((id) => push({ from: bn, to: nid("segment", id),   type: "supports", weight: 0.7 }));
    (b.related_themes     || []).forEach((id) => push({ from: bn, to: nid("theme", id),     type: "supports", weight: 0.8 }));
    (b.related_tags       || []).forEach((id) => push({ from: bn, to: nid("tag", id),       type: "related_to", weight: 0.4 }));
    (b.related_products   || []).forEach((id) => push({ from: bn, to: nid("product", id),   type: "linked_to", weight: 0.6 }));
  });

  return edges;
}

export function calculateNodeAuthority(node: KGNode, edges: KGEdge[]): number {
  const incoming = edges.filter((e) => e.to === node.id);
  const linkBoost = Math.min(20, incoming.length * 1.5);
  return Math.min(100, node.authority + linkBoost);
}

/** Distância semântica simplificada: 1 - overlap de vizinhos diretos. */
export function calculateSemanticDistance(a: KGNode, b: KGNode, edges: KGEdge[]): number {
  const neighA = new Set(edges.filter((e) => e.from === a.id || e.to === a.id).map((e) => e.from === a.id ? e.to : e.from));
  const neighB = new Set(edges.filter((e) => e.from === b.id || e.to === b.id).map((e) => e.from === b.id ? e.to : e.from));
  if (neighA.size === 0 && neighB.size === 0) return 1;
  let inter = 0;
  neighA.forEach((n) => { if (neighB.has(n)) inter++; });
  const union = new Set([...neighA, ...neighB]).size || 1;
  return Math.round((1 - inter / union) * 100) / 100;
}

export function detectWeakKnowledgeAreas(graph: { clusters: KGCluster[] }): { clusterId: string; reason: string; score: number }[] {
  return graph.clusters
    .filter((c) => c.authorityAvg < 40 || c.nodeIds.length < 3)
    .map((c) => ({
      clusterId: c.id,
      reason: c.nodeIds.length < 3 ? "cluster muito pequeno" : "autoridade média baixa",
      score: Math.max(0, 100 - c.authorityAvg),
    }))
    .sort((a, b) => b.score - a.score);
}

export function detectAuthorityLeaks(nodes: KGNode[], edges: KGEdge[]): { from: KGNode; reason: string }[] {
  const leaks: { from: KGNode; reason: string }[] = [];
  nodes.forEach((n) => {
    if (n.authority < 40) return;
    const outgoing = edges.filter((e) => e.from === n.id);
    if (outgoing.length === 0) leaks.push({ from: n, reason: "hub com autoridade sem outbound" });
  });
  return leaks.slice(0, 50);
}

export function detectSemanticLoops(edges: KGEdge[]): { a: string; b: string }[] {
  const set = new Set<string>();
  const loops: { a: string; b: string }[] = [];
  edges.forEach((e) => {
    const key = `${e.from}↔${e.to}`;
    const inv = `${e.to}↔${e.from}`;
    if (set.has(inv)) loops.push({ a: e.from, b: e.to });
    set.add(key);
  });
  return loops.slice(0, 50);
}

function clusterByCategory(nodes: KGNode[], edges: KGEdge[]): KGCluster[] {
  const categories = nodes.filter((n) => n.type === "category");
  const clusters: KGCluster[] = [];
  categories.forEach((c) => {
    const members = edges.filter((e) => e.to === c.id && e.type === "belongs_to").map((e) => e.from);
    const memberNodes = nodes.filter((n) => members.includes(n.id));
    const auths = memberNodes.map((m) => m.authority).concat(c.authority);
    clusters.push({
      id: c.id,
      label: c.name,
      nodeIds: [c.id, ...members],
      authorityAvg: auths.length ? Math.round(auths.reduce((a, b) => a + b, 0) / auths.length) : 0,
    });
  });
  return clusters;
}

export function buildKnowledgeGraph(inputs: KGInputs): KnowledgeGraph {
  const nodes: KGNode[] = [];
  inputs.products?.forEach((p) => nodes.push(buildEntityNode("product", p)));
  inputs.categories?.forEach((c) => nodes.push(buildEntityNode("category", c)));
  inputs.occasions?.forEach((c) => nodes.push(buildEntityNode("occasion", c)));
  inputs.segments?.forEach((c) => nodes.push(buildEntityNode("segment", c)));
  inputs.tags?.forEach((c) => nodes.push(buildEntityNode("tag", c)));
  inputs.themes?.forEach((c) => nodes.push(buildEntityNode("theme", c)));
  inputs.combinations?.forEach((c) => nodes.push(buildEntityNode("combination", { id: c.id, name: c.path, slug: c.path, authority: c.authority, topical: c.readiness, approved: c.approved })));
  inputs.blogPosts?.forEach((b) => nodes.push(buildEntityNode("blog_post", b)));

  const nodeIndex = new Set(nodes.map((n) => n.id));
  const edges = buildSemanticEdges(inputs, nodeIndex);

  const incoming = new Map<string, number>();
  edges.forEach((e) => incoming.set(e.to, (incoming.get(e.to) || 0) + 1));
  const orphanNodes = nodes.filter((n) => (incoming.get(n.id) || 0) === 0 && n.type !== "product");

  const clusters = clusterByCategory(nodes, edges);
  const weakAreas = detectWeakKnowledgeAreas({ clusters });

  const authorityFlows: AuthorityFlow[] = clusters
    .filter((c) => c.authorityAvg >= 50)
    .flatMap((c) =>
      c.nodeIds
        .filter((id) => id !== c.id)
        .slice(0, 5)
        .map((id) => ({ fromCluster: c.id, toNode: id, estimatedFlow: Math.round(c.authorityAvg * 0.6) })),
    );

  return { nodes, edges, clusters, orphanNodes, weakAreas, authorityFlows };
}

export function calculateKnowledgeHealth(graph: KnowledgeGraph): {
  score: number;
  rating: "Crítico" | "Frágil" | "Saudável" | "Forte" | "Excelente";
  breakdown: Record<string, number>;
} {
  const total = graph.nodes.length || 1;
  const orphanRatio = graph.orphanNodes.length / total;
  const avgAuthority = Math.round(graph.nodes.reduce((a, n) => a + n.authority, 0) / total);
  const connectivity = Math.min(100, Math.round((graph.edges.length / total) * 25));
  const clusterQuality = graph.clusters.length
    ? Math.round(graph.clusters.reduce((a, c) => a + c.authorityAvg, 0) / graph.clusters.length)
    : 0;
  const decayPenalty = graph.weakAreas.length > 5 ? 10 : 0;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        avgAuthority * 0.3 +
        connectivity * 0.25 +
        clusterQuality * 0.25 +
        (1 - orphanRatio) * 100 * 0.2 -
        decayPenalty,
      ),
    ),
  );

  const rating =
    score >= 85 ? "Excelente" :
    score >= 70 ? "Forte" :
    score >= 55 ? "Saudável" :
    score >= 35 ? "Frágil" : "Crítico";

  return {
    score,
    rating,
    breakdown: { avgAuthority, connectivity, clusterQuality, orphanRatio: Math.round(orphanRatio * 100), decayPenalty },
  };
}
