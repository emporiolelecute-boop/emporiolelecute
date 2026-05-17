/**
 * Phase 17 — Systemic Deduplication (pure, read-only).
 */
import type { CoreMetricsCanon, OverlapPair } from "./coreMetricsCanon";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface DuplicatedEngine { engines: string[]; overlap: number; reason: string }

const ENGINE_GROUPS: { name: string; engines: string[] }[] = [
  { name: "coherence_cluster", engines: ["coherenceMatrix", "consciousnessFabric", "temporalCoherence"] },
  { name: "integrity_cluster", engines: ["integrityGrid", "stabilityFabric", "governanceMatrix"] },
  { name: "convergence_cluster", engines: ["unifiedNexus", "nexusConvergence", "strategicContinuum"] },
  { name: "resilience_cluster", engines: ["resilienceContinuity", "resilienceIntegrity", "resilienceUnification"] },
  { name: "operational_cluster", engines: ["operationalContinuity", "operationalHarmony", "operationalAlignment"] },
];

export function detectDuplicatedEngines(canon: CoreMetricsCanon): DuplicatedEngine[] {
  return ENGINE_GROUPS.map((g) => {
    const metrics = canon.metrics.filter((m) => g.engines.includes(m.origin));
    if (metrics.length < 2) return null;
    const avgRedundancy = metrics.reduce((a, b) => a + b.redundancy, 0) / metrics.length;
    return {
      engines: g.engines,
      overlap: clamp(avgRedundancy),
      reason: `Cluster '${g.name}' shares semantic domains across ${metrics.length} engines`,
    } as DuplicatedEngine;
  }).filter(Boolean) as DuplicatedEngine[];
}

export function detectConceptualOverlap(canon: CoreMetricsCanon): OverlapPair[] {
  return canon.overlap.filter((p) => p.overlap >= 60);
}

export interface MirrorSystem { a: string; b: string; similarity: number }

export function detectMirrorSystems(canon: CoreMetricsCanon): MirrorSystem[] {
  const mirrors: MirrorSystem[] = [];
  const byOrigin = new Map<string, typeof canon.metrics>();
  canon.metrics.forEach((m) => {
    const arr = byOrigin.get(m.origin) ?? [];
    arr.push(m);
    byOrigin.set(m.origin, arr);
  });
  const origins = [...byOrigin.keys()];
  for (let i = 0; i < origins.length; i++) {
    for (let j = i + 1; j < origins.length; j++) {
      const a = byOrigin.get(origins[i])!;
      const b = byOrigin.get(origins[j])!;
      const aDomains = new Set(a.flatMap((m) => m.domains));
      const bDomains = new Set(b.flatMap((m) => m.domains));
      const shared = [...aDomains].filter((d) => bDomains.has(d)).length;
      const union = new Set([...aDomains, ...bDomains]).size || 1;
      const similarity = clamp((shared / union) * 100);
      if (similarity >= 70) mirrors.push({ a: origins[i], b: origins[j], similarity });
    }
  }
  return mirrors.sort((x, y) => y.similarity - x.similarity);
}

export interface ConsolidationSuggestion { merge: string[]; into: string; savings: number; rationale: string }

export function buildConsolidationSuggestions(canon: CoreMetricsCanon): ConsolidationSuggestion[] {
  const suggestions: ConsolidationSuggestion[] = [];
  const duplicates = detectDuplicatedEngines(canon);
  duplicates.forEach((d) => {
    if (d.overlap < 50) return;
    suggestions.push({
      merge: d.engines.slice(1),
      into: d.engines[0],
      savings: clamp(d.overlap * 0.6),
      rationale: d.reason,
    });
  });
  return suggestions;
}

export function estimateMaintenanceReduction(canon: CoreMetricsCanon): number {
  const suggestions = buildConsolidationSuggestions(canon);
  const totalSavings = suggestions.reduce((a, s) => a + s.savings, 0);
  return clamp(totalSavings / Math.max(suggestions.length || 1, 1));
}
