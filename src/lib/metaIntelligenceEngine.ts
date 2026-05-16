/**
 * Fase 14.3 — Meta Intelligence Engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface BlindspotSignal { key: string; severity: "low" | "medium" | "high"; note: string; }

export function calculateMetaIntelligence(t: TelemetrySnapshot): number {
  return clamp(
    (t.adaptive_intelligence_score * 0.3) +
    (t.strategic_singularity_score * 0.2) +
    (t.knowledge_health_score * 0.2) +
    (t.strategic_alignment_score * 0.15) +
    (100 - t.semantic_entropy_score) * 0.15,
  );
}

export function detectStrategicBlindspots(t: TelemetrySnapshot): BlindspotSignal[] {
  const out: BlindspotSignal[] = [];
  if (t.orphan_entities > 5) out.push({ key: "orphans", severity: "high", note: `${t.orphan_entities} entidades órfãs` });
  if (t.content_gap_count > 10) out.push({ key: "gaps", severity: "medium", note: `${t.content_gap_count} gaps de conteúdo` });
  if (t.fragile_cluster_count > 3) out.push({ key: "fragile", severity: "high", note: `${t.fragile_cluster_count} clusters frágeis` });
  if (t.under_monetized_score > 60) out.push({ key: "monetization", severity: "medium", note: "Subutilização comercial" });
  if (t.strategic_blackhole_score > 50) out.push({ key: "blackhole", severity: "high", note: "Blackholes estratégicos detectados" });
  return out;
}

export function detectFalseGrowthSignals(t: TelemetrySnapshot): number {
  const fakeGrowth = Math.max(0, t.momentum_growth_score - t.semantic_stability_score);
  return clamp(fakeGrowth + t.semantic_noise_score * 0.2);
}

export function detectSemanticHallucinations(t: TelemetrySnapshot): number {
  return clamp((t.meaning_dilution_score * 0.5) + (t.semantic_noise_score * 0.3) + (t.semantic_entropy_score * 0.2));
}

export function detectStrategicNoise(t: TelemetrySnapshot): number {
  return clamp((t.execution_noise_score * 0.5) + (t.operational_waste_score * 0.3) + (t.fragmentation_score * 0.2));
}

export function calculateStrategicPerception(t: TelemetrySnapshot): number {
  const noise = detectStrategicNoise(t);
  const hallucination = detectSemanticHallucinations(t);
  return clamp(100 - (noise * 0.5 + hallucination * 0.5));
}

export interface MetaIntelligenceMap {
  meta: number;
  perception: number;
  noise: number;
  hallucination: number;
  falseGrowth: number;
  blindspots: BlindspotSignal[];
}

export function buildMetaIntelligenceMap(t: TelemetrySnapshot): MetaIntelligenceMap {
  return {
    meta: calculateMetaIntelligence(t),
    perception: calculateStrategicPerception(t),
    noise: detectStrategicNoise(t),
    hallucination: detectSemanticHallucinations(t),
    falseGrowth: detectFalseGrowthSignals(t),
    blindspots: detectStrategicBlindspots(t),
  };
}
