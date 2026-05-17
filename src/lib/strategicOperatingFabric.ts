/**
 * Fase 15.2 — Strategic Operating Fabric.
 * Consolida sinais de cohesion, integrity, resilience e scalability em um tecido operacional unificado.
 * Puro, determinístico, sem side effects.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export type FabricVerdict =
  | "ASCENDED"
  | "OPTIMIZED"
  | "STABLE"
  | "STRESSED"
  | "FRACTURED"
  | "COLLAPSING";

export interface FabricInputs {
  cohesion?: number;
  semanticIntegrity?: number;
  authorityIntegrity?: number;
  governanceIntegrity?: number;
  resilience?: number;
  fragmentationRisk?: number;
  dependencyRisk?: number;
  executionPressure?: number;
  operationalDebt?: number;
  scalingRisk?: number;
  systemicComplexity?: number;
  explainability?: number;
  observability?: number;
  consensus?: number;
  anomalyPressure?: number;
  strategicNoise?: number;
  entropy?: number;
  scalabilityProjection?: number;
  futureStability?: number;
  sustainability?: number;
  continuity?: number;
  collapseProbability?: number;
}

export interface StrategicOperatingFabric {
  operating_fabric_score: number;
  strategic_cohesion_score: number;
  structural_integrity_score: number;
  fabric_resilience_score: number;
  fabric_scalability_score: number;
  execution_compression: number;
  semantic_compression: number;
  authority_compression: number;
  weaknesses: string[];
  scalingRisks: string[];
  architecturalDebt: string[];
  bottleneckChains: string[];
  verdict: FabricVerdict;
}

const v = (n: number | undefined, d = 50) => (Number.isFinite(n as number) ? (n as number) : d);

export function calculateOperatingFabricScore(i: FabricInputs): number {
  const positives =
    v(i.cohesion) * 0.18 +
    v(i.semanticIntegrity) * 0.14 +
    v(i.authorityIntegrity) * 0.14 +
    v(i.governanceIntegrity) * 0.12 +
    v(i.resilience) * 0.14 +
    v(i.explainability) * 0.08 +
    v(i.observability) * 0.1 +
    v(i.consensus) * 0.1;
  const negatives =
    v(i.fragmentationRisk, 0) * 0.2 +
    v(i.dependencyRisk, 0) * 0.15 +
    v(i.operationalDebt, 0) * 0.2 +
    v(i.entropy, 0) * 0.15 +
    v(i.anomalyPressure, 0) * 0.15 +
    v(i.systemicComplexity, 0) * 0.15;
  return clamp(positives - negatives * 0.35);
}

export function calculateStrategicCohesion(i: FabricInputs): number {
  return clamp(
    v(i.cohesion) * 0.5 +
      v(i.consensus) * 0.25 +
      v(i.governanceIntegrity) * 0.25 -
      v(i.strategicNoise, 0) * 0.2,
  );
}

export function calculateStructuralIntegrity(i: FabricInputs): number {
  return clamp(
    v(i.semanticIntegrity) * 0.3 +
      v(i.authorityIntegrity) * 0.3 +
      v(i.governanceIntegrity) * 0.2 +
      v(i.resilience) * 0.2 -
      v(i.fragmentationRisk, 0) * 0.25,
  );
}

export function calculateFabricResilience(i: FabricInputs): number {
  return clamp(
    v(i.resilience) * 0.5 +
      v(i.continuity) * 0.25 +
      v(i.futureStability) * 0.25 -
      v(i.anomalyPressure, 0) * 0.2 -
      v(i.collapseProbability, 0) * 0.3,
  );
}

export function calculateFabricScalability(i: FabricInputs): number {
  return clamp(
    v(i.scalabilityProjection) * 0.55 +
      v(i.sustainability) * 0.25 +
      v(i.futureStability) * 0.2 -
      v(i.scalingRisk, 0) * 0.3 -
      v(i.systemicComplexity, 0) * 0.2,
  );
}

export function calculateExecutionCompression(i: FabricInputs): number {
  return clamp(100 - v(i.executionPressure, 0) * 0.6 - v(i.operationalDebt, 0) * 0.4);
}
export function calculateSemanticCompression(i: FabricInputs): number {
  return clamp(v(i.semanticIntegrity) - v(i.entropy, 0) * 0.5);
}
export function calculateAuthorityCompression(i: FabricInputs): number {
  return clamp(v(i.authorityIntegrity) - v(i.strategicNoise, 0) * 0.4);
}

export function detectStructuralWeaknesses(i: FabricInputs): string[] {
  const out: string[] = [];
  if (v(i.fragmentationRisk, 0) > 60) out.push("Fragmentação estrutural elevada.");
  if (v(i.dependencyRisk, 0) > 60) out.push("Acoplamento excessivo entre engines.");
  if (v(i.governanceIntegrity) < 50) out.push("Governança enfraquecida.");
  if (v(i.semanticIntegrity) < 50) out.push("Integridade semântica baixa.");
  if (v(i.resilience) < 50) out.push("Resiliência insuficiente.");
  return out;
}

export function detectScalingFailureRisk(i: FabricInputs): string[] {
  const out: string[] = [];
  if (v(i.scalingRisk, 0) > 60) out.push("Risco alto ao escalar volume.");
  if (v(i.systemicComplexity, 0) > 70) out.push("Complexidade sistêmica acima do sustentável.");
  if (v(i.scalabilityProjection) < 50) out.push("Projeção de escalabilidade fraca.");
  return out;
}

export function detectArchitecturalDebt(i: FabricInputs): string[] {
  const out: string[] = [];
  if (v(i.operationalDebt, 0) > 55) out.push("Débito operacional acumulado.");
  if (v(i.systemicComplexity, 0) > 65) out.push("Excesso de camadas conceituais.");
  if (v(i.entropy, 0) > 60) out.push("Entropia estrutural elevada.");
  if (v(i.strategicNoise, 0) > 60) out.push("Ruído estratégico contaminando decisões.");
  return out;
}

export function detectOperationalBottleneckChains(i: FabricInputs): string[] {
  const out: string[] = [];
  if (v(i.executionPressure, 0) > 65 && v(i.operationalDebt, 0) > 50)
    out.push("Execução pressionada por débito acumulado.");
  if (v(i.dependencyRisk, 0) > 60 && v(i.fragmentationRisk, 0) > 50)
    out.push("Cadeia de dependências frágeis em múltiplos pontos.");
  if (v(i.anomalyPressure, 0) > 60 && v(i.observability) < 55)
    out.push("Anomalias pressionando observabilidade limitada.");
  return out;
}

export function buildFabricVerdict(score: number, collapse: number): FabricVerdict {
  if (collapse > 75) return "COLLAPSING";
  if (score >= 90) return "ASCENDED";
  if (score >= 78) return "OPTIMIZED";
  if (score >= 62) return "STABLE";
  if (score >= 45) return "STRESSED";
  return "FRACTURED";
}

export function buildStrategicOperatingFabric(i: FabricInputs): StrategicOperatingFabric {
  const operating_fabric_score = calculateOperatingFabricScore(i);
  return {
    operating_fabric_score,
    strategic_cohesion_score: calculateStrategicCohesion(i),
    structural_integrity_score: calculateStructuralIntegrity(i),
    fabric_resilience_score: calculateFabricResilience(i),
    fabric_scalability_score: calculateFabricScalability(i),
    execution_compression: calculateExecutionCompression(i),
    semantic_compression: calculateSemanticCompression(i),
    authority_compression: calculateAuthorityCompression(i),
    weaknesses: detectStructuralWeaknesses(i),
    scalingRisks: detectScalingFailureRisk(i),
    architecturalDebt: detectArchitecturalDebt(i),
    bottleneckChains: detectOperationalBottleneckChains(i),
    verdict: buildFabricVerdict(operating_fabric_score, v(i.collapseProbability, 0)),
  };
}
