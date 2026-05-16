// Fase 10.1 — Discovery Engine (fundação interna).
// Analisa produtos ativos e descobre combinações taxonômicas com potencial SEO.
// NÃO cria páginas públicas — apenas produz oportunidades para registry/admin.

export type DiscoveryOpportunityType =
  | "segment_occasion"
  | "category_occasion"
  | "tag_occasion";

export interface DiscoveryOpportunity {
  type: DiscoveryOpportunityType;
  slug: string;
  canonicalPath: string;
  entities: {
    category?: { id: string; slug: string; name: string };
    occasion?: { id: string; slug: string; name: string };
    segment?: { id: string; slug: string; name: string };
    tag?: { id: string; slug: string; name: string };
  };
  productsCount: number;
  productsWithImage: number;
  productsWithReview: number;
  productsWithEditorial: number;
  qualityScore: number;
  confidenceScore: number;
  classification: "Excelente" | "Forte" | "Regular" | "Fraca";
  thinContentRisk: boolean;
  reasons: string[];
  warnings: string[];
  isIndexableCandidate: boolean;
}

export interface DiscoveryProduct {
  id: string;
  is_active: boolean;
  images?: string[] | null;
  long_description?: string | null;
  editorial_content?: string | null;
  category_id?: string | null;
  reviews_count?: number;
  occasion_ids: string[];
  segment_ids: string[];
  tag_ids: string[];
}

export interface DiscoveryTaxonomy {
  id: string;
  slug: string;
  name: string;
  is_indexed?: boolean;
}

export interface DiscoveryInput {
  products: DiscoveryProduct[];
  categories: DiscoveryTaxonomy[];
  occasions: DiscoveryTaxonomy[];
  segments: DiscoveryTaxonomy[];
  tags: DiscoveryTaxonomy[];
  /** Slugs de taxonomias já existentes como página única (para detectar canibalização). */
  existingSinglePaths?: Set<string>;
}

const GENERIC_TAG_TOKENS = new Set([
  "novo", "novos", "promo", "promocao", "promoção", "geral",
  "diversos", "outros", "padrao", "padrão", "teste",
]);

// ---------------- Score ----------------

export function scoreDiscoveryOpportunity(args: {
  productsCount: number;
  productsWithImage: number;
  productsWithReview: number;
  productsWithEditorial: number;
  hasStrongTaxonomies: boolean;
  distinctCategories: number;
}): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // Volume de produtos (até 30 pts)
  if (args.productsCount >= 20) { score += 30; reasons.push("Catálogo robusto (20+ produtos)"); }
  else if (args.productsCount >= 12) { score += 22; reasons.push("Bom catálogo (12+ produtos)"); }
  else if (args.productsCount >= 6) { score += 14; reasons.push("Catálogo mínimo (6+ produtos)"); }
  else { score += 4; reasons.push("Poucos produtos"); }

  // Diversidade (até 15 pts)
  if (args.distinctCategories >= 3) { score += 15; reasons.push("Boa diversidade de categorias"); }
  else if (args.distinctCategories === 2) { score += 9; }
  else { score += 3; }

  // Imagens (até 15 pts)
  const imgRatio = args.productsCount ? args.productsWithImage / args.productsCount : 0;
  if (imgRatio >= 0.8) { score += 15; reasons.push("Alta cobertura de imagens"); }
  else if (imgRatio >= 0.5) { score += 9; }
  else { score += 3; }

  // Reviews (até 15 pts)
  if (args.productsWithReview >= 5) { score += 15; reasons.push("Boas avaliações"); }
  else if (args.productsWithReview >= 2) { score += 9; }
  else if (args.productsWithReview >= 1) { score += 5; }

  // Editorial (até 15 pts)
  const edRatio = args.productsCount ? args.productsWithEditorial / args.productsCount : 0;
  if (edRatio >= 0.5) { score += 15; reasons.push("Boa cobertura editorial"); }
  else if (edRatio >= 0.25) { score += 9; }
  else if (edRatio > 0) { score += 5; }

  // Taxonomias fortes (até 10 pts)
  if (args.hasStrongTaxonomies) { score += 10; reasons.push("Taxonomias indexáveis"); }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

export function classifyScore(score: number): DiscoveryOpportunity["classification"] {
  if (score >= 85) return "Excelente";
  if (score >= 70) return "Forte";
  if (score >= 55) return "Regular";
  return "Fraca";
}

// ---------------- Thin content ----------------

