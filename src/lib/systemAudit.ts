/**
 * System Audit — read-only diagnostics for SEO OS admin architecture.
 * Detects redundancy, overlap, orphan dashboards and complexity debt.
 * Pure functions — no side effects.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface DashboardDescriptor {
  id: string;
  label: string;
  path: string;
  domain: "core" | "content" | "discovery" | "intelligence" | "governance" | "system" | "labs";
  responsibilities: string[];
  usageScore?: number; // 0-100
  incrementalValue?: number; // 0-100
}

export interface RedundancyHit {
  a: string;
  b: string;
  overlap: number; // 0-100
  sharedResponsibilities: string[];
}

export interface ConsolidationSuggestion {
  type: "merge" | "demote-to-tab" | "demote-to-widget" | "archive";
  targets: string[];
  rationale: string;
}

const jaccard = (a: string[], b: string[]) => {
  const sa = new Set(a.map((x) => x.toLowerCase()));
  const sb = new Set(b.map((x) => x.toLowerCase()));
  if (sa.size === 0 && sb.size === 0) return 0;
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const uni = new Set([...sa, ...sb]).size;
  return uni === 0 ? 0 : inter / uni;
};

export function detectDashboardRedundancy(
  dashboards: DashboardDescriptor[],
  threshold = 0.4,
): RedundancyHit[] {
  const hits: RedundancyHit[] = [];
  for (let i = 0; i < dashboards.length; i++) {
    for (let j = i + 1; j < dashboards.length; j++) {
      const a = dashboards[i];
      const b = dashboards[j];
      const score = jaccard(a.responsibilities, b.responsibilities);
      if (score >= threshold) {
        const sa = new Set(a.responsibilities.map((x) => x.toLowerCase()));
        hits.push({
          a: a.id,
          b: b.id,
          overlap: clamp(score * 100),
          sharedResponsibilities: b.responsibilities.filter((r) =>
            sa.has(r.toLowerCase()),
          ),
        });
      }
    }
  }
  return hits.sort((x, y) => y.overlap - x.overlap);
}

export function detectOrphanDashboards(
  dashboards: DashboardDescriptor[],
): string[] {
  return dashboards.filter((d) => (d.usageScore ?? 0) < 10).map((d) => d.id);
}

export function detectThinDashboards(
  dashboards: DashboardDescriptor[],
): string[] {
  return dashboards
    .filter(
      (d) => (d.incrementalValue ?? 0) < 25 && d.responsibilities.length <= 2,
    )
    .map((d) => d.id);
}

export function detectCompetingNomenclature(
  dashboards: DashboardDescriptor[],
): Array<{ keyword: string; ids: string[] }> {
  const buckets: Record<string, string[]> = {};
  const keywords = [
    "nexus",
    "fabric",
    "matrix",
    "consciousness",
    "kernel",
    "core",
    "grid",
    "command",
    "continuum",
    "intelligence",
    "convergence",
    "operations",
    "governance",
    "executive",
    "reality",
    "orchestration",
  ];
  for (const kw of keywords) {
    const ids = dashboards
      .filter((d) => d.label.toLowerCase().includes(kw))
      .map((d) => d.id);
    if (ids.length >= 2) buckets[kw] = ids;
  }
  return Object.entries(buckets).map(([keyword, ids]) => ({ keyword, ids }));
}

export function detectMetaAbstractionExcess(
  dashboards: DashboardDescriptor[],
): number {
  const metaKw = [
    "meta",
    "consciousness",
    "nexus",
    "fabric",
    "continuum",
    "convergence",
    "singularity",
    "civilization",
    "evolution",
  ];
  const hits = dashboards.filter((d) =>
    metaKw.some((k) => d.label.toLowerCase().includes(k)),
  ).length;
  return clamp((hits / Math.max(1, dashboards.length)) * 200);
}

export function clusterByDomain(
  dashboards: DashboardDescriptor[],
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const d of dashboards) {
    (out[d.domain] ??= []).push(d.id);
  }
  return out;
}

export function calculateComplexityScore(input: {
  dashboards: number;
  routes: number;
  metaAbstractionExcess: number;
  redundancyHits: number;
}): number {
  const base =
    input.dashboards * 1.2 +
    input.routes * 0.6 +
    input.redundancyHits * 2 +
    input.metaAbstractionExcess * 0.6;
  return clamp(base);
}

export function calculateCognitiveLoadScore(input: {
  menuDepth: number;
  dashboards: number;
  competingNomenclatureCount: number;
}): number {
  return clamp(
    input.menuDepth * 8 +
      input.dashboards * 0.8 +
      input.competingNomenclatureCount * 6,
  );
}

export function calculateExecutiveUsabilityScore(input: {
  cognitiveLoad: number;
  complexity: number;
  orphanCount: number;
}): number {
  return clamp(
    100 -
      input.cognitiveLoad * 0.45 -
      input.complexity * 0.35 -
      input.orphanCount * 2,
  );
}

export function calculateFragmentationScore(
  clusters: Record<string, string[]>,
): number {
  const sizes = Object.values(clusters).map((c) => c.length);
  if (!sizes.length) return 0;
  const avg = sizes.reduce((a, b) => a + b, 0) / sizes.length;
  const variance =
    sizes.reduce((a, b) => a + (b - avg) ** 2, 0) / sizes.length;
  return clamp(Math.sqrt(variance) * 12);
}

export function detectArchitecturalDebt(input: {
  redundancy: RedundancyHit[];
  orphanCount: number;
  thinCount: number;
  metaExcess: number;
}): number {
  return clamp(
    input.redundancy.length * 4 +
      input.orphanCount * 5 +
      input.thinCount * 3 +
      input.metaExcess * 0.4,
  );
}

export function suggestConsolidations(
  dashboards: DashboardDescriptor[],
  redundancy: RedundancyHit[],
): ConsolidationSuggestion[] {
  const byId = new Map(dashboards.map((d) => [d.id, d]));
  const out: ConsolidationSuggestion[] = [];
  const seen = new Set<string>();
  for (const r of redundancy) {
    const key = [r.a, r.b].sort().join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    const a = byId.get(r.a);
    const b = byId.get(r.b);
    if (!a || !b) continue;
    if (r.overlap >= 75) {
      out.push({
        type: "merge",
        targets: [r.a, r.b],
        rationale: `Overlap ${r.overlap}% — merge into single dashboard under "${a.domain}".`,
      });
    } else if (r.overlap >= 55) {
      out.push({
        type: "demote-to-tab",
        targets: [r.b],
        rationale: `Move "${b.label}" as internal tab of "${a.label}" (overlap ${r.overlap}%).`,
      });
    } else {
      out.push({
        type: "demote-to-widget",
        targets: [r.b],
        rationale: `Embed "${b.label}" as widget inside "${a.label}".`,
      });
    }
  }
  for (const id of detectOrphanDashboards(dashboards)) {
    out.push({
      type: "archive",
      targets: [id],
      rationale: "Low usage — candidate to /labs archive.",
    });
  }
  return out;
}

export interface SystemAuditReport {
  totalDashboards: number;
  totalRoutes: number;
  redundancy: RedundancyHit[];
  orphans: string[];
  thin: string[];
  competingNomenclature: Array<{ keyword: string; ids: string[] }>;
  clusters: Record<string, string[]>;
  metaAbstractionExcess: number;
  complexityScore: number;
  cognitiveLoadScore: number;
  executiveUsabilityScore: number;
  fragmentationScore: number;
  architecturalDebt: number;
  consolidationSuggestions: ConsolidationSuggestion[];
  generatedAt: string;
}

export function generateSystemAuditReport(
  dashboards: DashboardDescriptor[],
  routes: number,
  menuDepth: number,
): SystemAuditReport {
  const redundancy = detectDashboardRedundancy(dashboards);
  const orphans = detectOrphanDashboards(dashboards);
  const thin = detectThinDashboards(dashboards);
  const competing = detectCompetingNomenclature(dashboards);
  const clusters = clusterByDomain(dashboards);
  const metaExcess = detectMetaAbstractionExcess(dashboards);
  const complexity = calculateComplexityScore({
    dashboards: dashboards.length,
    routes,
    metaAbstractionExcess: metaExcess,
    redundancyHits: redundancy.length,
  });
  const cognitive = calculateCognitiveLoadScore({
    menuDepth,
    dashboards: dashboards.length,
    competingNomenclatureCount: competing.length,
  });
  const usability = calculateExecutiveUsabilityScore({
    cognitiveLoad: cognitive,
    complexity,
    orphanCount: orphans.length,
  });
  const fragmentation = calculateFragmentationScore(clusters);
  const debt = detectArchitecturalDebt({
    redundancy,
    orphanCount: orphans.length,
    thinCount: thin.length,
    metaExcess,
  });
  return {
    totalDashboards: dashboards.length,
    totalRoutes: routes,
    redundancy,
    orphans,
    thin,
    competingNomenclature: competing,
    clusters,
    metaAbstractionExcess: metaExcess,
    complexityScore: complexity,
    cognitiveLoadScore: cognitive,
    executiveUsabilityScore: usability,
    fragmentationScore: fragmentation,
    architecturalDebt: debt,
    consolidationSuggestions: suggestConsolidations(dashboards, redundancy),
    generatedAt: new Date().toISOString(),
  };
}
