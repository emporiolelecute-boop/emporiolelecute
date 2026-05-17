/**
 * Phase 17 — Core Metrics Canon (pure, read-only).
 * Defines the official taxonomy and overlap analysis for SEO OS metrics.
 */

export type MetricClassification =
  | "CORE"
  | "DERIVED"
  | "EXPERIMENTAL"
  | "DIAGNOSTIC"
  | "REDUNDANT"
  | "DEPRECATED";

export type SemanticDomain =
  | "coherence" | "continuity" | "integrity" | "convergence"
  | "alignment" | "stability" | "resilience" | "trust" | "consistency";

export interface CanonMetric {
  name: string;
  origin: string;            // engine / source
  dependencies: string[];    // metric names it derives from
  weight: number;            // strategic weight 0..100
  usage: number;             // frequency / dashboards using it 0..100
  redundancy: number;        // 0..100
  category: MetricClassification;
  executiveImpact: number;   // 0..100
  domains: SemanticDomain[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const SEED: Omit<CanonMetric, "category" | "redundancy">[] = [
  { name: "authority_growth_projection", origin: "authority", dependencies: [], weight: 90, usage: 85, executiveImpact: 88, domains: ["trust", "convergence"] },
  { name: "semantic_roi_avg", origin: "decision", dependencies: [], weight: 86, usage: 78, executiveImpact: 84, domains: ["alignment"] },
  { name: "execution_efficiency", origin: "execution", dependencies: [], weight: 80, usage: 76, executiveImpact: 78, domains: ["consistency"] },
  { name: "knowledge_health_score", origin: "graph", dependencies: [], weight: 78, usage: 70, executiveImpact: 72, domains: ["integrity"] },
  { name: "coherence_matrix_score", origin: "coherenceMatrix", dependencies: ["systemic_coherence_score", "strategic_alignment_score"], weight: 70, usage: 40, executiveImpact: 70, domains: ["coherence", "alignment"] },
  { name: "integrity_grid_score", origin: "integrityGrid", dependencies: ["systemic_trust_integrity_score", "semantic_integrity_score"], weight: 70, usage: 38, executiveImpact: 70, domains: ["integrity", "trust"] },
  { name: "stability_fabric_score", origin: "stabilityFabric", dependencies: ["systemic_integrity_score", "executive_stability_score"], weight: 68, usage: 36, executiveImpact: 68, domains: ["stability"] },
  { name: "nexus_convergence_score", origin: "nexusConvergence", dependencies: ["semantic_trust_score", "operational_continuity_score"], weight: 66, usage: 34, executiveImpact: 66, domains: ["convergence"] },
  { name: "unified_nexus_score", origin: "unifiedNexus", dependencies: ["systemic_harmony_score"], weight: 64, usage: 32, executiveImpact: 64, domains: ["convergence", "alignment"] },
  { name: "strategic_continuum_score", origin: "strategicContinuum", dependencies: [], weight: 62, usage: 30, executiveImpact: 62, domains: ["continuity"] },
  { name: "strategic_reality_score", origin: "strategicReality", dependencies: [], weight: 60, usage: 28, executiveImpact: 60, domains: ["consistency"] },
  { name: "consciousness_fabric_score", origin: "consciousnessFabric", dependencies: [], weight: 50, usage: 22, executiveImpact: 50, domains: ["coherence"] },
  { name: "governance_matrix_score", origin: "governanceMatrix", dependencies: [], weight: 74, usage: 60, executiveImpact: 74, domains: ["trust", "alignment"] },
  { name: "executive_core_score", origin: "executiveCore", dependencies: [], weight: 72, usage: 58, executiveImpact: 72, domains: ["alignment"] },
  { name: "meta_reasoning_score", origin: "metaReasoning", dependencies: [], weight: 48, usage: 20, executiveImpact: 50, domains: ["coherence"] },
  { name: "resilience_continuity_score", origin: "resilienceContinuity", dependencies: [], weight: 60, usage: 30, executiveImpact: 60, domains: ["resilience", "continuity"] },
  { name: "resilience_integrity_score", origin: "resilienceIntegrity", dependencies: [], weight: 58, usage: 26, executiveImpact: 58, domains: ["resilience", "integrity"] },
  { name: "resilience_unification_score", origin: "resilienceUnification", dependencies: [], weight: 56, usage: 24, executiveImpact: 56, domains: ["resilience", "convergence"] },
  { name: "operational_continuity_score", origin: "operationalContinuity", dependencies: [], weight: 60, usage: 30, executiveImpact: 60, domains: ["continuity", "consistency"] },
  { name: "operational_harmony_score", origin: "operationalHarmony", dependencies: [], weight: 58, usage: 28, executiveImpact: 58, domains: ["alignment"] },
  { name: "operational_alignment_score", origin: "operationalAlignment", dependencies: [], weight: 58, usage: 28, executiveImpact: 58, domains: ["alignment"] },
  { name: "temporal_coherence_score", origin: "temporalCoherence", dependencies: [], weight: 54, usage: 22, executiveImpact: 52, domains: ["coherence", "continuity"] },
];

export function classifyMetric(m: Omit<CanonMetric, "category" | "redundancy">, redundancy: number): MetricClassification {
  if (m.usage <= 10) return "DEPRECATED";
  if (redundancy >= 70) return "REDUNDANT";
  if (m.dependencies.length >= 2 && m.weight < 70) return "DERIVED";
  if (m.weight >= 75 && m.executiveImpact >= 70) return "CORE";
  if (m.usage < 30 && m.executiveImpact < 55) return "EXPERIMENTAL";
  return "DIAGNOSTIC";
}

export interface OverlapPair { a: string; b: string; overlap: number; shared: SemanticDomain[] }

export function detectMetricOverlap(metrics: CanonMetric[]): OverlapPair[] {
  const out: OverlapPair[] = [];
  for (let i = 0; i < metrics.length; i++) {
    for (let j = i + 1; j < metrics.length; j++) {
      const a = metrics[i], b = metrics[j];
      const shared = a.domains.filter((d) => b.domains.includes(d));
      if (!shared.length) continue;
      const overlap = clamp((shared.length / Math.max(a.domains.length, b.domains.length)) * 100);
      if (overlap >= 40) out.push({ a: a.name, b: b.name, overlap, shared });
    }
  }
  return out.sort((x, y) => y.overlap - x.overlap);
}

export function detectRedundantMetrics(metrics: CanonMetric[]): string[] {
  return metrics.filter((m) => m.category === "REDUNDANT").map((m) => m.name);
}

export function calculateMetricImportance(m: CanonMetric): number {
  return clamp(m.weight * 0.45 + m.executiveImpact * 0.35 + m.usage * 0.2);
}

export interface DependencyEdge { from: string; to: string }
export function buildMetricDependencyGraph(metrics: CanonMetric[]): DependencyEdge[] {
  const edges: DependencyEdge[] = [];
  metrics.forEach((m) => m.dependencies.forEach((d) => edges.push({ from: d, to: m.name })));
  return edges;
}

export interface CoreMetricsCanon {
  metrics: CanonMetric[];
  overlap: OverlapPair[];
  redundant: string[];
  dependencies: DependencyEdge[];
  byClass: Record<MetricClassification, number>;
  byDomain: Record<SemanticDomain, number>;
  canon_score: number;
}

export function buildCoreMetricsCanon(): CoreMetricsCanon {
  // First pass with placeholder redundancy
  const draft: CanonMetric[] = SEED.map((s) => ({ ...s, redundancy: 0, category: "DIAGNOSTIC" as MetricClassification }));
  const tempOverlap = detectMetricOverlap(draft);
  const redundancyByName = new Map<string, number>();
  tempOverlap.forEach((p) => {
    redundancyByName.set(p.a, Math.max(redundancyByName.get(p.a) ?? 0, p.overlap));
    redundancyByName.set(p.b, Math.max(redundancyByName.get(p.b) ?? 0, p.overlap));
  });
  const metrics: CanonMetric[] = draft.map((m) => {
    const r = redundancyByName.get(m.name) ?? 0;
    return { ...m, redundancy: r, category: classifyMetric(m, r) };
  });
  const overlap = detectMetricOverlap(metrics);
  const redundant = detectRedundantMetrics(metrics);
  const dependencies = buildMetricDependencyGraph(metrics);

  const byClass = metrics.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1;
    return acc;
  }, {} as Record<MetricClassification, number>);
  ["CORE", "DERIVED", "EXPERIMENTAL", "DIAGNOSTIC", "REDUNDANT", "DEPRECATED"].forEach((k) => {
    if (!(k in byClass)) byClass[k as MetricClassification] = 0;
  });

  const byDomain = {} as Record<SemanticDomain, number>;
  (["coherence","continuity","integrity","convergence","alignment","stability","resilience","trust","consistency"] as SemanticDomain[])
    .forEach((d) => { byDomain[d] = metrics.filter((m) => m.domains.includes(d)).length; });

  const total = metrics.length;
  const coreRatio = (byClass.CORE ?? 0) / total;
  const redundantRatio = (byClass.REDUNDANT ?? 0) / total;
  const canon_score = clamp(coreRatio * 65 + (1 - redundantRatio) * 35);

  return { metrics, overlap, redundant, dependencies, byClass, byDomain, canon_score };
}