export function detectThinContentRisk(args: {
  productsCount: number;
  productsWithReview: number;
  productsWithEditorial: number;
  productsWithLongDesc: number;
  distinctCategories: number;
}): { risk: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (args.productsCount < 6) reasons.push("Menos de 6 produtos");
  if (args.distinctCategories < 2) reasons.push("Baixa diversidade");
  if (args.productsWithEditorial === 0) reasons.push("Sem conteúdo editorial");
  if (args.productsWithReview === 0) reasons.push("Sem avaliações");
  if (args.productsWithLongDesc < 2) reasons.push("Pouca descrição detalhada");
  return { risk: reasons.length >= 2, reasons };
}

// ---------------- Engine ----------------

interface Bucket {
  type: DiscoveryOpportunityType;
  entities: DiscoveryOpportunity["entities"];
  slug: string;
  canonicalPath: string;
  productIds: Set<string>;
}

function makeKey(type: DiscoveryOpportunityType, a: string, b: string) {
  return `${type}::${a}::${b}`;
}

export function runDiscoveryEngine(input: DiscoveryInput): DiscoveryOpportunity[] {
  const { products, categories, occasions, segments, tags } = input;
  const existing = input.existingSinglePaths ?? new Set<string>();

  const indexed = <T extends DiscoveryTaxonomy>(arr: T[]) =>
    new Map(arr.filter((t) => t.is_indexed !== false).map((t) => [t.id, t]));

  const catMap = indexed(categories);
  const occMap = indexed(occasions);
  const segMap = indexed(segments);
  const tagMap = indexed(tags);

  // Conta usos de tags para filtrar tags fracas (< 3 produtos) e genéricas.
  const tagUsage = new Map<string, number>();
  for (const p of products) {
    if (!p.is_active) continue;
    for (const tid of p.tag_ids) tagUsage.set(tid, (tagUsage.get(tid) || 0) + 1);
  }
  const validTagIds = new Set<string>();
  for (const [tid, count] of tagUsage) {
    const t = tagMap.get(tid);
    if (!t) continue;
    const norm = (t.slug || t.name || "").toLowerCase();
    if (GENERIC_TAG_TOKENS.has(norm)) continue;
    if (count < 3) continue;
    validTagIds.add(tid);
  }

  const buckets = new Map<string, Bucket>();

  const ensure = (
    type: DiscoveryOpportunityType,
    primary: DiscoveryTaxonomy,
    primaryKind: "category" | "segment" | "tag",
    occasion: DiscoveryTaxonomy,
  ): Bucket => {
    const key = makeKey(type, primary.id, occasion.id);
    let b = buckets.get(key);
    if (!b) {
      const prefix =
        primaryKind === "category" ? "categoria"
        : primaryKind === "segment" ? "segmento"
        : "tag";
      const slug = `${primary.slug}-${occasion.slug}`;
      const canonicalPath = `/${prefix}/${primary.slug}/ocasiao/${occasion.slug}`;
      b = {
        type,
        slug,
        canonicalPath,
        entities: {
          occasion: { id: occasion.id, slug: occasion.slug, name: occasion.name },
          ...(primaryKind === "category" ? { category: { id: primary.id, slug: primary.slug, name: primary.name } } : {}),
          ...(primaryKind === "segment" ? { segment: { id: primary.id, slug: primary.slug, name: primary.name } } : {}),
          ...(primaryKind === "tag" ? { tag: { id: primary.id, slug: primary.slug, name: primary.name } } : {}),
        },
        productIds: new Set<string>(),
      };
      buckets.set(key, b);
    }
    return b;
  };

  for (const p of products) {
    if (!p.is_active) continue;
    const cat = p.category_id ? catMap.get(p.category_id) : undefined;

    for (const oid of p.occasion_ids) {
      const occ = occMap.get(oid);
      if (!occ) continue;

      if (cat) ensure("category_occasion", cat, "category", occ).productIds.add(p.id);

      for (const sid of p.segment_ids) {
        const seg = segMap.get(sid);
        if (!seg) continue;
        ensure("segment_occasion", seg, "segment", occ).productIds.add(p.id);
      }

      for (const tid of p.tag_ids) {
        if (!validTagIds.has(tid)) continue;
        const tag = tagMap.get(tid);
        if (!tag) continue;
        ensure("tag_occasion", tag, "tag", occ).productIds.add(p.id);
      }
    }
  }

  const productsById = new Map(products.map((p) => [p.id, p]));
  const opportunities: DiscoveryOpportunity[] = [];

  for (const b of buckets.values()) {
    const ids = Array.from(b.productIds);
    if (ids.length < 6) continue;

    let withImage = 0;
    let withReview = 0;
    let withEditorial = 0;
    let withLongDesc = 0;
    const distinctCats = new Set<string>();

    for (const id of ids) {
      const p = productsById.get(id);
      if (!p) continue;
      if ((p.images?.length ?? 0) > 0) withImage++;
      if ((p.reviews_count ?? 0) > 0) withReview++;
      if ((p.editorial_content || "").trim().length >= 100) withEditorial++;
      if ((p.long_description || "").trim().length >= 100) withLongDesc++;
      if (p.category_id) distinctCats.add(p.category_id);
    }

    if (withImage < 2) continue;
    if (withReview < 1) continue;
    if (withEditorial < 1 && withLongDesc < 1) continue;

    const { score, reasons } = scoreDiscoveryOpportunity({
      productsCount: ids.length,
      productsWithImage: withImage,
      productsWithReview: withReview,
      productsWithEditorial: withEditorial,
      hasStrongTaxonomies: true,
      distinctCategories: distinctCats.size,
    });

    const thin = detectThinContentRisk({
      productsCount: ids.length,
      productsWithReview: withReview,
      productsWithEditorial: withEditorial,
      productsWithLongDesc: withLongDesc,
      distinctCategories: distinctCats.size,
    });

    // Confidence: pondera volume + cobertura editorial+reviews.
    const coverage = (withImage + withEditorial + withReview) / Math.max(1, ids.length * 3);
    const confidence = Math.round(Math.min(100, ids.length * 3 + coverage * 60));

    const warnings: string[] = [];
    const occSlug = b.entities.occasion?.slug;
    if (occSlug && existing.has(`/ocasiao/${occSlug}`)) {
      warnings.push(`Possível overlap com /ocasiao/${occSlug}`);
    }
    if (b.type === "tag_occasion") warnings.push("Tag pode canibalizar páginas mais fortes");

    opportunities.push({
      type: b.type,
      slug: b.slug,
      canonicalPath: b.canonicalPath,
      entities: b.entities,
      productsCount: ids.length,
      productsWithImage: withImage,
      productsWithReview: withReview,
      productsWithEditorial: withEditorial,
      qualityScore: score,
      confidenceScore: confidence,
      classification: classifyScore(score),
      thinContentRisk: thin.risk,
      reasons: [...reasons, ...thin.reasons],
      warnings,
      isIndexableCandidate: score >= 70 && !thin.risk,
    });
  }

  opportunities.sort((a, b) => b.qualityScore - a.qualityScore || b.productsCount - a.productsCount);
  return opportunities;
}

