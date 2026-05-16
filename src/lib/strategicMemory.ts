/**
 * Fase 13.1 — Strategic Memory.
 * Persistência manual de snapshots estratégicos (admin).
 */

import { supabase } from "@/integrations/supabase/client";

export interface StrategicSnapshotInput {
  entity_type: string;
  entity_id: string;
  authority_score?: number;
  readiness_score?: number;
  semantic_coverage?: number;
  business_intent_score?: number;
  conversion_potential?: number;
  editorial_depth?: number;
  internal_link_strength?: number;
  review_strength?: number;
  decay_score?: number;
  cannibalization_risk?: string;
  regression_risk?: string;
  strategic_value?: number;
  execution_priority?: number;
  notes?: string;
}

export interface ClusterSnapshotInput {
  cluster_key: string;
  total_entities?: number;
  avg_authority?: number;
  avg_readiness?: number;
  avg_roi?: number;
  avg_conversion?: number;
  orphan_rate?: number;
  concentration_risk?: number;
  saturation_score?: number;
  growth_velocity?: number;
  decline_velocity?: number;
}

export async function recordStrategicSnapshot(input: StrategicSnapshotInput) {
  return supabase.from("seo_strategy_memory").insert(input as any).select().maybeSingle();
}

export async function recordClusterSnapshot(input: ClusterSnapshotInput) {
  return supabase.from("seo_cluster_memory").insert(input as any).select().maybeSingle();
}

export async function buildStrategicTimeline(entity_type: string, entity_id: string, limit = 30) {
  return supabase
    .from("seo_strategy_memory")
    .select("*")
    .eq("entity_type", entity_type)
    .eq("entity_id", entity_id)
    .order("snapshot_date", { ascending: false })
    .limit(limit);
}

export interface StrategicMoment {
  authority_score: number;
  readiness_score: number;
  strategic_value: number;
  snapshot_date: string;
}

export function compareStrategicMoments(a: StrategicMoment, b: StrategicMoment) {
  return {
    authority_delta: (b.authority_score ?? 0) - (a.authority_score ?? 0),
    readiness_delta: (b.readiness_score ?? 0) - (a.readiness_score ?? 0),
    strategic_delta: (b.strategic_value ?? 0) - (a.strategic_value ?? 0),
  };
}

export function detectMomentumGain(timeline: StrategicMoment[]): boolean {
  if (timeline.length < 2) return false;
  const recent = timeline.slice(0, 3).reduce((s, m) => s + (m.strategic_value ?? 0), 0) / Math.min(3, timeline.length);
  const older = timeline.slice(-3).reduce((s, m) => s + (m.strategic_value ?? 0), 0) / Math.min(3, timeline.length);
  return recent - older > 5;
}

export function detectMomentumLoss(timeline: StrategicMoment[]): boolean {
  if (timeline.length < 2) return false;
  const recent = timeline.slice(0, 3).reduce((s, m) => s + (m.strategic_value ?? 0), 0) / Math.min(3, timeline.length);
  const older = timeline.slice(-3).reduce((s, m) => s + (m.strategic_value ?? 0), 0) / Math.min(3, timeline.length);
  return older - recent > 5;
}

export function calculateExecutionConsistency(timeline: StrategicMoment[]): number {
  if (timeline.length < 2) return 0;
  const deltas: number[] = [];
  for (let i = 1; i < timeline.length; i++) {
    deltas.push(Math.abs((timeline[i - 1].strategic_value ?? 0) - (timeline[i].strategic_value ?? 0)));
  }
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return Math.max(0, Math.min(100, Math.round(100 - avg * 2)));
}
