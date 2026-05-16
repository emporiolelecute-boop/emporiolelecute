/**
 * Fase 14.2 — Singularity Engine.
 * Read-only diagnostics. No side effects on public SEO.
 */
export interface SingularityInputs {
  authorityAvg: number;
  connectivity: number;
  coherence: number;
  compounding: number;
  stability: number;
  hubs: Array<{ key: string; weight: number; output: number }>;
}

export interface SingularityResult {
  score: number;
  convergence: number;
  compoundAuthority: number;
  structuralCoherence: number;
}

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export function calculateStrategicSingularity(i: SingularityInputs): SingularityResult {
  const convergence = clamp((i.connectivity + i.coherence) / 2);
  const compoundAuthority = clamp((i.authorityAvg + i.compounding) / 2);
  const structuralCoherence = clamp((i.coherence + i.stability) / 2);
  const score = Math.round(
    convergence * 0.3 + compoundAuthority * 0.35 + structuralCoherence * 0.2 + i.stability * 0.15
  );
  return { score, convergence: Math.round(convergence), compoundAuthority: Math.round(compoundAuthority), structuralCoherence: Math.round(structuralCoherence) };
}

export interface GravityCenter { key: string; weight: number; concentration: number; critical: boolean; }
export function detectSemanticGravityCenters(hubs: SingularityInputs["hubs"]): GravityCenter[] {
  const total = hubs.reduce((a, h) => a + h.weight, 0) || 1;
  return hubs.map((h) => {
    const concentration = Math.round((h.weight / total) * 100);
    return { key: h.key, weight: h.weight, concentration, critical: concentration > 35 };
  }).sort((a, b) => b.concentration - a.concentration);
}

export interface Blackhole { key: string; effortRatio: number; severity: "low" | "medium" | "high"; }
export function detectStrategicBlackholes(hubs: SingularityInputs["hubs"]): Blackhole[] {
  return hubs
    .map((h) => {
      const effortRatio = h.output > 0 ? h.weight / h.output : h.weight * 2;
      const severity: Blackhole["severity"] = effortRatio > 3 ? "high" : effortRatio > 1.5 ? "medium" : "low";
      return { key: h.key, effortRatio: Math.round(effortRatio * 100) / 100, severity };
    })
    .filter((b) => b.severity !== "low");
}

export function calculateAdaptiveIntelligence(i: { recoverySpeed: number; reactionSpeed: number; evolution: number; stability: number; }): number {
  return Math.round(clamp(i.recoverySpeed * 0.3 + i.reactionSpeed * 0.25 + i.evolution * 0.25 + i.stability * 0.2));
}

export function detectEvolutionPlateau(growthSeries: number[]): { plateau: boolean; trend: number } {
  if (growthSeries.length < 3) return { plateau: false, trend: 0 };
  const recent = growthSeries.slice(-3);
  const trend = recent[recent.length - 1] - recent[0];
  return { plateau: Math.abs(trend) < 2, trend: Math.round(trend * 100) / 100 };
}

export function detectSemanticInstability(i: { volatility: number; drift: number; entropy: number }): number {
  return Math.round(clamp(i.volatility * 0.4 + i.drift * 0.3 + i.entropy * 0.3));
}

export type SingularityVerdict = "Transcendent" | "Dominant" | "Advanced" | "Stable" | "Fragile" | "Degrading" | "Critical";
export function buildSingularityVerdict(score: number, instability: number): SingularityVerdict {
  if (instability > 70) return "Critical";
  if (instability > 55) return "Degrading";
  if (score >= 90) return "Transcendent";
  if (score >= 78) return "Dominant";
  if (score >= 65) return "Advanced";
  if (score >= 50) return "Stable";
  return "Fragile";
}
