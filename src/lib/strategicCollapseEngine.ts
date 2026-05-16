/**
 * Fase 14.2 — Strategic Collapse Engine.
 */
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export interface CollapseInputs {
  fragility: number;
  pressure: number;
  dependency: number;
  recovery: number;
  entropy: number;
}

export interface CollapseSignal { kind: string; severity: "low" | "medium" | "high"; note: string; }

export function detectCollapseSignals(i: CollapseInputs): CollapseSignal[] {
  const out: CollapseSignal[] = [];
  if (i.fragility > 65) out.push({ kind: "fragility", severity: "high", note: "Fragilidade estrutural elevada." });
  if (i.pressure > 70) out.push({ kind: "pressure", severity: "high", note: "Pressão de execução excedendo capacidade." });
  if (i.dependency > 60) out.push({ kind: "dependency", severity: "medium", note: "Dependência crítica entre clusters." });
  if (i.entropy > 70) out.push({ kind: "entropy", severity: "medium", note: "Entropia semântica em alta." });
  if (i.recovery < 35) out.push({ kind: "recovery", severity: "high", note: "Capacidade de recuperação insuficiente." });
  return out;
}

export function estimateCollapseProbability(i: CollapseInputs): number {
  return Math.round(clamp(
    i.fragility * 0.3 + i.pressure * 0.25 + i.dependency * 0.15 + i.entropy * 0.2 + (100 - i.recovery) * 0.1
  ));
}

export function detectCascadeCollapseRisk(dependency: number, hubsCritical: number): number {
  return Math.round(clamp(dependency * 0.6 + Math.min(100, hubsCritical * 12) * 0.4));
}

export function detectOperationalCollapse(pressure: number, capacity: number): number {
  const ratio = pressure / Math.max(1, capacity);
  return Math.round(clamp(ratio * 60));
}

export function estimateRecoveryWindow(probability: number, recoveryCapacity: number): number {
  return Math.max(7, Math.round((probability / Math.max(10, recoveryCapacity)) * 90));
}

export function estimateRecoveryCost(probability: number, scope: number): number {
  return Math.round(clamp(probability * 0.6 + scope * 0.4));
}

export function buildCollapseMitigationPlan(signals: CollapseSignal[]): string[] {
  if (!signals.length) return ["Sem sinais críticos detectados."];
  return signals.map((s) => {
    switch (s.kind) {
      case "fragility": return "Reforçar conectividade interna entre hubs.";
      case "pressure": return "Pausar expansão e reduzir backlog editorial.";
      case "dependency": return "Diversificar fontes de autoridade.";
      case "entropy": return "Consolidar clusters fragmentados.";
      case "recovery": return "Aumentar capacidade operacional editorial.";
      default: return s.note;
    }
  });
}
