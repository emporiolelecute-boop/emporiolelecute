/**
 * Fase 12 — Regression Engine.
 * Compara séries de snapshots por entidade e classifica regressões.
 */
import type { EntitySnapshotRow } from "./seoMemory";

export type RegressionType =
  | "authority_loss" | "link_loss" | "thin_content_growth"
  | "coverage_drop" | "overlap_growth" | "orphan_growth"
  | "review_drop" | "hub_weakening";

export interface RegressionFinding {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  severity: "low" | "medium" | "high";
  regressionType: RegressionType;
  estimatedImpact: number; // 0..100
  suggestedActions: string[];
}

export interface EntitySeries {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  snapshots: EntitySnapshotRow[];
}

export function detectRegressions(series: EntitySeries[]): RegressionFinding[] {
  const findings: RegressionFinding[] = [];

  for (const s of series) {
    if (s.snapshots.length < 2) continue;
    const first = s.snapshots[0];
    const last  = s.snapshots[s.snapshots.length - 1];

    const tests: { type: RegressionType; delta: number; threshold: number; impactBase: number; action: string }[] = [
      { type: "authority_loss",      delta: (first.authority_score      ?? 0) - (last.authority_score      ?? 0), threshold: 5,  impactBase: 25, action: "Revisar editorial, FAQ e links internos." },
      { type: "link_loss",           delta: (first.internal_links_count ?? 0) - (last.internal_links_count ?? 0), threshold: 2,  impactBase: 15, action: "Re-conectar páginas removidas em hubs/temas." },
      { type: "coverage_drop",       delta: (first.topical_coverage     ?? 0) - (last.topical_coverage     ?? 0), threshold: 5,  impactBase: 20, action: "Expandir cobertura semântica do cluster." },
      { type: "review_drop",         delta: (first.reviews_count        ?? 0) - (last.reviews_count        ?? 0), threshold: 1,  impactBase: 10, action: "Solicitar novas avaliações para o produto/categoria." },
      { type: "thin_content_growth", delta: (last.thin_content_risk ? 1 : 0) - (first.thin_content_risk ? 1 : 0) * 10, threshold: 1, impactBase: 20, action: "Reescrever editorial para mais de 600 caracteres." },
    ];

    tests.forEach((t) => {
      if (t.delta >= t.threshold) {
        const ratio = Math.min(1, t.delta / Math.max(t.threshold * 3, 1));
        const impact = Math.round(t.impactBase + ratio * 40);
        findings.push({
          entityType: s.entityType,
          entityId: s.entityId,
          entitySlug: s.entitySlug,
          entityName: s.entityName,
          regressionType: t.type,
          severity: impact >= 50 ? "high" : impact >= 30 ? "medium" : "low",
          estimatedImpact: impact,
          suggestedActions: [t.action],
        });
      }
    });
  }

  return findings.sort((a, b) => b.estimatedImpact - a.estimatedImpact);
}

export function regressionRiskScore(findings: RegressionFinding[]): number {
  if (!findings.length) return 0;
  const high = findings.filter((f) => f.severity === "high").length;
  const med  = findings.filter((f) => f.severity === "medium").length;
  return Math.min(100, high * 12 + med * 6 + findings.length);
}
