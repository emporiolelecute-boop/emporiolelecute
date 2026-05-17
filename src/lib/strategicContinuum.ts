/**
 * Fase 15.9 — Strategic Continuum (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ContinuumInputs {
  continuity: number;
  persistence: number;
  longevity: number;
  resilience: number;
  semantic: number;
  authority: number;
  entropy: number;
  decay: number;
  fragmentation: number;
  instability: number;
}

export type ContinuumVerdict =
  | "PERENNIAL" | "ENDURING" | "STABLE" | "FRACTURING" | "COLLAPSING";

export interface ContinuumOutput {
  strategic_continuum_score: number;
  strategic_longevity_score: number;
  continuity_strength_score: number;
  persistence_capacity_score: number;
  verdict: ContinuumVerdict;
  summary: string;
  strengths: string[];
  persistenceSignals: string[];
  decaySignals: string[];
  continuityWarnings: string[];
  recommendations: string[];
}

export function calculateStrategicContinuum(i: ContinuumInputs): number {
  return avg([
    i.continuity, i.persistence, i.resilience, i.semantic, i.authority,
    inv(i.entropy), inv(i.decay),
  ]);
}
export function calculateStrategicLongevity(i: ContinuumInputs): number {
  return avg([i.longevity, i.persistence, i.resilience, inv(i.decay), inv(i.entropy)]);
}
export function estimateContinuityStrength(i: ContinuumInputs): number {
  return avg([i.continuity, i.semantic, i.authority, inv(i.fragmentation), inv(i.instability)]);
}
export function detectContinuityWeakness(i: ContinuumInputs): string[] {
  const out: string[] = [];
  if (i.fragmentation > 45) out.push("Fragmentação de autoridade detectada");
  if (i.instability > 45) out.push("Instabilidade semântica persistente");
  if (i.decay > 50) out.push("Decaimento de execução acumulado");
  if (i.entropy > 55) out.push("Entropia sistêmica em ascensão");
  return out;
}
export function estimatePersistenceCapacity(i: ContinuumInputs): number {
  return avg([i.persistence, i.longevity, i.resilience, inv(i.entropy)]);
}

export function buildContinuumVerdict(i: ContinuumInputs): ContinuumOutput {
  const cont = calculateStrategicContinuum(i);
  const longevity = calculateStrategicLongevity(i);
  const strength = estimateContinuityStrength(i);
  const persistence = estimatePersistenceCapacity(i);

  let verdict: ContinuumVerdict = "STABLE";
  if (cont >= 88 && longevity >= 85) verdict = "PERENNIAL";
  else if (cont >= 75) verdict = "ENDURING";
  else if (cont >= 55) verdict = "STABLE";
  else if (cont >= 35) verdict = "FRACTURING";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  if (longevity >= 75) strengths.push("Longevidade estratégica robusta");
  if (strength >= 75) strengths.push("Força de continuidade consistente");
  if (i.resilience >= 75) strengths.push("Resiliência contínua sustentada");

  const persistenceSignals: string[] = [];
  if (i.persistence >= 70) persistenceSignals.push("Persistência operacional alta");
  if (i.semantic >= 70) persistenceSignals.push("Continuidade semântica preservada");

  const decaySignals: string[] = [];
  if (i.decay > 45) decaySignals.push("Decaimento gradual de execução");
  if (i.entropy > 50) decaySignals.push("Entropia em acumulação");

  const continuityWarnings = detectContinuityWeakness(i);

  const recommendations: string[] = [];
  if (i.entropy > 50) recommendations.push("Recalibrar processos contra entropia acumulada");
  if (i.fragmentation > 45) recommendations.push("Consolidar autoridade fragmentada");
  if (i.decay > 45) recommendations.push("Investir em durabilidade operacional");

  return {
    strategic_continuum_score: cont,
    strategic_longevity_score: longevity,
    continuity_strength_score: strength,
    persistence_capacity_score: persistence,
    verdict,
    summary: `Continuum=${cont} | Longevity=${longevity} | Strength=${strength}`,
    strengths,
    persistenceSignals,
    decaySignals,
    continuityWarnings,
    recommendations,
  };
}
