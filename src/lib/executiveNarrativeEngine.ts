/**
 * Fase 15.5 — Executive Narrative Engine (pure helpers).
 */
import type { ExecutiveSynthesis } from "./executiveSynthesisCore";
import type { HiddenRisk } from "./hiddenRiskEngine";

export interface ExecutiveNarrative {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  priorities: string[];
  actions: string[];
}

export function buildExecutiveSummary(s: ExecutiveSynthesis): string {
  return `Executive Core ${s.executive_core_score} · Strategy ${s.systemic_strategy_score} · ` +
    `Sustainability ${s.operational_sustainability_score} · Verdict: ${s.verdict}`;
}

export function explainExecutiveStrengths(s: ExecutiveSynthesis): string[] {
  const r: string[] = [];
  if (s.executive_core_score >= 75) r.push("Núcleo executivo sólido.");
  if (s.strategic_alignment_score >= 75) r.push("Alinhamento estratégico alto.");
  if (s.operational_sustainability_score >= 75) r.push("Sustentabilidade operacional saudável.");
  if (s.strategic_resilience_score >= 75) r.push("Resiliência estratégica robusta.");
  return r;
}

export function explainExecutiveWeaknesses(s: ExecutiveSynthesis): string[] {
  const r: string[] = [];
  if (s.executive_core_score < 65) r.push("Núcleo executivo abaixo do esperado.");
  if (s.strategic_alignment_score < 65) r.push("Alinhamento estratégico fragilizado.");
  if (s.execution_alignment_score < 65) r.push("Execução desalinhada da estratégia.");
  if (s.operational_sustainability_score < 65) r.push("Sustentabilidade abaixo do limite.");
  return r.concat(s.weaknesses.map(w => `signal:${w}`));
}

export function explainExecutiveRisks(s: ExecutiveSynthesis, risks: HiddenRisk[]): string[] {
  const r: string[] = [];
  if (s.collapse_exposure_score > 55) r.push("Exposição sistêmica a colapso elevada.");
  risks.forEach(rk => r.push(`${rk.type}:${rk.severity}`));
  return r;
}

export function buildExecutivePriorityMap(s: ExecutiveSynthesis): string[] {
  const p: string[] = [];
  if (s.collapse_exposure_score > 50) p.push("Reduzir exposição sistêmica.");
  if (s.strategic_alignment_score < 70) p.push("Realinhar estratégia.");
  if (s.execution_alignment_score < 70) p.push("Realinhar execução.");
  if (s.operational_sustainability_score < 70) p.push("Reforçar sustentabilidade.");
  if (!p.length) p.push("Manter trajetória atual e monitorar.");
  return p;
}

export function buildExecutiveActionFramework(s: ExecutiveSynthesis): string[] {
  const a: string[] = [];
  s.breakpoints.forEach(b => a.push(`Mitigar: ${b}`));
  s.misalignments.forEach(m => a.push(`Corrigir desalinhamento: ${m}`));
  if (!a.length) a.push("Nenhuma ação crítica pendente.");
  return a;
}

export function buildExecutiveNarrative(
  s: ExecutiveSynthesis, risks: HiddenRisk[]
): ExecutiveNarrative {
  return {
    summary: buildExecutiveSummary(s),
    strengths: explainExecutiveStrengths(s),
    weaknesses: explainExecutiveWeaknesses(s),
    risks: explainExecutiveRisks(s, risks),
    priorities: buildExecutivePriorityMap(s),
    actions: buildExecutiveActionFramework(s),
  };
}
