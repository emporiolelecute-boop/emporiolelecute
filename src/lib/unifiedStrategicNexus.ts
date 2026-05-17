/**
 * Fase 16.0 — Unified Strategic Nexus (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface NexusInputs {
  governance: number;
  consciousness: number;
  reality: number;
  continuity: number;
  executive: number;
  fabric: number;
  resilience: number;
  semantic: number;
  fragmentation: number;
  instability: number;
  divergence: number;
  entropy: number;
}

export type NexusVerdict =
  | "OMNIFIED" | "UNIFIED" | "STABLE" | "FRAGMENTED" | "COLLAPSING";

export interface NexusOutput {
  unified_nexus_score: number;
  strategic_unification_score: number;
  systemic_harmony_score: number;
  unified_resilience_score: number;
  verdict: NexusVerdict;
  summary: string;
  strengths: string[];
  fragmentationSignals: string[];
  instabilityVectors: string[];
  executiveWarnings: string[];
  recommendations: string[];
}

export function calculateUnifiedNexus(i: NexusInputs): number {
  return avg([
    i.governance, i.consciousness, i.reality, i.continuity, i.executive,
    i.fabric, i.resilience, i.semantic,
    inv(i.fragmentation), inv(i.entropy),
  ]);
}
export function calculateStrategicUnification(i: NexusInputs): number {
  return avg([i.governance, i.executive, i.continuity, i.semantic, inv(i.divergence)]);
}
export function calculateSystemicHarmony(i: NexusInputs): number {
  return avg([i.fabric, i.consciousness, i.continuity, i.resilience, inv(i.instability)]);
}
export function detectSystemicFragmentation(i: NexusInputs): string[] {
  const out: string[] = [];
  if (i.fragmentation > 45) out.push("Fragmentação sistêmica detectada");
  if (i.divergence > 45) out.push("Divergência semântica entre camadas");
  if (i.entropy > 50) out.push("Entropia executiva em ascensão");
  return out;
}
export function estimateUnifiedResilience(i: NexusInputs): number {
  return avg([i.resilience, i.continuity, i.fabric, inv(i.instability), inv(i.entropy)]);
}

export function buildNexusVerdict(i: NexusInputs): NexusOutput {
  const nexus = calculateUnifiedNexus(i);
  const unification = calculateStrategicUnification(i);
  const harmony = calculateSystemicHarmony(i);
  const resilience = estimateUnifiedResilience(i);

  let verdict: NexusVerdict = "STABLE";
  if (nexus >= 88 && unification >= 85) verdict = "OMNIFIED";
  else if (nexus >= 75) verdict = "UNIFIED";
  else if (nexus >= 55) verdict = "STABLE";
  else if (nexus >= 35) verdict = "FRAGMENTED";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  if (unification >= 75) strengths.push("Unificação estratégica robusta");
  if (harmony >= 75) strengths.push("Harmonia sistêmica consistente");
  if (resilience >= 75) strengths.push("Resiliência unificada sustentada");

  const fragmentationSignals = detectSystemicFragmentation(i);

  const instabilityVectors: string[] = [];
  if (i.instability > 45) instabilityVectors.push("Instabilidade estratégica recorrente");
  if (i.divergence > 45) instabilityVectors.push("Divergência operacional entre camadas");

  const executiveWarnings: string[] = [];
  if (verdict === "FRAGMENTED") executiveWarnings.push("Camadas estratégicas desalinhadas");
  if (verdict === "COLLAPSING") executiveWarnings.push("Risco crítico de colapso sistêmico");

  const recommendations: string[] = [];
  if (i.fragmentation > 40) recommendations.push("Consolidar camadas fragmentadas");
  if (i.entropy > 45) recommendations.push("Reduzir entropia executiva acumulada");
  if (i.divergence > 40) recommendations.push("Realinhar narrativa entre camadas");

  return {
    unified_nexus_score: nexus,
    strategic_unification_score: unification,
    systemic_harmony_score: harmony,
    unified_resilience_score: resilience,
    verdict,
    summary: `Nexus=${nexus} | Unification=${unification} | Harmony=${harmony}`,
    strengths,
    fragmentationSignals,
    instabilityVectors,
    executiveWarnings,
    recommendations,
  };
}
