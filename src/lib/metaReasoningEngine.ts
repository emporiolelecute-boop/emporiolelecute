/**
 * Phase 15.4 — Meta-Reasoning Engine.
 * Pure read-only helpers. No side effects.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (...xs: number[]) => {
  const v = xs.filter((x) => Number.isFinite(x));
  return v.length === 0 ? 0 : v.reduce((a, b) => a + b, 0) / v.length;
};

export type MetaReasoningVerdict =
  | "OMNISCIENT"
  | "HYPER_COHERENT"
  | "COHERENT"
  | "UNSTABLE"
  | "FRAGMENTED"
  | "DELUSIONAL";

export interface MetaReasoningInputs {
  cognitiveStability: number;
  decisionSynthesis: number;
  reasoningIntegrity: number;
  orchestrationAlignment: number;
  consensus: number;
  explainability: number;
  observability: number;
  noise: number;
  fragmentation: number;
  contradictionPressure: number;
  conflictDensity: number;
  cognitiveLoad: number;
  decayRisk: number;
  authorityBalance: number;
  semanticStability: number;
  governanceScore: number;
  strategicCoherence: number;
}

export interface MetaReasoning {
  meta_reasoning_score: number;
  strategic_self_awareness_score: number;
  systemic_reflection_score: number;
  cognitive_integrity_score: number;
  reasoning_reliability_score: number;
  decision_reliability_score: number;
  forecast_reliability_score: number;
  reasoning_weakness_score: number;
  reasoning_instability_score: number;
  strategic_hallucination_risk: number;
  contradiction_risk_score: number;
  verdict: MetaReasoningVerdict;
  drivers: string[];
}

export function calculateMetaReasoningScore(i: MetaReasoningInputs): number {
  const positive = avg(
    i.cognitiveStability, i.decisionSynthesis, i.reasoningIntegrity,
    i.orchestrationAlignment, i.consensus, i.explainability, i.observability,
  );
  const penalty = avg(i.noise, i.fragmentation, i.contradictionPressure, i.conflictDensity) * 0.5;
  return clamp(positive - penalty);
}

export function calculateStrategicSelfAwareness(i: MetaReasoningInputs): number {
  return clamp(
    i.explainability * 0.4 + i.observability * 0.3 + i.consensus * 0.2 -
      i.contradictionPressure * 0.2 - i.conflictDensity * 0.1,
  );
}

export function calculateSystemicReflection(i: MetaReasoningInputs): number {
  return clamp(
    i.observability * 0.5 + i.explainability * 0.3 + i.reasoningIntegrity * 0.2 -
      i.noise * 0.15,
  );
}

export function calculateCognitiveIntegrity(i: MetaReasoningInputs): number {
  return clamp(
    avg(i.cognitiveStability, i.reasoningIntegrity, i.decisionSynthesis) -
      avg(i.fragmentation, i.noise) * 0.4,
  );
}

export function calculateReasoningReliability(i: MetaReasoningInputs): number {
  return clamp(
    i.reasoningIntegrity * 0.4 + i.consensus * 0.3 + i.explainability * 0.3 -
      i.conflictDensity * 0.2,
  );
}

export function calculateDecisionReliability(i: MetaReasoningInputs): number {
  return clamp(
    i.decisionSynthesis * 0.5 + i.consensus * 0.3 + (100 - i.contradictionPressure) * 0.2,
  );
}

export function calculateForecastReliability(i: MetaReasoningInputs): number {
  return clamp(
    i.semanticStability * 0.3 + i.authorityBalance * 0.2 +
      i.strategicCoherence * 0.3 + i.observability * 0.2 -
      i.decayRisk * 0.2,
  );
}

export function detectReasoningWeakness(i: MetaReasoningInputs): number {
  return clamp(
    avg(100 - i.consensus, 100 - i.explainability, i.fragmentation, i.noise),
  );
}

export function detectReasoningInstability(i: MetaReasoningInputs): number {
  return clamp(
    avg(i.noise, i.fragmentation, i.contradictionPressure, i.cognitiveLoad),
  );
}

export function detectStrategicHallucination(i: MetaReasoningInputs): number {
  // false confidence: high synthesis with low explainability/observability
  const falseConfidence = Math.max(
    0,
    i.decisionSynthesis - avg(i.explainability, i.observability),
  );
  return clamp(falseConfidence * 0.7 + i.contradictionPressure * 0.3);
}

export function detectCognitiveContradictions(i: MetaReasoningInputs): number {
  return clamp(i.conflictDensity * 0.6 + i.contradictionPressure * 0.4);
}

export function buildMetaReasoningVerdict(o: {
  meta: number;
  awareness: number;
  reliability: number;
  hallucination: number;
  contradiction: number;
  instability: number;
}): MetaReasoningVerdict {
  if (o.hallucination >= 70 || o.contradiction >= 75) return "DELUSIONAL";
  if (o.instability >= 65) return "FRAGMENTED";
  if (o.reliability < 45 || o.meta < 40) return "UNSTABLE";
  if (o.meta >= 90 && o.awareness >= 85 && o.reliability >= 85) return "OMNISCIENT";
  if (o.meta >= 75 && o.awareness >= 70) return "HYPER_COHERENT";
  return "COHERENT";
}

export function buildMetaReasoning(i: MetaReasoningInputs): MetaReasoning {
  const meta = calculateMetaReasoningScore(i);
  const awareness = calculateStrategicSelfAwareness(i);
  const reflection = calculateSystemicReflection(i);
  const integrity = calculateCognitiveIntegrity(i);
  const reasoningReliability = calculateReasoningReliability(i);
  const decisionReliability = calculateDecisionReliability(i);
  const forecastReliability = calculateForecastReliability(i);
  const weakness = detectReasoningWeakness(i);
  const instability = detectReasoningInstability(i);
  const hallucination = detectStrategicHallucination(i);
  const contradiction = detectCognitiveContradictions(i);
  const reliability = avg(reasoningReliability, decisionReliability, forecastReliability);
  const verdict = buildMetaReasoningVerdict({
    meta, awareness, reliability, hallucination, contradiction, instability,
  });
  const drivers: string[] = [];
  if (hallucination >= 55) drivers.push("Risco de alucinação estratégica");
  if (contradiction >= 55) drivers.push("Contradições sistêmicas detectadas");
  if (instability >= 55) drivers.push("Raciocínio instável");
  if (awareness < 50) drivers.push("Baixa autoconsciência estratégica");
  if (i.explainability < 50) drivers.push("Baixa explicabilidade");
  return {
    meta_reasoning_score: meta,
    strategic_self_awareness_score: awareness,
    systemic_reflection_score: reflection,
    cognitive_integrity_score: integrity,
    reasoning_reliability_score: reasoningReliability,
    decision_reliability_score: decisionReliability,
    forecast_reliability_score: forecastReliability,
    reasoning_weakness_score: weakness,
    reasoning_instability_score: instability,
    strategic_hallucination_risk: hallucination,
    contradiction_risk_score: contradiction,
    verdict,
    drivers,
  };
}
