// Fase 10.1 — Hook do Discovery Engine.
// Lê dados brutos do banco, roda o engine e persiste oportunidades no registry.
// NÃO altera rotas públicas, sitemap ou indexação.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  runDiscoveryEngine,
  type DiscoveryInput,
  type DiscoveryOpportunity,
  type DiscoveryProduct,
  type DiscoveryTaxonomy,
} from "@/lib/discoveryEngine";

const REGISTRY = "combination_pages_registry";

async function loadDiscoveryInput(): Promise<DiscoveryInput> {
  const [
    { data: products = [] },
    { data: categories = [] },
    { data: occasions = [] },
    { data: segments = [] },
    { data: tags = [] },
    { data: poc = [] },
    { data: pseg = [] },
    { data: ptag = [] },
    { data: reviews = [] },
  ] = await Promise.all([
    supabase.from("products").select("id,is_active,images,long_description,editorial_content,category_id").eq("is_active", true),
    supabase.from("categories").select("id,slug,name,is_indexed"),
    supabase.from("occasions").select("id,slug,name,is_indexed"),
    supabase.from("segments").select("id,slug,name,is_indexed"),
    supabase.from("tags").select("id,slug,name"),
    supabase.from("product_occasions").select("product_id,occasion_id"),
    supabase.from("product_segments").select("product_id,segment_id"),
    supabase.from("product_tags").select("product_id,tag_id"),
    supabase.from("product_reviews").select("product_id").eq("is_visible", true),
  ]);

  const occMap = new Map<string, string[]>();
  for (const r of poc as any[]) {
    const arr = occMap.get(r.product_id) || []; arr.push(r.occasion_id); occMap.set(r.product_id, arr);
  }
  const segMap = new Map<string, string[]>();
  for (const r of pseg as any[]) {
    const arr = segMap.get(r.product_id) || []; arr.push(r.segment_id); segMap.set(r.product_id, arr);
  }
  const tagMap = new Map<string, string[]>();
  for (const r of ptag as any[]) {
    const arr = tagMap.get(r.product_id) || []; arr.push(r.tag_id); tagMap.set(r.product_id, arr);
  }
  const reviewCount = new Map<string, number>();
  for (const r of reviews as any[]) {
    reviewCount.set(r.product_id, (reviewCount.get(r.product_id) || 0) + 1);
  }

  const enriched: DiscoveryProduct[] = (products as any[]).map((p) => ({
    id: p.id,
    is_active: !!p.is_active,
    images: p.images || [],
    long_description: p.long_description,
    editorial_content: p.editorial_content,
    category_id: p.category_id,
    reviews_count: reviewCount.get(p.id) || 0,
    occasion_ids: occMap.get(p.id) || [],
    segment_ids: segMap.get(p.id) || [],
    tag_ids: tagMap.get(p.id) || [],
  }));

  const existingSinglePaths = new Set<string>([
    ...(categories as any[]).map((c) => `/categoria/${c.slug}`),
    ...(occasions as any[]).map((c) => `/ocasiao/${c.slug}`),
    ...(segments as any[]).map((c) => `/segmento/${c.slug}`),
    ...(tags as any[]).map((c) => `/tag/${c.slug}`),
  ]);

  return {
    products: enriched,
    categories: categories as DiscoveryTaxonomy[],
    occasions: occasions as DiscoveryTaxonomy[],
    segments: segments as DiscoveryTaxonomy[],
    tags: tags as DiscoveryTaxonomy[],
    existingSinglePaths,
  };
}

export interface DiscoveryRow {
  id: string;
  path: string;
  generated_slug: string | null;
  canonical_path: string | null;
  primary_type: string;
  primary_slug: string;
  secondary_type: string;
  secondary_slug: string;
  discovery_type: string | null;
  discovery_status: string;
  products_count: number;
  quality_score: number;
  confidence_score: number;
  thin_content_risk: boolean;
  auto_discovered: boolean;
  is_indexable: boolean;
  discovery_payload: any;
  last_evaluated_at: string | null;
  updated_at: string;
}

export function useDiscoveryRows() {
  return useQuery({
    queryKey: ["discovery_rows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(REGISTRY)
        .select("*")
        .eq("auto_discovered", true)
        .order("quality_score", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as unknown as DiscoveryRow[];
    },
  });
}

function primaryFor(op: DiscoveryOpportunity) {
  if (op.entities.segment) return { type: "segment", slug: op.entities.segment.slug };
  if (op.entities.category) return { type: "category", slug: op.entities.category.slug };
  return { type: "tag", slug: op.entities.tag!.slug };
}

export function useRunDiscovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const input = await loadDiscoveryInput();
      const opportunities = runDiscoveryEngine(input);

      const now = new Date().toISOString();
      const rows = opportunities.map((op) => {
        const primary = primaryFor(op);
        const secondary = { type: "occasion", slug: op.entities.occasion!.slug };
        return {
          path: op.canonicalPath,
          generated_slug: op.slug,
          canonical_path: op.canonicalPath,
          primary_type: primary.type,
          primary_slug: primary.slug,
          secondary_type: secondary.type,
          secondary_slug: secondary.slug,
          discovery_type: op.type,
          discovery_status: "candidate",
          products_count: op.productsCount,
          product_count: op.productsCount, // legado
          quality_score: op.qualityScore,
          confidence_score: op.confidenceScore,
          thin_content_risk: op.thinContentRisk,
          auto_discovered: true,
          is_indexable: false, // Fase 10.1 — nunca indexar automaticamente.
          discovery_payload: {
            classification: op.classification,
            reasons: op.reasons,
            warnings: op.warnings,
            productsWithImage: op.productsWithImage,
            productsWithReview: op.productsWithReview,
            productsWithEditorial: op.productsWithEditorial,
            isIndexableCandidate: op.isIndexableCandidate,
          },
          last_evaluated_at: now,
        };
      });

      if (rows.length === 0) return { upserted: 0, opportunities: 0 };

      const { error } = await supabase
        .from(REGISTRY)
        .upsert(rows as any, { onConflict: "path" });
      if (error) throw error;

      return { upserted: rows.length, opportunities: opportunities.length };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discovery_rows"] });
      qc.invalidateQueries({ queryKey: ["combination_pages"] });
    },
  });
}

export function useUpdateDiscoveryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "candidate" | "approved" | "ignored" }) => {
      const { error } = await supabase
        .from(REGISTRY)
        .update({ discovery_status: status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["discovery_rows"] }),
  });
}
