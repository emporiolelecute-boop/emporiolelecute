/**
 * Fase 15.8 — Strategic Reality (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface RealityInputs {
  truthAlignment: number;
  authenticity: number;
  grounding: number;
  credibility: number;
  coherence: number;
  consistency: number;
  illusion: number;
  selfDeception: number;
  distortion: number;
  fiction: number;
}

export type RealityVerdict =
  | "TRUE_NORTH" | "GROUNDED" | "STABLE" | "DISTORTED" | "DETACHED";

export interface RealityOutput {
  strategic_reality_score: number;
  strategic_authenticity_score: number;
  truth_alignment_score: number;
  verdict: RealityVerdict;
  summary: string;
  strengths: string[];
  distortions: string[];
  illusionSignals: string[];
  operationalWarnings: string[];
  recommendations: string[];
}

export function calculateStrategicReality(i: RealityInputs): number {
  return avg([i.truthAlignment, i.grounding, i.coherence, i.consistency, inv(i.illusion), inv(i.distortion)]);
}
export function calculateStrategicAuthenticity(i: RealityInputs): number {
  return avg([i.authenticity, i.credibility, i.consistency, inv(i.selfDeception)]);
}
export function estimateTruthAlignment(i: RealityInputs): number {
  return avg([i.truthAlignment, i.grounding, i.coherence, inv(i.fiction)]);
}
export function detectRealityDistortion(i: RealityInputs): string[] {
  const out: string[] = [];
  if (i.distortion > 50) out.push("Distorção semântica elevada");
  if (i.illusion > 50) out.push("Sinais ilusórios persistentes");
  if (i.fiction > 50) out.push("Ficção operacional ativa");
  if (i.selfDeception > 50) out.push("Auto-engano estratégico detectado");
  return out;
}
export function detectStrategicIllusions(i: RealityInputs): string[] {
  const out: string[] = [];
  if (i.illusion > 45) out.push("Percepção inflada de progresso");
  if (i.selfDeception > 45) out.push("Confiança injustificada na execução");
  if (i.distortion > 45 && i.coherence < 60) out.push("Narrativa desalinhada da realidade");
  return out;
}

export function buildRealityVerdict(i: RealityInputs): RealityOutput {
  const reality = calculateStrategicReality(i);
  const authenticity = calculateStrategicAuthenticity(i);
  const truth = estimateTruthAlignment(i);

  let verdict: RealityVerdict = "STABLE";
  if (reality >= 88 && authenticity >= 85) verdict = "TRUE_NORTH";
  else if (reality >= 75) verdict = "GROUNDED";
  else if (reality >= 55) verdict = "STABLE";
  else if (reality >= 35) verdict = "DISTORTED";
  else verdict = "DETACHED";

  const strengths: string[] = [];
  if (authenticity >= 75) strengths.push("Autenticidade estratégica firme");
  if (truth >= 75) strengths.push("Alinhamento com a verdade operacional");
  if (i.grounding >= 75) strengths.push("Ancoragem semântica sólida");

  const distortions = detectRealityDistortion(i);
  const illusionSignals = detectStrategicIllusions(i);

  const operationalWarnings: string[] = [];
  if (verdict === "DISTORTED") operationalWarnings.push("Decisões executivas baseadas em sinais distorcidos");
  if (verdict === "DETACHED") operationalWarnings.push("Risco crítico de desconexão com a realidade");

  const recommendations: string[] = [];
  if (i.illusion > 40) recommendations.push("Validar métricas contra fontes primárias");
  if (i.selfDeception > 40) recommendations.push("Auditar premissas estratégicas dominantes");
  if (i.distortion > 40) recommendations.push("Recalibrar pesos semânticos");

  const summary = `Reality=${reality} | Authenticity=${authenticity} | Truth=${truth}`;
  return {
    strategic_reality_score: reality,
    strategic_authenticity_score: authenticity,
    truth_alignment_score: truth,
    verdict,
    summary,
    strengths,
    distortions,
    illusionSignals,
    operationalWarnings,
    recommendations,
  };
}
