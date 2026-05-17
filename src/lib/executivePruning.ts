/**
 * Executive Pruning Engine — read-only suggestions for manual simplification.
 * Never deletes or mutates anything. Builds candidate lists and burden estimates.
 */

export interface SystemNode {
  id: string;
  kind: "dashboard" | "engine" | "metric" | "component";
  usageScore?: number; // 0..100
  complexityScore?: number; // 0..100
  dependencies?: number;
  maintainerNotes?: string;
}

export interface PruningCandidate {
  id: string;
  kind: SystemNode["kind"];
  reason: string;
  confidence: number; // 0..100
}

export interface SimplificationCandidate {
  id: string;
  suggestion: string;
  impact: "low" | "medium" | "high";
}

export interface PruningReport {
  totalNodes: number;
  candidates: PruningCandidate[];
  simplifications: SimplificationCandidate[];
  complexityCostScore: number; // 0..100
  maintenanceBurdenScore: number; // 0..100
}

export function buildPruningCandidates(nodes: SystemNode[] = []): PruningCandidate[] {
  return nodes
    .filter((n) => (n.usageScore ?? 0) < 20)
    .map((n) => ({
      id: n.id,
      kind: n.kind,
      reason: `Low usage (${n.usageScore ?? 0}) with complexity ${n.complexityScore ?? 0}`,
      confidence: Math.min(100, Math.round(100 - (n.usageScore ?? 0) + (n.complexityScore ?? 0) / 2)),
    }))
    .sort((a, b) => b.confidence - a.confidence);
}

export function calculateComplexityCost(nodes: SystemNode[] = []): number {
  if (nodes.length === 0) return 0;
  const sum = nodes.reduce(
    (s, n) => s + (n.complexityScore ?? 0) + (n.dependencies ?? 0) * 2,
    0,
  );
  return Math.max(0, Math.min(100, Math.round(sum / Math.max(1, nodes.length * 2))));
}

export function estimateMaintenanceBurden(nodes: SystemNode[] = []): number {
  if (nodes.length === 0) return 0;
  const heavy = nodes.filter(
    (n) => (n.complexityScore ?? 0) >= 60 || (n.dependencies ?? 0) >= 5,
  ).length;
  return Math.max(0, Math.min(100, Math.round((heavy / nodes.length) * 100)));
}

export function detectLowValueSystems(nodes: SystemNode[] = []): SystemNode[] {
  return nodes.filter(
    (n) => (n.usageScore ?? 0) < 25 && (n.complexityScore ?? 0) >= 40,
  );
}

export function buildSimplificationCandidates(nodes: SystemNode[] = []): SimplificationCandidate[] {
  return nodes
    .filter((n) => (n.complexityScore ?? 0) >= 60)
    .map<SimplificationCandidate>((n) => ({
      id: n.id,
      suggestion:
        n.kind === "dashboard"
          ? "Consolidate with related dashboard or split into tabs"
          : n.kind === "engine"
          ? "Reduce engine surface area or merge with sibling engine"
          : "Refactor for clarity and reduce dependencies",
      impact:
        (n.complexityScore ?? 0) >= 80 ? "high" : (n.complexityScore ?? 0) >= 70 ? "medium" : "low",
    }));
}

export function buildExecutivePruningReport(nodes: SystemNode[] = []): PruningReport {
  return {
    totalNodes: nodes.length,
    candidates: buildPruningCandidates(nodes),
    simplifications: buildSimplificationCandidates(nodes),
    complexityCostScore: calculateComplexityCost(nodes),
    maintenanceBurdenScore: estimateMaintenanceBurden(nodes),
  };
}
