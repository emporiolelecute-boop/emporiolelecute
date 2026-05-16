/**
 * Fase 13.2 — Execution Bottlenecks (diagnóstico operacional).
 * Heurísticas leves sobre TelemetrySnapshot.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type BottleneckSeverity = "low" | "medium" | "high" | "critical";
export type BottleneckArea =
  | "editorial" | "semantic" | "authority" | "review" | "faq" | "internal_link";

export interface Bottleneck {
  area: BottleneckArea;
  title: string;
  description: string;
  severity: BottleneckSeverity;
  impact: number; // 0..100
}

const sev = (n: number): BottleneckSeverity => (n >= 80 ? "critical" : n >= 60 ? "high" : n >= 35 ? "medium" : "low");
const v = (x?: number) => (typeof x === "number" ? x : 0);

export function detectEditorialBottlenecks(t: TelemetrySnapshot): Bottleneck[] {
  const out: Bottleneck[] = [];
  if (v(t.editorial_maturity_avg) < 50) {
    const impact = 100 - v(t.editorial_maturity_avg);
    out.push({ area: "editorial", title: "Maturidade editorial baixa", description: "Textos curtos ou sem profundidade temática.", severity: sev(impact), impact });
  }
  if (v(t.thinContent) > 5) {
    const impact = Math.min(100, v(t.thinContent) * 6);
    out.push({ area: "editorial", title: "Thin content alto", description: `${t.thinContent} entidades classificadas como thin.`, severity: sev(impact), impact });
  }
  return out;
}

export function detectSemanticBottlenecks(t: TelemetrySnapshot): Bottleneck[] {
  const out: Bottleneck[] = [];
  if (v(t.semantic_connectivity_score) < 50) {
    const impact = 100 - v(t.semantic_connectivity_score);
    out.push({ area: "semantic", title: "Baixa conectividade semântica", description: "Entidades pouco interligadas.", severity: sev(impact), impact });
  }
  if (v(t.fragile_cluster_count) > 0) {
    const impact = Math.min(100, v(t.fragile_cluster_count) * 12);
    out.push({ area: "semantic", title: "Clusters frágeis", description: `${t.fragile_cluster_count} clusters em risco.`, severity: sev(impact), impact });
  }
  return out;
}

export function detectAuthorityBottlenecks(t: TelemetrySnapshot): Bottleneck[] {
  const out: Bottleneck[] = [];
  if (v(t.averageAuthority) < 45) {
    const impact = 100 - v(t.averageAuthority);
    out.push({ area: "authority", title: "Autoridade média baixa", description: "Hubs precisam de reforço.", severity: sev(impact), impact });
  }
  if (v(t.authority_dependency_risk) > 60) {
    out.push({ area: "authority", title: "Dependência excessiva", description: "Autoridade concentrada em poucas entidades.", severity: sev(v(t.authority_dependency_risk)), impact: v(t.authority_dependency_risk) });
  }
  return out;
}

export function detectReviewBottlenecks(t: TelemetrySnapshot): Bottleneck[] {
  const out: Bottleneck[] = [];
  if (v(t.review_coverage) < 30) {
    const impact = 100 - v(t.review_coverage);
    out.push({ area: "review", title: "Baixa cobertura de reviews", description: "Falta prova social em produtos.", severity: sev(impact), impact });
  }
  return out;
}

export function detectFaqBottlenecks(t: TelemetrySnapshot): Bottleneck[] {
  const out: Bottleneck[] = [];
  if (v(t.faq_coverage) < 30) {
    const impact = 100 - v(t.faq_coverage);
    out.push({ area: "faq", title: "FAQ insuficiente", description: "Páginas sem perguntas frequentes.", severity: sev(impact), impact });
  }
  return out;
}

export function detectInternalLinkBottlenecks(t: TelemetrySnapshot): Bottleneck[] {
  const out: Bottleneck[] = [];
  if (v(t.orphan_entities) > 0) {
    const impact = Math.min(100, v(t.orphan_entities) * 4);
    out.push({ area: "internal_link", title: "Entidades órfãs", description: `${t.orphan_entities} sem links internos.`, severity: sev(impact), impact });
  }
  if (v(t.overlinked_pages) > 0) {
    const impact = Math.min(100, v(t.overlinked_pages) * 5);
    out.push({ area: "internal_link", title: "Overlinking detectado", description: `${t.overlinked_pages} páginas saturadas.`, severity: sev(impact), impact });
  }
  return out;
}

export function detectExecutionBottlenecks(t: TelemetrySnapshot): Bottleneck[] {
  return [
    ...detectEditorialBottlenecks(t),
    ...detectSemanticBottlenecks(t),
    ...detectAuthorityBottlenecks(t),
    ...detectReviewBottlenecks(t),
    ...detectFaqBottlenecks(t),
    ...detectInternalLinkBottlenecks(t),
  ];
}

export function prioritizeBottlenecks(items: Bottleneck[]): Bottleneck[] {
  const order: Record<BottleneckSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  return [...items].sort((a, b) => order[b.severity] - order[a.severity] || b.impact - a.impact);
}
