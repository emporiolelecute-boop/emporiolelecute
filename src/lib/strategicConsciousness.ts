/**
 * Fase 15.7 — Strategic Consciousness (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ConsciousnessInputs {
  awareness: number;
  clarity: number;
  coherence: number;
  identity: number;
  adaptability: number;
  perception: number;
  consistency: number;
  fragmentation: number;
  confusion: number;
  dissonance: number;
  instability: number;
  regression: number;
}

export type ConsciousnessVerdict =
  | "ENLIGHTENED" | "AWARE" | "STABLE" | "DISTORTED" | "COLLAPSING";

export interface ConsciousnessOutput {
  strategic_consciousness_score: number;
  executive_awareness_score: number;
  strategic_identity_score: number;
  perception_score: number;
  verdict: ConsciousnessVerdict;
  summary: string;
  strengths: string[];
  blindspots: string[];
  instabilitySignals: string[];
  executiveWarnings: string[];
  recommendations: string[];
}

export function calculateStrategicConsciousness(i: ConsciousnessInputs): number {
  return avg([i.awareness, i.clarity, i.coherence, i.identity, i.perception, inv(i.confusion)]);
}
export function calculateExecutiveAwareness(i: ConsciousnessInputs): number {
  return avg([i.awareness, i.clarity, i.perception, inv(i.dissonance)]);
}
export function calculateStrategicIdentity(i: ConsciousnessInputs): number {
  return avg([i.identity, i.consistency, i.coherence, inv(i.fragmentation)]);
}
export function estimateStrategicPerception(i: ConsciousnessInputs): number {
  return avg([i.perception, i.clarity, inv(i.confusion), inv(i.instability)]);
}
export function detectConsciousnessBlindspots(i: ConsciousnessInputs): string[] {
  const out: string[] = [];
  if (i.awareness < 60) out.push("Awareness operacional abaixo do limiar");
  if (i.clarity < 60) out.push("Clareza sistêmica degradada");
  if (i.perception < 60) out.push("Percepção estratégica baixa");
  if (i.identity < 55) out.push("Identidade estratégica difusa");
  return out;
}

export function buildConsciousnessVerdict(i: ConsciousnessInputs): ConsciousnessOutput {
  const consciousness = calculateStrategicConsciousness(i);
  const awareness = calculateExecutiveAwareness(i);
  const identity = calculateStrategicIdentity(i);
  const perception = estimateStrategicPerception(i);

  let verdict: ConsciousnessVerdict = "STABLE";
  if (consciousness >= 88 && awareness >= 85) verdict = "ENLIGHTENED";
  else if (consciousness >= 75) verdict = "AWARE";
  else if (consciousness >= 55) verdict = "STABLE";
  else if (consciousness >= 35) verdict = "DISTORTED";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  if (awareness >= 75) strengths.push("Executive awareness consolidado");
  if (identity >= 75) strengths.push("Identidade estratégica firme");
  if (perception >= 75) strengths.push("Percepção sistêmica nítida");

  const blindspots = detectConsciousnessBlindspots(i);

  const instabilitySignals: string[] = [];
  if (i.instability > 50) instabilitySignals.push("Instabilidade sistêmica elevada");
  if (i.fragmentation > 50) instabilitySignals.push("Fragmentação cognitiva crítica");
  if (i.dissonance > 50) instabilitySignals.push("Dissonância executiva crescente");

  const executiveWarnings: string[] = [];
  if (verdict === "DISTORTED") executiveWarnings.push("Sinais distorcidos chegando à camada executiva");
  if (verdict === "COLLAPSING") executiveWarnings.push("Risco de colapso de consciência estratégica");

  const recommendations: string[] = [];
  if (awareness < 70) recommendations.push("Revisar mecanismos de awareness executiva");
  if (identity < 70) recommendations.push("Reafirmar identidade estratégica");
  if (i.confusion > 50) recommendations.push("Compressão de sinais para reduzir confusão");

  const summary = `Consciousness=${consciousness} | Awareness=${awareness} | Identity=${identity} | Perception=${perception}`;
  return {
    strategic_consciousness_score: consciousness,
    executive_awareness_score: awareness,
    strategic_identity_score: identity,
    perception_score: perception,
    verdict,
    summary,
    strengths,
    blindspots,
    instabilitySignals,
    executiveWarnings,
    recommendations,
  };
}