// ---------------- Fase 10.4 — Hub Suggestion Candidates ----------------

/**
 * Identifica oportunidades fortes para virar HUB temático.
 * Critérios (SAFE MODE — sugestão apenas, NÃO cria nada):
 *   produtos >= 10, ocasiões >= 2, segmentos >= 2,
 *   authority/quality >= 70, thinContentRisk = false.
 */
export interface HubSuggestionCandidate {
  sourceType: DiscoveryOpportunityType;
  slug: string;
  label: string;
  productsCount: number;
  occasionsCount: number;
  segmentsCount: number;
  qualityScore: number;
  reasons: string[];
}

export function suggestHubCandidates(
  opportunities: DiscoveryOpportunity[],
  perProductTaxonomy: {
    occasionsByOpportunitySlug?: Map<string, number>;
    segmentsByOpportunitySlug?: Map<string, number>;
  } = {}
): HubSuggestionCandidate[] {
  const out: HubSuggestionCandidate[] = [];
  for (const op of opportunities) {
    const occ = perProductTaxonomy.occasionsByOpportunitySlug?.get(op.slug) ?? 0;
    const seg = perProductTaxonomy.segmentsByOpportunitySlug?.get(op.slug) ?? 0;

    if (
      op.productsCount >= 10 &&
      occ >= 2 &&
      seg >= 2 &&
      op.qualityScore >= 70 &&
      !op.thinContentRisk
    ) {
      out.push({
        sourceType: op.type,
        slug: op.slug,
        label:
          op.entities.tag?.name ??
          op.entities.segment?.name ??
          op.entities.category?.name ??
          op.slug,
        productsCount: op.productsCount,
        occasionsCount: occ,
        segmentsCount: seg,
        qualityScore: op.qualityScore,
        reasons: [
          `Quality ${op.qualityScore}`,
          `${op.productsCount} produtos`,
          `${occ} ocasiões`,
          `${seg} segmentos`,
        ],
      });
    }
  }
  return out;
}
