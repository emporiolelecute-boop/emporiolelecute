/**
 * Fase 15.5 — Executive Synthesis Core
 * Pure helpers — no side effects. Aggregates signals from previous engines
 * into an executive-level synthesis. Read-only.
 */

const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ExecutiveInputs {
  // strategic
  strategicCoherence: number;
  strategicAlignment: number;
  executionAlignment: number;
  governanceScore: number;
  semanticIntegrity: number;
  authorityBalance: number;
  // intelligence
  metaReasoning: number;
  cognitiveStability: number;
  observability: number;
  explainability: number;
  decisionConfidence: number;
  consensus: number;
  // risk
  contradictionPressure: number;
  conflictDensity: number;
  hallucinationRisk: number;
  driftScore: number;
  collapseRisk: number;
  fragmentation: number;
  // future
  longevity: number;
  scalability: number;
  resilience: number;
  forecastReliability: number;
}

export type ExecutiveVerdict =
  | "SUPREME" | "ASCENDED" | "STABLE" | "STRESSED" | "FRAGMENTED" | "COLLAPSING";

export interface ExecutiveSynthesis {
  executive_core_score: number;
  systemic_strategy_score: number;
  strategic_alignment_score: number;
  execution_alignment_score: number;
  operational_sustainability_score: number;
  strategic_resilience_score: number;
  collapse_exposure_score: number;
  weaknesses: string[];
  misalignments: string[];
  breakpoints: string[];
  verdict: ExecutiveVerdict;
  drivers: string[];
}

export function calculateExecutiveCoreScore(i: ExecutiveInputs): number {
  return avg([
    i.strategicCoherence, i.strategicAlignment, i.executionAlignment,
    i.governanceScore, i.metaReasoning, i.cognitiveStability,
    i.observability, i.consensus, inv(i.collapseRisk), inv(i.driftScore),
  ]);
}

export function calculateSystemicStrategy(i: ExecutiveInputs): number {
  return avg([
    i.strategicCoherence, i.strategicAlignment, i.governanceScore,
    i.semanticIntegrity, i.authorityBalance, inv(i.fragmentation),
  ]);
}

export function calculateStrategicAlignment(i: ExecutiveInputs): number {
  return avg([
    i.strategicAlignment, i.strategicCoherence,
    inv(i.contradictionPressure), inv(i.conflictDensity), i.consensus,
  ]);
}

export function calculateExecutionAlignment(i: ExecutiveInputs): number {
  return avg([
    i.executionAlignment, inv(i.fragmentation),
    i.observability, i.consensus, inv(i.driftScore),
  ]);
}

export function calculateOperationalSustainability(i: ExecutiveInputs): number {
  return avg([
    i.longevity, i.resilience, inv(i.collapseRisk),
    i.cognitiveStability, i.governanceScore,
  ]);
}

export function calculateStrategicResilience(i: ExecutiveInputs): number {
  return avg([
    i.resilience, i.cognitiveStability, inv(i.fragmentation),
    inv(i.hallucinationRisk), i.forecastReliability,
  ]);
}

export function detectExecutiveWeaknesses(i: ExecutiveInputs): string[] {
  const w: string[] = [];
  if (i.observability < 60) w.push("low_observability");
  if (i.explainability < 60) w.push("low_explainability");
  if (i.consensus < 60) w.push("weak_consensus");
  if (i.governanceScore < 60) w.push("governance_gap");
  if (i.metaReasoning < 60) w.push("meta_reasoning_gap");
  return w;
}

export function detectStrategicMisalignment(i: ExecutiveInputs): string[] {
  const m: string[] = [];
  if (Math.abs(i.strategicAlignment - i.executionAlignment) > 15) m.push("strategy_vs_execution");
  if (Math.abs(i.strategicCoherence - i.governanceScore) > 15) m.push("strategy_vs_governance");
  if (Math.abs(i.semanticIntegrity - i.authorityBalance) > 15) m.push("semantic_vs_authority");
  return m;
}

export function detectOperationalMisalignment(i: ExecutiveInputs): string[] {
  const m: string[] = [];
  if (i.executionAlignment < 60) m.push("execution_below_threshold");
  if (i.fragmentation > 40) m.push("operational_fragmentation");
  if (i.driftScore > 35) m.push("operational_drift");
  return m;
}

export function detectExecutionBreakpoints(i: ExecutiveInputs): string[] {
  const b: string[] = [];
  if (i.collapseRisk > 50) b.push("collapse_pressure");
  if (i.driftScore > 50) b.push("drift_pressure");
  if (i.fragmentation > 50) b.push("fragmentation_pressure");
  if (i.contradictionPressure > 50) b.push("contradiction_pressure");
  return b;
}

export function detectSystemicCollapseExposure(i: ExecutiveInputs): number {
  return avg([
    i.collapseRisk, i.driftScore, i.fragmentation,
    i.hallucinationRisk, i.contradictionPressure,
  ]);
}

export function buildExecutiveVerdict(score: number, exposure: number): ExecutiveVerdict {
  if (exposure > 70) return "COLLAPSING";
  if (exposure > 55) return "FRAGMENTED";
  if (score >= 90) return "SUPREME";
  if (score >= 80) return "ASCENDED";
  if (score >= 65) return "STABLE";
  return "STRESSED";
}

export function buildExecutiveSynthesisCore(i: ExecutiveInputs): ExecutiveSynthesis {
  const core = calculateExecutiveCoreScore(i);
  const strategy = calculateSystemicStrategy(i);
  const strategicAlignment = calculateStrategicAlignment(i);
  const executionAlignment = calculateExecutionAlignment(i);
  const sustainability = calculateOperationalSustainability(i);
  const resilience = calculateStrategicResilience(i);
  const exposure = detectSystemicCollapseExposure(i);
  const weaknesses = detectExecutiveWeaknesses(i);
  const misalignments = [
    ...detectStrategicMisalignment(i),
    ...detectOperationalMisalignment(i),
  ];
  const breakpoints = detectExecutionBreakpoints(i);
  const verdict = buildExecutiveVerdict(core, exposure);
  const drivers: string[] = [];
  if (core < 65) drivers.push("low_core_score");
  if (strategicAlignment < 60) drivers.push("strategic_alignment_gap");
  if (executionAlignment < 60) drivers.push("execution_alignment_gap");
  if (exposure > 50) drivers.push("collapse_exposure_high");
  return {
    executive_core_score: core,
    systemic_strategy_score: strategy,
    strategic_alignment_score: strategicAlignment,
    execution_alignment_score: executionAlignment,
    operational_sustainability_score: sustainability,
    strategic_resilience_score: resilience,
    collapse_exposure_score: exposure,
    weaknesses, misalignments, breakpoints, verdict, drivers,
  };
}
