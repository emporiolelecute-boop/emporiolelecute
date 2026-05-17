/**
 * Dashboard Compression — diagnostic helpers (pure, read-only).
 */

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface DashboardSummary {
  id: string;
  label: string;
  kpiCount: number;
  responsibilities: string[];
  usageScore?: number;
  group?: string;
}

export interface CompressionSuggestion {
  id: string;
  recommendation: "merge" | "tab" | "widget" | "overlay" | "advanced";
  reason: string;
  withId?: string;
}

export function detectEquivalentDashboards(
  dashboards: DashboardSummary[],
): Array<{ a: string; b: string; overlap: number }> {
  const pairs: Array<{ a: string; b: string; overlap: number }> = [];
  for (let i = 0; i < dashboards.length; i++) {
    for (let j = i + 1; j < dashboards.length; j++) {
      const a = new Set(dashboards[i].responsibilities.map((r) => r.toLowerCase()));
      const b = new Set(dashboards[j].responsibilities.map((r) => r.toLowerCase()));
      if (!a.size || !b.size) continue;
      const inter = [...a].filter((x) => b.has(x)).length;
      const union = new Set([...a, ...b]).size;
      const overlap = Math.round((inter / union) * 100);
      if (overlap >= 40) pairs.push({ a: dashboards[i].id, b: dashboards[j].id, overlap });
    }
  }
  return pairs.sort((x, y) => y.overlap - x.overlap);
}

export function detectThinDashboards(dashboards: DashboardSummary[]): string[] {
  return dashboards.filter((d) => d.kpiCount <= 3).map((d) => d.id);
}

export function detectLowUsageDashboards(dashboards: DashboardSummary[]): string[] {
  return dashboards.filter((d) => (d.usageScore ?? 100) < 25).map((d) => d.id);
}

export function detectKPIInflation(dashboards: DashboardSummary[]): string[] {
  return dashboards.filter((d) => d.kpiCount > 30).map((d) => d.id);
}

export function buildCompressionSuggestions(
  dashboards: DashboardSummary[],
): CompressionSuggestion[] {
  const suggestions: CompressionSuggestion[] = [];
  const pairs = detectEquivalentDashboards(dashboards);
  for (const p of pairs) {
    suggestions.push({
      id: p.a,
      withId: p.b,
      recommendation: p.overlap >= 70 ? "merge" : p.overlap >= 50 ? "tab" : "widget",
      reason: `${p.overlap}% functional overlap`,
    });
  }
  for (const id of detectThinDashboards(dashboards)) {
    suggestions.push({ id, recommendation: "widget", reason: "Thin dashboard (≤3 KPIs)" });
  }
  for (const id of detectLowUsageDashboards(dashboards)) {
    suggestions.push({ id, recommendation: "advanced", reason: "Low usage (<25)" });
  }
  for (const id of detectKPIInflation(dashboards)) {
    suggestions.push({ id, recommendation: "tab", reason: "KPI inflation (>30 metrics)" });
  }
  return suggestions;
}

export function calculateDashboardRedundancyScore(
  dashboards: DashboardSummary[],
): number {
  if (!dashboards.length) return 0;
  const pairs = detectEquivalentDashboards(dashboards);
  return clamp((pairs.length / dashboards.length) * 100);
}

export function calculateDashboardInflationScore(
  dashboards: DashboardSummary[],
): number {
  if (!dashboards.length) return 0;
  const avg = dashboards.reduce((s, d) => s + d.kpiCount, 0) / dashboards.length;
  return clamp(avg * 2);
}

export function calculateTelemetryDensityScore(
  dashboards: DashboardSummary[],
): number {
  const total = dashboards.reduce((s, d) => s + d.kpiCount, 0);
  return clamp((total / Math.max(dashboards.length, 1)) * 1.5);
}

export function buildDefaultDashboardCatalog(): DashboardSummary[] {
  return [
    { id: "executive-home", label: "Executive Home", kpiCount: 12, responsibilities: ["overview", "kpis", "alerts"], usageScore: 80, group: "executive" },
    { id: "war-room", label: "War Room", kpiCount: 18, responsibilities: ["alerts", "ops", "risks"], usageScore: 60, group: "executive" },
    { id: "control-tower", label: "Control Tower", kpiCount: 22, responsibilities: ["ops", "risks", "monitoring"], usageScore: 55, group: "executive" },
    { id: "operational-reality", label: "Operational Reality", kpiCount: 14, responsibilities: ["ops", "performance", "usage"], usageScore: 50, group: "executive" },
    { id: "final-governance", label: "Final Governance", kpiCount: 16, responsibilities: ["governance", "compliance", "audit"], usageScore: 40, group: "system" },
    { id: "system-audit", label: "System Audit", kpiCount: 12, responsibilities: ["audit", "redundancy", "cognitive-load"], usageScore: 45, group: "system" },
    { id: "consolidation", label: "Consolidation", kpiCount: 10, responsibilities: ["redundancy", "merge", "compression"], usageScore: 35, group: "system" },
    { id: "kernel", label: "Kernel", kpiCount: 20, responsibilities: ["runtime", "engines", "performance"], usageScore: 30, group: "system" },
    { id: "knowledge-graph", label: "Knowledge Graph", kpiCount: 8, responsibilities: ["graph", "semantics"], usageScore: 50, group: "intelligence" },
    { id: "unified-nexus", label: "Unified Nexus", kpiCount: 15, responsibilities: ["intelligence", "graph", "semantics"], usageScore: 25, group: "intelligence" },
    { id: "consciousness", label: "Consciousness", kpiCount: 18, responsibilities: ["intelligence", "meta"], usageScore: 20, group: "intelligence" },
    { id: "civilization", label: "Civilization", kpiCount: 24, responsibilities: ["meta", "long-term", "survivability"], usageScore: 12, group: "labs" },
    { id: "singularity", label: "Singularity", kpiCount: 26, responsibilities: ["meta", "consciousness"], usageScore: 10, group: "labs" },
    { id: "meta-reasoning", label: "Meta Reasoning", kpiCount: 20, responsibilities: ["meta", "reasoning"], usageScore: 8, group: "labs" },
  ];
}
