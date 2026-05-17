/**
 * Phase 15.3 — Cognitive Orchestration Engine.
 * Pure read-only helpers. No side effects.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

const avg = (...xs: number[]) => {
  const v = xs.filter((x) => Number.isFinite(x));
  return v.length === 0 ? 0 : v.reduce((a, b) => a + b, 0) / v.length;
};

export type CognitiveVerdict =
  | "TRANSCENDENT"
  | "SYNCHRONIZED"
  | "STABLE"
  | "NOISY"
  | "FRAGMENTED"
  | "COLLAPSING";

export interface OrchestrationInputs {
  // Signal sources (0..100)
  strategicCoherence: number;
  operationalScore: number;
  semanticStability: number;
  authorityBalance: number;
  governanceScore: number;
  // Noise / risk (0..100, higher = worse)
  fragmentation: number;
  noise: number;
  contradictionPressure: number;
  conflictDensity: number;
  // Observability / consensus (0..100)
  observability: number;
  consensus: number;
  explainability: number;
  // Pressure (0..100, higher = worse)
  cognitiveLoad: number;
  decayRisk: number;
}

export interface CognitiveOrchestration {
  cognitive_stability_score: number;
  decision_synthesis_score: number;
  systemic_reasoning_score: number;
  orchestration_efficiency: number;
  orchestration_fragmentation: number;
  orchestration_noise: number;
  orchestration_alignment: number;
  orchestration_entropy: number;
  verdict: CognitiveVerdict;
  drivers: string[];
}

export function calculateStrategicSignalClarity(i: OrchestrationInputs): number {
  return clamp(i.strategicCoherence * 0.6 + (100 - i.contradictionPressure) * 0.4);
}
export function calculateOperationalSignalClarity(i: OrchestrationInputs): number {
  return clamp(i.operationalScore * 0.6 + (100 - i.noise) * 0.4);
}
export function calculateSemanticSignalClarity(i: OrchestrationInputs): number {
  return clamp(i.semanticStability * 0.6 + (100 - i.fragmentation) * 0.4);
}
export function calculateAuthoritySignalClarity(i: OrchestrationInputs): number {
  return clamp(i.authorityBalance * 0.7 + i.consensus * 0.3);
}

export function calculateCognitiveStability(i: OrchestrationInputs): number {
  const positive = avg(
    i.strategicCoherence, i.operationalScore, i.semanticStability,
    i.authorityBalance, i.governanceScore,
  );
  const penalty = avg(i.fragmentation, i.noise, i.contradictionPressure) * 0.5;
  return clamp(positive - penalty);
}

export function calculateDecisionSynthesis(i: OrchestrationInputs): number {
  return clamp(
    avg(
      calculateStrategicSignalClarity(i),
      calculateOperationalSignalClarity(i),
      calculateSemanticSignalClarity(i),
      calculateAuthoritySignalClarity(i),
    ) * 0.7 +
      i.explainability * 0.3,
  );
}

export function calculateReasoningIntegrity(i: OrchestrationInputs): number {
  return clamp(
    i.observability * 0.35 + i.explainability * 0.35 + i.consensus * 0.3 -
      i.conflictDensity * 0.2,
  );
}

export function detectCognitiveNoise(i: OrchestrationInputs): number {
  return clamp(avg(i.noise, i.fragmentation, i.contradictionPressure, i.conflictDensity));
}
export function detectReasoningFragmentation(i: OrchestrationInputs): number {
  return clamp(i.fragmentation * 0.6 + (100 - i.consensus) * 0.4);
}
export function detectSignalConflicts(i: OrchestrationInputs): number {
  return clamp(i.conflictDensity * 0.7 + i.contradictionPressure * 0.3);
}
export function detectStrategicConfusion(i: OrchestrationInputs): number {
  return clamp(i.contradictionPressure * 0.5 + (100 - i.strategicCoherence) * 0.5);
}
export function detectAuthorityConfusion(i: OrchestrationInputs): number {
  return clamp((100 - i.authorityBalance) * 0.6 + (100 - i.consensus) * 0.4);
}
export function detectGovernanceConfusion(i: OrchestrationInputs): number {
  return clamp((100 - i.governanceScore) * 0.6 + i.contradictionPressure * 0.4);
}

export function buildCognitiveVerdict(o: {
  stability: number;
  synthesis: number;
  noise: number;
  fragmentation: number;
  collapseRisk: number;
}): CognitiveVerdict {
  if (o.collapseRisk >= 70 || o.stability < 25) return "COLLAPSING";
  if (o.fragmentation >= 65) return "FRAGMENTED";
  if (o.noise >= 60) return "NOISY";
  if (o.stability >= 85 && o.synthesis >= 85) return "TRANSCENDENT";
  if (o.stability >= 70 && o.synthesis >= 70) return "SYNCHRONIZED";
  return "STABLE";
}

export function buildCognitiveOrchestration(i: OrchestrationInputs): CognitiveOrchestration {
  const stability = calculateCognitiveStability(i);
  const synthesis = calculateDecisionSynthesis(i);
  const reasoning = calculateReasoningIntegrity(i);
  const noise = detectCognitiveNoise(i);
  const fragmentation = detectReasoningFragmentation(i);
  const alignment = clamp(i.consensus * 0.6 + (100 - i.contradictionPressure) * 0.4);
  const efficiency = clamp(synthesis * 0.6 + reasoning * 0.4 - noise * 0.2);
  const entropy = clamp((noise + fragmentation + i.cognitiveLoad) / 3);
  const verdict = buildCognitiveVerdict({
    stability, synthesis, noise, fragmentation, collapseRisk: i.decayRisk,
  });
  const drivers: string[] = [];
  if (noise >= 55) drivers.push("Ruído analítico elevado");
  if (fragmentation >= 55) drivers.push("Fragmentação de raciocínio");
  if (i.contradictionPressure >= 55) drivers.push("Pressão de contradição estratégica");
  if (i.explainability < 50) drivers.push("Baixa explicabilidade");
  if (i.consensus < 50) drivers.push("Consenso fraco entre engines");
  return {
    cognitive_stability_score: stability,
    decision_synthesis_score: synthesis,
    systemic_reasoning_score: reasoning,
    orchestration_efficiency: efficiency,
    orchestration_fragmentation: fragmentation,
    orchestration_noise: noise,
    orchestration_alignment: alignment,
    orchestration_entropy: entropy,
    verdict,
    drivers,
  };
}
