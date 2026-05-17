/**
 * Fase 15.5 — Hidden Risk Engine (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));

export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface HiddenRisk {
  type: string;
  description: string;
  severity: RiskSeverity;
  affected: string[];
  propagation: number;
  collapse: number;
}

export interface HiddenRiskInputs {
  fragmentation: number;
  hallucination: number;
  drift: number;
  collapseRisk: number;
  semanticInstability: number;
  governanceGap: number;
  authorityDispersion: number;
  hiddenDependency: number;
  clusterDependency: number;
  conflicts: number;
}

export function classifyRiskSeverity(score: number): RiskSeverity {
  if (score >= 75) return "CRITICAL";
  if (score >= 55) return "HIGH";
  if (score >= 35) return "MEDIUM";
  return "LOW";
}

export function detectLatentCollapseRisks(i: HiddenRiskInputs): HiddenRisk[] {
  const r: HiddenRisk[] = [];
  if (i.collapseRisk > 40) r.push({
    type: "latent_collapse", description: "Pressão sistêmica acumulada acima do limite.",
    severity: classifyRiskSeverity(i.collapseRisk),
    affected: ["governance", "execution"], propagation: clamp(i.collapseRisk * 0.8),
    collapse: clamp(i.collapseRisk),
  });
  return r;
}
export function detectInvisibleDependencies(i: HiddenRiskInputs): HiddenRisk[] {
  if (i.hiddenDependency < 35) return [];
  return [{
    type: "invisible_dependency",
    description: "Dependências críticas não observáveis entre engines.",
    severity: classifyRiskSeverity(i.hiddenDependency),
    affected: ["orchestration", "intelligence"],
    propagation: clamp(i.hiddenDependency),
    collapse: clamp(i.hiddenDependency * 0.6),
  }];
}
export function detectClusterInstability(i: HiddenRiskInputs): HiddenRisk[] {
  if (i.clusterDependency < 40) return [];
  return [{
    type: "cluster_instability",
    description: "Clusters com alta dependência interna.",
    severity: classifyRiskSeverity(i.clusterDependency),
    affected: ["semantic", "authority"],
    propagation: clamp(i.clusterDependency * 0.7),
    collapse: clamp(i.clusterDependency * 0.5),
  }];
}
export function detectSemanticWeaknesses(i: HiddenRiskInputs): HiddenRisk[] {
  if (i.semanticInstability < 35) return [];
  return [{
    type: "semantic_weakness",
    description: "Sinal semântico instável.",
    severity: classifyRiskSeverity(i.semanticInstability),
    affected: ["semantic"], propagation: clamp(i.semanticInstability),
    collapse: clamp(i.semanticInstability * 0.4),
  }];
}
export function detectGovernanceWeaknesses(i: HiddenRiskInputs): HiddenRisk[] {
  if (i.governanceGap < 35) return [];
  return [{
    type: "governance_weakness",
    description: "Governança apresenta lacunas operacionais.",
    severity: classifyRiskSeverity(i.governanceGap),
    affected: ["governance"], propagation: clamp(i.governanceGap),
    collapse: clamp(i.governanceGap * 0.5),
  }];
}
export function estimateCascadeExposure(risks: HiddenRisk[]): number {
  if (!risks.length) return 0;
  return clamp(risks.reduce((s, r) => s + r.propagation, 0) / risks.length);
}
export function detectHiddenRisks(i: HiddenRiskInputs): HiddenRisk[] {
  return [
    ...detectLatentCollapseRisks(i),
    ...detectInvisibleDependencies(i),
    ...detectClusterInstability(i),
    ...detectSemanticWeaknesses(i),
    ...detectGovernanceWeaknesses(i),
  ];
}
