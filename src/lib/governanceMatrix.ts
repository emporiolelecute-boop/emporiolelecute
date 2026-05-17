/**
 * Fase 15.6 — Governance Matrix (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface GovernanceMatrixInputs {
  strategicCoherence: number;
  alignment: number;
  governance: number;
  semanticIntegrity: number;
  authorityBalance: number;
  observability: number;
  consensus: number;
  predictability: number;
  evolutionCapacity: number;
  fragmentation: number;
  conflicts: number;
  drift: number;
  noise: number;
  collapseRisk: number;
}

export type GovernanceVerdict =
  | "TRANSCENDENT" | "ASCENDED" | "STABLE" | "FRAGMENTED" | "CRITICAL";

export interface GovernanceMatrixOutput {
  governance_matrix_score: number;
  strategic_integrity_score: number;
  systemic_alignment_score: number;
  autonomous_stability_score: number;
  governance_entropy_score: number;
  execution_integrity_score: number;
  strategic_cohesion_score: number;
  verdict: GovernanceVerdict;
  summary: string;
  strengths: string[];
  blockers: string[];
  instabilitySignals: string[];
  governanceRisks: string[];
  recommendations: string[];
}

export function calculateStrategicIntegrity(i: GovernanceMatrixInputs): number {
  return avg([i.strategicCoherence, i.alignment, i.semanticIntegrity, inv(i.conflicts)]);
}
export function calculateSystemicAlignment(i: GovernanceMatrixInputs): number {
  return avg([i.alignment, i.consensus, inv(i.fragmentation), i.governance]);
}
export function calculateAutonomousStability(i: GovernanceMatrixInputs): number {
  return avg([i.predictability, inv(i.drift), inv(i.noise), i.consensus]);
}
export function calculateGovernanceEntropy(i: GovernanceMatrixInputs): number {
  return clamp((i.fragmentation * 0.3) + (i.noise * 0.3) + (i.drift * 0.2) + (i.conflicts * 0.2));
}
export function calculateExecutionIntegrity(i: GovernanceMatrixInputs): number {
  return avg([i.alignment, inv(i.fragmentation), i.observability, inv(i.drift)]);
}
function strategicCohesion(i: GovernanceMatrixInputs): number {
  return avg([i.strategicCoherence, i.consensus, i.governance, inv(i.fragmentation)]);
}

export function buildGovernanceVerdict(score: number, entropy: number): GovernanceVerdict {
  if (entropy > 65) return "CRITICAL";
  if (entropy > 50) return "FRAGMENTED";
  if (score >= 90) return "TRANSCENDENT";
  if (score >= 78) return "ASCENDED";
  return "STABLE";
}

export function calculateGovernanceMatrix(i: GovernanceMatrixInputs): GovernanceMatrixOutput {
  const integrity = calculateStrategicIntegrity(i);
  const alignment = calculateSystemicAlignment(i);
  const autonomy = calculateAutonomousStability(i);
  const entropy = calculateGovernanceEntropy(i);
  const execution = calculateExecutionIntegrity(i);
  const cohesion = strategicCohesion(i);
  const score = avg([integrity, alignment, autonomy, execution, cohesion, inv(entropy)]);
  const verdict = buildGovernanceVerdict(score, entropy);

  const strengths: string[] = [];
  if (integrity >= 75) strengths.push("Integridade estratégica sólida.");
  if (alignment >= 75) strengths.push("Alinhamento sistêmico saudável.");
  if (autonomy >= 75) strengths.push("Autonomia operacional consistente.");
  if (cohesion >= 75) strengths.push("Coesão estratégica robusta.");

  const blockers: string[] = [];
  if (integrity < 60) blockers.push("integridade_estrategica_baixa");
  if (alignment < 60) blockers.push("desalinhamento_sistemico");
  if (autonomy < 60) blockers.push("autonomia_fragil");
  if (execution < 60) blockers.push("execucao_inconsistente");

  const instabilitySignals: string[] = [];
  if (i.drift > 35) instabilitySignals.push("drift_alto");
  if (i.noise > 35) instabilitySignals.push("ruido_alto");
  if (i.fragmentation > 35) instabilitySignals.push("fragmentacao_alta");

  const governanceRisks: string[] = [];
  if (entropy > 50) governanceRisks.push("entropia_de_governanca");
  if (i.collapseRisk > 50) governanceRisks.push("exposicao_a_colapso");
  if (i.conflicts > 40) governanceRisks.push("conflitos_persistentes");

  const recommendations: string[] = [];
  if (entropy > 50) recommendations.push("Reduzir ruído e fragmentação operacional.");
  if (integrity < 65) recommendations.push("Reforçar integridade estratégica.");
  if (autonomy < 65) recommendations.push("Estabilizar processos autônomos.");
  if (!recommendations.length) recommendations.push("Manter trajetória e monitorar telemetria.");

  return {
    governance_matrix_score: score,
    strategic_integrity_score: integrity,
    systemic_alignment_score: alignment,
    autonomous_stability_score: autonomy,
    governance_entropy_score: entropy,
    execution_integrity_score: execution,
    strategic_cohesion_score: cohesion,
    verdict,
    summary: `Governance ${score} · Verdict ${verdict} · Entropy ${entropy}`,
    strengths, blockers, instabilitySignals, governanceRisks, recommendations,
  };
}
