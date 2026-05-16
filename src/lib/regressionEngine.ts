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

// =================== Fase 13 — Predictive Regression =====================

export interface PredictiveRegressionInput {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  authorityTrend?: number;       // -1..1
  linkTrend?: number;            // -1..1
  reviewTrend?: number;          // -1..1
  thinContentRisk?: boolean;
  orphanRisk?: boolean;
  authorityScore?: number;
  internalLinks?: number;
}

export interface PredictiveRegressionFinding {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  predictedRegression: number;   // 0..100 (probabilidade)
  horizonDays: 30 | 90;
  reasons: string[];
}

export function predictFutureRegression(items: PredictiveRegressionInput[]): PredictiveRegressionFinding[] {
  return items.map((i) => {
    const reasons: string[] = [];
    let score = 0;
    if ((i.authorityTrend ?? 0) < -0.1) { score += 30; reasons.push("autoridade em queda"); }
    if ((i.linkTrend ?? 0)      < -0.1) { score += 20; reasons.push("perda de links"); }
    if ((i.reviewTrend ?? 0)    < -0.1) { score += 15; reasons.push("queda de reviews"); }
    if (i.thinContentRisk)              { score += 20; reasons.push("conteúdo raso"); }
    if (i.orphanRisk)                   { score += 15; reasons.push("órfão"); }
    if ((i.internalLinks ?? 0) <= 1)    { score += 10; reasons.push("baixa conexão interna"); }
    const horizon: 30 | 90 = score >= 50 ? 30 : 90;
    return {
      entityType: i.entityType, entityId: i.entityId,
      entitySlug: i.entitySlug, entityName: i.entityName,
      predictedRegression: Math.min(100, score),
      horizonDays: horizon, reasons,
    };
  }).filter((f) => f.predictedRegression > 0)
    .sort((a, b) => b.predictedRegression - a.predictedRegression);
}

export interface ClusterFragilityInput {
  clusterId: string;
  clusterName?: string;
  memberCount: number;
  averageAuthority: number;
  totalLinks: number;
  thinContentCount: number;
  orphanCount: number;
}

export interface ClusterFragilityResult {
  clusterId: string;
  clusterName?: string;
  fragilityScore: number;
  band: "stable" | "watch" | "fragile" | "critical";
  reasons: string[];
}

export function detectClusterFragility(items: ClusterFragilityInput[]): ClusterFragilityResult[] {
  return items.map((c) => {
    const reasons: string[] = [];
    let score = 0;
    if (c.averageAuthority < 50) { score += 30; reasons.push("autoridade média baixa"); }
    if (c.totalLinks / Math.max(1, c.memberCount) < 2) { score += 20; reasons.push("links por página insuficientes"); }
    if (c.thinContentCount / Math.max(1, c.memberCount) > 0.3) { score += 25; reasons.push("muitos thin content"); }
    if (c.orphanCount / Math.max(1, c.memberCount) > 0.2) { score += 15; reasons.push("órfãos no cluster"); }
    if (c.memberCount < 3) { score += 10; reasons.push("cluster pequeno demais"); }
    const s = Math.min(100, score);
    let band: ClusterFragilityResult["band"] = "stable";
    if (s >= 70) band = "critical";
    else if (s >= 50) band = "fragile";
    else if (s >= 25) band = "watch";
    return { clusterId: c.clusterId, clusterName: c.clusterName, fragilityScore: s, band, reasons };
  }).sort((a, b) => b.fragilityScore - a.fragilityScore);
}

export interface AuthorityConcentrationInput {
  entityId: string;
  entityName?: string;
  authority: number;
  inboundLinks: number;
}

export interface AuthorityConcentrationResult {
  topShare: number;       // 0..100 (% concentrado no top 3)
  risk: "low" | "medium" | "high";
  topEntities: AuthorityConcentrationInput[];
}

export function detectAuthorityConcentrationRisk(items: AuthorityConcentrationInput[]): AuthorityConcentrationResult {
  if (!items.length) return { topShare: 0, risk: "low", topEntities: [] };
  const sorted = [...items].sort((a, b) => b.authority - a.authority);
  const total = sorted.reduce((acc, i) => acc + i.authority, 0) || 1;
  const top3 = sorted.slice(0, 3);
  const topShare = Math.round((top3.reduce((a, i) => a + i.authority, 0) / total) * 100);
  const risk = topShare >= 60 ? "high" : topShare >= 40 ? "medium" : "low";
  return { topShare, risk, topEntities: top3 };
}
