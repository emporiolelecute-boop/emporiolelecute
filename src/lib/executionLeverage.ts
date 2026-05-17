/**
 * Phase 18 — Execution Leverage Engine (pure, read-only).
 */
import type { CanonMetric, CoreMetricsCanon } from "./coreMetricsCanon";
import { calculateCompoundingPotential, estimateStrategicLeverage } from "./executiveDecisionEngine";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function calculateExecutionLeverage(canon: CoreMetricsCanon): number {
  if (!canon.metrics.length) return 0;
  const avg = canon.metrics.reduce((a, m) => a + estimateStrategicLeverage(m), 0) / canon.metrics.length;
  return clamp(avg);
}

export interface LowLeverageItem { metric: string; leverage: number; reason: string }

export function detectLowLeverageExecution(canon: CoreMetricsCanon): LowLeverageItem[] {
  return canon.metrics
    .map((m) => ({ metric: m.name, leverage: estimateStrategicLeverage(m), m }))
    .filter((x) => x.leverage < 45)
    .map((x) => ({ metric: x.metric, leverage: x.leverage, reason: `Low weight ${x.m.weight} / impact ${x.m.executiveImpact}` }))
    .sort((a, b) => a.leverage - b.leverage);
}

export function estimateCompoundingAuthority(canon: CoreMetricsCanon): number {
  const authority = canon.metrics.filter((m) => m.domains.includes("trust") || m.domains.includes("convergence"));
  if (!authority.length) return 0;
  const avg = authority.reduce((a, m) => a + calculateCompoundingPotential(m), 0) / authority.length;
  return clamp(avg);
}

export function estimateSemanticCompounding(canon: CoreMetricsCanon): number {
  const sem = canon.metrics.filter((m) => m.domains.includes("coherence") || m.domains.includes("consistency"));
  if (!sem.length) return 0;
  const avg = sem.reduce((a, m) => a + calculateCompoundingPotential(m), 0) / sem.length;
  return clamp(avg);
}

export function estimateLongTermStrategicValue(canon: CoreMetricsCanon): number {
  const authority = estimateCompoundingAuthority(canon);
  const semantic = estimateSemanticCompounding(canon);
  const leverage = calculateExecutionLeverage(canon);
  return clamp(authority * 0.4 + semantic * 0.3 + leverage * 0.3);
}

export interface WasteItem { metric: string; waste_score: number; reason: string }

export function detectExecutionWaste(canon: CoreMetricsCanon): WasteItem[] {
  return canon.metrics
    .filter((m: CanonMetric) => m.redundancy >= 60 || m.category === "DEPRECATED")
    .map((m) => ({
      metric: m.name,
      waste_score: clamp(m.redundancy * 0.7 + (100 - m.executiveImpact) * 0.3),
      reason: m.category === "DEPRECATED" ? "Deprecated" : "High semantic redundancy",
    }))
    .sort((a, b) => b.waste_score - a.waste_score);
}
