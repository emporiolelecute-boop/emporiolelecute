/**
 * Fase 12 — SEO Memory Layer.
 *
 * Persistência de snapshots por entidade. Apenas leitura/escrita explícita
 * via painel admin; não roda automaticamente.
 */
import { supabase } from "@/integrations/supabase/client";

export interface EntitySnapshotInput {
  entity_type: string;
  entity_id: string;
  entity_slug?: string;
  entity_name?: string;
  authority_score?: number;
  maturity_score?: number;
  readiness_score?: number;
  topical_coverage?: number;
  internal_links_count?: number;
  reviews_count?: number;
  faq_count?: number;
  editorial_size?: number;
  semantic_connectivity?: number;
  orphan_risk?: boolean;
  cannibalization_risk?: string;
  thin_content_risk?: boolean;
  metadata?: Record<string, any>;
}

export interface EntitySnapshotRow extends EntitySnapshotInput {
  id: string;
  snapshot_date: string;
  created_at: string;
}

export async function recordSeoSnapshot(input: EntitySnapshotInput): Promise<{ id?: string; error?: string }> {
  const { data, error } = await (supabase as any)
    .from("seo_entity_snapshots")
    .insert(input)
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: data?.id };
}

export async function recordSeoSnapshotBatch(items: EntitySnapshotInput[]): Promise<{ inserted: number; error?: string }> {
  if (!items.length) return { inserted: 0 };
  const { error, count } = await (supabase as any)
    .from("seo_entity_snapshots")
    .insert(items, { count: "exact" });
  if (error) return { inserted: 0, error: error.message };
  return { inserted: count ?? items.length };
}

export async function buildEntityTimeline(entityType: string, entityId: string, limit = 60): Promise<EntitySnapshotRow[]> {
  const { data, error } = await (supabase as any)
    .from("seo_entity_snapshots")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("snapshot_date", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []).reverse() as EntitySnapshotRow[];
}

export interface SnapshotDelta {
  metric: keyof EntitySnapshotInput;
  before: number;
  after: number;
  delta: number;
  direction: "up" | "down" | "flat";
}

const NUMERIC_KEYS: (keyof EntitySnapshotInput)[] = [
  "authority_score", "maturity_score", "readiness_score",
  "topical_coverage", "internal_links_count", "reviews_count",
  "faq_count", "editorial_size", "semantic_connectivity",
];

export function compareSnapshots(a: EntitySnapshotRow, b: EntitySnapshotRow): SnapshotDelta[] {
  return NUMERIC_KEYS.map((k) => {
    const before = Number(a[k] ?? 0);
    const after  = Number(b[k] ?? 0);
    const delta = after - before;
    return {
      metric: k, before, after, delta,
      direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
    };
  });
}

export function detectPositiveTrend(timeline: EntitySnapshotRow[]): boolean {
  if (timeline.length < 3) return false;
  const first = timeline[0].authority_score ?? 0;
  const last = timeline[timeline.length - 1].authority_score ?? 0;
  return last - first >= 5;
}

export function detectRegressionRisk(timeline: EntitySnapshotRow[]): { risk: "none" | "low" | "high"; reasons: string[] } {
  if (timeline.length < 2) return { risk: "none", reasons: [] };
  const first = timeline[0];
  const last  = timeline[timeline.length - 1];
  const reasons: string[] = [];
  if ((last.authority_score ?? 0) < (first.authority_score ?? 0) - 5)        reasons.push("Queda de autoridade");
  if ((last.internal_links_count ?? 0) < (first.internal_links_count ?? 0))  reasons.push("Perda de links internos");
  if ((last.reviews_count ?? 0) < (first.reviews_count ?? 0))                reasons.push("Queda de reviews");
  if ((last.topical_coverage ?? 0) < (first.topical_coverage ?? 0) - 5)      reasons.push("Queda de cobertura");
  if ((last.thin_content_risk && !first.thin_content_risk))                  reasons.push("Surgiu risco de thin content");
  return { risk: reasons.length >= 2 ? "high" : reasons.length === 1 ? "low" : "none", reasons };
}
