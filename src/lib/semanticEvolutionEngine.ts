/**
 * Fase 14.2 — Semantic Evolution Engine.
 */
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export function calculateEvolutionVelocity(series: number[]): number {
  if (series.length < 2) return 0;
  const delta = series[series.length - 1] - series[0];
  return Math.round(clamp(50 + delta));
}

export function calculateSemanticMutationRate(changes: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round(clamp((changes / total) * 100));
}

export interface EvolutionConflict { key: string; severity: "low" | "medium" | "high"; }
export function detectEvolutionConflicts(entities: Array<{ key: string; overlap: number; competition: number }>): EvolutionConflict[] {
  return entities
    .map((e) => {
      const score = e.overlap * 0.5 + e.competition * 0.5;
      const severity: EvolutionConflict["severity"] = score > 65 ? "high" : score > 40 ? "medium" : "low";
      return { key: e.key, severity };
    })
    .filter((c) => c.severity !== "low");
}

export function estimateFutureDominance(authority: number, velocity: number, stability: number): number {
  return Math.round(clamp(authority * 0.5 + velocity * 0.25 + stability * 0.25));
}

export function estimateSemanticAging(daysSinceUpdate: number, decay: number): number {
  return Math.round(clamp(Math.min(100, daysSinceUpdate * 0.4) + decay * 0.4));
}

export function detectEvolutionDeadZones(entities: Array<{ key: string; daysSinceUpdate: number; growth: number }>): string[] {
  return entities.filter((e) => e.daysSinceUpdate > 120 && e.growth < 5).map((e) => e.key);
}

export interface EvolutionForecast { horizonDays: number; projectedAuthority: number; projectedDominance: number; }
export function buildEvolutionForecast(current: { authority: number; velocity: number; stability: number }, horizons: number[] = [30, 90, 180, 365]): EvolutionForecast[] {
  return horizons.map((d) => {
    const projectedAuthority = clamp(current.authority + (current.velocity - 50) * (d / 90));
    const projectedDominance = estimateFutureDominance(projectedAuthority, current.velocity, current.stability);
    return { horizonDays: d, projectedAuthority: Math.round(projectedAuthority), projectedDominance };
  });
}
